"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import Spinner from "@/app/[locale]/_components/ui/spinner";
import { IdParamType } from "types/IdParamType";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import { useProductsQuery } from "@/features/products/api";

const DetailProduct = ({ params }: IdParamType) => {
  const { data: productData, isLoading } = useProductsQuery(params.id);
  const locale = useLocale();
  return (
    <div>
      <BreadCrumb title="Product Details" />
      <div className="flex justify-center align-middle mx-auto min-h-fit">
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="w-1/2">
            <div className="mb-5">
              <label
                htmlFor="Name"
                className="block text-xs font-medium text-gray-500"
              >
                Name
              </label>

              <input
                type="text"
                id="name"
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-3 bg-gray-200"
                name="name"
                value={productData?.name}
                readOnly
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="AccountStatus"
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
                value={productData?.isActive}
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
                value={productData?.description || ""}
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

export default DetailProduct;
