"use client";

import { useForm } from "react-hook-form";
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

export default function LoginForm() {
  const locale = useLocale();
  const t = useTranslations("Translation");
  const version = env.APP_VERSION;

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();
  const { mutate, isPending, error } = useLogin();

  const onSubmit = (data: LoginInput) => {
    mutate(data, {
      onSuccess: () => {
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
                <Input type="email" {...field} />
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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <p className="text-sm text-red-500">{t("loginFailed")}</p>
        )}
        <div className="flex items-center justify-between text-sm">
          <div />
          <a href={`/${locale}/forgot-password?type=console`} className="text-blue-600 hover:underline">
            {t("forgotPassword")}
          </a>
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? t("loggingIn") : t("login")}
        </Button>
      </form>
    </Form>
  );
}
