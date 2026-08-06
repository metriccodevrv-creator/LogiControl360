import { Badge } from "@/components/ui/badge";
import type { TechnicalReviewStatus } from "@/features/revisiones-tecnicas/types";
import {
  technicalReviewLabel,
  technicalReviewTone,
} from "@/features/revisiones-tecnicas/utils";

interface StatusBadgeProps {
  status: TechnicalReviewStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge tone={technicalReviewTone(status)}>{technicalReviewLabel(status)}</Badge>;
}
