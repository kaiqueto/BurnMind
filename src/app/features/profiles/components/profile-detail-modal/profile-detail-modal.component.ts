import { ChangeDetectionStrategy, Component, computed, effect, inject, input, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LucideHeartHandshake } from '@lucide/angular';
import { ChipComponent } from '../../../../shared/components/chip/chip.component';
import { DisclaimerComponent } from '../../../../shared/components/disclaimer/disclaimer.component';
import { ModalShellComponent } from '../../../../shared/components/modal-shell/modal-shell.component';
import { QuestionnaireService } from '../../../questionnaire/services/questionnaire.service';
import { profileFor } from '../../../results/attention';
import { answerBullets, findProfile } from '../../profiles.data';

/** SCR-09b — Modal do perfil (/perfis/:slug). Rota filha de /perfis: tem deep link e botão voltar. RF-17. */
@Component({
  selector: 'bm-profile-detail-modal',
  standalone: true,
  imports: [ModalShellComponent, ChipComponent, DisclaimerComponent, LucideHeartHandshake],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (profile(); as p) {
      <bm-modal-shell titleId="profile-title" (closed)="goBack()">
        <bm-chip>Perfil educativo</bm-chip>
        <h2 id="profile-title" class="bm-card-title mt-3">{{ p.title }}</h2>
        <p>{{ p.details.intro }}</p>

        @if (bullets(); as items) {
          <h3 class="bm-section-title fs-6">Nas suas respostas</h3>
          <ul class="mb-4">
            @for (item of items; track item) {
              <li>{{ item }}</li>
            }
          </ul>
        }

        <h3 class="bm-section-title fs-6">O que pode ajudar agora</h3>
        @for (tip of p.details.helpNow; track tip.title) {
          <div class="bm-tip">
            <span class="bm-tip__icon"><svg lucideHeartHandshake [size]="16"></svg></span>
            <div>
              <span class="bm-tip__title">{{ tip.title }}</span>
              <p class="bm-tip__text bm-muted">{{ tip.text }}</p>
            </div>
          </div>
        }

        <bm-disclaimer class="mb-3">{{ p.details.disclaimer }}</bm-disclaimer>
        <button type="button" class="btn btn-outline-secondary w-100" (click)="shell()?.close()">
          Fechar e voltar aos perfis
        </button>
      </bm-modal-shell>
    }
  `,
})
export class ProfileDetailModalComponent {
  /** Parâmetro de rota :slug (withComponentInputBinding). */
  readonly slug = input.required<string>();

  private readonly router = inject(Router);
  private readonly questionnaire = inject(QuestionnaireService);
  protected readonly shell = viewChild(ModalShellComponent);

  protected readonly profile = computed(() => findProfile(this.slug()));

  /** Só o perfil do próprio usuário mostra "Nas suas respostas". */
  protected readonly bullets = computed(() => {
    const answers = this.questionnaire.latest()?.answers;
    return answers && profileFor(answers) === this.profile()?.slug ? answerBullets(answers) : null;
  });

  constructor() {
    effect(() => {
      if (!this.profile()) void this.router.navigateByUrl('/perfis');
    });
  }

  protected goBack(): void {
    void this.router.navigateByUrl('/perfis');
  }
}
