"use client";

import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("Translation");
  return <h1>{t("dashboard")}</h1>;
}
