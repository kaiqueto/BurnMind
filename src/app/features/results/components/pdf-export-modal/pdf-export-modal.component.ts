import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideDownload, LucideFileText, LucideShieldCheck } from '@lucide/angular';
import { ChipComponent } from '../../../../shared/components/chip/chip.component';
import { ModalShellComponent } from '../../../../shared/components/modal-shell/modal-shell.component';
import { QuestionnaireSubmission } from '../../../../shared/models/burnoutmind.models';
import { PdfNote, buildPdfContent } from '../../pdf-content';
import { PdfService } from '../../services/pdf.service';

/** SCR-07b — Modal "Preparar resumo em PDF" (RF-15). A nota diária vem desmarcada: privacidade por padrão. */
@Component({
  selector: 'bm-pdf-export-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ModalShellComponent, ChipComponent, LucideFileText, LucideShieldCheck, LucideDownload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bm-modal-shell titleId="pdf-title" (closed)="closed.emit()">
      <bm-chip>Prévia de exportação</bm-chip>
      <h2 id="pdf-title" class="bm-card-title mt-3">Preparar resumo em PDF</h2>
      <p class="bm-muted">Revise o que deseja incluir antes de compartilhar seu momento de cuidado.</p>

      <div class="bm-pdf-preview" aria-label="Prévia do documento" role="group">
        <div class="d-flex align-items-center gap-2 mb-2">
          <svg lucideFileText class="bm-icon-strong" [size]="20"></svg>
          <div>
            <strong>BurnoutMind</strong>
            <span class="d-block small bm-muted">Resumo educativo • {{ today }}</span>
          </div>
        </div>
        <bm-chip>{{ preview().attentionLabel }} • educativo</bm-chip>
        <p class="fw-bold fs-5 mt-2 mb-1">{{ preview().profileTitle }}</p>
        <p class="small mb-2">{{ preview().summary }}</p>
        @if (preview().answers; as answers) {
          <ul class="small mb-2 ps-3">
            @for (a of answers; track a.question) {
              <li>{{ a.answer }}</li>
            }
          </ul>
        }
        @if (preview().note; as n) {
          <p class="small fst-italic mb-2">Nota ({{ n.date }}): “{{ n.text }}”</p>
        }
        <p class="small bm-muted mb-0">
          Resumo educativo, sem pontuação clínica. Não é diagnóstico e não substitui avaliação profissional.
        </p>
      </div>

      <form [formGroup]="form" class="mt-3" (submit)="submit($event)">
        <div class="form-check mb-2">
          <input id="opt-answers" class="form-check-input" type="checkbox" formControlName="includeAnswers" />
          <label class="form-check-label" for="opt-answers">Incluir respostas do formulário</label>
        </div>
        <div class="form-check mb-3">
          <input id="opt-note" class="form-check-input" type="checkbox" formControlName="includeNote" />
          <label class="form-check-label" for="opt-note">
            Incluir minha nota diária (opcional)
            @if (!note()) {
              <span class="d-block small bm-muted">Você ainda não tem nota diária.</span>
            }
          </label>
        </div>

        <p class="bm-disclaimer">
          <svg lucideShieldCheck [size]="16"></svg>
          <span>
            Um PDF pode conter informações pessoais. Compartilhe apenas com quem você escolher e guarde o
            arquivo em um local seguro.
          </span>
        </p>

        @if (error()) {
          <p class="bm-error" role="alert">Não foi possível gerar o PDF agora. Tente de novo em instantes.</p>
        }

        <div class="d-flex gap-2 mt-3">
          <button type="button" class="btn btn-outline-secondary flex-fill" (click)="shell()?.close()">Cancelar</button>
          <button type="submit" class="btn btn-primary flex-fill" [attr.aria-busy]="busy()">
            <svg lucideDownload [size]="16"></svg>{{ busy() ? 'Preparando…' : 'Preparar PDF' }}
          </button>
        </div>
      </form>
    </bm-modal-shell>
  `,
})
export class PdfExportModalComponent {
  readonly submission = input.required<QuestionnaireSubmission>();
  /** Nota mais recente do diário, se existir. */
  readonly note = input<PdfNote | null>(null);

  readonly closed = output<void>();
  readonly exported = output<void>();

  private readonly pdf = inject(PdfService);
  protected readonly shell = viewChild(ModalShellComponent);
  protected readonly today = new Date().toLocaleDateString('pt-BR');
  protected readonly busy = signal(false);
  protected readonly error = signal(false);

  protected readonly form = new FormGroup({
    includeAnswers: new FormControl(true, { nonNullable: true }),
    includeNote: new FormControl(false, { nonNullable: true }),
  });
  private readonly options = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });


  constructor() {
    // Sem nota no diário, a opção fica indisponível (e desmarcada).
    effect(() => {
      const control = this.form.controls.includeNote;
      if (this.note()) control.enable({ emitEvent: false });
      else control.disable({ emitEvent: false });
    });
  }

  protected readonly preview = computed(() =>
    buildPdfContent(
      this.submission(),
      { includeAnswers: !!this.options().includeAnswers, includeNote: !!this.options().includeNote },
      this.note(),
    ),
  );

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set(false);
    try {
      await this.pdf.download(this.preview());
      this.exported.emit();
      this.shell()?.close();
    } catch {
      this.error.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
