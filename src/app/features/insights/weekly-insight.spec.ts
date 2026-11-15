import { DailyCheckIn, EnergyLevel } from '../../shared/models/burnoutmind.models';
import { addDays, toIsoDate } from '../../shared/utils/date';
import { buildWeeklyInsight, describeWeekCard } from './weekly-insight';

const end = new Date(2026, 9, 27);
const rec = (day: number, energy: EnergyLevel): DailyCheckIn => ({
  id: `${day}`, date: `2026-10-${day}`, mood: 'tired', energy, createdAt: '', updatedAt: '',
});
// Cenário do wireframe: 21–27/10, sem registro em 25; 3 baixas e 3 médias.
const wireframe = [rec(21, 'medium'), rec(22, 'low'), rec(23, 'low'), rec(24, 'medium'), rec(26, 'medium'), rec(27, 'low')];

describe('buildWeeklyInsight', () => {
  const insight = buildWeeklyInsight(wireframe, end);

  it('cobre 7 dias terminando em hoje, com lacuna no dia sem registro', () => {
    expect(insight.range).toEqual({ start: '2026-10-21', end: '2026-10-27' });
    expect(insight.points.length).toBe(7);
    expect(insight.points.find((p) => p.date === '2026-10-25')?.energy).toBeUndefined();
    expect(insight.recordedDays).toBe(6);
  });

  it('descreve a variação sem apontar causa nem diagnóstico', () => {
    expect(insight.varied).toBe(true);
    expect(insight.headline).toBe('Sua energia variou. Isso não é uma falha.');
    expect(insight.summary).toContain('3 dias de energia baixa, 3 de média e 0 de alta');
    expect(`${insight.headline} ${insight.summary}`).not.toMatch(/diagn[óo]stic|risco|transtorno|porque|devido/i);
  });

  it('avisa quando há poucos registros (RF-09)', () => {
    const few = buildWeeklyInsight([rec(26, 'low'), rec(27, 'low')], end);
    expect(few.headline).toBe('Ainda há poucos registros para ver um padrão.');
    expect(few.summary).toContain('2 dias de energia baixa');
  });

  it('lida com semana sem registros e com energia estável', () => {
    expect(buildWeeklyInsight([], end).headline).toBe('Ainda não há registros nesta semana.');
    const stable = buildWeeklyInsight([rec(25, 'high'), rec(26, 'high'), rec(27, 'high')], end);
    expect(stable.varied).toBe(false);
    expect(stable.headline).toBe('Sua energia ficou parecida nesta semana.');
  });

  it('gera o card da semana do calendário como no wireframe', () => {
    const card = describeWeekCard(insight, new Date(2026, 9, 21), end);
    expect(card.title).toBe('Uma semana com variações');
    expect(card.text).toBe('De 21 a 27/10, a energia variou entre baixa e média em 6 registros. Um dia sem registro também faz parte.');
  });

  it('usa datas locais (não UTC)', () => {
    expect(toIsoDate(addDays(end, -6))).toBe('2026-10-21');
  });
});
