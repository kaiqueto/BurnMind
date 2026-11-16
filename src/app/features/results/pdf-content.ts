import {
  DailyCheckIn,
  FREQUENCY_LABEL,
  IMPACT_LABEL,
  PdfExportOptions,
  QuestionnaireSubmission,
} from '../../shared/models/burnoutmind.models';
import { QUESTIONS } from '../questionnaire/questions';
import { ATTENTION_META, PROFILE_TITLE, buildResult } from './attention';

export interface PdfNote {
  /** dd/MM */
  date: string;
  text: string;
}

export interface PdfContent {
  generatedAt: Date;
  attentionLabel: string;
  headline: string;
  profileTitle: string;
  summary: string;
  answers?: { question: string; answer: string }[];
  note?: PdfNote;
}

/** Nota mais recente (check-in mais novo que tenha texto). */
export function latestNote(checkIns: readonly DailyCheckIn[]): PdfNote | null {
  const found = [...checkIns].sort((a, b) => b.date.localeCompare(a.date)).find((c) => c.note?.trim());
  if (!found?.note) return null;
  const [, month, day] = found.date.split('-');
  return { date: `${day}/${month}`, text: found.note.trim() };
}

/** Monta o conteúdo do PDF respeitando as opções (RF-15): nota e respostas só entram se marcadas. */
export function buildPdfContent(
  submission: QuestionnaireSubmission,
  options: PdfExportOptions,
  note: PdfNote | null,
  now: Date = new Date(),
): PdfContent {
  const result = buildResult(submission);
  const a = submission.answers;
  const labels = [FREQUENCY_LABEL[a.exhaustion], FREQUENCY_LABEL[a.recovery], IMPACT_LABEL[a.routine]];
  return {
    generatedAt: now,
    attentionLabel: ATTENTION_META[result.attentionLevel].label,
    headline: result.headline,
    profileTitle: PROFILE_TITLE[result.profileSlug],
    summary: result.summary,
    answers: options.includeAnswers
      ? QUESTIONS.map((q, i) => ({ question: q.prompt, answer: labels[i] }))
      : undefined,
    note: options.includeNote && note ? note : undefined,
  };
}

export function pdfFileName(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `burnoutmind-resumo-${y}-${m}-${d}.pdf`;
}
