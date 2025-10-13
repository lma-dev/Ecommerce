"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import Spinner from "@/app/[locale]/_components/ui/spinner";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import { useCategoryQuery } from "@/features/categories/api";

type CategoryDetailClientProps = {
  id: number;
};

const CategoryDetailClient = ({ id }: CategoryDetailClientProps) => {
  const { data: categoryData, isLoading } = useCategoryQuery(id);
  const locale = useLocale();

  return (
    <div>
      <BreadCrumb title="Category Details" />
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
                value={categoryData?.name ?? ""}
                readOnly
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="isActive"
                className="block text-xs font-medium text-gray-500"
              >
                Is Active
              </label>
              <input
                type="text"
                id="isActive"
                placeholder="isActive"
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-3 bg-gray-200"
                name="isActive"
                value={categoryData?.isActive ?? ""}
                readOnly
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="description"
                className="block text-xs font-medium text-gray-500"
              >
                Description
              </label>
              <textarea
                id="description"
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-3 bg-gray-200"
                name="description"
                value={categoryData?.description ?? ""}
                readOnly
              />
            </div>
            <Link
              href={`/${locale}/${process.env.NEXT_PUBLIC_APP_VERSION}/categories`}
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

export default CategoryDetailClient;
