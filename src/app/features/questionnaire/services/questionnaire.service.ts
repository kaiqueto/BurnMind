import { Injectable, computed, inject, signal } from '@angular/core';
import { ConsentService } from '../../../core/services/consent.service';
import { StorageService } from '../../../core/services/storage.service';
import {
  FrequencyAnswer,
  ImpactAnswer,
  QuestionId,
  QuestionnaireAnswers,
  QuestionnaireSubmission,
} from '../../../shared/models/burnoutmind.models';
import { QUESTIONS } from '../questions';

/** Rascunho das respostas + histórico de envios. Persistência no navegador (MVP). */
@Injectable({ providedIn: 'root' })
export class QuestionnaireService {
  private readonly storage = inject(StorageService);
  private readonly consent = inject(ConsentService);

  private readonly _answers = signal<Partial<QuestionnaireAnswers>>(
    this.storage.get<Partial<QuestionnaireAnswers>>('draft') ?? {},
  );
  private readonly _submissions = signal<QuestionnaireSubmission[]>(
    this.storage.get<QuestionnaireSubmission[]>('submissions') ?? [],
  );

  readonly answers = this._answers.asReadonly();
  /** Envio mais recente (base da tela de Resultados). */
  readonly latest = computed(() => this._submissions().at(-1) ?? null);

  setAnswer(id: QuestionId, value: FrequencyAnswer | ImpactAnswer): void {
    const next = { ...this._answers(), [id]: value };
    this._answers.set(next);
    this.storage.set('draft', next);
  }

  /** Primeira pergunta ainda sem resposta, ou null se todas foram respondidas. */
  firstMissing(): QuestionId | null {
    const a = this._answers();
    return QUESTIONS.find((q) => !a[q.id])?.id ?? null;
  }

  /** Cria o envio a partir do rascunho completo. Exige consentimento (RN-01). */
  complete(): QuestionnaireSubmission | null {
    const consentAt = this.consent.consentAt();
    if (!consentAt || this.firstMissing() !== null) return null;
    const now = new Date().toISOString();
    const submission: QuestionnaireSubmission = {
      id: crypto.randomUUID(),
      periodDays: 14,
      answers: this._answers() as QuestionnaireAnswers,
      consentAt,
      createdAt: now,
    };
    const all = [...this._submissions(), submission];
    this._submissions.set(all);
    this.storage.set('submissions', all);
    this._answers.set({});
    this.storage.remove('draft');
    return submission;
  }
}
