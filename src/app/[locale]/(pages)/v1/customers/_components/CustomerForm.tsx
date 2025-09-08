"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createCustomerSchema } from "@/features/customers/schemas/createCustomerSchema";
import { updateCustomerSchema } from "@/features/customers/schemas/updateCustomerSchema";
import { useCreateCustomer, useUpdateCustomer } from "@/features/customers/api";
import ToastAlert from "@/app/[locale]/_components/ui/toast-box";
import { Input } from "@/components/ui/input";
import { FormSubmitButton } from "@/app/[locale]/_components/ui/button";
import CustomLink from "@/app/[locale]/_components/ui/custom-link";
import { useLocale, useTranslations } from "next-intl";

type FormValues = z.infer<typeof updateCustomerSchema>;

const CustomerForm = ({
  mode,
  defaultValues,
}: {
  mode: "create" | "edit";
  defaultValues?: any;
}) => {
  const mappedDefaults: FormValues = defaultValues
    ? {
        name: defaultValues.name ?? "",
        email: defaultValues.email ?? "",
        phone: defaultValues.phone ?? "",
      }
    : {
        name: "",
        email: "",
        phone: "",
      };

  const activeSchema = mode === "edit" ? updateCustomerSchema : createCustomerSchema;
  const form = useForm<FormValues>({
    resolver: zodResolver(activeSchema) as any,
    defaultValues: mappedDefaults as any,
  });

  const locale = useLocale();
  const t = useTranslations("Translation");
  const create = useCreateCustomer();
  const update = useUpdateCustomer();

  const onSubmit = (values: FormValues) => {
    if (mode === "edit" && defaultValues?.id) {
      update.mutate(
        { id: defaultValues.id, ...values },
        { onSuccess: () => ToastAlert.success({ message: t("updateSuccess") }) },
      );
    } else {
      create.mutate(values as any, {
        onSuccess: () => ToastAlert.success({ message: t("createSuccess") }),
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register("name")} placeholder={t("name")} />
      <Input {...form.register("email")} placeholder={t("email")} type="email" />
      <Input {...form.register("phone")} placeholder={t("phone")} />

      <div className="flex justify-between items-center">
        <CustomLink href={`/${locale}/v1/customers`}>{t("back")}</CustomLink>
        <FormSubmitButton text={mode === "edit" ? t("updateCustomer") : t("createCustomer")} />
      </div>
    </form>
  );
};

export default CustomerForm;
