import { ChangeDetectionStrategy, Component, computed, effect, inject, input, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChipComponent } from '../../../../shared/components/chip/chip.component';
import { DisclaimerComponent } from '../../../../shared/components/disclaimer/disclaimer.component';
import { ModalShellComponent } from '../../../../shared/components/modal-shell/modal-shell.component';
import { findTopic } from '../../topics.data';

/** SCR-10b — Modal do tema (/doencas/:slug). Só abre para temas com conteúdo. RF-18. */
@Component({
  selector: 'bm-topic-detail-modal',
  standalone: true,
  imports: [ModalShellComponent, ChipComponent, DisclaimerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (content(); as c) {
      <bm-modal-shell titleId="topic-title" (closed)="goBack()">
        <bm-chip>{{ topic()!.tag }}</bm-chip>
        <h2 id="topic-title" class="bm-card-title mt-3">{{ c.heading }}</h2>
        <p>{{ c.definition }}</p>

        <h3 class="bm-section-title fs-6">Sinais que merecem atenção</h3>
        <ul class="mb-4">
          @for (sign of c.signs; track sign) {
            <li>{{ sign }}</li>
          }
        </ul>

        <h3 class="bm-section-title fs-6">Prevenção é também coletiva</h3>
        <p>{{ c.prevention }}</p>

        <bm-disclaimer class="mb-3">{{ c.disclaimer }}</bm-disclaimer>
        <button type="button" class="btn btn-outline-secondary w-100" (click)="shell()?.close()">
          Fechar e voltar aos temas
        </button>
      </bm-modal-shell>
    }
  `,
})
export class TopicDetailModalComponent {
  /** Parâmetro de rota :slug (withComponentInputBinding). */
  readonly slug = input.required<string>();

  private readonly router = inject(Router);
  protected readonly shell = viewChild(ModalShellComponent);
  protected readonly topic = computed(() => findTopic(this.slug()));
  protected readonly content = computed(() => this.topic()?.content ?? null);

  constructor() {
    // Tema inexistente ou ainda sem conteúdo → volta à lista.
    effect(() => {
      if (!this.content()) void this.router.navigateByUrl('/doencas');
    });
  }

  protected goBack(): void {
    void this.router.navigateByUrl('/doencas');
  }
}
