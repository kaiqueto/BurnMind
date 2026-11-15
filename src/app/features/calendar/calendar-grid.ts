import { DailyCheckIn } from '../../shared/models/burnoutmind.models';
import { toIsoDate } from '../../shared/utils/date';

export interface CalendarCell {
  iso: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  checkIn: DailyCheckIn | null;
}

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;

/** Semanas (domingo a sábado) do mês, com os check-ins de cada dia. `month` é 0-11. */
export function buildMonthGrid(
  year: number,
  month: number,
  checkIns: readonly DailyCheckIn[],
  today: Date = new Date(),
): CalendarCell[][] {
  const byDate = new Map(checkIns.map((c) => [c.date, c]));
  const todayIso = toIsoDate(today);
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  const weeks: CalendarCell[][] = [];

  for (let cursor = new Date(start); ; cursor.setDate(cursor.getDate() + 7)) {
    const week: CalendarCell[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + i);
      const iso = toIsoDate(date);
      week.push({
        iso,
        day: date.getDate(),
        inMonth: date.getMonth() === month,
        isToday: iso === todayIso,
        isFuture: iso > todayIso,
        checkIn: byDate.get(iso) ?? null,
      });
    }
    weeks.push(week);
    const lastDay = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 6);
    if (lastDay >= new Date(year, month + 1, 0)) break;
  }
  return weeks;
}

/** Ex.: "Outubro de 2026". */
export function monthTitle(year: number, month: number): string {
  const text = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
  return text.charAt(0).toUpperCase() + text.slice(1);
}
