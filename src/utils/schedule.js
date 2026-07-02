// El backend guarda day_of_week como número 1..7 (1 = Lunes)
export const DAYS_OF_WEEK = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
];

export function dayName(value) {
  return DAYS_OF_WEEK.find((day) => day.value === Number(value))?.label || '—';
}

// El backend entrega TIME como "HH:MM:SS"; los inputs y la UI usan "HH:MM"
export function formatTime(time) {
  return time ? String(time).slice(0, 5) : '';
}

// Etiqueta legible de una asignación deporte-sala-coach
export function assignmentLabel(sportRoom) {
  if (!sportRoom) return '—';
  const sport = sportRoom.sport?.name || '¿deporte?';
  const room = sportRoom.room?.name || '¿sala?';
  const coach = sportRoom.coach?.full_name;
  return `${sport} — ${room}${coach ? ` (${coach})` : ''}`;
}
