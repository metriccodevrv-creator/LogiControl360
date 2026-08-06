import { appConfig } from "@/config/app";

export function formatDateTime(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: appConfig.timezone,
    ...options,
  }).format(new Date(value));
}

export function formatDate(value: string | number | Date) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeZone: appConfig.timezone,
  }).format(new Date(value));
}
