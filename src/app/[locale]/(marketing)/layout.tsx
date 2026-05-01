import { Navbar } from "@/components/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/40 bg-card/30">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EduPlatform. All rights reserved.
        </div>
      </footer>
    </>
  );
}
