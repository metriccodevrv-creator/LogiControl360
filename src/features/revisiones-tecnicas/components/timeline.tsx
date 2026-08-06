import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TechnicalReviewTimelineEvent } from "@/features/revisiones-tecnicas/types";
import { technicalReviewLabel } from "@/features/revisiones-tecnicas/utils";
import { formatDateTime } from "@/lib/dates/format";

interface TimelineProps {
  items: TechnicalReviewTimelineEvent[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Linea de tiempo del proceso</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                  {formatDateTime(item.at)}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--color-primary)]">
                  {item.action}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
                  {item.observations}
                </p>
              </div>
              <Badge tone="info">{item.user}</Badge>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Badge tone="neutral">
                {technicalReviewLabel(item.previousState)} -&gt;{" "}
                {technicalReviewLabel(item.nextState)}
              </Badge>
              {item.documents.map((document) => (
                <Badge key={document} tone="success">
                  {document}
                </Badge>
              ))}
              {item.rejectionReasons.map((reason) => (
                <Badge key={reason} tone="warning">
                  {reason}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
