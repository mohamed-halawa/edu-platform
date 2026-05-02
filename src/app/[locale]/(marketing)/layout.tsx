import { Navbar } from "@/components/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
