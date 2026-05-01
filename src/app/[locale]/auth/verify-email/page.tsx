"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { verifyEmailAction } from "@/lib/auth-actions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { CheckCircle2, XCircle, Loader2, GraduationCap } from "lucide-react";

function VerifyEmailContent() {
  const t = useTranslations("auth.verify");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token provided");
      return;
    }

    verifyEmailAction(token).then((result) => {
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(
          result.error === "TOKEN_EXPIRED"
            ? t("expired")
            : "Invalid verification link"
        );
      }
    });
  }, [token, t]);

  return (
    <div className="animate-fade-in text-center">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2.5 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>

      {status === "loading" && (
        <>
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <h1 className="mt-6 text-2xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">{t("success")}</h1>
          <Link
            href="/auth/login"
            className="mt-8 inline-flex rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25"
          >
            Sign In
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <XCircle className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Verification Failed</h1>
          <p className="mt-2 text-muted-foreground">{errorMessage}</p>
          <Link
            href="/auth/login"
            className="mt-8 inline-flex rounded-xl border border-border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-accent"
          >
            Back to Login
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
