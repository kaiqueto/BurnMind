import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideChevronRight } from '@lucide/angular';

/** Cartão-link com ícone projetado (`<svg icon …>`), título e subtítulo. */
@Component({
  selector: 'bm-link-card',
  standalone: true,
  imports: [RouterLink, LucideChevronRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
  template: `
    <a class="bm-link-card" [class.bm-link-card--brand-soft]="tone() === 'brand-soft'" [routerLink]="link()">
      <ng-content select="[icon]" />
      <span class="bm-link-card__body">
        <span class="bm-link-card__title">{{ title() }}</span>
        @if (subtitle(); as s) {
          <span class="bm-link-card__subtitle">{{ s }}</span>
        }
      </span>
      <svg class="bm-link-card__chevron" lucideChevronRight [size]="20" aria-hidden="true"></svg>
    </a>
  `,
})
export class LinkCardComponent {
  readonly link = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly tone = input<'default' | 'brand-soft'>('default');
}
