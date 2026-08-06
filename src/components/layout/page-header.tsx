import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  badge?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        {eyebrow ? (
          <Badge tone="info" className="w-fit">
            {eyebrow}
          </Badge>
        ) : null}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-primary)]">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--color-text-soft)]">
            {description}
          </p>
        </div>
      </div>
      {badge ? <div>{badge}</div> : null}
    </div>
  );
}
