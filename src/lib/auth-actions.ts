"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validators/auth";
import { sendVerificationEmail } from "@/lib/email";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function registerAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return { success: false, error: "EMAIL_TAKEN" };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Generate verification token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user + verification token in transaction
  await prisma.$transaction([
    prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: "STUDENT",
        locale: "ar",
        studentProfile: {
          create: {},
        },
      },
    }),
    prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token,
        expires,
      },
    }),
  ]);

  // Send verification email (non-blocking — don't fail registration if email fails)
  try {
    await sendVerificationEmail(normalizedEmail, token);
  } catch (e) {
    console.error("Failed to send verification email during registration:", e);
  }

  return { success: true };
}

export async function verifyEmailAction(
  token: string
): Promise<ActionResult> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return { success: false, error: "INVALID_TOKEN" };
  }

  if (verificationToken.expires < new Date()) {
    // Clean up expired token
    await prisma.verificationToken.delete({
      where: { token },
    });
    return { success: false, error: "TOKEN_EXPIRED" };
  }

  // Update user and delete token in transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.verificationToken.delete({
      where: { token },
    }),
  ]);

  return { success: true };
}

export async function resendVerificationAction(
  email: string
): Promise<ActionResult> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Don't reveal if email exists
    return { success: true };
  }

  if (user.emailVerifiedAt) {
    return { success: false, error: "ALREADY_VERIFIED" };
  }

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email.toLowerCase() },
  });

  // Generate new token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      identifier: email.toLowerCase(),
      token,
      expires,
    },
  });

  try {
    await sendVerificationEmail(email.toLowerCase(), token, user.locale);
  } catch (e) {
    console.error("Failed to resend verification email:", e);
    return { success: false, error: "EMAIL_SEND_FAILED" };
  }

  return { success: true };
}
