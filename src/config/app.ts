export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "LogiControl360",
  timezone: process.env.APP_TIMEZONE || "America/Santiago",
  description:
    "Plataforma integral para la gestion logistica, operacional y administrativa de terminales de buses.",
};

export const navigationGroups = [
  {
    title: "Operacion",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/turnos", label: "Turnos" },
      { href: "/tareas", label: "Tareas" },
      { href: "/notificaciones", label: "Notificaciones" },
    ],
  },
  {
    title: "Procesos",
    items: [
      { href: "/diesel", label: "Diesel" },
      { href: "/electricos", label: "Electricos" },
      { href: "/checklists", label: "Checklists" },
      { href: "/levantamientos", label: "Levantamientos" },
      { href: "/recepcion-combustible", label: "Recepcion" },
    ],
  },
  {
    title: "Gestion",
    items: [
      { href: "/flota", label: "Flota" },
      { href: "/documentacion", label: "Documentacion" },
      { href: "/rtg", label: "RTG" },
      { href: "/informes", label: "Informes" },
      { href: "/historial", label: "Historial" },
    ],
  },
  {
    title: "Administracion",
    items: [
      { href: "/administracion", label: "Centro admin" },
      { href: "/administracion/terminales", label: "Terminales" },
      { href: "/administracion/flota", label: "Base flota" },
      { href: "/administracion/personal", label: "Personal" },
      { href: "/marca", label: "Marca" },
    ],
  },
] as const;
