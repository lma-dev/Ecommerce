"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUserQuery } from "@/features/users/api";
import UserForm from "@/v1/users/_components/UserForm";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";

export default function UserEditPage() {
  const { id } = useParams();
  const { data: user, isLoading } = useUserQuery(Number(id));
  const t = useTranslations("Translation");

  if (isLoading) return <div>{t("loadingUsers")}</div>;
  if (!user) return <div>{t("userNotFound", { default: "User not found" })}</div>;

  return (
    <div>
      <BreadCrumb title="Edit User" />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Edit User</h1>
        <UserForm mode="edit" defaultValues={user} />
      </div>
    </div>
  );
}
