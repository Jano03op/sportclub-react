// Formatea fechas ISO a "05 de Marzo de 2026"; devuelve un guion si no hay dato
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '—';
  const formatted = date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return formatted.replace(
    / de ([a-záéíóúñ]+) de /i,
    (_, month) => ` de ${month.charAt(0).toUpperCase()}${month.slice(1)} de `
  );
}
