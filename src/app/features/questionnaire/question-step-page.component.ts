import { ChangeDetectionStrategy, Component, computed, effect, inject, input, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideArrowRight } from '@lucide/angular';
import { CardComponent } from '../../shared/components/card/card.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';
import { FrequencyAnswer, ImpactAnswer } from '../../shared/models/burnoutmind.models';
import { AnswerOptionsComponent } from './components/answer-options/answer-options.component';
import { StepProgressComponent } from './components/step-progress/step-progress.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { FIRST_STEP_URL, QUESTIONS } from './questions';
import { QuestionnaireService } from './services/questionnaire.service';

/** SCR-06 — Questionário, uma pergunta por tela (/formulario/:step). RF-10, RF-11. */
@Component({
  selector: 'bm-question-step-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CardComponent,
    DisclaimerComponent,
    StepperComponent,
    StepProgressComponent,
    AnswerOptionsComponent,
    LucideArrowLeft,
    LucideArrowRight,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (question(); as q) {
      <div class="bm-page">
        <div class="row g-4 g-lg-5">
          <aside class="col-lg-4 d-none d-lg-block">
            <p class="bm-eyebrow">Seu momento · {{ position() }}/{{ total }}</p>
            <h2 class="bm-card-title mt-2 mb-4">Uma pergunta de cada vez.</h2>
            <bm-stepper [items]="labels" [current]="index()" />
            <bm-card tone="footer" class="mt-4"><p class="small mb-0">{{ q.note }}</p></bm-card>
          </aside>

          <section class="col-lg-8" aria-labelledby="question-title">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <a class="bm-eyebrow" [routerLink]="backLink()"><svg lucideArrowLeft [size]="14"></svg>Voltar</a>
              <span class="small fw-bold">Seu momento · {{ position() }}/{{ total }}</span>
            </div>
            <bm-step-progress [total]="total" [current]="position()" />

            <p class="bm-eyebrow mt-4">Nos últimos 14 dias</p>
            <h1 id="question-title" class="bm-page-title">{{ q.prompt }}</h1>
            <p class="bm-muted mb-4">{{ q.hint }}</p>

            <form (submit)="next($event)" novalidate>
              <bm-answer-options [control]="control" [options]="q.options" [name]="q.id" [legend]="q.prompt" />
              <p class="bm-error mt-2 mb-0" role="alert">
                @if (control.touched && control.invalid) {
                  Escolha uma opção para continuar.
                }
              </p>
              <button class="btn btn-primary btn-lg w-100 mt-3" type="submit">
                {{ isLast() ? 'Ver resultado' : 'Continuar' }} <svg lucideArrowRight [size]="18"></svg>
              </button>
            </form>

            <bm-disclaimer class="mt-3">
              Questionário educativo de autorrelato, não diagnóstico. Não é um instrumento clínico validado e
              não produz pontuação clínica.
            </bm-disclaimer>
          </section>
        </div>
      </div>
    }
  `,
})
export class QuestionStepPageComponent {
  /** Vem do parâmetro de rota :step (withComponentInputBinding). */
  readonly step = input.required<string>();

  private readonly service = inject(QuestionnaireService);
  private readonly router = inject(Router);

  protected readonly total = QUESTIONS.length;
  protected readonly labels = QUESTIONS.map((q) => q.label);
  protected readonly control = new FormControl<string | null>(null, Validators.required);

  protected readonly index = computed(() => QUESTIONS.findIndex((q) => q.slug === this.step()));
  protected readonly question = computed(() => QUESTIONS[this.index()] ?? null);
  protected readonly position = computed(() => this.index() + 1);
  protected readonly isLast = computed(() => this.index() === this.total - 1);
  protected readonly backLink = computed(() =>
    this.index() > 0 ? `/formulario/${QUESTIONS[this.index() - 1].slug}` : '/home',
  );

  constructor() {
    // Passo inválido → volta à primeira pergunta.
    effect(() => {
      if (this.index() < 0) void this.router.navigateByUrl(FIRST_STEP_URL);
    });

    // Ao trocar de pergunta, restaura a resposta já dada (respostas persistem ao voltar).
    effect(() => {
      const q = this.question();
      if (!q) return;
      untracked(() => {
        // emitEvent:false evita regravar no storage a resposta que acabou de ser lida.
        this.control.reset((this.service.answers()[q.id] as string | undefined) ?? null, { emitEvent: false });
      });
    });

    // Cada escolha é guardada na hora.
    this.control.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      const q = this.question();
      if (q && value) this.service.setAnswer(q.id, value as FrequencyAnswer | ImpactAnswer);
    });
  }

  protected async next(event: Event): Promise<void> {
    event.preventDefault();
    this.control.markAsTouched();
    if (this.control.invalid) return;

    if (!this.isLast()) {
      await this.router.navigateByUrl(`/formulario/${QUESTIONS[this.index() + 1].slug}`);
      return;
    }
    const missing = this.service.firstMissing();
    if (missing) {
      await this.router.navigateByUrl(`/formulario/${QUESTIONS.find((q) => q.id === missing)!.slug}`);
      return;
    }
    this.service.complete();
    await this.router.navigateByUrl('/resultados');
  }
}
