"use client";

import {
  useCreateRegularCost,
  useUpdateRegularCost,
} from "@/features/regular-costs/api";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRegularCostSchema } from "@/features/regular-costs/schemas/createRegularCostSchema";
import { updateRegularCostSchema } from "@/features/regular-costs/schemas/updateRegularCostSchema";
import ToastAlert from "@/app/[locale]/_components/ui/toast-box";
import { useLocale } from "next-intl";
import { FormSubmitButton } from "@/app/[locale]/_components/ui/button";
import CustomLink from "@/app/[locale]/_components/ui/custom-link";

const RegularCostForm = ({
  mode,
  defaultValues,
  t,
}: {
  mode: "create" | "edit" | "show";
  defaultValues?: any;
  t: any;
}) => {
  const isReadOnly = mode === "show";

  const form = useForm({
    resolver: zodResolver(
      mode === "edit" ? updateRegularCostSchema : createRegularCostSchema
    ),
    defaultValues: defaultValues ?? {
      amount: 1000,
      description: "",
    },
  });

  const locale = useLocale();
  const create = useCreateRegularCost();
  const update = useUpdateRegularCost();

  const onSubmit = async (values: any) => {
    if (isReadOnly) return;

    try {
      if (mode === "edit" && defaultValues?.id) {
        await update.mutateAsync(
          { id: defaultValues.id, ...values },
          {
            onSuccess: () => {
              ToastAlert.success({
                message: "RegularCost updated successfully",
              });
            },
          }
        );
      } else {
        await create.mutateAsync(values, {
          onSuccess: () => {
            ToastAlert.success({
              message: "RegularCost created successfully",
            });
          },
        });
      }
    } catch (error) {
      ToastAlert.error({ message: "Submission failed" });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("amount")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder={t("amountPlaceholder")}
                  min={500}
                  step={2}
                  disabled={isReadOnly}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t("descriptionPlaceholder")}
                  maxLength={255}
                  disabled={isReadOnly}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <CustomLink
            href={`/${locale}/${process.env.NEXT_PUBLIC_APP_VERSION}/regular-costs`}
          >
            {t("back")}
          </CustomLink>

          {/* Only show submit button if not in "show" mode */}
          {!isReadOnly && (
            <FormSubmitButton
              text={
                mode === "edit" ? t("editRegularCost") : t("createRegularCost")
              }
            />
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default RegularCostForm;
