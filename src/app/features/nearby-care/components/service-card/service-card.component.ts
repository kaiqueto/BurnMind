import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideExternalLink } from '@lucide/angular';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CareService } from '../../../../shared/models/burnoutmind.models';
import { mapsSearchUrl } from '../../care-services.data';

/** Tipo de serviço (UBS/CAPS) com link de busca no mapa. */
@Component({
  selector: 'bm-service-card',
  standalone: true,
  imports: [CardComponent, LucideExternalLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block h-100' },
  template: `
    <bm-card class="h-100">
      <div class="d-flex flex-column h-100 gap-2">
        <span class="bm-chip align-self-start">{{ service().kind }}</span>
        <h2 class="bm-card-title">{{ service().name }}</h2>
        <p class="bm-muted flex-grow-1">{{ service().description }}</p>
        <a class="btn btn-outline-secondary" [href]="url()" target="_blank" rel="noopener noreferrer">
          <svg lucideExternalLink [size]="16"></svg>Buscar {{ service().kind }} no mapa
          <span class="visually-hidden">(abre em nova aba)</span>
        </a>
      </div>
    </bm-card>
  `,
})
export class ServiceCardComponent {
  readonly service = input.required<CareService>();
  readonly region = input('');
  protected readonly url = computed(() => mapsSearchUrl(this.service().kind, this.region()));
}
