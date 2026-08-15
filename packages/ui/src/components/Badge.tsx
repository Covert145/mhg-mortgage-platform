import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/** Also used as the platform's "StatusPill" (loan stage, document status, etc.) — same component, semantic variant names. */
const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      neutral: "bg-ink-100 text-ink-700",
      brand: "bg-brand-100 text-brand-700",
      success: "bg-green-100 text-success",
      warning: "bg-amber-100 text-warning",
      danger: "bg-red-100 text-danger",
      info: "bg-blue-100 text-blue-700",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export const StatusPill = Badge;
