"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, CircleUserRound, Info, Phone, Receipt } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppIcon } from "@/app/[locale]/_components/ui/app-icon";
import { useLogout } from "@/app/[locale]/(auth)/login/features/hooks";
import { Link } from "@/i18n/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function CustomerUserDropdown() {
  const t = useTranslations("Translation");
  const logout = useLogout();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <AppIcon icon={CircleUserRound} size="lg" variant="primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={{ pathname: "/customer/profile" }}>
              <User className="mr-2 h-4 w-4" /> {t("profile")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={{ pathname: "/customer/orders" }}>
              <Receipt className="mr-2 h-4 w-4" /> {t("orders")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={{ pathname: "/about" }}>
              <Info className="mr-2 h-4 w-4" /> {t("about", { default: "About" })}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={{ pathname: "/contact" }}>
              <Phone className="mr-2 h-4 w-4" /> {t("contact", { default: "Contact" })}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setConfirmOpen(true)}>
            <LogOut className="mr-2 h-4 w-4" /> {t("signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("signOut")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirmDialogText")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={logout}>{t("confirm")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
