import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Barra de progresso segmentada (uma parte por etapa). */
@Component({
  selector: 'bm-step-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block', role: 'progressbar', '[attr.aria-valuemin]': '1', '[attr.aria-valuemax]': 'total()', '[attr.aria-valuenow]': 'current()', '[attr.aria-label]': '"Progresso do questionário"' },
  template: `
    <div class="bm-step-progress">
      @for (s of segments(); track s) {
        <span class="bm-step-progress__segment" [class.bm-step-progress__segment--filled]="s <= current()"></span>
      }
    </div>
  `,
})
export class StepProgressComponent {
  readonly total = input.required<number>();
  /** Etapa atual (1-based). */
  readonly current = input.required<number>();
  protected readonly segments = computed(() => Array.from({ length: this.total() }, (_, i) => i + 1));
}
