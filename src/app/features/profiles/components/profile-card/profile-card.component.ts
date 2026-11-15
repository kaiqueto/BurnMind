import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ChipComponent } from '../../../../shared/components/chip/chip.component';
import { WellbeingProfile } from '../../../../shared/models/burnoutmind.models';

/** Cartão de um perfil educativo; destaca o perfil do próprio usuário. */
@Component({
  selector: 'bm-profile-card',
  standalone: true,
  imports: [RouterLink, CardComponent, ChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block h-100' },
  template: `
    <bm-card class="h-100" [tone]="highlighted() ? 'brand-soft' : 'default'">
      <div class="d-flex flex-column h-100 gap-2">
        <div class="bm-profile-card__badge">
          @if (highlighted()) {
            <bm-chip variant="outline">Seu resultado</bm-chip>
          }
        </div>
        <h2 class="bm-card-title">{{ profile().title }}</h2>
        <p class="bm-muted flex-grow-1">{{ profile().summary }}</p>
        <a class="bm-eyebrow" [routerLink]="['/perfis', profile().slug]" [attr.aria-label]="'Ver detalhes: ' + profile().title">
          Ver detalhes
        </a>
      </div>
    </bm-card>
  `,
})
export class ProfileCardComponent {
  readonly profile = input.required<WellbeingProfile>();
  readonly highlighted = input(false);
}
