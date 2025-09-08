import LoginForm from "@/auth/_components/LoginForm";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Translation");
  return (
    <div className="w-full max-w-md mx-auto mt-24 p-6 border rounded-md">
      <h1 className="text-2xl font-semibold mb-6">{t("loginToYourAccount")}</h1>
      <LoginForm />
    </div>
  );
}
