import { MetricCard } from "@/components/layout/metric-card";
import type { TechnicalReviewMetric } from "@/features/revisiones-tecnicas/types";

interface StatGridProps {
  metrics: TechnicalReviewMetric[];
}

export function StatGrid({ metrics }: StatGridProps) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </section>
  );
}
