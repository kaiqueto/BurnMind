import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideLeaf } from '@lucide/angular';

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Anel de nível de atenção. É uma representação visual, não uma escala clínica. */
@Component({
  selector: 'bm-attention-ring',
  standalone: true,
  imports: [LucideLeaf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bm-ring' },
  template: `
    <svg viewBox="0 0 200 200" role="img" [attr.aria-label]="label() + ' (representação visual)'">
      <circle class="bm-ring__track" cx="100" cy="100" [attr.r]="radius" fill="none" stroke-width="14" />
      <circle
        class="bm-ring__value"
        cx="100"
        cy="100"
        [attr.r]="radius"
        fill="none"
        stroke-width="14"
        stroke-linecap="round"
        [attr.stroke-dasharray]="dash()"
        transform="rotate(-90 100 100)"
      />
    </svg>
    <div class="bm-ring__label" aria-hidden="true">
      <svg lucideLeaf class="bm-icon-strong" [size]="20"></svg>
      <span>{{ label() }}</span>
    </div>
  `,
})
export class AttentionRingComponent {
  readonly label = input.required<string>();
  /** Preenchimento visual de 0 a 1. */
  readonly progress = input.required<number>();

  protected readonly radius = RADIUS;
  protected readonly dash = computed(() => {
    const filled = Math.max(0, Math.min(1, this.progress())) * CIRCUMFERENCE;
    return `${filled} ${CIRCUMFERENCE}`;
  });
}
