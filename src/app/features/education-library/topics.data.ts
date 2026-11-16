import { EducationTopic } from '../../shared/models/burnoutmind.models';
import { normalizeText } from '../../shared/utils/text';

/*
 * [PENDENTE — RN-08] O conteúdo de saúde precisa ser revisado por profissional antes de publicar.
 * Só "Burnout" tem texto detalhado no wireframe. Os demais temas aparecem na lista com "Em breve":
 * não inventei conteúdo clínico sobre ansiedade, depressão, estresse crônico ou sono.
 * Para publicar um tema, basta preencher `content`.
 */
export const TOPICS: readonly EducationTopic[] = [
  {
    slug: 'burnout',
    title: 'Burnout',
    summary: 'Exaustão e distanciamento ligados ao trabalho.',
    tag: 'Contexto ocupacional',
    icon: 'flame',
    content: {
      heading: 'Entendendo o burnout',
      definition:
        'Burnout é um fenômeno ligado ao estresse crônico no trabalho que não foi bem manejado. Não é sinônimo de qualquer cansaço ou de todo estresse da vida.',
      signs: [
        'Exaustão física ou emocional',
        'Distanciamento ou cinismo em relação ao trabalho',
        'Sensação de menor eficácia no trabalho',
      ],
      prevention:
        'Pausas e descanso ajudam, mas carga de trabalho, autonomia e apoio também importam. Se for seguro, converse sobre demandas e procure orientação de saúde.',
      disclaimer:
        'Sinais isolados não confirmam diagnóstico. Uma avaliação profissional considera duração, contexto e outras possíveis causas.',
    },
  },
  { slug: 'anxiety', title: 'Ansiedade', summary: 'Preocupação e alerta que podem afetar o dia a dia.', tag: 'Entenda os sinais', icon: 'wind' },
  { slug: 'depression', title: 'Depressão', summary: 'Alterações persistentes no humor e no interesse.', tag: 'Informação e cuidado', icon: 'cloud' },
  { slug: 'chronic-stress', title: 'Estresse crônico', summary: 'Quando o estado de tensão se mantém por muito tempo.', tag: 'Demandas e recuperação', icon: 'activity' },
  { slug: 'sleep-difficulties', title: 'Dificuldades de sono', summary: 'Problemas para dormir ou sentir que o sono recupera.', tag: 'Descanso e bem-estar', icon: 'moon' },
];

export function findTopic(slug: string): EducationTopic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

/** Busca por título, resumo ou tag, sem diferenciar acentos nem caixa. */
export function filterTopics(topics: readonly EducationTopic[], query: string): EducationTopic[] {
  const q = normalizeText(query);
  if (!q) return [...topics];
  return topics.filter((t) => normalizeText(`${t.title} ${t.summary} ${t.tag}`).includes(q));
}
