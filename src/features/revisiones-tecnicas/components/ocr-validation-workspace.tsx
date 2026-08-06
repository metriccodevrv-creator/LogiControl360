"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TechnicalReviewDocumentReview } from "@/features/revisiones-tecnicas/types";
import {
  confidenceLabel,
  confidenceTone,
} from "@/features/revisiones-tecnicas/utils";

interface OcrValidationWorkspaceProps {
  document: TechnicalReviewDocumentReview;
}

export function OcrValidationWorkspace({
  document,
}: OcrValidationWorkspaceProps) {
  const [selectedPage, setSelectedPage] = useState(1);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(document.fields.map((field) => [field.id, field.confirmedValue])),
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <CardTitle>Documento original</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: document.pages }, (_, index) => index + 1).map((page) => (
              <Button
                key={page}
                variant={selectedPage === page ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSelectedPage(page)}
              >
                Pagina {page}
              </Button>
            ))}
            <Button variant="ghost" size="sm">
              Rotar
            </Button>
            <Button variant="ghost" size="sm">
              Zoom +
            </Button>
            <Button variant="ghost" size="sm">
              Zoom -
            </Button>
          </div>

          <div className="flex min-h-[520px] items-center justify-center rounded-[28px] border border-dashed border-[var(--color-border)] bg-[linear-gradient(180deg,#f8fafc_0%,#eef5fb_100%)] p-8">
            <div className="max-w-md space-y-4 text-center">
              <Badge tone="info">Vista simulada pagina {selectedPage}</Badge>
              <p className="text-lg font-semibold text-[var(--color-primary)]">
                Documento {document.documentType}
              </p>
              <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                Este panel queda preparado para integrar render de PDF/imagen, rotacion,
                cambio de pagina y resaltado de coordenadas OCR.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {document.warnings.map((warning) => (
              <Badge key={warning} tone="warning">
                {warning}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revision humana obligatoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="info">{document.documentType}</Badge>
            <Badge tone={confidenceTone(document.overallConfidence)}>
              Confianza global {Math.round(document.overallConfidence * 100)}%
            </Badge>
            <Badge tone="neutral">Bus {document.ppu}</Badge>
          </div>

          {document.fields.map((field) => (
            <div
              key={field.id}
              className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-primary)]">
                    {field.name}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                    OCR detectado: {field.ocrValue || "Sin dato"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={confidenceTone(field.confidence)}>
                    {confidenceLabel(field.confidence)}
                  </Badge>
                  <Badge tone="neutral">Pagina {field.page}</Badge>
                  {field.corrected ? <Badge tone="warning">Corregido</Badge> : null}
                </div>
              </div>
              <input
                className="mt-3 h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm"
                value={values[field.id] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [field.id]: event.target.value }))
                }
              />
            </div>
          ))}

          <div className="flex flex-wrap gap-3">
            <Button>Confirmar recepcion</Button>
            <Button variant="secondary">Guardar borrador</Button>
            <Button variant="secondary">Volver a procesar</Button>
            <Button variant="ghost">Rechazar lectura</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
