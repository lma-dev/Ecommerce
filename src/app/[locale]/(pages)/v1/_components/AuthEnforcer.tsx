"use client";

import { useEffect } from "react";
import { getSession } from "next-auth/react";

export function AuthEnforcer({ locale }: { locale: string }) {
  useEffect(() => {
    let mounted = true;

    const redirectToLogin = () => {
      window.location.replace(`/${locale}/login?type=console&reason=auth_expired`);
    };

    const hasAnyAdminCookie = () => {
      try {
        const c = document.cookie || "";
        return (
          /(?:^|;\s*)(?:next-auth\.session-token|__Secure-next-auth\.session-token|auth_token)=/.test(
            c
          )
        );
      } catch {
        return true; // assume auth if cannot read cookies
      }
    };

    const check = async () => {
      // Prefer NextAuth session; fallback to raw cookies
      const session = await getSession();
      if (!mounted) return;
      if (!session && !hasAnyAdminCookie()) redirectToLogin();
    };

    // Initial check
    check();

    // Re-check when window regains focus or visibility changes
    const onFocus = () => check();
    const onVisibility = () => {
      if (document.visibilityState === "visible") check();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    // Periodic check (lightweight)
    const id = window.setInterval(check, 5000);

    return () => {
      mounted = false;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(id);
    };
  }, [locale]);

  return null;
}
