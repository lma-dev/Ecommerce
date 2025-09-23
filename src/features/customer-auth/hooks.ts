"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { customerLogin, type CustomerLoginInput } from "./api";

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export const useCustomerLogin = () => {
  const router = useRouter();
  const locale = useLocale();
  return useMutation({
    mutationFn: async (data: CustomerLoginInput) => {
      const res = await customerLogin(data);
      const token = res?.data?.token || (res as any)?.token;
      if (!token) throw new Error("Missing token");
      setCookie("customer_token", token, 14);
      return res;
    },
    onSuccess: () => {
      router.replace(`/${locale}/customer`);
    },
  });
};

