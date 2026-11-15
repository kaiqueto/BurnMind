import { DailyCheckIn } from '../../shared/models/burnoutmind.models';
import { buildMonthGrid, monthTitle } from './calendar-grid';

const checkIn = (date: string): DailyCheckIn => ({
  id: date, date, mood: 'tired', energy: 'low', createdAt: '', updatedAt: '',
});

describe('buildMonthGrid', () => {
  const today = new Date(2026, 9, 27);
  const grid = buildMonthGrid(2026, 9, [checkIn('2026-10-27'), checkIn('2026-10-21')], today);
  const cells = grid.flat();

  it('começa no domingo, com 7 colunas por semana', () => {
    expect(grid.every((w) => w.length === 7)).toBe(true);
    expect(grid.length).toBe(5);
  });

  it('outubro de 2026 começa numa quinta-feira (4 células vazias antes do dia 1)', () => {
    expect(grid[0].slice(0, 4).every((c) => !c.inMonth)).toBe(true);
    expect(grid[0][4]).toMatchObject({ day: 1, inMonth: true });
  });

  it('tem exatamente 31 dias no mês e marca hoje, futuro e registros', () => {
    expect(cells.filter((c) => c.inMonth).length).toBe(31);
    expect(cells.find((c) => c.iso === '2026-10-27')).toMatchObject({ isToday: true, isFuture: false });
    expect(cells.find((c) => c.iso === '2026-10-28')?.isFuture).toBe(true);
    expect(cells.filter((c) => c.checkIn).map((c) => c.iso)).toEqual(['2026-10-21', '2026-10-27']);
  });

  it('formata o título do mês', () => {
    expect(monthTitle(2026, 9)).toBe('Outubro de 2026');
  });
});
