"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/permissions/access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FleetBus } from "@/types/domain";
import { dedupeFleetRows } from "@/features/fleet/importer";

const fleetBusSchema = z.object({
  id: z.string(),
  internalNumber: z.string(),
  ppu: z.string(),
  brand: z.string(),
  model: z.string(),
  energyType: z.enum(["Diésel", "Eléctrico"]),
  terminalName: z.string(),
  zone: z.string(),
  operationalState: z.enum([
    "Operativo",
    "Operativo con observaciones",
    "No operativo",
    "En mantenimiento",
    "Programado para RTG",
  ]),
  administrativeState: z.string(),
  documentsExpiring: z.number().int().min(0),
});

const fleetImportPayloadSchema = z.object({
  fileName: z.string().min(1),
  rows: z.array(fleetBusSchema).min(1),
});

export interface PersistFleetImportResult {
  status: "success" | "error";
  message: string;
  sourceRows: number;
  deduplicatedRows: number;
  duplicateRows: number;
  insertedRows: number;
  updatedRows: number;
  skippedRows: number;
  issues: string[];
}

export async function persistFleetImport(
  input: unknown,
): Promise<PersistFleetImportResult> {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "fleet.manage")) {
    return {
      status: "error",
      message: "No tienes permisos para importar la flota.",
      sourceRows: 0,
      deduplicatedRows: 0,
      duplicateRows: 0,
      insertedRows: 0,
      updatedRows: 0,
      skippedRows: 0,
      issues: [],
    };
  }

  const parsedPayload = fleetImportPayloadSchema.safeParse(input);
  if (!parsedPayload.success) {
    return {
      status: "error",
      message: "El archivo limpio no tiene el formato esperado para importar.",
      sourceRows: 0,
      deduplicatedRows: 0,
      duplicateRows: 0,
      insertedRows: 0,
      updatedRows: 0,
      skippedRows: 0,
      issues: parsedPayload.error.issues.map((issue) => issue.message),
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      status: "error",
      message:
        "Supabase no está configurado en este entorno. La depuración funciona, pero no puedo guardar la flota en la base aún.",
      sourceRows: parsedPayload.data.rows.length,
      deduplicatedRows: parsedPayload.data.rows.length,
      duplicateRows: 0,
      insertedRows: 0,
      updatedRows: 0,
      skippedRows: 0,
      issues: [],
    };
  }

  try {
    const deduplicated = dedupeFleetRows(parsedPayload.data.rows as FleetBus[]);
    const terminalMap = await loadTerminalMap(supabase);
    const brandMap = await loadBrandMap(supabase);
    const modelMap = await loadModelMap(supabase);
    const existingByPpu = await loadExistingBusesByPpu(
      supabase,
      deduplicated.cleanedRows.map((row) => row.ppu),
    );
    const existingByInternalNumber = await loadExistingBusesByInternalNumber(
      supabase,
      deduplicated.cleanedRows.map((row) => row.internalNumber),
    );

    const toInsert: Array<Record<string, string | boolean | null>> = [];
    const toUpdate: Array<{ id: string; values: Record<string, string | boolean | null> }> = [];
    const issues: string[] = [];

    for (const row of deduplicated.cleanedRows) {
      try {
        const terminalKey = normalizeLookup(row.terminalName);
        const terminalId = terminalMap.get(terminalKey);

        if (!terminalId) {
          issues.push(
            `No encontré un terminal válido para el bus ${row.internalNumber} (${row.terminalName}).`,
          );
          continue;
        }

        const brandId =
          row.brand && row.brand !== "Sin marca"
            ? await ensureBrand(supabase, brandMap, row.brand)
            : null;

        const modelId =
          brandId && row.model && row.model !== "Sin modelo"
            ? await ensureModel(supabase, modelMap, brandId, row.model)
            : null;

        const payload = {
          terminal_id: terminalId,
          brand_id: brandId,
          model_id: modelId,
          internal_number: row.internalNumber,
          ppu: row.ppu,
          energy_type: row.energyType,
          operational_status: row.operationalState,
          administrative_status: row.administrativeState,
          zone: row.zone,
          observations: parsedPayload.data.fileName
            ? `Importado desde ${parsedPayload.data.fileName}`
            : null,
          is_active: true,
        };

        const existingBus =
          existingByPpu.get(normalizeLookup(row.ppu)) ||
          existingByInternalNumber.get(normalizeLookup(row.internalNumber));

        if (existingBus) {
          toUpdate.push({ id: existingBus.id, values: payload });
          continue;
        }

        toInsert.push(payload);
      } catch (error) {
        issues.push(
          `No pude preparar el bus ${row.internalNumber}: ${readErrorMessage(error)}`,
        );
      }
    }

    let insertedRows = 0;
    let updatedRows = 0;

    if (toInsert.length) {
      const { data, error } = await supabase.from("buses").insert(toInsert).select("id");
      if (error) {
        return buildErrorResult(
          deduplicated,
          issues,
          `No pude insertar la nueva flota: ${error.message}`,
        );
      }

      insertedRows = data?.length ?? toInsert.length;
    }

    for (const item of toUpdate) {
      const { error } = await supabase.from("buses").update(item.values).eq("id", item.id);
      if (error) {
        issues.push(`No pude actualizar el bus ${item.values.internal_number}: ${error.message}`);
        continue;
      }

      updatedRows += 1;
    }

    const importedTerminalIds = [
      ...toInsert.map((item) => item.terminal_id),
      ...toUpdate.map((item) => item.values.terminal_id),
    ].filter((value): value is string => Boolean(value));
    const auditTerminalId = importedTerminalIds[0] ?? null;

    const { error: auditError } = await supabase.from("audit_logs").insert({
      user_id: user.id,
      terminal_id: auditTerminalId,
      module: "fleet",
      action: "import",
      record_type: "buses",
      record_id: null,
      previous_values: null,
      new_values: {
        source_rows: parsedPayload.data.rows.length,
        inserted_rows: insertedRows,
        updated_rows: updatedRows,
        duplicate_rows: deduplicated.duplicateRows,
        skipped_rows: issues.length,
        file_name: parsedPayload.data.fileName,
      },
    });

    if (auditError) {
      issues.push(`La importación se guardó, pero la auditoría falló: ${auditError.message}`);
    }

    revalidatePath("/flota");

    return {
      status: issues.length ? "error" : "success",
      message: issues.length
        ? "La flota se cargó parcialmente. Revisa los registros omitidos."
        : "La flota se cargó correctamente en la base.",
      sourceRows: parsedPayload.data.rows.length,
      deduplicatedRows: deduplicated.cleanedRows.length,
      duplicateRows: deduplicated.duplicateRows,
      insertedRows,
      updatedRows,
      skippedRows: issues.length,
      issues,
    };
  } catch (error) {
    return {
      status: "error",
      message: `No pude completar la importación: ${readErrorMessage(error)}`,
      sourceRows: parsedPayload.data.rows.length,
      deduplicatedRows: 0,
      duplicateRows: 0,
      insertedRows: 0,
      updatedRows: 0,
      skippedRows: 0,
      issues: [],
    };
  }
}

