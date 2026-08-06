import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/features/revisiones-tecnicas/components/status-badge";
import type { TechnicalReviewOperationalItem } from "@/features/revisiones-tecnicas/types";

interface OperationalTableProps {
  items: TechnicalReviewOperationalItem[];
}

export function OperationalTable({ items }: OperationalTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bandeja operacional</CardTitle>
        <p className="text-sm text-[var(--color-text-soft)]">
          Vista priorizada para envios, recepciones, validacion documental y trazabilidad.
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-[1180px] border-separate border-spacing-y-3">
          <thead>
            <tr>
              {[
                "Bus",
                "Marca y modelo",
                "Terminal",
                "Vencimiento",
                "Estado",
                "Ultimo resultado",
                "Intentos",
                "Planta",
                "Responsable",
                "Acciones",
              ].map((label) => (
                <th
                  key={label}
                  className="px-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="bg-[var(--color-surface)]">
                <td className="rounded-l-3xl px-4 py-4 text-sm">
                  <Link
                    href={`/revisiones-tecnicas/historial/${item.busId}`}
                    className="font-semibold text-[var(--color-operational)]"
                  >
                    {item.internalNumber}
                  </Link>
                  <p className="mt-1 text-xs text-[var(--color-text-soft)]">{item.ppu}</p>
                </td>
                <td className="px-4 py-4 text-sm text-[var(--color-text)]">
                  {item.brand} {item.model}
                </td>
                <td className="px-4 py-4 text-sm text-[var(--color-text)]">{item.terminal}</td>
                <td className="px-4 py-4 text-sm text-[var(--color-text)]">
                  <p>{item.dueDate}</p>
                  <Badge tone={item.daysRemaining <= 0 ? "danger" : "warning"} className="mt-2">
                    {item.daysRemaining <= 0
                      ? `${Math.abs(item.daysRemaining)} dias vencido`
                      : `${item.daysRemaining} dias restantes`}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-sm">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-4 text-sm">
                  <Badge
                    tone={
                      item.lastResult === "APROBADO"
                        ? "success"
                        : item.lastResult === "RECHAZADO"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {item.lastResult}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-sm text-[var(--color-text)]">
                  {item.attemptCount} intento(s)
                  <p className="mt-1 text-xs text-[var(--color-text-soft)]">
                    {item.rejectionCount} rechazo(s)
                  </p>
                </td>
                <td className="px-4 py-4 text-sm text-[var(--color-text)]">{item.plant}</td>
                <td className="px-4 py-4 text-sm text-[var(--color-text)]">{item.responsible}</td>
                <td className="rounded-r-3xl px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/revisiones-tecnicas/historial/${item.busId}`}>
                      <Button size="sm" variant="secondary">
                        Ver detalle
                      </Button>
                    </Link>
                    <Link href="/revisiones-tecnicas/envios/nuevo">
                      <Button size="sm" variant="secondary">
                        Registrar envio
                      </Button>
                    </Link>
                    <Link href="/revisiones-tecnicas/recepciones/nueva">
                      <Button size="sm" variant="ghost">
                        Recepcion
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
