"use client";

import {
  useCreateCategory,
  useUpdateCategory,
} from "@/features/categories/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema } from "@/features/categories/schemas/createCategorySchema";
import { updateCategorySchema } from "@/features/categories/schemas/updateCategorySchema";
import ToastAlert from "@/app/[locale]/_components/ui/toast-box";
import { useLocale } from "next-intl";
import { FormSubmitButton } from "@/app/[locale]/_components/ui/button";
import CustomLink from "@/app/[locale]/_components/ui/custom-link";
import {
  categoryStatusOptions,
  CategoryStatusType,
} from "@/features/categories/constants/status";

// --- Shared CategoryForm Component ---
const CategoryForm = ({
  mode,
  defaultValues,
}: {
  mode: "create" | "edit";
  defaultValues?: any;
}) => {
  const form = useForm({
    resolver: zodResolver(
      mode === "edit" ? updateCategorySchema : createCategorySchema
    ),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      isActive: "ACTIVE",
    },
  });
  const locale = useLocale();

  const create = useCreateCategory();
  const update = useUpdateCategory();

  const onSubmit = (values: any) => {
    if (mode === "edit" && defaultValues?.id) {
      update.mutate(
        { id: defaultValues.id, ...values },
        {
          onSuccess: () =>
            ToastAlert.success({ message: "Category updated successfully" }),
        }
      );
    } else {
      create.mutate(values, {
        onSuccess: () =>
          ToastAlert.success({ message: "Category created successfully" }),
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register("name")} placeholder="Name" />
      <Input {...form.register("description")} placeholder="Description" />

      <Controller
        name="isActive"
        control={form.control}
        render={({ field }) => (
          <Select
            value={field.value ?? undefined}
            onValueChange={(v) => field.onChange(v as CategoryStatusType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Release state" />
            </SelectTrigger>
            <SelectContent>
              {categoryStatusOptions.map((st) => (
                <SelectItem key={st} value={st}>
                  {st === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <div className="flex justify-between items-center">
        <CustomLink
          href={`/${locale}/${process.env.NEXT_PUBLIC_APP_VERSION}/categories`}
        >
          Back
        </CustomLink>
        <FormSubmitButton
          text={mode === "edit" ? "Update Category" : "Create Category"}
        />
      </div>
    </form>
  );
};

export default CategoryForm;
