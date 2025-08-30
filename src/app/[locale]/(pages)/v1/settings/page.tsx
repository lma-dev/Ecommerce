"use client";

import { useTranslations } from "next-intl";

const SettingPage = () => {
  const t = useTranslations("Translation");
  return <h1>{t("settings")}</h1>;
};

export default SettingPage;
