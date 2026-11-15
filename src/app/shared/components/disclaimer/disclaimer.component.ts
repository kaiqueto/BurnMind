import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideShieldCheck } from '@lucide/angular';

/** Aviso de limite educativo (não diagnóstico). */
@Component({
  selector: 'bm-disclaimer',
  standalone: true,
  imports: [LucideShieldCheck],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
  template: `
    <p class="bm-disclaimer">
      <svg lucideShieldCheck [size]="16" aria-hidden="true"></svg>
      <span><ng-content /></span>
    </p>
  `,
})
export class DisclaimerComponent {}
