import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCalendarDays, LucideInfo, LucideUsers } from '@lucide/angular';

/** Atalhos de cuidado da Home. */
@Component({
  selector: 'bm-care-shortcuts',
  standalone: true,
  imports: [RouterLink, LucideCalendarDays, LucideUsers, LucideInfo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="shortcuts-title">
      <h2 id="shortcuts-title" class="bm-section-title">Atalhos de cuidado</h2>
      <div class="row g-3">
        <div class="col-6 col-md-4">
          <a class="bm-tile" routerLink="/calendario">
            <svg lucideCalendarDays class="bm-icon-strong" [size]="22"></svg>Calendário
          </a>
        </div>
        <div class="col-6 col-md-4">
          <a class="bm-tile" routerLink="/perfis">
            <svg lucideUsers class="bm-icon-strong" [size]="22"></svg>Perfis
          </a>
        </div>
        <div class="col-6 col-md-4">
          <a class="bm-tile" routerLink="/sobre">
            <svg lucideInfo class="bm-icon-strong" [size]="22"></svg>Sobre
          </a>
        </div>
      </div>
    </section>
  `,
})
export class CareShortcutsComponent {}
