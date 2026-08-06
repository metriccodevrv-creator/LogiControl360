import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FleetBus } from "@/types/domain";

export async function getFleetRows(): Promise<FleetBus[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("buses")
    .select(
      "id,internal_number,ppu,energy_type,operational_status,administrative_status,zone,brand:bus_brands(name),model:bus_models(name),terminal:terminals(name)",
    )
    .is("deleted_at", null)
    .order("internal_number");

  if (error || !data?.length) {
    return [];
  }

  return data.map((bus) => ({
    id: bus.id,
    internalNumber: bus.internal_number,
    ppu: bus.ppu,
    brand: readNestedName(bus.brand) || "Sin marca",
    model: readNestedName(bus.model) || "Sin modelo",
    energyType: bus.energy_type === "Eléctrico" ? "Eléctrico" : "Diésel",
    terminalName: readNestedName(bus.terminal) || "Sin terminal",
    zone: bus.zone || "Sin zona",
    operationalState: mapOperationalState(bus.operational_status),
    administrativeState: bus.administrative_status || "Pendiente",
    documentsExpiring: 0,
  }));
}

export async function getFleetBusById(id: string): Promise<FleetBus | null> {
  const rows = await getFleetRows();
  return rows.find((bus) => bus.id === id) ?? null;
}

function readNestedName(
  value: { name?: string | null } | { name?: string | null }[] | null,
) {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0]?.name ?? null;
  }

  return value.name ?? null;
}

function mapOperationalState(value: string | null): FleetBus["operationalState"] {
  switch (value) {
    case "Operativo con observaciones":
      return "Operativo con observaciones";
    case "No operativo":
      return "No operativo";
    case "En mantenimiento":
      return "En mantenimiento";
    case "Programado para RTG":
      return "Programado para RTG";
    default:
      return "Operativo";
  }
}
