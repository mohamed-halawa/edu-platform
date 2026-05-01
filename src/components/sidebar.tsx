"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Wallet,
  ClipboardCheck,
  Users,
  CreditCard,
  Settings,
  ScrollText,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

type SidebarLink = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const studentLinks: SidebarLink[] = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/courses", label: "Courses", icon: BookOpen },
  { href: "/student/billing", label: "Billing", icon: CreditCard },
];

const instructorLinks: SidebarLink[] = [
  { href: "/instructor/courses", label: "My Courses", icon: BookOpen },
  { href: "/instructor/grading", label: "Grading", icon: ClipboardCheck },
  { href: "/instructor/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/instructor/payouts", label: "Payouts", icon: Wallet },
];

const adminLinks: SidebarLink[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/instructors", label: "Instructors", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/payouts", label: "Payouts", icon: Wallet },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/audit", label: "Audit Log", icon: ScrollText },
];

export function Sidebar({ variant }: { variant: "student" | "instructor" | "admin" }) {
  const pathname = usePathname();
  const locale = useLocale();
  const [collapsed, setCollapsed] = useState(false);

  const links =
    variant === "student"
      ? studentLinks
      : variant === "instructor"
        ? instructorLinks
        : adminLinks;

  const CollapseIcon = locale === "ar" ? (collapsed ? ChevronLeft : ChevronRight) : (collapsed ? ChevronRight : ChevronLeft);

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen border-e border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 flex flex-col",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border/40 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight gradient-text truncate">
            EduPlatform
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-border/40 p-3 space-y-1">
        {!collapsed && <LocaleSwitcher />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <CollapseIcon className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{collapsed ? "Expand" : "Collapse"}</span>}
        </button>
      </div>
    </aside>
  );
}
