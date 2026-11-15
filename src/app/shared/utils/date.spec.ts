import { addDays, formatDayMonth, formatLongDate, formatRange, formatRangeShort, formatShortDate, parseIsoDate, toIsoDate } from './date';

describe('date utils', () => {
  it('formata a data civil local como yyyy-MM-dd', () => {
    expect(toIsoDate(new Date(2026, 9, 27))).toBe('2026-10-27');
  });

  it('formata a data por extenso como no wireframe', () => {
    expect(formatLongDate(new Date(2026, 9, 27))).toBe('Terça, 27 de outubro de 2026');
  });

  it('formata a data sem o ano', () => {
    expect(formatShortDate(new Date(2026, 9, 27))).toBe('Terça, 27 de outubro');
  });

  it('converte yyyy-MM-dd em data local e volta', () => {
    expect(toIsoDate(parseIsoDate('2026-10-27'))).toBe('2026-10-27');
  });

  it('formata dia e mês e intervalos', () => {
    expect(formatDayMonth(new Date(2026, 9, 27))).toBe('27 de outubro');
    expect(formatRange(new Date(2026, 9, 21), new Date(2026, 9, 27))).toBe('21 a 27 de outubro');
    expect(formatRange(new Date(2026, 8, 28), new Date(2026, 9, 4))).toBe('28 de setembro a 4 de outubro');
    expect(formatRangeShort(new Date(2026, 9, 21), new Date(2026, 9, 27))).toBe('21 a 27/10');
    expect(formatRangeShort(new Date(2026, 8, 28), new Date(2026, 9, 4))).toBe('28/09 a 04/10');
  });

  it('soma dias atravessando o mês', () => {
    expect(toIsoDate(addDays(new Date(2026, 9, 30), 3))).toBe('2026-11-02');
  });
});
