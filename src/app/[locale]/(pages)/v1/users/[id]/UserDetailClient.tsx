"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import Spinner from "@/app/[locale]/_components/ui/spinner";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import { useUserQuery } from "@/features/users/api";

type UserDetailClientProps = {
  id: number;
};

const UserDetailClient = ({ id }: UserDetailClientProps) => {
  const { data: userData, isLoading } = useUserQuery(id);
  const locale = useLocale();

  return (
    <div>
      <BreadCrumb title="User Profile" />
      <div className="flex justify-center align-middle mx-auto min-h-fit">
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="w-1/2">
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block text-xs font-medium text-gray-500"
              >
                Name
              </label>

              <input
                type="text"
                id="name"
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-3 bg-gray-200"
                name="name"
                value={userData?.name ?? ""}
                readOnly
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="UserEmail"
                className="block text-xs font-medium text-gray-500"
              >
                Email
              </label>

              <input
                type="email"
                id="UserEmail"
                placeholder="john@rhcp.com"
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-3 bg-gray-200"
                name="email"
                value={userData?.email ?? ""}
                readOnly
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="role"
                className="block text-xs font-medium text-gray-500"
              >
                Role
              </label>
              <input
                type="text"
                id="role"
                placeholder="role"
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-3 bg-gray-200"
                name="role"
                value={userData?.role ?? ""}
                readOnly
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="accountStatus"
                className="block text-xs font-medium text-gray-500"
              >
                Account Status
              </label>
              <input
                type="text"
                id="accountStatus"
                placeholder="accountStatus"
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-3 bg-gray-200"
                name="accountStatus"
                value={userData?.accountStatus ?? ""}
                readOnly
              />
            </div>
            <Link
              href={`/${locale}/${process.env.NEXT_PUBLIC_APP_VERSION}/users`}
              className="inline-flex mr-1.5 rounded-lg p-3 text-sm text-white bg-gray-900 font-medium transition hover:scale-105 border"
            >
              Back
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailClient;
