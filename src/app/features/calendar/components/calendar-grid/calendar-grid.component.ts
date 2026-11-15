import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ENERGY_LABEL, MOOD_LABEL } from '../../../../shared/models/burnoutmind.models';
import { formatDayMonth, parseIsoDate } from '../../../../shared/utils/date';
import { CalendarCell, WEEKDAYS } from '../../calendar-grid';
import { DayMarkerComponent } from '../day-marker/day-marker.component';

/** Grade mensal acessível: tabela com um botão por dia. */
@Component({
  selector: 'bm-calendar-grid',
  standalone: true,
  imports: [DayMarkerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="bm-calendar">
      <caption class="visually-hidden">{{ caption() }}</caption>
      <thead>
        <tr>
          @for (d of weekdays; track d) {
            <th scope="col">{{ d }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (week of weeks(); track $index) {
          <tr>
            @for (cell of week; track cell.iso) {
              <td>
                @if (cell.inMonth) {
                  <button
                    type="button"
                    class="bm-calendar__day"
                    [class.bm-calendar__day--selected]="cell.iso === selected()"
                    [disabled]="cell.isFuture"
                    [attr.aria-pressed]="cell.iso === selected()"
                    [attr.aria-current]="cell.isToday ? 'date' : null"
                    [attr.aria-label]="label(cell)"
                    (click)="picked.emit(cell.iso)"
                  >
                    <span class="bm-calendar__num">{{ cell.day }}</span>
                    @if (cell.checkIn; as c) {
                      <bm-day-marker [checkIn]="c" />
                    }
                  </button>
                }
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class CalendarGridComponent {
  readonly weeks = input.required<readonly (readonly CalendarCell[])[]>();
  readonly selected = input<string | null>(null);
  readonly caption = input('Calendário de registros');
  readonly picked = output<string>();
  protected readonly weekdays = WEEKDAYS;

  protected label(cell: CalendarCell): string {
    const base = formatDayMonth(parseIsoDate(cell.iso));
    if (!cell.checkIn) return `${base}${cell.isToday ? ', hoje' : ''}, sem registro`;
    const { mood, energy } = cell.checkIn;
    return `${base}${cell.isToday ? ', hoje' : ''}, humor ${MOOD_LABEL[mood].toLowerCase()}, energia ${ENERGY_LABEL[energy].toLowerCase()}`;
  }
}
