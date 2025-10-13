import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import UserForm from "@/v1/users/_components/UserForm";
import { useTranslations } from "next-intl";

export default function CreateUserPage() {
  const t = useTranslations("Translation");
  return (
    <div>
      <BreadCrumb title={t("createUser")} />
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">{t("createUser")}</h1>
        <UserForm mode="create" />
      </div>
    </div>
  );
}
