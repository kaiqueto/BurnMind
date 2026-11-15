import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideCheck } from '@lucide/angular';

/** Lista vertical de etapas (concluída / atual / futura). */
@Component({
  selector: 'bm-stepper',
  standalone: true,
  imports: [LucideCheck],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="bm-stepper" aria-label="Etapas do questionário">
      @for (item of items(); track item; let i = $index) {
        <li
          class="bm-stepper__item"
          [class.bm-stepper__item--current]="i === current()"
          [class.bm-stepper__item--done]="i < current()"
          [attr.aria-current]="i === current() ? 'step' : null"
        >
          <span class="bm-stepper__marker">
            @if (i < current()) {
              <svg lucideCheck [size]="14"></svg>
            } @else {
              {{ i + 1 }}
            }
          </span>
          <span>{{ item }}</span>
        </li>
      }
    </ol>
  `,
})
export class StepperComponent {
  readonly items = input.required<readonly string[]>();
  /** Índice (0-based) da etapa atual. */
  readonly current = input.required<number>();
}
