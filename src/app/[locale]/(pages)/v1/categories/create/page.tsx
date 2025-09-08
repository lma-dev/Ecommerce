import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import CategoryForm from "../_components/CategoryForm";
import { useTranslations } from "next-intl";

export default function CreateCategoryPage() {
  const t = useTranslations("Translation");
  return (
    <div>
      <BreadCrumb title={t("createCategory")} />
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">{t("createCategory")}</h1>
        <CategoryForm mode="create" />
      </div>
    </div>
  );
}
