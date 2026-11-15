import { ChangeDetectionStrategy, Component } from '@angular/core';

/** [PLACEHOLDER] Ilustração simplificada. Trocar pelo SVG exportado do Figma. */
@Component({
  selector: 'bm-welcome-illustration',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
  template: `
    <svg viewBox="0 0 400 340" class="w-100 h-auto" role="img" aria-label="Ilustração de uma pessoa sentada, em um momento de pausa">
      <rect width="400" height="340" rx="28" fill="#FCE8DF" />
      <circle cx="305" cy="78" r="30" fill="#F26035" />
      <ellipse cx="200" cy="305" rx="190" ry="26" fill="#F8D9CB" />
      <path d="M62 300V150M62 195c-22-6-30-24-28-40 20 4 32 20 28 40ZM62 165c22-6 30-24 28-40-20 4-32 20-28 40Z" stroke="#3E5847" stroke-width="2" fill="none" stroke-linecap="round" />
      <path d="M150 295c0-62 20-104 62-110 40 5 62 42 64 110Z" fill="#3E5847" />
      <path d="M176 238c22 20 62 24 96 8l16 22c-42 22-90 16-118-12Z" fill="#EEB195" />
      <path d="M226 300c10-22 40-32 92-22l16 22Z" fill="#D9B99B" />
      <circle cx="206" cy="128" r="27" fill="#EEB195" />
      <path d="M178 124c0-27 18-40 42-35 14 3 19 15 14 31-12-15-32-15-56 4Z" fill="#1B2228" />
    </svg>
  `,
})
export class WelcomeIllustrationComponent {}
