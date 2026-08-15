import * as React from "react";
import { cn } from "../lib/cn";
import { Card } from "./Card";

export interface StatWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  trend?: { direction: "up" | "down" | "flat"; label: string };
}

const TREND_CLASS: Record<NonNullable<StatWidgetProps["trend"]>["direction"], string> = {
  up: "text-success",
  down: "text-danger",
  flat: "text-ink-500",
};

/** Dashboard tile — reporting/dashboards across CRM, management, and admin views. */
export function StatWidget({ label, value, trend, className, ...props }: StatWidgetProps) {
  return (
    <Card className={cn("p-5", className)} {...props}>
      <p className="text-sm font-medium text-ink-500">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-ink-900">{value}</p>
      {trend ? <p className={cn("mt-2 text-xs font-medium", TREND_CLASS[trend.direction])}>{trend.label}</p> : null}
    </Card>
  );
}
