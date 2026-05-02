"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const t = useTranslations("nav");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#0a0b0f]/80 backdrop-blur-xl shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            EduPlatform
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: t("home"), href: "/" },
            { label: t("courses"), href: "/" },
            { label: "الأسعار", href: "/" },
            { label: t("about"), href: "/" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/auth/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            {t("login")}
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 hover:scale-105"
          >
            {t("register")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden rounded-lg p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0b0f]/95 backdrop-blur-xl">
          <div className="flex flex-col gap-1 px-6 py-4">
            {[
              { label: t("home"), href: "/" },
              { label: t("courses"), href: "/" },
              { label: "الأسعار", href: "/" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-2">
              <LocaleSwitcher />
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                {t("login")}
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white text-center"
              >
                {t("register")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
