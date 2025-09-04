"use client";

import { useParams } from "next/navigation";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import CategoryForm from "../../_components/CategoryForm";
import { useCategoryQuery } from "@/features/categories/api";

export default function CategoryEditPage() {
  const { id } = useParams();
  const { data: category, isLoading } = useCategoryQuery(Number(id));

  if (isLoading) return <div>Loading...</div>;
  if (!category) return <div>Category not found</div>;

  return (
    <div>
      <BreadCrumb title="Edit Category" />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Edit Category</h1>
        <CategoryForm mode="edit" defaultValues={category} />
      </div>
    </div>
  );
}
