"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/auth/features/schemas/loginSchema";
import { useCustomerLogin } from "@/features/customer-auth/hooks";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
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
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { mutate, isPending, error } = useCustomerLogin();

  const onSubmit = (data: LoginInput) => mutate(data);

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
                <Input type="email" placeholder="name@example.com" {...field} />
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
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <p className="text-sm text-red-500">{t("loginFailed")}</p>
        )}
        <div className="flex items-center justify-between text-sm">
          <Link href={`/${locale}/forgot-password`} className="text-blue-600 hover:underline">
            {t("forgotPassword")}
          </Link>
          <div className="text-muted-foreground">
            {t("noAccount")} {" "}
            <Link href={`/${locale}/register`} className="text-blue-600 hover:underline">
              {t("register")}
            </Link>
          </div>
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? t("loggingIn") : t("signIn")}
        </Button>
      </form>
    </Form>
  );
}
