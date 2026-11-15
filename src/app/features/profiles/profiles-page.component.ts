import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeaderComponent } from '../../layout/components/page-header/page-header.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';
import { QuestionnaireService } from '../questionnaire/services/questionnaire.service';
import { profileFor } from '../results/attention';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { PROFILES } from './profiles.data';

/** SCR-09 — Perfis · Momentos, não rótulos (/perfis). RF-17. O modal é a rota filha /perfis/:slug. */
@Component({
  selector: 'bm-profiles-page',
  standalone: true,
  imports: [RouterOutlet, PageHeaderComponent, ProfileCardComponent, DisclaimerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-page">
      <bm-page-header
        eyebrow="Perfis"
        title="Momentos, não rótulos"
        subtitle="Perfis educativos de bem-estar para refletir sobre o seu ritmo."
      />
      <div class="row g-4 mb-4">
        @for (p of profiles; track p.slug) {
          <div class="col-md-6 col-lg-4">
            <bm-profile-card [profile]="p" [highlighted]="p.slug === mine()" />
          </div>
        }
      </div>
      <bm-disclaimer>
        Um perfil descreve um momento, não uma identidade fixa ou condição clínica. Ele pode mudar com seu
        contexto.
      </bm-disclaimer>
    </div>
    <router-outlet />
  `,
})
export class ProfilesPageComponent {
  private readonly questionnaire = inject(QuestionnaireService);
  protected readonly profiles = PROFILES;
  /** Perfil do último questionário respondido, se houver. */
  protected readonly mine = computed(() => {
    const answers = this.questionnaire.latest()?.answers;
    return answers ? profileFor(answers) : null;
  });
}
