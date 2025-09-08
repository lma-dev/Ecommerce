"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createOrderSchema } from "@/features/orders/schemas/createOrderSchema";
import { updateOrderSchema } from "@/features/orders/schemas/updateOrderSchema";
import { useCreateOrder, useUpdateOrder } from "@/features/orders/api";
import ToastAlert from "@/app/[locale]/_components/ui/toast-box";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  orderStatusOptions,
  OrderStatusType,
} from "@/features/orders/constants/status";
import { useProductsQuery } from "@/features/products/api";
import { useCustomersQuery } from "@/features/customers/api";
import { FormSubmitButton } from "@/app/[locale]/_components/ui/button";
import CustomLink from "@/app/[locale]/_components/ui/custom-link";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { Button } from "@/components/ui/button";

type FormValues = z.infer<typeof updateOrderSchema>;

const OrderForm = ({
  mode,
  defaultValues,
}: {
  mode: "create" | "edit";
  defaultValues?: any;
}) => {
  const mappedDefaults: FormValues = defaultValues
    ? {
        customerId: defaultValues.customer?.id,
        status: defaultValues.status,
        notes: defaultValues.notes ?? null,
        shippingAddress: defaultValues.shippingAddress,
        productIds: (defaultValues.products ?? []).map((p: any) => p.id),
      }
    : {
        customerId: undefined,
        status: "PENDING",
        notes: null,
        shippingAddress: "",
        productIds: [],
      };

  const activeSchema = mode === "edit" ? updateOrderSchema : createOrderSchema;
  const form = useForm<FormValues>({
    resolver: zodResolver(activeSchema) as any,
    defaultValues: mappedDefaults as any,
  });

  const locale = useLocale();
  const t = useTranslations("Translation");
  const create = useCreateOrder();
  const update = useUpdateOrder();

  // Customers for select
  const { data: customersRes } = useCustomersQuery(1, {});
  // Products with search + pagination support
  const [productPage, setProductPage] = React.useState(1);
  const [productSearch, setProductSearch] = React.useState("");
  const { data: productsRes, isLoading: isLoadingProducts } = useProductsQuery(
    productPage,
    { name: productSearch || undefined }
  );

  const onSubmit = (values: FormValues) => {
    if (mode === "edit" && defaultValues?.id) {
      update.mutate(
        { id: defaultValues.id, ...values },
        {
          onSuccess: () =>
            ToastAlert.success({ message: "Order updated successfully" }),
        }
      );
    } else {
      create.mutate(values, {
        onSuccess: () =>
          ToastAlert.success({ message: "Order created successfully" }),
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Customer */}
      <Controller
        name="customerId"
        control={form.control}
        render={({ field }) => (
          <Select
            value={field.value != null ? String(field.value) : undefined}
            onValueChange={(v) => field.onChange(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectCustomer")} />
            </SelectTrigger>
            <SelectContent>
              {(customersRes?.data ?? []).map((c: any) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name} ({c.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {/* Status */}
      <Controller
        name="status"
        control={form.control}
        render={({ field }) => (
          <Select
            value={field.value ?? undefined}
            onValueChange={(v) => field.onChange(v as OrderStatusType)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              {orderStatusOptions.map((st) => (
                <SelectItem key={st} value={st}>
                  {st}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {/* Shipping Address */}
      <Textarea
        {...form.register("shippingAddress")}
        placeholder={t("shippingAddress")}
      />

      {/* Notes */}
      <Textarea {...form.register("notes")} placeholder={t("notesOptional")} />

      {/* Products - searchable, paginated list for large datasets */}
      <div className="space-y-2">
        <div className="font-medium">{t("products")}</div>
        <div className="flex gap-2 items-center">
          <Input
            placeholder={t("searchProducts")}
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setProductPage(1);
            }}
            onBlur={() => setProductPage(1)}
          />
          <div className="text-sm text-muted-foreground">
            Selected: {(form.watch("productIds") ?? []).length}
          </div>
        </div>

        <div className="border rounded max-h-64 overflow-auto p-2">
          {isLoadingProducts ? (
            <div className="p-2 text-sm">{t("loadingProducts")}</div>
          ) : (
            (productsRes?.data ?? []).map((p: any) => {
              const checked = (form.watch("productIds") ?? []).includes(p.id);
              return (
                <label key={p.id} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const current = new Set(
                        form.getValues("productIds") ?? []
                      );
                      if (e.target.checked) current.add(p.id);
                      else current.delete(p.id);
                      form.setValue("productIds", Array.from(current));
                    }}
                  />
                  <span className="truncate">
                    {p.name} - ${p.price}
                  </span>
                </label>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            {t("page")} {productPage} {t("of")} {productsRes?.meta?.totalPages ?? 1}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setProductPage((p) => Math.max(1, p - 1))}
              disabled={productPage <= 1}
            >
              {t("previous")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setProductPage((p) =>
                  Math.min(productsRes?.meta?.totalPages ?? 1, p + 1)
                )
              }
              disabled={productPage >= (productsRes?.meta?.totalPages ?? 1)}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <CustomLink href={`/${locale}/v1/orders`}>{t("back")}</CustomLink>
        <FormSubmitButton
          text={mode === "edit" ? t("updateOrder") : t("createOrder")}
        />
      </div>
    </form>
  );
};

export default OrderForm;