function buildErrorResult(
  deduplicated: ReturnType<typeof dedupeFleetRows>,
  issues: string[],
  message: string,
): PersistFleetImportResult {
  return {
    status: "error",
    message,
    sourceRows: deduplicated.sourceRows,
    deduplicatedRows: deduplicated.cleanedRows.length,
    duplicateRows: deduplicated.duplicateRows,
    insertedRows: 0,
    updatedRows: 0,
    skippedRows: issues.length,
    issues,
  };
}

async function loadTerminalMap(supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>) {
  const { data, error } = await supabase
    .from("terminals")
    .select("id,name,code")
    .is("deleted_at", null);

  if (error) {
    throw new Error(`No pude leer los terminales: ${error.message}`);
  }

  const map = new Map<string, string>();
  for (const terminal of data ?? []) {
    if (terminal.name) {
      map.set(normalizeLookup(terminal.name), terminal.id);
    }

    if (terminal.code) {
      map.set(normalizeLookup(terminal.code), terminal.id);
    }
  }

  return map;
}

async function loadBrandMap(supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>) {
  const { data, error } = await supabase.from("bus_brands").select("id,name");
  if (error) {
    throw new Error(`No pude leer las marcas de buses: ${error.message}`);
  }

  const map = new Map<string, string>();
  for (const brand of data ?? []) {
    if (brand.name) {
      map.set(normalizeLookup(brand.name), brand.id);
    }
  }

  return map;
}

