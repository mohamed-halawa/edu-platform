import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@eduplatform.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(
  email: string,
  token: string,
  locale: string = "ar"
) {
  const verifyUrl = `${APP_URL}/${locale}/auth/verify-email?token=${token}`;

  const subject =
    locale === "ar"
      ? "تأكيد البريد الإلكتروني - منصة تعليمية"
      : "Verify your email - EduPlatform";

  const html =
    locale === "ar"
      ? `
    <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #4f46e5;">مرحباً بك في منصة تعليمية!</h1>
      <p>شكراً لإنشاء حسابك. يرجى الضغط على الرابط أدناه لتأكيد بريدك الإلكتروني:</p>
      <a href="${verifyUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
        تأكيد البريد الإلكتروني
      </a>
      <p style="color: #6b7280; font-size: 14px;">ينتهي هذا الرابط خلال 24 ساعة.</p>
    </div>
  `
      : `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #4f46e5;">Welcome to EduPlatform!</h1>
      <p>Thanks for creating your account. Please click the link below to verify your email:</p>
      <a href="${verifyUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
        Verify Email Address
      </a>
      <p style="color: #6b7280; font-size: 14px;">This link expires in 24 hours.</p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject,
    html,
  });

  if (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  locale: string = "ar"
) {
  const resetUrl = `${APP_URL}/${locale}/auth/reset-password?token=${token}`;

  const subject =
    locale === "ar"
      ? "إعادة تعيين كلمة المرور - منصة تعليمية"
      : "Reset your password - EduPlatform";

  const html =
    locale === "ar"
      ? `
    <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #4f46e5;">إعادة تعيين كلمة المرور</h1>
      <p>تم طلب إعادة تعيين كلمة المرور. اضغط على الرابط أدناه:</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
        إعادة تعيين كلمة المرور
      </a>
      <p style="color: #6b7280; font-size: 14px;">إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة.</p>
    </div>
  `
      : `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #4f46e5;">Reset Your Password</h1>
      <p>A password reset was requested. Click the link below:</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
        Reset Password
      </a>
      <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can ignore this email.</p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject,
    html,
  });

  if (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}
