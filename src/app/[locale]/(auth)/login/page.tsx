import AdminLoginForm from "@/auth/_components/LoginForm";
import CustomerLoginForm from "@/auth/_components/CustomerLoginForm";
import { useTranslations } from "next-intl";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = useTranslations("Translation");
  const type = (searchParams?.type ?? "") as string;
  const isConsole = type === "console";

  return (
    <div className="w-full max-w-md mx-auto mt-24 p-6 border rounded-md">
      <h1 className="text-2xl font-semibold mb-6">{t("loginToYourAccount")}</h1>
      {isConsole ? <AdminLoginForm /> : <CustomerLoginForm />}
    </div>
  );
}