async function loadModelMap(supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>) {
  const { data, error } = await supabase.from("bus_models").select("id,name,brand_id");
  if (error) {
    throw new Error(`No pude leer los modelos de buses: ${error.message}`);
  }

  const map = new Map<string, string>();
  for (const model of data ?? []) {
    if (model.name && model.brand_id) {
      map.set(buildModelKey(model.brand_id, model.name), model.id);
    }
  }

  return map;
}

async function loadExistingBusesByPpu(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  ppus: string[],
) {
  const filteredPpus = uniqueLookupValues(ppus);
  if (!filteredPpus.length) {
    return new Map<string, { id: string }>();
  }

  const { data, error } = await supabase
    .from("buses")
    .select("id,ppu")
    .in("ppu", filteredPpus)
    .is("deleted_at", null);

  if (error) {
    throw new Error(`No pude consultar buses por PPU: ${error.message}`);
  }

  const map = new Map<string, { id: string }>();
  for (const bus of data ?? []) {
    if (bus.ppu) {
      map.set(normalizeLookup(bus.ppu), { id: bus.id });
    }
  }

  return map;
}

async function loadExistingBusesByInternalNumber(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  internalNumbers: string[],
) {
  const filteredValues = uniqueLookupValues(internalNumbers);
  if (!filteredValues.length) {
    return new Map<string, { id: string }>();
  }

  const { data, error } = await supabase
    .from("buses")
    .select("id,internal_number")
    .in("internal_number", filteredValues)
    .is("deleted_at", null);

  if (error) {
    throw new Error(`No pude consultar buses por número interno: ${error.message}`);
  }

  const map = new Map<string, { id: string }>();
  for (const bus of data ?? []) {
    if (bus.internal_number) {
      map.set(normalizeLookup(bus.internal_number), { id: bus.id });
    }
  }

  return map;
}

async function ensureBrand(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  brandMap: Map<string, string>,
  brandName: string,
) {
  const lookup = normalizeLookup(brandName);
  const existing = brandMap.get(lookup);
  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("bus_brands")
    .insert({ name: brandName.trim() })
    .select("id,name")
    .single();

  if (error) {
    throw new Error(`No pude crear la marca "${brandName}": ${error.message}`);
  }

  brandMap.set(lookup, data.id);
  return data.id;
}

async function ensureModel(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  modelMap: Map<string, string>,
  brandId: string,
  modelName: string,
) {
  const key = buildModelKey(brandId, modelName);
  const existing = modelMap.get(key);
  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("bus_models")
    .insert({ brand_id: brandId, name: modelName.trim() })
    .select("id,name,brand_id")
    .single();

  if (error) {
    throw new Error(`No pude crear el modelo "${modelName}": ${error.message}`);
  }

  modelMap.set(buildModelKey(data.brand_id, data.name), data.id);
  return data.id;
}

function buildModelKey(brandId: string, modelName: string) {
  return `${brandId}::${normalizeLookup(modelName)}`;
}

function normalizeLookup(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function uniqueLookupValues(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}

function readErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Error desconocido";
}
