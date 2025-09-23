"use client";

import CustomerTopbar from "../customer/_components/CustomerTopbar";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("Translation");
  return (
    <div className="p-4 md:p-6 space-y-8">
      <CustomerTopbar />
      <section className="max-w-3xl mx-auto text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
          {t("contactTitle", { default: "Contact Us" })}
        </h1>
        <p className="text-neutral-600">
          {t("contactSubtitle", { default: "We'd love to hear from you." })}
        </p>
      </section>

      <section className="max-w-3xl mx-auto grid grid-cols-1 gap-4">
        <div className="rounded-2xl border p-5 bg-white">
          <div className="text-sm text-neutral-700">
            <div className="mb-2"><strong>{t("email", { default: "Email" })}:</strong> hello@example.com</div>
            <div className="mb-2"><strong>{t("phone", { default: "Phone" })}:</strong> +95 9 000 000 000</div>
            <div><strong>{t("address", { default: "Address" })}:</strong> 123 Sample Street, Yangon</div>
          </div>
        </div>
      </section>
    </div>
  );
}

