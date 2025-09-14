"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const t = useTranslations("Translation");
  const locale = useLocale();

  return (
    <main className="min-h-screen w-full bg-background flex items-center justify-center px-6">
      <div className="relative w-full max-w-5xl rounded-3xl border border-border bg-card shadow-sm p-8 md:p-12">
        {/* Corner badge brand */}
        <div className="absolute -top-4 -left-4">
          <Badge className="rounded-full bg-amber-600 text-white shadow-md px-3 py-1">
            {t("appTitle")}
          </Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
              {t("appTitle")}
            </h1>
            <div className="mt-3 flex justify-center md:justify-start">
              <span className="h-1.5 w-28 rounded-full bg-amber-500/80" />
            </div>
            <p className="mt-4 text-muted-foreground text-base md:text-lg">
              {t("landingSubtitle")}
            </p>
            <div className="mt-8">
              <Link href={`/${locale}/login`}>
                <Button size="lg" className="min-w-40">
                  {t("getStarted")}
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src="/illustrations/food-plate.svg"
              alt="Restaurant illustration"
              className="h-56 w-auto md:h-72 select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
