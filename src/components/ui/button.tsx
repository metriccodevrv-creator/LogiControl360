import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-operational)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&[aria-pressed='true']]:bg-[var(--color-primary)] [&[aria-pressed='true']]:text-white [&[aria-pressed='true']]:shadow-sm [&[data-state='active']]:bg-[var(--color-primary)] [&[data-state='active']]:text-white [&[data-state='active']]:shadow-sm",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] px-4 py-2 text-white hover:bg-[var(--color-primary-strong)]",
        secondary:
          "bg-white px-4 py-2 text-[var(--color-primary)] ring-1 ring-inset ring-[var(--color-border)] hover:bg-[var(--color-surface)]",
        ghost:
          "px-3 py-2 text-[var(--color-text)] hover:bg-[var(--color-surface)]",
      },
      size: {
        sm: "h-9",
        md: "h-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}
