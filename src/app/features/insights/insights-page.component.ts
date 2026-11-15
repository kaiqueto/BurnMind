import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCalendarDays, LucideClock, LucidePenLine } from '@lucide/angular';
import { PageHeaderComponent } from '../../layout/components/page-header/page-header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';
import { LinkCardComponent } from '../../shared/components/link-card/link-card.component';
import { formatRange, formatDayMonth, parseIsoDate } from '../../shared/utils/date';
import { CheckInService } from '../check-in/services/check-in.service';
import { EnergyChartComponent } from './components/energy-chart/energy-chart.component';
import { MIN_RECORDS_FOR_PATTERN, WEEK_DAYS, buildWeeklyInsight } from './weekly-insight';

/** SCR-05 — Insights · Seu ritmo na semana (/calendario/insights). RF-09. */
@Component({
  selector: 'bm-insights-page',
  standalone: true,
  imports: [
    RouterLink,
    PageHeaderComponent,
    CardComponent,
    DisclaimerComponent,
    LinkCardComponent,
    EnergyChartComponent,
    LucideCalendarDays,
    LucideClock,
    LucidePenLine,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-page">
      <bm-page-header
        eyebrow="No seu ritmo"
        backLink="/calendario"
        title="Um olhar gentil para sua semana"
        [subtitle]="'Insights • ' + rangeText()"
      />

      <div class="row g-4">
        <div class="col-lg-7 d-flex flex-column gap-3">
          <bm-card>
            <h2 class="bm-card-title">Sua energia ao longo dos dias</h2>
            <p class="small bm-muted">
              {{ insight().recordedDays }} {{ insight().recordedDays === 1 ? 'registro' : 'registros' }} em
              {{ weekDays }} dias • sem meta de frequência
            </p>
            <bm-energy-chart [points]="insight().points" />
            @if (missing().length) {
              <p class="small bm-muted mt-2 mb-0">Sem registro em {{ missing().join(', ') }}.</p>
            }
          </bm-card>
          <bm-link-card link="/calendario" title="Voltar ao calendário" subtitle="Veja cada dia com mais contexto">
            <svg icon lucideCalendarDays class="bm-icon-strong" [size]="22"></svg>
          </bm-link-card>
        </div>

        <div class="col-lg-5 d-flex flex-column gap-3">
          <bm-card tone="brand-soft">
            <h2 class="bm-card-title">{{ insight().headline }}</h2>
            <p class="mb-0">{{ insight().summary }}</p>
            @if (insight().recordedDays === 0) {
              <a class="btn btn-primary mt-3" routerLink="/check-in">Fazer check-in</a>
            }
          </bm-card>

          <section aria-labelledby="try-title">
            <h2 id="try-title" class="bm-section-title mb-3">Experimente, se fizer sentido</h2>
            @for (s of insight().suggestions; track s.title; let i = $index) {
              <div class="bm-tip">
                <span class="bm-tip__icon">
                  @if (i === 0) { <svg lucideClock [size]="16"></svg> } @else { <svg lucidePenLine [size]="16"></svg> }
                </span>
                <div>
                  <span class="bm-tip__title">{{ s.title }}</span>
                  <p class="bm-tip__text bm-muted">{{ s.text }}</p>
                </div>
              </div>
            }
          </section>

          <bm-disclaimer>
            Tendências descritivas, não diagnósticas. Poucos registros (menos de {{ minRecords }}) não permitem
            conclusões sobre sua saúde.
          </bm-disclaimer>
        </div>
      </div>
    </div>
  `,
})
export class InsightsPageComponent {
  private readonly checkIns = inject(CheckInService);
  protected readonly weekDays = WEEK_DAYS;
  protected readonly minRecords = MIN_RECORDS_FOR_PATTERN;

  protected readonly insight = computed(() => buildWeeklyInsight(this.checkIns.checkIns()));
  protected readonly rangeText = computed(() =>
    formatRange(parseIsoDate(this.insight().range.start), parseIsoDate(this.insight().range.end)),
  );
  protected readonly missing = computed(() =>
    this.insight()
      .points.filter((p) => !p.energy)
      .map((p) => formatDayMonth(parseIsoDate(p.date))),
  );
}
