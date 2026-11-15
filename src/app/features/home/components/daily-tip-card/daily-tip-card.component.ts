import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideLeaf } from '@lucide/angular';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { DailyTip } from '../../../../shared/models/burnoutmind.models';

/** Card "dica do dia" (tom care-soft). */
@Component({
  selector: 'bm-daily-tip-card',
  standalone: true,
  imports: [CardComponent, LucideLeaf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bm-card tone="care-soft">
      <p class="bm-eyebrow bm-eyebrow--care"><svg lucideLeaf [size]="14"></svg>Dica de cuidado</p>
      <h2 class="bm-card-title mt-2">{{ tip().title }}</h2>
      <p class="mb-2">{{ tip().text }}</p>
      <p class="small mb-0">{{ tip().footnote }}</p>
    </bm-card>
  `,
})
export class DailyTipCardComponent {
  readonly tip = input.required<DailyTip>();
}
