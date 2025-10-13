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
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";

type FormValues = z.infer<typeof updateOrderSchema>;

const OrderForm = ({
  mode,
  defaultValues,
}: {
  mode: "create" | "edit";
  defaultValues?: any;
}) => {
  // Build initial product counts from default values (uses backend quantity field)
  const initialCounts = React.useMemo(() => {
    const counts = new Map<number, number>();
    for (const p of defaultValues?.products ?? []) {
      const qty = Number(p?.quantity ?? 1);
      const prev = counts.get(p.id) ?? 0;
      counts.set(p.id, prev + qty);
    }
    return counts;
  }, [defaultValues?.products]);

  const mappedDefaults: FormValues = defaultValues
    ? {
        customerId: defaultValues.customer?.id,
        status: defaultValues.status,
        notes: defaultValues.notes ?? null,
        shippingAddress: defaultValues.shippingAddress,
        // Keep productIds for validation; will be updated from counts before submit
        productIds:
          defaultValues.products?.map((p: any) => p.id) ?? [],
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

  // Local state for quantities per product
  const [productCounts, setProductCounts] = React.useState<Map<number, number>>(
    initialCounts
  );

  // Sync initial counts to form productIds on mount
  React.useEffect(() => {
    if (productCounts.size > 0) {
      const ids: number[] = [];
      productCounts.forEach((q, id) => { for (let i=0;i<q;i++) ids.push(id) });
      form.setValue("productIds", ids);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to recompute productIds (with repetition) from counts
  const computeProductIdsFromCounts = React.useCallback(() => {
    const ids: number[] = [];
    productCounts.forEach((qty, id) => {
      for (let i = 0; i < qty; i++) ids.push(id);
    });
    return ids;
  }, [productCounts]);

  const onSubmit = (values: FormValues) => {
    const productIds = computeProductIdsFromCounts();
    const payload = { ...values, productIds } as FormValues;
    if (mode === "edit" && defaultValues?.id) {
      update.mutate(
        { id: defaultValues.id, ...payload },
        {
          onSuccess: () =>
            ToastAlert.success({ message: "Order updated successfully" }),
        }
      );
    } else {
      create.mutate(payload, {
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
              {/* Ensure current customer (from defaultValues) is selectable even if not in the first page */}
              {(() => {
                const currentId = field.value as number | undefined;
                const inList = (customersRes?.data ?? []).some((c: any) => c.id === currentId);
                if (currentId && !inList && defaultValues?.customer) {
                  const c = defaultValues.customer;
                  return (
                    <SelectItem key={`current-${c.id}`} value={String(c.id)}>
                      {c.name} ({c.email})
                    </SelectItem>
                  );
                }
                return null;
              })()}
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

      {/* Products - searchable, paginated list with quantity controls */}
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
            Selected: {Array.from(productCounts.values()).reduce((a, b) => a + b, 0)}
          </div>
        </div>

        <div className="border rounded max-h-64 overflow-auto p-2">
          {isLoadingProducts ? (
            <div className="p-2 text-sm">{t("loadingProducts")}</div>
          ) : (
            (productsRes?.data ?? []).map((p: any) => {
              const qty = productCounts.get(p.id) ?? 0;
              const setQty = (next: number) => {
                const normalized = Math.max(0, Math.floor(next || 0));
                setProductCounts((prev) => {
                  const map = new Map(prev);
                  if (normalized <= 0) map.delete(p.id);
                  else map.set(p.id, normalized);
                  // keep form productIds in sync for validation
                  form.setValue("productIds", (() => {
                    const ids: number[] = [];
                    map.forEach((q, id) => { for (let i=0;i<q;i++) ids.push(id) })
                    return ids;
                  })());
                  return map;
                });
              };
              const active = qty > 0;
              return (
                <div
                  key={p.id}
                  className={cn(
                    "flex items-center justify-between gap-2 py-2 px-2 rounded-md transition-colors",
                    active && "bg-amber-50 border border-amber-200"
                  )}
                  aria-selected={active}
                >
                  <div className="truncate flex items-center gap-2">
                    <span className="truncate">{p.name} - ${p.price}</span>
                    {active && (
                      <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        x{qty}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="outline" size="sm" onClick={() => setQty(qty - 1)}>-</Button>
                    <Input
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="w-16 text-center"
                      type="number"
                      min={0}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => setQty(qty + 1)}>+</Button>
                  </div>
                </div>
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
