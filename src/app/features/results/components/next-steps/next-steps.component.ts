import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideCoffee, LucideHeartHandshake, LucideMessagesSquare } from '@lucide/angular';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { NextStep } from '../../../../shared/models/burnoutmind.models';

/** Card "Pequenos próximos passos". */
@Component({
  selector: 'bm-next-steps',
  standalone: true,
  imports: [CardComponent, LucideCoffee, LucideMessagesSquare, LucideHeartHandshake],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bm-card>
      <h2 class="bm-card-title mb-3">Pequenos próximos passos</h2>
      @for (step of steps(); track step.title) {
        <div class="bm-tip" [class.mb-0]="$last">
          <span class="bm-tip__icon">
            @switch (step.icon) {
              @case ('break') { <svg lucideCoffee [size]="16"></svg> }
              @case ('talk') { <svg lucideMessagesSquare [size]="16"></svg> }
              @case ('support') { <svg lucideHeartHandshake [size]="16"></svg> }
            }
          </span>
          <div>
            <span class="bm-tip__title">{{ step.title }}</span>
            <p class="bm-tip__text bm-muted">{{ step.text }}</p>
          </div>
        </div>
      }
    </bm-card>
  `,
})
export class NextStepsComponent {
  readonly steps = input.required<readonly NextStep[]>();
}
