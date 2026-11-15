// src/app/shared/models/burnoutmind.models.ts
// Modelos de domínio do BurnoutMind. Ver burnoutmind-guia.json > modelosDeDados.

export type MoodLevel = 'hard' | 'tired' | 'good' | 'great';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type FrequencyAnswer = 'never' | 'fewDays' | 'severalDays' | 'almostEveryDay';
export type ImpactAnswer = 'none' | 'little' | 'quite' | 'veryMuch';
/** [PENDENTE] Só "moderate" aparece no wireframe. Validar níveis com profissional de saúde. */
export type AttentionLevel = 'low' | 'moderate' | 'high';
export type ProfileSlug = 'overload-recovery' | 'fluctuating-rhythm' | 'room-to-recover';
export type TopicSlug = 'burnout' | 'anxiety' | 'depression' | 'chronic-stress' | 'sleep-difficulties';
export type QuestionId = 'exhaustion' | 'recovery' | 'routine';

/** Rótulos pt-BR (centralizar também em arquivo de strings — RNF-09). */
export const MOOD_LABEL: Record<MoodLevel, string> = {
  hard: 'Difícil', tired: 'Cansado', good: 'Bem', great: 'Muito bem',
};
export const ENERGY_LABEL: Record<EnergyLevel, string> = {
  low: 'Baixa', medium: 'Média', high: 'Alta',
};
export const ENERGY_ABBR: Record<EnergyLevel, 'B' | 'M' | 'A'> = {
  low: 'B', medium: 'M', high: 'A',
};
export const FREQUENCY_LABEL: Record<FrequencyAnswer, string> = {
  never: 'Nunca', fewDays: 'Em poucos dias', severalDays: 'Em vários dias', almostEveryDay: 'Quase todos os dias',
};
export const IMPACT_LABEL: Record<ImpactAnswer, string> = {
  none: 'Não afetou', little: 'Afetou um pouco', quite: 'Afetou bastante', veryMuch: 'Afetou muito',
};

/** Data civil no formato yyyy-MM-dd (um check-in por dia — RN-04). */
export type IsoDate = string;
export type IsoDateTime = string;

export interface User { id: string; name: string; }

export interface DailyCheckIn {
  id: string;
  date: IsoDate;
  mood: MoodLevel;
  energy: EnergyLevel;
  note?: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface QuestionnaireAnswers {
  exhaustion: FrequencyAnswer;
  recovery: FrequencyAnswer;
  routine: ImpactAnswer;
}

export interface QuestionnaireSubmission {
  id: string;
  periodDays: 14;
  answers: QuestionnaireAnswers;
  consentAt: IsoDateTime;
  createdAt: IsoDateTime;
}

export type NextStepIcon = 'break' | 'talk' | 'support';
export interface NextStep { icon: NextStepIcon; title: string; text: string; }

export interface CareResult {
  id: string;
  submissionId: string;
  attentionLevel: AttentionLevel;
  profileSlug: ProfileSlug;
  headline: string;
  /** Resumo em linguagem natural das respostas (ex.: "cansaço em vários dias..."). */
  summary: string;
  nextSteps: NextStep[];
}

export interface WellbeingProfile {
  slug: ProfileSlug;
  title: string;
  summary: string;
  details: { intro: string; exampleAnswers: string[]; helpNow: { title: string; text: string }[]; disclaimer: string };
}

export interface EducationTopic {
  slug: TopicSlug;
  title: string;
  summary: string;
  tag: string;
  icon: string;
  content?: { heading: string; definition: string; signs: string[]; prevention: string; disclaimer: string };
}

export interface EnergyPoint { date: IsoDate; energy?: EnergyLevel; }
export interface WeeklyInsight {
  range: { start: IsoDate; end: IsoDate };
  points: EnergyPoint[];
  headline: string;
  /** Texto descritivo com a contagem de registros por nível de energia. */
  summary: string;
  recordedDays: number;
  /** Houve mais de um nível de energia na semana. */
  varied: boolean;
  suggestions: { title: string; text: string }[];
}

export interface ChatMessage { id: string; role: 'user' | 'assistant'; text: string; createdAt: IsoDateTime; }

/** Tipo de serviço de saúde (sem localização específica; a busca é feita no mapa). */
export interface CareService {
  id: string;
  kind: 'UBS' | 'CAPS';
  name: string;
  description: string;
}

export interface PdfExportOptions { includeAnswers: boolean; includeNote: boolean; }

/** Dica do dia exibida na Home (card care-soft). */
export interface DailyTip { title: string; text: string; footnote: string; }
