import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import ProductForm from "../_components/ProductForm";
import { useTranslations } from "next-intl";

export default function CreateProductPage() {
  const t = useTranslations("Translation");
  return (
    <div>
      <BreadCrumb title={t("createProduct")} />
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">{t("createProduct")}</h1>
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
