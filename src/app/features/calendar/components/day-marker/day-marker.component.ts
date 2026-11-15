import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideFrown, LucideLaugh, LucideMeh, LucideSmile } from '@lucide/angular';
import { DailyCheckIn, ENERGY_ABBR } from '../../../../shared/models/burnoutmind.models';

/** Marcador de um dia: ícone de humor + letra da energia (B/M/A). Informação nunca só por cor. */
@Component({
  selector: 'bm-day-marker',
  standalone: true,
  imports: [LucideFrown, LucideMeh, LucideSmile, LucideLaugh],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bm-day-marker', 'aria-hidden': 'true' },
  template: `
    @switch (checkIn().mood) {
      @case ('hard') { <svg lucideFrown [size]="14"></svg> }
      @case ('tired') { <svg lucideMeh [size]="14"></svg> }
      @case ('good') { <svg lucideSmile [size]="14"></svg> }
      @case ('great') { <svg lucideLaugh [size]="14"></svg> }
    }
    <span>{{ abbr[checkIn().energy] }}</span>
  `,
})
export class DayMarkerComponent {
  readonly checkIn = input.required<DailyCheckIn>();
  protected readonly abbr = ENERGY_ABBR;
}
