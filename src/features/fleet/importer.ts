import * as XLSX from "xlsx";

import type { FleetBus } from "@/types/domain";

type FleetColumn =
  | "internalNumber"
  | "ppu"
  | "brand"
  | "model"
  | "energyType"
  | "terminalName"
  | "zone"
  | "operationalState"
  | "administrativeState"
  | "documentsExpiring";

export interface FleetImportResult {
  cleanedRows: FleetBus[];
  sourceRows: number;
  validRows: number;
  duplicateRows: number;
  ignoredRows: number;
  detectedColumns: string[];
}

type RawRecord = Record<string, string | number | boolean | null | undefined>;

const headerAliases: Record<FleetColumn, string[]> = {
  internalNumber: [
    "internalnumber",
    "numerointerno",
    "numerointerno",
    "nrointerno",
    "bus",
    "interno",
    "numero",
  ],
  ppu: ["ppu", "patente", "placa", "matricula"],
  brand: ["brand", "marca"],
  model: ["model", "modelo"],
  energyType: [
    "energytype",
    "energia",
    "tipoenergia",
    "combustible",
    "tipocombustible",
  ],
  terminalName: ["terminalname", "terminal", "terminalsalida"],
  zone: ["zone", "zona", "unidadnegocio", "unidad"],
  operationalState: [
    "operationalstate",
    "estadooperacional",
    "estadooperativo",
    "estado",
  ],
  administrativeState: [
    "administrativestate",
    "estadoadministrativo",
    "estadodocumental",
    "vigencia",
  ],
  documentsExpiring: [
    "documentsexpiring",
    "documentosporvencer",
    "docsporvencer",
    "porvencer",
  ],
};

export function importFleetWorkbook(buffer: ArrayBuffer): FleetImportResult {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = sheetName ? workbook.Sheets[sheetName] : undefined;

  if (!worksheet) {
    return emptyResult();
  }

  const rows = XLSX.utils.sheet_to_json<RawRecord>(worksheet, {
    defval: "",
    raw: false,
  });

  return cleanFleetRecords(rows);
}

export function dedupeFleetRows(rows: FleetBus[]): FleetImportResult {
  const uniqueRows = new Map<string, FleetBus>();
  const ppuIndex = new Map<string, string>();
  const internalIndex = new Map<string, string>();

  let duplicateRows = 0;
  let ignoredRows = 0;

  for (const row of rows) {
    const normalized = normalizeImportedRow(row);
    if (!normalized) {
      ignoredRows += 1;
      continue;
    }

    const ppuKey = normalizePpu(normalized.ppu);
    const internalKey = normalizeText(normalized.internalNumber);
    const compositeKey = `${ppuKey || "sin-ppu"}::${internalKey || "sin-interno"}`;

    const knownKey =
      (ppuKey ? ppuIndex.get(ppuKey) : undefined) ||
      (internalKey ? internalIndex.get(internalKey) : undefined) ||
      compositeKey;

    const existing = uniqueRows.get(knownKey);
    if (!existing) {
      uniqueRows.set(knownKey, normalized);

      if (ppuKey) {
        ppuIndex.set(ppuKey, knownKey);
      }

      if (internalKey) {
        internalIndex.set(internalKey, knownKey);
      }

      continue;
    }

    duplicateRows += 1;
    uniqueRows.set(knownKey, chooseBetterRow(existing, normalized));
  }

  return {
    cleanedRows: Array.from(uniqueRows.values()).sort((a, b) =>
      a.internalNumber.localeCompare(b.internalNumber, "es"),
    ),
    sourceRows: rows.length,
    validRows: uniqueRows.size,
    duplicateRows,
    ignoredRows,
    detectedColumns: [],
  };
}

function cleanFleetRecords(rows: RawRecord[]): FleetImportResult {
  const detectedColumns = new Set<string>();
  const uniqueRows = new Map<string, FleetBus>();
  const ppuIndex = new Map<string, string>();
  const internalIndex = new Map<string, string>();

  let duplicateRows = 0;
  let ignoredRows = 0;

  for (const row of rows) {
    const normalized = normalizeFleetRow(row, detectedColumns);
    if (!normalized) {
      ignoredRows += 1;
      continue;
    }

    const ppuKey = normalizePpu(normalized.ppu);
    const internalKey = normalizeText(normalized.internalNumber);
    const compositeKey = `${ppuKey || "sin-ppu"}::${internalKey || "sin-interno"}`;

    const knownKey =
      (ppuKey ? ppuIndex.get(ppuKey) : undefined) ||
      (internalKey ? internalIndex.get(internalKey) : undefined) ||
      uniqueRows.get(compositeKey)?.id;

    if (!knownKey) {
      uniqueRows.set(compositeKey, normalized);

      if (ppuKey) {
        ppuIndex.set(ppuKey, compositeKey);
      }

      if (internalKey) {
        internalIndex.set(internalKey, compositeKey);
      }

      continue;
    }

    const currentKey = uniqueRows.has(knownKey) ? knownKey : compositeKey;
    const existing = uniqueRows.get(currentKey);

    if (!existing) {
      uniqueRows.set(compositeKey, normalized);
      continue;
    }

    duplicateRows += 1;
    uniqueRows.set(currentKey, chooseBetterRow(existing, normalized));
  }

  return {
    cleanedRows: Array.from(uniqueRows.values()).sort((a, b) =>
      a.internalNumber.localeCompare(b.internalNumber, "es"),
    ),
    sourceRows: rows.length,
    validRows: uniqueRows.size,
    duplicateRows,
    ignoredRows,
    detectedColumns: Array.from(detectedColumns.values()).sort(),
  };
}

