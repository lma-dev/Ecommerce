"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/libs/utils";

type Variant = "primary" | "muted" | "destructive";
type Size = "xs" | "sm" | "md" | "lg" | "xl";

type AppIconProps = {
  icon: LucideIcon;
  size?: Size;
  strokeWidth?: number;
  variant?: Variant;
  className?: string;
};

const variantClassMap: Record<Variant, string> = {
  primary: "text-primary",
  muted: "text-muted-foreground",
  destructive: "text-red-500",
};

const sizePxMap: Record<Size, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export function AppIcon({
  icon: Icon,
  size = "md",
  strokeWidth = 1.5,
  className,
  variant = "muted",
}: AppIconProps) {
  const pixelSize = sizePxMap[size];

  return (
    <Icon
      strokeWidth={strokeWidth}
      className={cn("shrink-0", variantClassMap[variant], className)}
      style={{ width: pixelSize, height: pixelSize }}
    />
  );
}
