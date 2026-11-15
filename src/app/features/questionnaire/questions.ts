import {
  FREQUENCY_LABEL,
  FrequencyAnswer,
  IMPACT_LABEL,
  ImpactAnswer,
  QuestionId,
} from '../../shared/models/burnoutmind.models';

export type StepSlug = 'exaustao' | 'recuperacao' | 'rotina';

export interface AnswerOption {
  value: string;
  label: string;
}

export interface QuestionDef {
  id: QuestionId;
  slug: StepSlug;
  /** Rótulo no stepper lateral. */
  label: string;
  prompt: string;
  hint: string;
  /** Nota de apoio exibida na coluna lateral. */
  note: string;
  options: AnswerOption[];
}

const frequencyOptions: AnswerOption[] = (Object.keys(FREQUENCY_LABEL) as FrequencyAnswer[]).map((value) => ({
  value,
  label: FREQUENCY_LABEL[value],
}));
const impactOptions: AnswerOption[] = (Object.keys(IMPACT_LABEL) as ImpactAnswer[]).map((value) => ({
  value,
  label: IMPACT_LABEL[value],
}));

/** As 3 perguntas fixas (RN-03), na ordem do wireframe. Período de referência: 14 dias. */
export const QUESTIONS: readonly QuestionDef[] = [
  {
    id: 'exhaustion',
    slug: 'exaustao',
    label: 'Exaustão',
    prompt: 'Com que frequência o trabalho deixou você sem energia?',
    hint: 'Pense no cansaço físico ou emocional ao longo desses dias.',
    note: 'Não há resposta certa. Reconhecer o cansaço é uma forma de se escutar.',
    options: frequencyOptions,
  },
  {
    id: 'recovery',
    slug: 'recuperacao',
    label: 'Recuperação',
    prompt: 'Com que frequência o descanso ajudou você a recuperar a energia?',
    hint: 'Considere as pausas, o sono e os momentos fora do trabalho.',
    note: 'Descansar nem sempre é simples. Suas condições de trabalho e de vida também importam.',
    options: frequencyOptions,
  },
  {
    id: 'routine',
    slug: 'rotina',
    label: 'Rotina',
    prompt: 'Quanto o cansaço ligado ao trabalho afetou sua rotina?',
    hint: 'Ainda nos últimos 14 dias, pense nas tarefas, relações e atividades de que gosta.',
    note: 'Você chegou até aqui. Vamos olhar para suas respostas com cuidado, sem rótulos.',
    options: impactOptions,
  },
];

export const FIRST_STEP_URL = `/formulario/${QUESTIONS[0].slug}`;
