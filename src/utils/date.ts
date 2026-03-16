export function formatPeruDateTime(dateString: string): string {
  if (!dateString) return "";

  const utcDate = new Date(dateString.endsWith("Z") ? dateString : `${dateString}Z`);

  return new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(utcDate);
}