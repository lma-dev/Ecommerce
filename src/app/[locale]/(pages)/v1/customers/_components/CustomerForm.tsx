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
import { useLocale } from "next-intl";

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
  const create = useCreateCustomer();
  const update = useUpdateCustomer();

  const onSubmit = (values: FormValues) => {
    if (mode === "edit" && defaultValues?.id) {
      update.mutate(
        { id: defaultValues.id, ...values },
        { onSuccess: () => ToastAlert.success({ message: "Customer updated successfully" }) },
      );
    } else {
      create.mutate(values as any, {
        onSuccess: () => ToastAlert.success({ message: "Customer created successfully" }),
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register("name")} placeholder="Name" />
      <Input {...form.register("email")} placeholder="Email" type="email" />
      <Input {...form.register("phone")} placeholder="Phone" />

      <div className="flex justify-between items-center">
        <CustomLink href={`/${locale}/v1/customers`}>Back</CustomLink>
        <FormSubmitButton text={mode === "edit" ? "Update Customer" : "Create Customer"} />
      </div>
    </form>
  );
};

export default CustomerForm;

