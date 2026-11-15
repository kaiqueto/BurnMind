import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ChipVariant = 'default' | 'outline' | 'plain';

@Component({
  selector: 'bm-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bm-chip',
    '[class.bm-chip--outline]': 'variant() === "outline"',
    '[class.bm-chip--plain]': 'variant() === "plain"',
  },
  template: `<ng-content />`,
})
export class ChipComponent {
  readonly variant = input<ChipVariant>('default');
}
