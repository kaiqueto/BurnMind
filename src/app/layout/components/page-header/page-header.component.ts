import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft } from '@lucide/angular';

/** Cabeçalho de página: voltar (opcional), eyebrow, título e subtítulo. */
@Component({
  selector: 'bm-page-header',
  standalone: true,
  imports: [RouterLink, LucideArrowLeft],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bm-page__header d-block' },
  template: `
    @if (backLink(); as back) {
      <a class="bm-eyebrow mb-2" [routerLink]="back"><svg lucideArrowLeft [size]="14"></svg>Voltar</a>
    }
    @if (eyebrow(); as e) {
      <p class="bm-eyebrow d-block">{{ e }}</p>
    }
    <h1 class="bm-page-title">{{ title() }}</h1>
    @if (subtitle(); as s) {
      <p class="bm-page-subtitle">{{ s }}</p>
    }
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input<string>();
  readonly subtitle = input<string>();
  readonly backLink = input<string>();
}
