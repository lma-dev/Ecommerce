"use client";

import { useEffect } from "react";
import ToastAlert from "@/app/[locale]/_components/ui/toast-box";

export default function LoginNotice({ reason }: { reason?: string }) {
  useEffect(() => {
    if (!reason) return;
    const errorReasons = new Set(["auth", "auth_expired", "unauthorized", "session_expired"]);
    if (errorReasons.has(reason)) {
      ToastAlert.error({ message: "Your session expired. Please sign in again." });
    } else {
      // Any other reason is treated as success/notice
      ToastAlert.success({ message: "Please sign in to continue." });
    }
  }, [reason]);
  return null;
}
