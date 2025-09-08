"use client";

import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import OrderForm from "../_components/OrderForm";

export default function OrderCreatePage() {
  return (
    <div>
      <BreadCrumb title="Create Order" />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Create Order</h1>
        <OrderForm mode="create" />
      </div>
    </div>
  );
}