function normalizeFleetRow(
  row: RawRecord,
  detectedColumns: Set<string>,
): FleetBus | null {
  const internalNumber = getValue(row, "internalNumber", detectedColumns);
  const ppu = normalizePpu(getValue(row, "ppu", detectedColumns));

  if (!internalNumber && !ppu) {
    return null;
  }

  const brand = getValue(row, "brand", detectedColumns) || "Sin marca";
  const model = getValue(row, "model", detectedColumns) || "Sin modelo";
  const terminalName = getValue(row, "terminalName", detectedColumns) || "Sin terminal";
  const zone = getValue(row, "zone", detectedColumns) || "Sin zona";
  const operationalState =
    mapOperationalState(getValue(row, "operationalState", detectedColumns)) || "Operativo";
  const administrativeState =
    getValue(row, "administrativeState", detectedColumns) || "Pendiente";

  return {
    id: `import-${normalizeText(ppu || internalNumber || crypto.randomUUID())}`,
    internalNumber: internalNumber || "Sin interno",
    ppu: ppu || "SIN-PPU",
    brand,
    model,
    energyType: mapEnergyType(getValue(row, "energyType", detectedColumns)),
    terminalName,
    zone,
    operationalState,
    administrativeState,
    documentsExpiring: parsePositiveInteger(
      getValue(row, "documentsExpiring", detectedColumns),
    ),
  };
}

function normalizeImportedRow(row: FleetBus): FleetBus | null {
  const internalNumber = row.internalNumber.trim();
  const ppu = normalizePpu(row.ppu);

  if (!internalNumber && !ppu) {
    return null;
  }

  return {
    ...row,
    id: row.id || `import-${normalizeText(ppu || internalNumber || crypto.randomUUID())}`,
    internalNumber: internalNumber || "Sin interno",
    ppu: ppu || "SIN-PPU",
    brand: row.brand || "Sin marca",
    model: row.model || "Sin modelo",
    terminalName: row.terminalName || "Sin terminal",
    zone: row.zone || "Sin zona",
    administrativeState: row.administrativeState || "Pendiente",
  };
}

function getValue(
  row: RawRecord,
  column: FleetColumn,
  detectedColumns: Set<string>,
) {
  for (const [rawKey, rawValue] of Object.entries(row)) {
    const normalizedKey = normalizeHeader(rawKey);
    if (headerAliases[column].includes(normalizedKey)) {
      detectedColumns.add(rawKey);
      return stringifyValue(rawValue);
    }
  }

  return "";
}

function chooseBetterRow(current: FleetBus, candidate: FleetBus) {
  const currentScore = completenessScore(current);
  const candidateScore = completenessScore(candidate);

  if (candidateScore > currentScore) {
    return candidate;
  }

  if (candidateScore < currentScore) {
    return current;
  }

  return {
    ...current,
    brand: current.brand === "Sin marca" ? candidate.brand : current.brand,
    model: current.model === "Sin modelo" ? candidate.model : current.model,
    terminalName:
      current.terminalName === "Sin terminal"
        ? candidate.terminalName
        : current.terminalName,
    zone: current.zone === "Sin zona" ? candidate.zone : current.zone,
    administrativeState:
      current.administrativeState === "Pendiente"
        ? candidate.administrativeState
        : current.administrativeState,
    documentsExpiring: Math.max(current.documentsExpiring, candidate.documentsExpiring),
  };
}

function completenessScore(row: FleetBus) {
  return [
    row.internalNumber,
    row.ppu,
    row.brand !== "Sin marca",
    row.model !== "Sin modelo",
    row.terminalName !== "Sin terminal",
    row.zone !== "Sin zona",
    row.administrativeState !== "Pendiente",
  ].filter(Boolean).length;
}

function parsePositiveInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function mapEnergyType(value: string): FleetBus["energyType"] {
  const normalized = normalizeText(value);
  if (
    normalized.includes("elect") ||
    normalized.includes("ev") ||
    normalized.includes("bateria")
  ) {
    return "Eléctrico";
  }

  return "Diésel";
}

function mapOperationalState(value: string): FleetBus["operationalState"] | null {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  if (normalized.includes("observ")) {
    return "Operativo con observaciones";
  }

  if (normalized.includes("manten")) {
    return "En mantenimiento";
  }

  if (normalized.includes("program")) {
    return "Programado para RTG";
  }

  if (normalized.includes("nooper") || normalized.includes("fuera")) {
    return "No operativo";
  }

  return "Operativo";
}

function stringifyValue(value: RawRecord[string]) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function normalizeHeader(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function normalizePpu(value: string) {
  return value
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9-]/g, "");
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function emptyResult(): FleetImportResult {
  return {
    cleanedRows: [],
    sourceRows: 0,
    validRows: 0,
    duplicateRows: 0,
    ignoredRows: 0,
    detectedColumns: [],
  };
}
