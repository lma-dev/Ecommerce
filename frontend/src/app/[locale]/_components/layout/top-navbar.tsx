"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/app/[locale]/_components/layout/sidebar";
import { useTranslations } from "next-intl";
import { UserProfileDropdown } from "@/app/[locale]/_components/ui/user-profile-dropdown";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";

export function TopNavbar() {
  const t = useTranslations("Translation");

  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="h-16 mx-auto w-full max-w-6xl flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="md:hidden border p-2 rounded"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="hidden md:inline text-lg font-bold truncate max-w-[40vw]">
              {t("appTitle")}
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="md:hidden">
              <LanguageSwitcher compact />
            </div>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <UserProfileDropdown />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-30 bg-black md:hidden backdrop-blur-sm"
            />

            {/* Sidebar */}
            <motion.aside
              key="sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r p-4 md:hidden shadow-xl"
            >
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => setOpen(false)}
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
              <Sidebar onLinkClick={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
