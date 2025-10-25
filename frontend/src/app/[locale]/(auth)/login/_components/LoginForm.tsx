"use client";

import { useForm } from "react-hook-form";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/auth/features/schemas/loginSchema";
import { useLogin } from "@/auth/features/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { env } from "@/utils/env";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const locale = useLocale();
  const t = useTranslations("Translation");
  const version = env.APP_VERSION;
  const [showPassword, setShowPassword] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();
  const { mutate, isPending, error } = useLogin();
  const isLoading = isPending || isRedirecting;

  const onSubmit = (data: LoginInput) => {
    mutate(data, {
      onSuccess: () => {
        setIsRedirecting(true);
        router.push(`/${locale}/${version}/dashboard`); // redirect after login
      },
    });
  };

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
                <Input type="email" autoComplete="email" autoFocus {...field} />
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
                <a
                  href={`/${locale}/forgot-password?type=console`}
                  className="text-blue-600 hover:underline whitespace-nowrap text-xs sm:text-sm"
                >
                  {t("forgotPassword")}
                </a>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
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
        {/* Admin login: no register link */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          )}
          {isLoading ? t("loggingIn") : t("login")}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {t("contactAdminForAccess", { default: "Need access? Contact your administrator." })}
        </p>
      </form>
    </Form>
  );
}
