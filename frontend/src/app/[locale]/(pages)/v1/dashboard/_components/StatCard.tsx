"use client";

import React from "react";

export type StatCardProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  Icon: React.ElementType;
  iconBg?: string;
  className?: string;
};

export function StatCard({ label, value, hint, Icon, iconBg = "bg-muted", className }: StatCardProps) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm p-5 flex flex-col gap-3 ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className={`h-9 w-9 rounded-md flex items-center justify-center ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-3xl font-semibold tracking-tight">{value}</div>
      {hint ? <div className="text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

export default StatCard;

