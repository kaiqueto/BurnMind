import {
  AttentionLevel,
  CareResult,
  FrequencyAnswer,
  ImpactAnswer,
  NextStep,
  ProfileSlug,
  QuestionnaireAnswers,
  QuestionnaireSubmission,
} from '../../shared/models/burnoutmind.models';

/*
 * [PENDENTE — VALIDAR COM PROFISSIONAL DE SAÚDE]
 * Regra NÃO CLÍNICA e meramente educativa (RN-02/RN-06). O wireframe só mostra "Atenção moderada".
 * Os pontos abaixo são internos: nunca exibir número, "pontuação" ou "risco" ao usuário.
 * Toda a regra está isolada neste arquivo para ser trocada sem mexer nas telas.
 */

const FREQ: FrequencyAnswer[] = ['never', 'fewDays', 'severalDays', 'almostEveryDay'];
const IMPACT: ImpactAnswer[] = ['none', 'little', 'quite', 'veryMuch'];

/** Soma interna 0–9 (recuperação é invertida: menos recuperação = mais atenção). */
function internalPoints(a: QuestionnaireAnswers): number {
  return FREQ.indexOf(a.exhaustion) + (3 - FREQ.indexOf(a.recovery)) + IMPACT.indexOf(a.routine);
}

export function attentionLevel(a: QuestionnaireAnswers): AttentionLevel {
  const p = internalPoints(a);
  return p <= 3 ? 'low' : p <= 6 ? 'moderate' : 'high';
}

export function profileFor(a: QuestionnaireAnswers): ProfileSlug {
  const exhaustion = FREQ.indexOf(a.exhaustion);
  const recovery = FREQ.indexOf(a.recovery);
  if (exhaustion >= 2 && recovery <= 1) return 'overload-recovery';
  if (attentionLevel(a) === 'low') return 'room-to-recover';
  return 'fluctuating-rhythm';
}

export const PROFILE_TITLE: Record<ProfileSlug, string> = {
  'overload-recovery': 'Sobrecarga e recuperação',
  'fluctuating-rhythm': 'Ritmo em oscilação',
  'room-to-recover': 'Espaço para recuperar',
};

export interface AttentionMeta {
  label: string;
  headline: string;
  /** Preenchimento visual do anel (0–1). Representação, não escala clínica. */
  progress: number;
}

/** Textos de "moderada" vêm do wireframe; "leve" e "alta" são [SUGESTÃO] para revisão de conteúdo. */
export const ATTENTION_META: Record<AttentionLevel, AttentionMeta> = {
  low: { label: 'Atenção leve', headline: 'Há espaço para manter o que ajuda.', progress: 0.33 },
  moderate: { label: 'Atenção moderada', headline: 'Vale abrir espaço para recuperar.', progress: 0.66 },
  high: { label: 'Atenção alta', headline: 'Seu momento pede mais cuidado.', progress: 0.9 },
};

const EXHAUSTION_TEXT: Record<FrequencyAnswer, string> = {
  never: 'cansaço quase ausente',
  fewDays: 'cansaço em poucos dias',
  severalDays: 'cansaço em vários dias',
  almostEveryDay: 'cansaço quase todos os dias',
};
const RECOVERY_TEXT: Record<FrequencyAnswer, string> = {
  never: 'descanso que não ajudou a recuperar',
  fewDays: 'descanso que ajudou em poucos dias',
  severalDays: 'descanso que ajudou em vários dias',
  almostEveryDay: 'descanso que ajudou quase todos os dias',
};
const ROUTINE_TEXT: Record<ImpactAnswer, string> = {
  none: 'nenhum impacto na rotina',
  little: 'algum impacto na rotina',
  quite: 'bastante impacto na rotina',
  veryMuch: 'muito impacto na rotina',
};

export function summarize(a: QuestionnaireAnswers): string {
  return `Nas suas respostas: ${EXHAUSTION_TEXT[a.exhaustion]}, ${RECOVERY_TEXT[a.recovery]} e ${ROUTINE_TEXT[a.routine]}. Isso merece cuidado, não culpa.`;
}

export const NEXT_STEPS: readonly NextStep[] = [
  { icon: 'break', title: 'Proteja uma pausa possível', text: 'Experimente 2 minutos longe da tela.' },
  { icon: 'talk', title: 'Converse sobre suas demandas', text: 'Se houver segurança, alinhe limites e prioridades.' },
  { icon: 'support', title: 'Busque apoio se isso persistir', text: 'Um serviço de saúde pode avaliar seu contexto.' },
];

export function buildResult(submission: QuestionnaireSubmission): CareResult {
  const level = attentionLevel(submission.answers);
  return {
    id: `${submission.id}-result`,
    submissionId: submission.id,
    attentionLevel: level,
    profileSlug: profileFor(submission.answers),
    headline: ATTENTION_META[level].headline,
    summary: summarize(submission.answers),
    nextSteps: [...NEXT_STEPS],
  };
}
