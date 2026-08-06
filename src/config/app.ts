export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "LogiControl360",
  timezone: process.env.APP_TIMEZONE || "America/Santiago",
  description:
    "Plataforma integral para la gestión logística, operacional y administrativa de terminales de buses.",
};

export const navigationGroups = [
  {
    title: "Operación",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/turnos", label: "Turnos" },
      { href: "/tareas", label: "Tareas" },
      { href: "/asistencia", label: "Asistencia" },
      { href: "/notificaciones", label: "Notificaciones" },
    ],
  },
  {
    title: "Procesos",
    items: [
      { href: "/diesel", label: "Diésel" },
      { href: "/electricos", label: "Eléctricos" },
      { href: "/checklists", label: "Checklists" },
      { href: "/levantamientos", label: "Levantamientos" },
      { href: "/recepcion-combustible", label: "Recepción" },
    ],
  },
  {
    title: "Gestión",
    items: [
      { href: "/flota", label: "Flota" },
      { href: "/documentacion", label: "Documentación" },
      { href: "/rtg", label: "RTG" },
      { href: "/informes", label: "Informes" },
      { href: "/historial", label: "Historial" },
    ],
  },
  {
    title: "Administración",
    items: [
      { href: "/administracion", label: "Centro admin" },
      { href: "/administracion/terminales", label: "Terminales" },
      { href: "/administracion/flota", label: "Base flota" },
      { href: "/administracion/personal", label: "Personal" },
      { href: "/marca", label: "Marca" },
    ],
  },
] as const;
