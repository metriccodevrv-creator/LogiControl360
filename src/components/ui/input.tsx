import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-operational)] focus:ring-2 focus:ring-[rgba(8,145,178,0.2)]",
        className,
      )}
      {...props}
    />
  );
}
