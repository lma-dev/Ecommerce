"use client";

import { useParams } from "next/navigation";
import { useUserQuery } from "@/features/users/api";
import UserForm from "@/v1/users/_components/UserForm";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";

export default function UserEditPage() {
  const { id } = useParams();
  const { data: user, isLoading } = useUserQuery(Number(id));

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

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
