import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "../lib/cn";

export const ToastProvider = ToastPrimitive.Provider;

export function ToastViewport({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      className={cn("fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2", className)}
      {...props}
    />
  );
}

const TOAST_VARIANT_CLASS: Record<"default" | "success" | "danger", string> = {
  default: "border-ink-200 bg-white",
  success: "border-success/30 bg-white",
  danger: "border-danger/30 bg-white",
};

export interface ToastRootProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: keyof typeof TOAST_VARIANT_CLASS;
}

export const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastRootProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        "rounded-card border p-4 shadow-card data-[state=open]:animate-in data-[state=closed]:animate-out",
        TOAST_VARIANT_CLASS[variant],
        className,
      )}
      {...props}
    />
  ),
);
Toast.displayName = "Toast";

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn("text-sm font-semibold text-ink-900", className)} {...props} />
));
ToastTitle.displayName = "ToastTitle";

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description ref={ref} className={cn("mt-1 text-sm text-ink-500", className)} {...props} />
));
ToastDescription.displayName = "ToastDescription";

export const ToastClose = ToastPrimitive.Close;
