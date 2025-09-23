"use client";

import { useTranslations } from "next-intl";

export default function HeroHeader() {
  const t = useTranslations("Translation");
  return (
    <section className="py-10 md:py-14 text-center bg-white">
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
        {t("ourMenu")}
      </h1>
      <p className="text-sm md:text-base text-neutral-500 mt-3">
        {t("menuSubtitle")}
      </p>
    </section>
  );
}
