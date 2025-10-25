"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/auth/features/schemas/loginSchema";
import { useCustomerLogin } from "@/features/customer-auth/hooks";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import React from "react";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function CustomerLoginForm() {
  const t = useTranslations("Translation");
  const locale = useLocale();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { mutate, isPending, error } = useCustomerLogin();
  const isLoading = isPending || isRedirecting;

  const onSubmit = (data: LoginInput) =>
    mutate(data, {
      onSuccess: () => setIsRedirecting(true),
      onError: () => setIsRedirecting(false),
    });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" autoComplete="email" autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="mb-0">{t("password")}</FormLabel>
                <Link
                  href={`/${locale}/forgot-password`}
                  className="text-blue-600 hover:underline whitespace-nowrap text-xs sm:text-sm"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    autoComplete="current-password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-2 my-auto text-xs text-neutral-600 hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <p className="text-sm text-red-500">{t("loginFailed")}</p>
        )}
        <div className="text-center text-sm text-muted-foreground">
          {t("noAccount")} {" "}
          <Link href={`/${locale}/register`} className="text-blue-600 hover:underline whitespace-nowrap">
            {t("register")}
          </Link>
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          )}
          {isLoading ? t("loggingIn") : t("signIn")}
        </Button>
      </form>
    </Form>
  );
}
