/** Data civil local no formato yyyy-MM-dd (não usa UTC, evita virar o dia). */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Ex.: "Terça, 27 de outubro de 2026" (formato da Home no wireframe). */
export function formatLongDate(date: Date): string {
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })
    .format(date)
    .replace('-feira', '');
  const rest = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${rest}`;
}

/** Ex.: "Terça, 27 de outubro" (sem o ano). */
export function formatShortDate(date: Date): string {
  return formatLongDate(date).replace(/ de \d{4}$/, '');
}

/** Converte "yyyy-MM-dd" em Date local (meia-noite local, sem virar o dia por UTC). */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Ex.: "27 de outubro". */
export function formatDayMonth(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(date);
}

/** Ex.: "21 a 27 de outubro" ou "28 de setembro a 4 de outubro". */
export function formatRange(start: Date, end: Date): string {
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} a ${formatDayMonth(end)}`;
  }
  return `${formatDayMonth(start)} a ${formatDayMonth(end)}`;
}

/** Ex.: "21 a 27/10" ou "28/09 a 04/10". */
export function formatRangeShort(start: Date, end: Date): string {
  const mm = (d: Date) => String(d.getMonth() + 1).padStart(2, '0');
  const dd = (d: Date) => String(d.getDate()).padStart(2, '0');
  return start.getMonth() === end.getMonth()
    ? `${start.getDate()} a ${end.getDate()}/${mm(end)}`
    : `${dd(start)}/${mm(start)} a ${dd(end)}/${mm(end)}`;
}

/** Soma dias a uma data (mantém o horário local). */
export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}
