"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/auth/features/schemas/loginSchema";
import { useCustomerLogin } from "@/features/customer-auth/hooks";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function CustomerLoginForm() {
  const t = useTranslations("Translation");
  const locale = useLocale();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { mutate, isPending, error } = useCustomerLogin();

  const onSubmit = (data: LoginInput) => mutate(data);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input type="email" placeholder={t("email")} {...form.register("email")} />
      <Input type="password" placeholder={t("password")} {...form.register("password")} />
      {error && (
        <p className="text-sm text-red-500">{t("loginFailed")}</p>
      )}
      <div className="flex items-center justify-between gap-2">
        <Link href={`/${locale}/login?type=console`} className="text-blue-600 hover:underline text-sm">
          {t("goToAdminLogin")}
        </Link>
        <Button type="submit" disabled={isPending} className="w-32">
          {isPending ? t("loggingIn") : t("signIn")}
        </Button>
      </div>
    </form>
  );
}
