import AdminLoginForm from "@/auth/_components/LoginForm";
import CustomerLoginForm from "@/auth/_components/CustomerLoginForm";
import { useTranslations } from "next-intl";
import { use } from "react";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = useTranslations("Translation");
  const params = searchParams ? use(searchParams) : undefined;
  const type = (params?.type ?? "") as string;
  const isConsole = type === "console";

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-slate-200/60 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("loginToYourAccount")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isConsole ? "Admin" : "Customer"} Portal
            </p>
          </div>
          {isConsole ? <AdminLoginForm /> : <CustomerLoginForm />}
        </div>
      </div>
    </div>
  );
}
