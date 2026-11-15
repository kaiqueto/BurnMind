import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type CardTone = 'default' | 'brand-soft' | 'care-soft' | 'footer';

/** Cartão base. A aparência vem das classes `.bm-card--*` (styles/_components.scss). */
@Component({
  selector: 'bm-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bm-card',
    '[class.bm-card--brand-soft]': 'tone() === "brand-soft"',
    '[class.bm-card--care-soft]': 'tone() === "care-soft"',
    '[class.bm-card--footer]': 'tone() === "footer"',
  },
  template: `<ng-content />`,
})
export class CardComponent {
  readonly tone = input<CardTone>('default');
}
