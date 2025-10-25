"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DialogType = "delete" | "export";

interface ConfirmDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: DialogType;
  method: (() => void) | null;
  t: (key: string) => string; // Translation function
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  setOpen,
  type,
  method,
  t,
}) => {
  const handleConfirm = () => {
    if (method) {
      method();
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Define dialog content based on type
  const dialogConfig = {
    delete: {
      title: t("delete"),
      description: t("confirmDialogText"),
      confirmText: t("delete"),
      variant: "destructive" as const,
    },
    export: {
      title: t("export"),
      description: t("confirmDialogText"),
      confirmText: t("export"),
      variant: "default" as const,
    },
  };

  const config = dialogConfig[type];

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{config.title}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={handleCancel}>
              {t("cancel")}
            </Button>
            <Button onClick={handleConfirm}>{t("confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
