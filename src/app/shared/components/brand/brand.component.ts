import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logo + wordmark. [PLACEHOLDER] trocar o SVG pelo exportado do Figma (src/assets/logo.svg). */
@Component({
  selector: 'bm-brand',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bm-brand' },
  template: `
    <svg class="bm-brand__logo" viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 3C11 3 5 9.5 5 18c0 4 1.5 6.5 3 9v8h14v-6c6-1 13-5 13-14C35 8 29 3 20 3Z" fill="#1B2228" />
      <circle cx="19" cy="17" r="7" fill="#F26035" />
    </svg>
    <span class="bm-brand__text">
      <span class="bm-brand__name">Burnout<span class="bm-brand__accent">Mind</span></span>
      @if (showTagline()) {
        <span class="bm-brand__tagline">Informação • Prevenção • Bem-estar</span>
      }
    </span>
  `,
})
export class BrandComponent {
  readonly showTagline = input(true);
}
