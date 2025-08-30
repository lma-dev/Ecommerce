"use client";

import { useCreateUser, useUpdateUser } from "@/features/users/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@/features/users/schemas/createUserSchema";
import { updateUserSchema } from "@/features/users/schemas/updateUserSchema";
import ToastAlert from "@/app/[locale]/_components/ui/toast-box";
import { useLocale } from "next-intl";
import { FormSubmitButton } from "@/app/[locale]/_components/ui/button";
import CustomLink from "@/app/[locale]/_components/ui/custom-link";

// --- Shared UserForm Component ---
const UserForm = ({
  mode,
  defaultValues,
}: {
  mode: "create" | "edit";
  defaultValues?: any;
}) => {
  const form = useForm({
    resolver: zodResolver(
      mode === "edit" ? updateUserSchema : createUserSchema
    ),
    defaultValues: defaultValues ?? {
      name: "",
      email: "",
      role: "MEMBER",
      accountStatus: "ACTIVE",
      password: "",
    },
  });
  const locale = useLocale();

  const create = useCreateUser();
  const update = useUpdateUser();

  const onSubmit = (values: any) => {
    if (mode === "edit" && defaultValues?.id) {
      update.mutate(
        { id: defaultValues.id, ...values },
        {
          onSuccess: () =>
            ToastAlert.success({ message: "User updated successfully" }),
        }
      );
    } else {
      create.mutate(values, {
        onSuccess: () =>
          ToastAlert.success({ message: "User created successfully" }),
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register("name")} placeholder="Name" />
      <Input {...form.register("email")} placeholder="Email" />

      <Select
        defaultValue={form.getValues("role")}
        onValueChange={(value) => form.setValue("role", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="MEMBER">Member</SelectItem>
          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={form.getValues("accountStatus")}
        onValueChange={(value) => form.setValue("accountStatus", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="SUSPENDED">Suspended</SelectItem>
        </SelectContent>
      </Select>

      {mode === "create" && (
        <Input
          type="password"
          {...form.register("password")}
          placeholder="Password"
        />
      )}
      <div className="flex justify-between items-center">
        <CustomLink
          href={`/${locale}/${process.env.NEXT_PUBLIC_APP_VERSION}/users`}
        >
          Back
        </CustomLink>
        <FormSubmitButton
          text={mode === "edit" ? "Update User" : "Create User"}
        />
      </div>
    </form>
  );
};

export default UserForm;
