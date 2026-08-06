import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CompliancePoint,
  DashboardMetric,
  NotificationItem,
  PersonnelMember,
  Terminal,
} from "@/types/domain";

export async function getTerminalRows(): Promise<Terminal[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("terminals")
    .select("id,code,name,zone,shift_window,is_active,contact_name")
    .is("deleted_at", null)
    .order("name");

  if (error || !data) {
    return [];
  }

  return data.map((terminal) => ({
    id: terminal.id,
    code: terminal.code,
    name: terminal.name,
    zone: terminal.zone,
    shiftWindow: terminal.shift_window,
    active: terminal.is_active,
    activeBuses: 0,
    activePersonnel: 0,
    supervisorName: terminal.contact_name || "Sin supervisor asignado",
  }));
}

export async function getPersonnelRows(): Promise<PersonnelMember[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("personnel")
    .select(
      "id,internal_code,full_name,email,job_title,system_role_code,habitual_shift,is_active,supervisor_name,terminal:terminals(name)",
    )
    .is("deleted_at", null)
    .order("full_name");

  if (error || !data) {
    return [];
  }

  return data.map((person) => ({
    id: person.id,
    internalCode: person.internal_code,
    fullName: person.full_name,
    email: person.email || "sin-correo",
    roleLabel: person.job_title,
    systemRole: mapRole(person.system_role_code),
    mainTerminal: readNestedName(person.terminal) || "Sin terminal",
    habitualShift: person.habitual_shift || "Sin turno",
    status: person.is_active ? "Activo" : "Inactivo",
    supervisorName: person.supervisor_name || "Sin supervisor",
  }));
}

export async function getNotificationRows(): Promise<NotificationItem[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("id,title,description,severity,created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) {
    return [];
  }

  return data.map((notification) => ({
    id: notification.id,
    title: notification.title,
    description: notification.description,
    severity: mapSeverity(notification.severity),
    createdAt: notification.created_at,
  }));
}

export async function getDashboardMetrics(): Promise<DashboardMetric[]> {
  const [terminals, notifications] = await Promise.all([
    getTerminalRows(),
    getNotificationRows(),
  ]);

  return [
    {
      label: "Terminales activos",
      value: String(terminals.filter((terminal) => terminal.active).length),
      helper: "Terminales operativos registrados en la base",
      tone: "success",
    },
    {
      label: "Terminales inactivos",
      value: String(terminals.filter((terminal) => !terminal.active).length),
      helper: "Terminales pendientes de activacion o ajuste",
      tone: "warning",
    },
    {
      label: "Alertas activas",
      value: String(notifications.length),
      helper: "Eventos visibles en el centro interno",
      tone: notifications.length ? "danger" : "neutral",
    },
    {
      label: "Base conectada",
      value: terminals.length || notifications.length ? "Si" : "Sin datos",
      helper: "Lectura actual desde Supabase",
      tone: terminals.length || notifications.length ? "success" : "neutral",
    },
  ];
}

export function getDashboardComplianceSeries(): CompliancePoint[] {
  return [];
}

function mapRole(value: string): PersonnelMember["systemRole"] {
  switch (value) {
    case "admin":
    case "supervisor":
    case "inspector":
    case "inspector_administrativo":
    case "planillero":
    case "cleaner":
    case "consulta":
      return value;
    default:
      return "consulta";
  }
}

function mapSeverity(value: string): NotificationItem["severity"] {
  switch (value) {
    case "warning":
    case "danger":
    case "success":
      return value;
    default:
      return "info";
  }
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
