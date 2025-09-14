"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function LoginNotice({ reason }: { reason?: string }) {
  useEffect(() => {
    if (reason === "auth") {
      toast.info("Please sign in to continue");
    }
  }, [reason]);
  return null;
}

