"use client";

import { useCreateProduct, useUpdateProduct } from "@/features/products/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProductSchema } from "@/features/products/schemas/createProductSchema";
import { updateProductSchema } from "@/features/products/schemas/updateProductSchema";
import ToastAlert from "@/app/[locale]/_components/ui/toast-box";
import { useLocale, useTranslations } from "next-intl";
import { FormSubmitButton } from "@/app/[locale]/_components/ui/button";
import CustomLink from "@/app/[locale]/_components/ui/custom-link";
import {
  productStatusOptions,
  ProductStatusType,
} from "@/features/products/constants/status";
import { Textarea } from "@/components/ui/textarea";
import { useCategoriesQuery } from "@/features/categories/api";

// --- Shared ProductForm Component ---
const ProductForm = ({
  mode,
  defaultValues,
}: {
  mode: "create" | "edit";
  defaultValues?: any;
}) => {
  type CreateValues = z.infer<typeof createProductSchema>;
  type UpdateValues = z.infer<typeof updateProductSchema>;
  // Use the update (partial) shape for the form type to avoid resolver mismatch
  type FormValues = UpdateValues;
  // Normalize incoming defaults (esp. categoryId from category.id)
  const mappedDefaults = defaultValues
    ? {
        name: defaultValues.name ?? "",
        description: defaultValues.description ?? "",
        isActive: defaultValues.isActive ?? "ACTIVE",
        price: defaultValues.price ?? 0,
        categoryId:
          defaultValues.categoryId ?? defaultValues.category?.id ?? null,
        image: null,
      }
    : {
        name: "",
        description: "",
        isActive: "ACTIVE",
        price: 0,
        categoryId: null,
        image: null,
      };

  const activeSchema = mode === "edit" ? updateProductSchema : createProductSchema;
  const form = useForm<FormValues>({
    resolver: zodResolver(activeSchema) as any,
    defaultValues: mappedDefaults as any,
  });
  
  // Ensure categoryId is set from defaultValues on mount (robust preselect)
  useEffect(() => {
    if (mode === "edit") {
      const id = defaultValues?.categoryId ?? defaultValues?.category?.id;
      if (id != null) {
        form.setValue("categoryId" as any, id, { shouldDirty: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const locale = useLocale();
  const t = useTranslations("Translation");

  const create = useCreateProduct();
  const update = useUpdateProduct();
  const { data: categoriesRes, isLoading: isLoadingCategories } =
    useCategoriesQuery(1, {});

  const onSubmit = (values: any) => {
    console.log(values);
    if (mode === "edit" && defaultValues?.id) {
      update.mutate(
        { id: defaultValues.id, ...values },
        {
          onSuccess: () =>
            ToastAlert.success({ message: t("updateSuccess") }),
        }
      );
    } else {
      create.mutate(values, {
        onSuccess: () =>
          ToastAlert.success({ message: t("createSuccess") }),
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register("name")} placeholder={t("name")} />
      <Input
        {...form.register("price", { valueAsNumber: true })}
        placeholder={t("price")}
        type="number"
      />
      <Textarea {...form.register("description")} placeholder={t("description")} />

      {/* Category Select (shows name, submits id) */}
      <Controller
        name="categoryId"
        control={form.control}
        render={({ field }) => {
          if (isLoadingCategories) return <div>{t("loadingCategories")}</div>;

          const categories = categoriesRes?.data ?? [];
          const selectedId = field.value as number | null | undefined;
          const hasSelected =
            selectedId != null && categories.some((c) => c.id === selectedId);
          const fallbackOption = !hasSelected && selectedId != null
            ? {
                id: selectedId,
                name:
                  defaultValues?.category?.name ?? `Current category (#${selectedId})`,
              }
            : null;

          return (
            <Select
              value={field.value != null ? String(field.value) : undefined}
              onValueChange={(v) => field.onChange(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {fallbackOption && (
                  <SelectItem
                    key={`fallback-${fallbackOption.id}`}
                    value={String(fallbackOption.id)}
                  >
                    {fallbackOption.name}
                  </SelectItem>
                )}
                {categories
                  .filter((cat) => cat.id !== fallbackOption?.id)
                  .map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          );
        }}
      />
      <Controller
        name="image"
        control={form.control}
        render={({ field }) => (
          <Input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
            onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
            ref={field.ref}
            name={field.name}
          />
        )}
      />

      <Controller
        name="isActive"
        control={form.control}
        render={({ field }) => (
          <Select
            value={field.value ?? undefined}
            onValueChange={(v) => field.onChange(v as ProductStatusType)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              {productStatusOptions.map((st) => (
                <SelectItem key={st} value={st}>
                  {st === "ACTIVE" ? t("active") : t("inactive")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <div className="flex justify-between items-center">
        <CustomLink
          href={`/${locale}/${process.env.NEXT_PUBLIC_APP_VERSION}/products`}
        >
          {t("back")}
        </CustomLink>
        <FormSubmitButton
          text={mode === "edit" ? t("updateProduct") : t("createProduct")}
        />
      </div>
    </form>
  );
};

export default ProductForm;
