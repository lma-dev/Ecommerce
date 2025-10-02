"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "@/libs/axios";
import ToastAlert from "@/app/[locale]/_components/ui/toast-box";
const passwordResetSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    password_confirmation: z
      .string()
      .min(8, { message: "Confirm Password must be at least 8 characters" }),
  })
  .refine((values) => values.password === values.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });
type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;
type PasswordResetPageClientProps = {
  token: string;
  email: string;
  type?: string;
};
const getResetPasswordEndpoint = (type?: string) =>
  type === "console"
    ? "/staff/reset-password"
    : "/customer/reset-password";
export default function ResetPasswordForm({
  token,
  email,
  type,
}: PasswordResetPageClientProps) {
  const t = useTranslations("Translation");
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const endpoint = getResetPasswordEndpoint(type);
  const isConsole = type === "console";
  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });
  const onSubmit = async (values: PasswordResetFormValues) => {
    if (!email || !token) {
      ToastAlert.error({ message: t("resetPasswordInvalidLink") });
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(endpoint, {
        ...values,
        email,
        token,
      });
      ToastAlert.success({ message: t("passwordResetSuccess") });
      router.push(
        `/${locale}/login${isConsole ? "?type=console" : ""}`,
      );
    } catch (error) {
      ToastAlert.error({ message: t("passwordResetFailed") });
    } finally {
      setIsSubmitting(false);
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
              {email ? `${t("email")}: ${email}` : t("enterYourNewPassword")}
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirmPassword")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("processing") : t("resetPassword")}
              </Button>
            </form>
          </Form>
          <div className="text-sm text-center mt-4">
            <Link
              href={`/${locale}/login${isConsole ? "?type=console" : ""}`}
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
