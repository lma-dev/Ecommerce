import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import CategoryForm from "../_components/CategoryForm";

export default function CreateCategoryPage() {
  return (
    <div>
      <BreadCrumb title="Create Category" />
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Create Category</h1>
        <CategoryForm mode="create" />
      </div>
    </div>
  );
}
