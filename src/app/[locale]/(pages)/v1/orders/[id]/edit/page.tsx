"use client";

import { useParams } from "next/navigation";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import OrderForm from "../../_components/OrderForm";
import { useOrderQuery } from "@/features/orders/api";

export default function OrderEditPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrderQuery(Number(id));

  if (isLoading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div>
      <BreadCrumb title="Edit Order" />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Edit Order</h1>
        <OrderForm mode="edit" defaultValues={order} />
      </div>
    </div>
  );
}

