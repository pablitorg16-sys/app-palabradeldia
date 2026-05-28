export function getSpanishDate(date: Date) {
  return date.toLocaleDateString("es-ES");
}

export function getSpanishTime(date: Date) {
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}