import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight, LucideSparkles } from '@lucide/angular';
import { PageHeaderComponent } from '../../layout/components/page-header/page-header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';
import { LinkCardComponent } from '../../shared/components/link-card/link-card.component';
import { addDays, formatDayMonth, parseIsoDate, toIsoDate } from '../../shared/utils/date';
import { CheckInService } from '../check-in/services/check-in.service';
import { buildWeeklyInsight, describeWeekCard } from '../insights/weekly-insight';
import { CalendarGridComponent } from './components/calendar-grid/calendar-grid.component';
import { DayDetailCardComponent } from './components/day-detail-card/day-detail-card.component';
import { buildMonthGrid, monthTitle } from './calendar-grid';

/** SCR-04 — Calendário (/calendario). RF-07, RF-08. */
@Component({
  selector: 'bm-calendar-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CardComponent,
    DisclaimerComponent,
    LinkCardComponent,
    CalendarGridComponent,
    DayDetailCardComponent,
    LucideChevronLeft,
    LucideChevronRight,
    LucideSparkles,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-page">
      <bm-page-header
        eyebrow="No seu ritmo"
        backLink="/home"
        title="Seu cuidado, dia a dia"
        subtitle="Registros para observar, não para se cobrar."
      />

      <div class="row g-4">
        <div class="col-lg-7">
          <bm-card>
            <div class="d-flex align-items-center justify-content-between mb-3">
              <button type="button" class="btn btn-link p-1" aria-label="Mês anterior" (click)="shift(-1)">
                <svg lucideChevronLeft [size]="20"></svg>
              </button>
              <h2 class="bm-card-title mb-0" aria-live="polite">{{ title() }}</h2>
              <button type="button" class="btn btn-link p-1" aria-label="Próximo mês" [disabled]="!canGoNext()" (click)="shift(1)">
                <svg lucideChevronRight [size]="20"></svg>
              </button>
            </div>

            <bm-calendar-grid [weeks]="grid()" [selected]="selected()" [caption]="'Calendário de ' + title()" (picked)="selected.set($event)" />

            <p class="small bm-muted mt-3 mb-1">Energia: B = baixa · M = média · A = alta</p>
            <p class="small bm-muted mb-0">Vazio = sem registro</p>
          </bm-card>
        </div>

        <div class="col-lg-5 d-flex flex-column gap-3">
          <bm-day-detail-card
            [title]="selectedTitle()"
            [isToday]="selected() === todayIso"
            [checkIn]="selectedCheckIn()"
          />

          <bm-card tone="care-soft">
            <h2 class="bm-card-title">{{ week().title }}</h2>
            <p class="mb-0">{{ week().text }}</p>
          </bm-card>

          <bm-link-card
            link="/calendario/insights"
            title="Explorar insights personalizados"
            subtitle="Um olhar gentil para esses registros"
          >
            <svg icon lucideSparkles class="bm-icon-strong" [size]="22"></svg>
          </bm-link-card>

          <bm-disclaimer>Esses padrões são descritivos e não indicam um diagnóstico.</bm-disclaimer>
        </div>
      </div>
    </div>
  `,
})
export class CalendarPageComponent {
  private readonly checkIns = inject(CheckInService);
  private readonly now = new Date();
  protected readonly todayIso = toIsoDate(this.now);

  protected readonly view = signal({ year: this.now.getFullYear(), month: this.now.getMonth() });
  protected readonly selected = signal(this.todayIso);

  protected readonly title = computed(() => monthTitle(this.view().year, this.view().month));
  protected readonly grid = computed(() =>
    buildMonthGrid(this.view().year, this.view().month, this.checkIns.checkIns(), this.now),
  );
  protected readonly canGoNext = computed(
    () => this.view().year * 12 + this.view().month < this.now.getFullYear() * 12 + this.now.getMonth(),
  );

  protected readonly selectedCheckIn = computed(() => this.checkIns.checkIns().find((c) => c.date === this.selected()) ?? null);
  protected readonly selectedTitle = computed(() => formatDayMonth(parseIsoDate(this.selected())));

  protected readonly week = computed(() => {
    const insight = buildWeeklyInsight(this.checkIns.checkIns(), this.now);
    return describeWeekCard(insight, addDays(this.now, -6), this.now);
  });

  protected shift(delta: -1 | 1): void {
    const { year, month } = this.view();
    const next = new Date(year, month + delta, 1);
    this.view.set({ year: next.getFullYear(), month: next.getMonth() });
    const isCurrent = next.getFullYear() === this.now.getFullYear() && next.getMonth() === this.now.getMonth();
    this.selected.set(isCurrent ? this.todayIso : toIsoDate(next));
  }
}
