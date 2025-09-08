"use client";

import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import CustomerForm from "../_components/CustomerForm";

export default function CustomerCreatePage() {
  return (
    <div>
      <BreadCrumb title="Create Customer" />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Create Customer</h1>
        <CustomerForm mode="create" />
      </div>
    </div>
  );
}

