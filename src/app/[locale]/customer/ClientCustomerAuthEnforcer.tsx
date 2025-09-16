"use client";

import { useEffect } from "react";

export default function ClientCustomerAuthEnforcer({
  locale,
}: {
  locale: string;
}) {
  useEffect(() => {
    let mounted = true;
    const redirectToLogin = () => {
      window.location.replace(`/${locale}/login?reason=auth_expired`);
    };
    const hasCustomerToken = () => {
      try {
        return /(?:^|;\s*)customer_token=/.test(document.cookie || "");
      } catch {
        return true; // if we cannot read, avoid false negatives
      }
    };
    const check = () => {
      if (!mounted) return;
      if (!hasCustomerToken()) redirectToLogin();
    };
    check();
    const onFocus = () => check();
    const onVisibility = () => {
      if (document.visibilityState === "visible") check();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
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
