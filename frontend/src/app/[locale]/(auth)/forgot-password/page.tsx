"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
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
import axios from "@/libs/axios";
import ToastAlert from "@/app/[locale]/_components/ui/toast-box";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/features/customer-auth/schemas/forgotPasswordSchema";

const SUPPORTED = ["en", "jp", "mm"] as const;

export default function ForgotPasswordPage() {
  const t = useTranslations("Translation");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const isConsole = (searchParams.get("type") ?? "") === "console";

  // Resolve to a safe locale once (fallback to 'en')
  const resolvedLocale = (SUPPORTED as readonly string[]).includes(locale)
    ? (locale as ForgotPasswordSchema["locale"])
    : "en";

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "", locale: resolvedLocale },
  });

  const onSubmit = async ({ email, locale }: ForgotPasswordSchema) => {
    try {
      const endpoint = isConsole
        ? "/staff/forgot-password"
        : "/customer/forgot-password";
      await axios.post(endpoint, { email, locale });
      ToastAlert.success({ message: t("sendResetLink") });
    } catch {
      ToastAlert.error({ message: t("loginFailed") });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("resetPassword")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isConsole ? "Admin" : "Customer"} Portal
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Registered hidden field so RHF includes it in submit */}
              <input
                type="hidden"
                {...form.register("locale")}
                value={resolvedLocale}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {t("sendResetLink")}
              </Button>
            </form>
          </Form>

          <div className="text-sm text-center mt-4">
            <Link
              href={`/${resolvedLocale}/login${isConsole ? "?type=console" : ""}`}
              className="text-blue-600 hover:underline"
            >
              {t("backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
