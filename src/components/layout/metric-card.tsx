import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardMetric } from "@/types/domain";

const toneMap = {
  neutral: "neutral",
  success: "success",
  warning: "warning",
  danger: "danger",
} as const;

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardDescription>{metric.label}</CardDescription>
          <Badge tone={toneMap[metric.tone]}>{metric.tone}</Badge>
        </div>
        <CardTitle className="text-3xl">{metric.value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--color-text-soft)]">{metric.helper}</p>
      </CardContent>
    </Card>
  );
}
