import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create platform config singleton
  await prisma.platformConfig.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      defaultProfitSharePct: 70,
      currency: "EGP",
      platformName: "EduPlatform",
    },
  });
  console.log("✅ Platform config created");

  // Create super admin user
  const adminPassword = await bcrypt.hash("Admin@123456", 12);
  await prisma.user.upsert({
    where: { email: "admin@eduplatform.com" },
    update: {},
    create: {
      email: "admin@eduplatform.com",
      name: "Super Admin",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
      locale: "en",
      emailVerifiedAt: new Date(),
    },
  });
  console.log("✅ Super admin created (admin@eduplatform.com / Admin@123456)");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
