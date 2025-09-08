"use client";

import { useParams } from "next/navigation";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import ProductForm from "../../_components/ProductForm";
import { useProductQuery } from "@/features/products/api";

export default function ProductEditPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProductQuery(Number(id));

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <BreadCrumb title="Edit Product" />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <ProductForm mode="edit" defaultValues={product} />
      </div>
    </div>
  );
}
