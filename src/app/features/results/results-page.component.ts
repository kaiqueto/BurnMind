import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDownload, LucideMapPin, LucideMessageCircle } from '@lucide/angular';
import { PageHeaderComponent } from '../../layout/components/page-header/page-header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';
import { LinkCardComponent } from '../../shared/components/link-card/link-card.component';
import { CheckInService } from '../check-in/services/check-in.service';
import { FIRST_STEP_URL } from '../questionnaire/questions';
import { QuestionnaireService } from '../questionnaire/services/questionnaire.service';
import { ATTENTION_META, PROFILE_TITLE, buildResult } from './attention';
import { AttentionRingComponent } from './components/attention-ring/attention-ring.component';
import { NextStepsComponent } from './components/next-steps/next-steps.component';
import { PdfExportModalComponent } from './components/pdf-export-modal/pdf-export-modal.component';
import { latestNote } from './pdf-content';

/** SCR-07 — Resultados · Seu momento de cuidado (/resultados). RF-12, RF-13, RF-14. */
@Component({
  selector: 'bm-results-page',
  standalone: true,
  imports: [
    RouterLink,
    PageHeaderComponent,
    CardComponent,
    DisclaimerComponent,
    LinkCardComponent,
    AttentionRingComponent,
    NextStepsComponent,
    PdfExportModalComponent,
    LucideDownload,
    LucideMapPin,
    LucideMessageCircle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-page">
      <bm-page-header
        eyebrow="No seu ritmo"
        backLink="/home"
        title="Seu momento de cuidado"
        subtitle="Um olhar educativo, sem rótulos."
      />

      @if (view(); as v) {
        <div class="row g-4">
          <div class="col-lg-6">
            <bm-card class="h-100 text-center">
              <bm-attention-ring class="mx-auto mb-3" [label]="v.meta.label" [progress]="v.meta.progress" />
              <h2 class="bm-card-title">{{ v.result.headline }}</h2>
              <p class="small bm-muted">Representação educativa, sem pontuação ou cálculo clínico.</p>
              <div class="text-start mt-4">
                <p class="bm-eyebrow">Perfil educativo</p>
                <h3 class="bm-card-title mt-2">{{ v.profileTitle }}</h3>
                <p class="mb-0 bm-muted">{{ v.result.summary }}</p>
              </div>
            </bm-card>
          </div>

          <div class="col-lg-6 d-flex flex-column gap-3">
            <bm-next-steps [steps]="v.result.nextSteps" />

            @if (v.result.attentionLevel === 'high') {
              <bm-card tone="brand-soft">
                <p class="mb-0 fw-bold">
                  Se você estiver em sofrimento intenso, procure ajuda agora: CVV 188 (24 horas) ou SAMU 192.
                </p>
              </bm-card>
            }

            <a class="btn btn-primary btn-lg" routerLink="/chat">
              <svg lucideMessageCircle [size]="18"></svg>Falar com o chat
            </a>
            <button type="button" class="btn btn-outline-secondary btn-lg" (click)="exportOpen.set(true)">
              <svg lucideDownload [size]="18"></svg>Exportar resultado (PDF)
            </button>
            <bm-link-card
              link="/resultados/assistencia-proxima"
              tone="brand-soft"
              title="Assistência próxima"
              subtitle="Ver mapa e opções de cuidado"
            >
              <svg icon lucideMapPin class="bm-icon-strong" [size]="22"></svg>
            </bm-link-card>

            <bm-disclaimer>
              O nível de atenção é apenas ilustrativo, não é diagnóstico nem previsão de risco. O questionário
              não substitui avaliação profissional.
            </bm-disclaimer>
          </div>
        </div>
        @if (exported()) {
          <p class="bm-disclaimer mt-3" role="status">PDF gerado. Confira a pasta de downloads do seu dispositivo.</p>
        }
        @if (exportOpen()) {
          <bm-pdf-export-modal
            [submission]="v.submission"
            [note]="note()"
            (exported)="exported.set(true)"
            (closed)="exportOpen.set(false)"
          />
        }
      } @else {
        <bm-card tone="brand-soft" class="text-center">
          <h2 class="bm-card-title">Você ainda não respondeu ao questionário.</h2>
          <p class="bm-muted">São 3 perguntas curtas sobre os últimos 14 dias, sem resposta certa.</p>
          <a class="btn btn-primary btn-lg" [routerLink]="firstStep">Responder agora</a>
        </bm-card>
      }
    </div>
  `,
})
export class ResultsPageComponent {
  private readonly questionnaire = inject(QuestionnaireService);
  private readonly checkIns = inject(CheckInService);
  protected readonly firstStep = FIRST_STEP_URL;
  protected readonly exportOpen = signal(false);
  protected readonly exported = signal(false);
  protected readonly note = computed(() => latestNote(this.checkIns.checkIns()));

  protected readonly view = computed(() => {
    const submission = this.questionnaire.latest();
    if (!submission) return null;
    const result = buildResult(submission);
    return { submission, result, meta: ATTENTION_META[result.attentionLevel], profileTitle: PROFILE_TITLE[result.profileSlug] };
  });
}
