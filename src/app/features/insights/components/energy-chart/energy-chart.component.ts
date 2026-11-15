import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ENERGY_LABEL, EnergyLevel, EnergyPoint } from '../../../../shared/models/burnoutmind.models';
import { parseIsoDate } from '../../../../shared/utils/date';

const W = 520;
const H = 210;
const PAD = { left: 56, right: 16, top: 16, bottom: 40 };
const LEVEL_ORDER: readonly EnergyLevel[] = ['high', 'medium', 'low']; // de cima para baixo

/** Gráfico de linha da energia nos 7 dias. Dias sem registro quebram a linha (lacuna). */
@Component({
  selector: 'bm-energy-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="'0 0 ' + w + ' ' + h" class="bm-chart" role="img" [attr.aria-label]="ariaLabel()">
      @for (g of grid(); track g.level) {
        <line [attr.x1]="pad.left" [attr.x2]="w - pad.right" [attr.y1]="g.y" [attr.y2]="g.y" class="bm-chart__grid" />
        <text [attr.x]="pad.left - 10" [attr.y]="g.y + 4" text-anchor="end" class="bm-chart__label">{{ g.label }}</text>
      }
      @for (path of paths(); track path) {
        <path [attr.d]="path" class="bm-chart__line" fill="none" />
      }
      @for (d of dots(); track d.date) {
        @if (d.y !== null) {
          <circle [attr.cx]="d.x" [attr.cy]="d.y" r="5" class="bm-chart__dot" />
        } @else {
          <text [attr.x]="d.x" [attr.y]="h - 8" text-anchor="middle" class="bm-chart__label">—</text>
        }
        <text [attr.x]="d.x" [attr.y]="h - 24" text-anchor="middle" class="bm-chart__label bm-chart__label--day">{{ d.day }}</text>
      }
    </svg>
    <table class="visually-hidden">
      <caption>Energia por dia</caption>
      <thead><tr><th scope="col">Dia</th><th scope="col">Energia</th></tr></thead>
      <tbody>
        @for (d of dots(); track d.date) {
          <tr><td>{{ d.day }}</td><td>{{ d.text }}</td></tr>
        }
      </tbody>
    </table>
  `,
})
export class EnergyChartComponent {
  readonly points = input.required<readonly EnergyPoint[]>();

  protected readonly w = W;
  protected readonly h = H;
  protected readonly pad = PAD;

  protected readonly grid = computed(() =>
    LEVEL_ORDER.map((level, i) => ({
      level,
      label: ENERGY_LABEL[level],
      y: PAD.top + (i * (H - PAD.top - PAD.bottom)) / (LEVEL_ORDER.length - 1),
    })),
  );

  protected readonly dots = computed(() => {
    const pts = this.points();
    const step = (W - PAD.left - PAD.right) / Math.max(pts.length - 1, 1);
    return pts.map((p, i) => ({
      date: p.date,
      day: parseIsoDate(p.date).getDate(),
      x: PAD.left + i * step,
      y: p.energy ? this.grid().find((g) => g.level === p.energy)!.y : null,
      text: p.energy ? ENERGY_LABEL[p.energy] : 'Sem registro',
    }));
  });

  /** Segmentos contínuos de dias consecutivos com registro. */
  protected readonly paths = computed(() => {
    const segments: string[] = [];
    let current: string[] = [];
    for (const d of this.dots()) {
      if (d.y === null) {
        if (current.length > 1) segments.push(current.join(' '));
        current = [];
      } else {
        current.push(`${current.length ? 'L' : 'M'}${d.x} ${d.y}`);
      }
    }
    if (current.length > 1) segments.push(current.join(' '));
    return segments;
  });

  protected readonly ariaLabel = computed(
    () => 'Gráfico de linha da energia por dia: ' + this.dots().map((d) => `${d.day}, ${d.text.toLowerCase()}`).join('; '),
  );
}
