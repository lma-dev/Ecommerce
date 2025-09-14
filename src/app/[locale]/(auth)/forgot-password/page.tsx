"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const schema = z.object({
  email: z.string().email(),
});

export default function ForgotPasswordPage() {
  const t = useTranslations("Translation");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "";
  const isConsole = type === "console";

  const form = useForm<{ email: string }>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      const endpoint = isConsole ? "/staff/forgot-password" : "/customer/forgot-password";
      await axios.post(endpoint, { email });
      ToastAlert.success({ message: t("sendResetLink") });
    } catch (e) {
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {t("sendResetLink")}
              </Button>
            </form>
          </Form>
          <div className="text-sm text-center mt-4">
            <Link href={`/${locale}/login${isConsole ? "?type=console" : ""}`} className="text-blue-600 hover:underline">
              {t("backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
