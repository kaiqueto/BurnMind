import {
  DailyCheckIn,
  ENERGY_LABEL,
  EnergyLevel,
  EnergyPoint,
  WeeklyInsight,
} from '../../shared/models/burnoutmind.models';
import { addDays, formatRangeShort, toIsoDate } from '../../shared/utils/date';

export const WEEK_DAYS = 7;
/** Abaixo disso o app avisa que ainda não dá para ver um padrão (RF-09). */
export const MIN_RECORDS_FOR_PATTERN = 3;

const SUGGESTIONS = [
  {
    title: 'Combine um limite possível',
    text: 'Escolha um horário para encerrar o trabalho e avalie o que é viável no seu contexto.',
  },
  {
    title: 'Observe o que ajuda a recuperar',
    text: 'No próximo registro, anote uma pausa ou um apoio que fez diferença.',
  },
];

/** Insight descritivo dos últimos 7 dias terminando em `end`. Sem linguagem causal ou diagnóstica. */
export function buildWeeklyInsight(checkIns: readonly DailyCheckIn[], end: Date = new Date()): WeeklyInsight {
  const startDate = addDays(end, -(WEEK_DAYS - 1));
  const byDate = new Map(checkIns.map((c) => [c.date, c]));
  const points: EnergyPoint[] = Array.from({ length: WEEK_DAYS }, (_, i) => {
    const date = toIsoDate(addDays(startDate, i));
    return { date, energy: byDate.get(date)?.energy };
  });

  const count = (level: EnergyLevel) => points.filter((p) => p.energy === level).length;
  const [low, medium, high] = [count('low'), count('medium'), count('high')];
  const recordedDays = low + medium + high;
  const varied = [low, medium, high].filter((n) => n > 0).length > 1;

  let headline: string;
  let summary: string;
  if (recordedDays === 0) {
    headline = 'Ainda não há registros nesta semana.';
    summary = 'Um dia sem registro também faz parte. Quando quiser, o check-in leva cerca de um minuto.';
  } else {
    const dias = (n: number) => (n === 1 ? 'dia' : 'dias');
    summary = `Nesta semana: ${low} ${dias(low)} de energia baixa, ${medium} de média e ${high} de alta. `;
    if (recordedDays < MIN_RECORDS_FOR_PATTERN) {
      headline = 'Ainda há poucos registros para ver um padrão.';
      summary += 'Com mais alguns dias, o quadro fica mais claro.';
    } else {
      headline = varied ? 'Sua energia variou. Isso não é uma falha.' : 'Sua energia ficou parecida nesta semana.';
      summary += 'Esses dados não explicam a causa do cansaço, mas podem ajudar a iniciar uma conversa.';
    }
  }

  return {
    range: { start: points[0].date, end: points[WEEK_DAYS - 1].date },
    points,
    headline,
    summary,
    recordedDays,
    varied,
    suggestions: SUGGESTIONS,
  };
}

/** Título e texto do card "semana" do calendário. */
export function describeWeekCard(insight: WeeklyInsight, start: Date, end: Date): { title: string; text: string } {
  const range = formatRangeShort(start, end);
  if (insight.recordedDays === 0) {
    return {
      title: 'Uma semana sem registros',
      text: 'Ainda não há registros nos últimos 7 dias. Um dia sem registro também faz parte.',
    };
  }
  const levels = (['low', 'medium', 'high'] as const)
    .filter((l) => insight.points.some((p) => p.energy === l))
    .map((l) => ENERGY_LABEL[l].toLowerCase());
  const n = insight.recordedDays;
  const energia = insight.varied ? `variou entre ${levels.join(' e ')}` : `ficou ${levels[0]}`;
  return {
    title: insight.varied ? 'Uma semana com variações' : 'Uma semana mais estável',
    text: `De ${range}, a energia ${energia} em ${n} ${n === 1 ? 'registro' : 'registros'}. Um dia sem registro também faz parte.`,
  };
}
