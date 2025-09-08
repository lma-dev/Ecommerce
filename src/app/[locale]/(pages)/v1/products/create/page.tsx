import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import ProductForm from "../_components/ProductForm";

export default function CreateProductPage() {
  return (
    <div>
      <BreadCrumb title="Create Product" />
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Create Product</h1>
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
