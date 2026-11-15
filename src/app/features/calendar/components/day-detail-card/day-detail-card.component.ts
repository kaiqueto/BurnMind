import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideBatteryLow, LucideSmile } from '@lucide/angular';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ChipComponent } from '../../../../shared/components/chip/chip.component';
import { DailyCheckIn, ENERGY_LABEL, MOOD_LABEL } from '../../../../shared/models/burnoutmind.models';

/** Detalhe do dia selecionado (humor, energia e nota). */
@Component({
  selector: 'bm-day-detail-card',
  standalone: true,
  imports: [RouterLink, CardComponent, ChipComponent, LucideSmile, LucideBatteryLow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bm-card tone="brand-soft">
      <h2 class="bm-card-title">{{ title() }}{{ isToday() ? ' • Hoje' : '' }}</h2>
      @if (checkIn(); as c) {
        <div class="d-flex flex-wrap gap-3 mb-2">
          <bm-chip variant="plain"><svg lucideSmile [size]="14"></svg>{{ mood[c.mood] }}</bm-chip>
          <bm-chip variant="plain"><svg lucideBatteryLow [size]="14"></svg>Energia {{ energy[c.energy].toLowerCase() }}</bm-chip>
        </div>
        @if (c.note) {
          <blockquote class="mb-0 fst-italic">“{{ c.note }}”</blockquote>
        }
      } @else {
        <p class="bm-muted mb-0">
          Sem registro neste dia.
          @if (isToday()) {
            <a routerLink="/check-in" class="fw-bold">Fazer o check-in de hoje</a>
          }
        </p>
      }
    </bm-card>
  `,
})
export class DayDetailCardComponent {
  readonly title = input.required<string>();
  readonly isToday = input(false);
  readonly checkIn = input<DailyCheckIn | null>(null);
  protected readonly mood = MOOD_LABEL;
  protected readonly energy = ENERGY_LABEL;
}
