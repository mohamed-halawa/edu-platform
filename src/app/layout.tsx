import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | EduPlatform",
    default: "EduPlatform - Learn from Egypt's Best Instructors",
  },
  description:
    "Access premium courses, video lectures, and interactive exams from top Egyptian instructors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
