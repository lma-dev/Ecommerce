"use client";

import CustomerTopbar from "../customer/_components/CustomerTopbar";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("Translation");
  return (
    <div className="p-4 md:p-6 space-y-8">
      <CustomerTopbar />
      <section className="max-w-3xl mx-auto text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
          {t("aboutTitle")}
        </h1>
        <p className="text-neutral-600">
          {t("aboutSubtitle")}
        </p>
      </section>
      <section className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border p-5 bg-white">
          <h3 className="font-semibold text-neutral-900 mb-1">{t("freshIngredients")}</h3>
          <p className="text-sm text-neutral-600">{t("freshIngredientsDesc")}</p>
        </div>
        <div className="rounded-2xl border p-5 bg-white">
          <h3 className="font-semibold text-neutral-900 mb-1">{t("fastDelivery")}</h3>
          <p className="text-sm text-neutral-600">{t("fastDeliveryDesc")}</p>
        </div>
      </section>
    </div>
  );
}

