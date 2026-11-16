import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LucideBookOpen } from '@lucide/angular';
import { PageHeaderComponent } from '../../layout/components/page-header/page-header.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';
import { TopicCardComponent } from './components/topic-card/topic-card.component';
import { TopicSearchComponent } from './components/topic-search/topic-search.component';
import { TOPICS, filterTopics } from './topics.data';

/** SCR-10 — Biblioteca educativa, menu "Doenças" (/doencas). RF-18. O modal é a rota filha /doencas/:slug. */
@Component({
  selector: 'bm-education-library-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    PageHeaderComponent,
    ChipComponent,
    DisclaimerComponent,
    TopicCardComponent,
    TopicSearchComponent,
    LucideBookOpen,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-page">
      <bm-page-header
        eyebrow="Aprender"
        title="Informação que acolhe"
        subtitle="Doenças e temas de saúde mental, em linguagem simples."
      />

      <div class="row g-3 align-items-center mb-4">
        <div class="col-md-7 col-lg-6"><bm-topic-search [control]="search" /></div>
        <div class="col-md-auto">
          <bm-chip><svg lucideBookOpen [size]="14"></svg>Aprender não é se diagnosticar</bm-chip>
        </div>
      </div>

      <p class="visually-hidden" aria-live="polite">
        {{ visible().length }} {{ visible().length === 1 ? 'tema encontrado' : 'temas encontrados' }}
      </p>

      @if (visible().length) {
        <div class="row g-4 mb-4">
          @for (t of visible(); track t.slug) {
            <div class="col-md-6 col-lg-4"><bm-topic-card [topic]="t" /></div>
          }
        </div>
      } @else {
        <p class="bm-muted my-5 text-center">Nenhum tema encontrado para “{{ query() }}”. Tente outra palavra.</p>
      }

      <bm-disclaimer>
        Nem todo tema desta lista é uma doença. Burnout é um fenômeno ocupacional. Condições podem coexistir,
        mas não são equivalentes.
      </bm-disclaimer>
    </div>
    <router-outlet />
  `,
})
export class EducationLibraryPageComponent {
  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly query = toSignal(this.search.valueChanges, { initialValue: '' });
  protected readonly visible = computed(() => filterTopics(TOPICS, this.query()));
}
