import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../lib/cn";

export const RadioGroup = RadioGroupPrimitive.Root;

export const RadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink-300 bg-white",
      "data-[state=checked]:border-brand-600",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="h-2.5 w-2.5 rounded-full bg-brand-600" />
  </RadioGroupPrimitive.Item>
));
RadioItem.displayName = "RadioItem";
