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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@/features/users/schemas/createUserSchema";
import { updateUserSchema } from "@/features/users/schemas/updateUserSchema";
import ToastAlert from "@/app/[locale]/_components/ui/toast-box";
import { useLocale, useTranslations } from "next-intl";
import { FormSubmitButton } from "@/app/[locale]/_components/ui/button";
import CustomLink from "@/app/[locale]/_components/ui/custom-link";
import {
  userRoleLabel,
  userRoleOptions,
  UserRoleType,
} from "@/features/users/constants/role";
import {
  userAccountStatusOptions,
  UserAccountStatusType,
} from "@/features/users/constants/status";

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
      role: "STAFF",
      accountStatus: "ACTIVE",
      password: "",
    },
  });
  const locale = useLocale();
  const t = useTranslations("Translation");

  const create = useCreateUser();
  const update = useUpdateUser();

  const onSubmit = (values: any) => {
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
      <Input {...form.register("email")} placeholder={t("email")} />

      <Controller
        name="role"
        control={form.control}
        render={({ field }) => (
          <Select
            value={field.value ?? undefined}
            onValueChange={(v) => field.onChange(v as UserRoleType)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectRole")} />
            </SelectTrigger>
            <SelectContent>
              {userRoleOptions.map((role) => (
                <SelectItem key={role} value={role}>
                  {userRoleLabel[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Controller
        name="accountStatus"
        control={form.control}
        render={({ field }) => (
          <Select
            value={field.value ?? undefined}
            onValueChange={(v) => field.onChange(v as UserAccountStatusType)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              {userAccountStatusOptions.map((st) => (
                <SelectItem key={st} value={st}>
                  {st === "ACTIVE" ? t("active") : t("suspend")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {mode === "create" && (
        <div>
          <Input
            type="password"
            {...form.register("password")}
            placeholder={t("password")}
          />
        </div>
      )}
      <div className="flex justify-between items-center">
        <CustomLink
          href={`/${locale}/${process.env.NEXT_PUBLIC_APP_VERSION}/users`}
        >
          {t("back")}
        </CustomLink>
        <FormSubmitButton
          text={mode === "edit" ? t("updateUser") : t("createUser")}
        />
      </div>
    </form>
  );
};

export default UserForm;
