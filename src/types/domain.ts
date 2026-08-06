export const appRoles = [
  "admin",
  "supervisor",
  "inspector",
  "inspector_administrativo",
  "planillero",
  "cleaner",
  "consulta",
] as const;

export type AppRole = (typeof appRoles)[number];

export type Permission =
  | "dashboard.read"
  | "brand.read"
  | "notifications.read"
  | "reports.read"
  | "shifts.read"
  | "shifts.manage"
  | "tasks.read"
  | "tasks.manage"
  | "tasks.execute"
  | "fleet.read"
  | "fleet.manage"
  | "personnel.read"
  | "personnel.manage"
  | "terminals.read"
  | "terminals.manage"
  | "documents.read"
  | "documents.manage"
  | "rtg.read"
  | "rtg.manage"
  | "technical_reviews.read"
  | "technical_reviews.manage"
  | "technical_reviews.validate"
  | "technical_reviews.admin"
  | "administration.read"
  | "administration.manage";

export type TaskStatus =
  | "Pendiente"
  | "Asignada"
  | "En proceso"
  | "Finalizada"
  | "Pendiente de validación"
  | "Aprobada"
  | "Rechazada";

export type OperationalState =
  | "Operativo"
  | "Operativo con observaciones"
  | "No operativo"
  | "En mantenimiento"
  | "Programado para RTG";

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  role: AppRole;
  terminalIds: string[];
  lastAccessAt: string;
}

export interface Terminal {
  id: string;
  code: string;
  name: string;
  zone: string;
  shiftWindow: string;
  active: boolean;
  activeBuses: number;
  activePersonnel: number;
  supervisorName: string;
}

export interface FleetBus {
  id: string;
  internalNumber: string;
  ppu: string;
  brand: string;
  model: string;
  energyType: "Diésel" | "Eléctrico";
  terminalName: string;
  zone: string;
  operationalState: OperationalState;
  administrativeState: string;
  documentsExpiring: number;
}

export interface PersonnelMember {
  id: string;
  internalCode: string;
  fullName: string;
  email: string;
  roleLabel: string;
  systemRole: AppRole;
  mainTerminal: string;
  habitualShift: string;
  status: "Activo" | "Inactivo";
  supervisorName: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  helper: string;
  tone: "neutral" | "success" | "warning" | "danger";
}

export interface CompliancePoint {
  day: string;
  cumplimiento: number;
  tareasCriticas: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "danger" | "success";
  createdAt: string;
}
