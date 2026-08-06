"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useDeferredValue, useState, useTransition } from "react";

import { persistFleetImport, type PersistFleetImportResult } from "@/features/fleet/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { importFleetWorkbook, type FleetImportResult } from "@/features/fleet/importer";
import type { FleetBus } from "@/types/domain";

interface FleetImportWorkspaceProps {
  initialFleet: FleetBus[];
  canManage: boolean;
}

const emptyImport: FleetImportResult = {
  cleanedRows: [],
  sourceRows: 0,
  validRows: 0,
  duplicateRows: 0,
  ignoredRows: 0,
  detectedColumns: [],
};

export function FleetImportWorkspace({
  initialFleet,
  canManage,
}: FleetImportWorkspaceProps) {
  const router = useRouter();
  const [rows, setRows] = useState(initialFleet);
  const [importSummary, setImportSummary] = useState<FleetImportResult>(emptyImport);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [persistResult, setPersistResult] = useState<PersistFleetImportResult | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredRows = rows.filter((row) => {
    const term = deferredQuery.trim().toLowerCase();
    if (!term) {
      return true;
    }

    return [
      row.internalNumber,
      row.ppu,
      row.brand,
      row.model,
      row.terminalName,
      row.zone,
    ].some((value) => value.toLowerCase().includes(term));
  });

  async function handleFileChange(file: File | null) {
    if (!file) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const result = importFleetWorkbook(buffer);

      startTransition(() => {
        setRows(result.cleanedRows);
        setImportSummary(result);
        setFileName(file.name);
      });
    } catch {
      setError(
        "No pude leer el archivo. Usa un Excel o CSV con columnas como PPU, numero interno, marca, modelo y terminal.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function resetToInitialData() {
    setRows(initialFleet);
    setImportSummary(emptyImport);
    setFileName(null);
    setError(null);
    setPersistResult(null);
    setQuery("");
  }

  function saveCleanFleet() {
    if (!fileName || !rows.length || !canManage) {
      return;
    }

    startSaving(() => {
      void (async () => {
        const result = await persistFleetImport({
          fileName,
          rows,
        });

        setPersistResult(result);

        if (result.status === "success") {
          router.refresh();
        }
      })();
    });
  }

  function exportCleanCsv() {
    if (!rows.length) {
      return;
    }

    const header = [
      "Numero interno",
      "PPU",
      "Marca",
      "Modelo",
      "Energia",
      "Terminal",
      "Zona",
      "Estado operacional",
      "Estado administrativo",
      "Documentos por vencer",
    ];

    const csv = [
      header.join(","),
      ...rows.map((row) =>
        [
          row.internalNumber,
          row.ppu,
          row.brand,
          row.model,
          row.energyType,
          row.terminalName,
          row.zone,
          row.operationalState,
          row.administrativeState,
          row.documentsExpiring,
        ]
          .map(escapeCsvValue)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "flota-limpia.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Carga de archivo</CardTitle>
            <CardDescription>
              Soporta `.xlsx`, `.xls` y `.csv`. Al subirlo se normalizan columnas,
              se quitan duplicados por `PPU` o `numero interno` y se deja una base
              limpia para revisión.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(event) =>
                handleFileChange(event.currentTarget.files?.[0] ?? null)
              }
            />

            <div className="flex flex-wrap gap-3">
              <Badge tone="info">Excel/CSV</Badge>
              <Badge tone="neutral">Normaliza encabezados comunes</Badge>
              <Badge tone="success">Deduplica antes de mostrar</Badge>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={resetToInitialData}
                disabled={isLoading}
              >
                Volver a base actual
              </Button>
              <Button onClick={exportCleanCsv} disabled={!rows.length || isLoading}>
                Exportar base limpia
              </Button>
              <Button
                onClick={saveCleanFleet}
                disabled={!fileName || !rows.length || !canManage || isLoading || isSaving}
              >
                {isSaving ? "Cargando a la base..." : "Cargar a la base"}
              </Button>
            </div>

            {isLoading ? (
              <p className="text-sm text-[var(--color-text-soft)]">
                Procesando archivo y consolidando duplicados...
              </p>
            ) : null}

            {fileName ? (
              <p className="text-sm text-[var(--color-text-soft)]">
                Archivo cargado: <span className="font-semibold">{fileName}</span>
              </p>
            ) : null}

            {!canManage ? (
              <p className="text-sm text-amber-700">
                Tienes acceso de lectura, pero no permisos para cargar la flota a la base.
              </p>
            ) : null}

            {error ? <p className="text-sm text-rose-700">{error}</p> : null}

            {persistResult ? (
              <div
                className={
                  persistResult.status === "success"
                    ? "rounded-[24px] bg-emerald-50 p-4 text-emerald-800"
                    : "rounded-[24px] bg-amber-50 p-4 text-amber-800"
                }
              >
                <p className="font-semibold">{persistResult.message}</p>
                <p className="mt-2 text-sm">
                  Insertados: {persistResult.insertedRows} · Actualizados:{" "}
                  {persistResult.updatedRows} · Omitidos: {persistResult.skippedRows}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultado de depuración</CardTitle>
            <CardDescription>
              Resumen de limpieza para dejar una tabla base consistente antes de
              seguir con importación real a base de datos.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="Filas origen"
              value={String(importSummary.sourceRows || initialFleet.length)}
              tone="neutral"
            />
            <Metric
              label="Filas limpias"
              value={String(rows.length)}
              tone="success"
            />
            <Metric
              label="Duplicados removidos"
              value={String(importSummary.duplicateRows)}
              tone="warning"
            />
            <Metric
              label="Filas ignoradas"
              value={String(importSummary.ignoredRows)}
              tone="danger"
            />

            {importSummary.detectedColumns.length ? (
              <div className="md:col-span-2 xl:col-span-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                  Columnas detectadas
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {importSummary.detectedColumns.map((column) => (
                    <Badge key={column} tone="info">
                      {column}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {persistResult?.issues.length ? (
              <div className="md:col-span-2 xl:col-span-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                  Observaciones de carga
                </p>
                <div className="mt-3 space-y-2">
                  {persistResult.issues.slice(0, 6).map((issue) => (
                    <p
                      key={issue}
                      className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800"
                    >
                      {issue}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <CardTitle>Tabla base limpia</CardTitle>
            <CardDescription>
              Puedes buscar por PPU, interno, marca, modelo o terminal.
            </CardDescription>
          </div>
          <div className="w-full max-w-sm">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar en la base limpia"
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-[1080px] border-separate border-spacing-y-3">
            <thead>
              <tr>
                {[
                  "Bus",
                  "PPU",
                  "Marca",
                  "Modelo",
                  "Energia",
                  "Terminal",
                  "Zona",
                  "Estado",
                  "Accion",
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
              {filteredRows.map((bus) => (
                <tr key={bus.id} className="bg-[var(--color-surface)]">
                  <td className="rounded-l-3xl px-4 py-4 text-sm font-semibold text-[var(--color-operational)]">
                    <Link href={`/flota/${bus.id}`}>{bus.internalNumber}</Link>
                  </td>
                  <td className="px-4 py-4 text-sm">{bus.ppu}</td>
                  <td className="px-4 py-4 text-sm">{bus.brand}</td>
                  <td className="px-4 py-4 text-sm">{bus.model}</td>
                  <td className="px-4 py-4 text-sm">{bus.energyType}</td>
                  <td className="px-4 py-4 text-sm">{bus.terminalName}</td>
                  <td className="px-4 py-4 text-sm">{bus.zone}</td>
                  <td className="px-4 py-4 text-sm">
                    <Badge tone="info">{bus.operationalState}</Badge>
                  </td>
                  <td className="rounded-r-3xl px-4 py-4 text-sm">
                    <Badge
                      tone={fileName ? "success" : "neutral"}
                    >
                      {fileName ? "Base depurada" : "Base actual"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filteredRows.length ? (
            <div className="rounded-[26px] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-text-soft)]">
              No hay buses para mostrar con los filtros actuales.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning" | "danger";
}) {
  return (
    <div className="rounded-[24px] bg-[var(--color-surface)] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-[var(--color-primary)]">
        {value}
      </p>
      <div className="mt-3">
        <Badge tone={tone}>{label}</Badge>
      </div>
    </div>
  );
}

function escapeCsvValue(value: string | number) {
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
}
