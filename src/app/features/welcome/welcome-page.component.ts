import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideArrowRight, LucideHeart } from '@lucide/angular';
import { ConsentService } from '../../core/services/consent.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';
import { WelcomeIllustrationComponent } from './components/welcome-illustration/welcome-illustration.component';

/** Próxima rota após o consentimento: primeira pergunta do questionário. */
export const AFTER_CONSENT_ROUTE = '/formulario/exaustao';

/** SCR-01 — Boas-vindas (/boas-vindas). RF-01, RN-01. */
@Component({
  selector: 'bm-welcome-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CardComponent,
    ChipComponent,
    DisclaimerComponent,
    WelcomeIllustrationComponent,
    LucideArrowRight,
    LucideHeart,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-page">
      <div class="row align-items-center g-5">
        <div class="col-lg-6">
          <bm-chip><svg lucideHeart [size]="12"></svg>Um espaço para você</bm-chip>
          <h1 class="bm-page-title mt-3">Seu bem-estar merece uma pausa.</h1>
          <p class="bm-muted fs-5 mb-4">
            Perceba como o trabalho tem afetado seus dias e descubra pequenos caminhos de cuidado.
          </p>

          <form (submit)="start($event)" novalidate>
            <bm-card class="mb-3">
              <p class="fw-bold mb-3">Comece com 3 perguntas educativas sobre os últimos 14 dias.</p>
              <div class="form-check">
                <input
                  id="consent"
                  class="form-check-input"
                  type="checkbox"
                  [formControl]="consent"
                  [attr.aria-invalid]="showError() ? 'true' : null"
                  aria-describedby="consent-error"
                />
                <label class="form-check-label" for="consent">
                  Entendo os limites do questionário e concordo com o uso das respostas para personalizar
                  esta experiência.
                </label>
              </div>
              <p id="consent-error" class="bm-error mt-2 mb-0" role="alert">
                @if (showError()) {
                  Marque a caixa para continuar.
                }
              </p>
              <a class="bm-eyebrow mt-3" routerLink="/sobre">Privacidade e uso responsável →</a>
            </bm-card>

            <button class="btn btn-primary btn-lg w-100" type="submit">
              Começar <svg lucideArrowRight [size]="18"></svg>
            </button>
          </form>

          <bm-disclaimer class="mt-3">
            Você decide o que compartilhar. Este site não substitui avaliação, diagnóstico ou
            acompanhamento profissional.
          </bm-disclaimer>
        </div>

        <div class="col-lg-6">
          <bm-welcome-illustration />
          <p class="small bm-muted text-center mt-2 mb-0">Informação • Prevenção • Bem-estar</p>
        </div>
      </div>
    </div>
  `,
})
export class WelcomePageComponent {
  private readonly consentService = inject(ConsentService);
  private readonly router = inject(Router);

  protected readonly consent = new FormControl(this.consentService.hasConsent(), {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });
  protected readonly showError = signal(false);

  protected async start(event: Event): Promise<void> {
    event.preventDefault();
    if (this.consent.invalid) {
      this.showError.set(true);
      return;
    }
    this.showError.set(false);
    if (!this.consentService.hasConsent()) this.consentService.give();
    await this.router.navigateByUrl(AFTER_CONSENT_ROUTE);
  }
}
