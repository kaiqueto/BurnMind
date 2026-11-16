import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageHeaderComponent } from '../../layout/components/page-header/page-header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';
import { CARE_SERVICES } from './care-services.data';
import { RegionPickerComponent } from './components/region-picker/region-picker.component';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { RegionService } from './services/region.service';

/**
 * SCR-08 — Assistência próxima (/resultados/assistencia-proxima). RF-16, RN-07.
 * [PENDENTE] Sem fonte oficial de dados de serviços, a tela descreve os TIPOS (UBS, CAPS) e abre uma busca no
 * mapa. O mapa esquemático com marcadores fictícios do wireframe não foi reproduzido, para não indicar locais falsos.
 */
@Component({
  selector: 'bm-nearby-care-page',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, DisclaimerComponent, RegionPickerComponent, ServiceCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-page">
      <bm-page-header
        eyebrow="No seu ritmo"
        backLink="/resultados"
        title="Apoio também é cuidado"
        subtitle="Conheça caminhos de acolhimento na rede de saúde."
      />

      <bm-region-picker [region]="regionService.region()" (saved)="regionService.set($event)" />
      <p class="small bm-muted mt-2 mb-4">
        Você pode informar uma região para buscar opções. O BurnoutMind não acessa a sua localização: o botão
        abre o Google Maps em outra aba, e a busca acontece lá.
      </p>

      <div class="row g-4 mb-4">
        @for (s of services; track s.id) {
          <div class="col-md-6"><bm-service-card [service]="s" [region]="regionService.region()" /></div>
        }
      </div>

      <bm-card tone="brand-soft" class="mb-4">
        <h2 class="bm-card-title">Em situação de risco imediato</h2>
        <p class="mb-2">
          Ligue para o <strong>SAMU: 192</strong> ou procure o pronto-atendimento mais próximo. Para conversar
          agora, o <strong>CVV atende pelo 188</strong>, gratuito e 24 horas.
        </p>
        <p class="mb-0 small">Para informações sobre serviços do SUS: Disque Saúde 136.</p>
      </bm-card>

      <bm-disclaimer>
        Os cartões descrevem tipos de serviço e não indicam um local específico. Antes de ir, confirme a
        existência, o acesso e o funcionamento pelos canais oficiais da rede municipal ou do SUS.
      </bm-disclaimer>
    </div>
  `,
})
export class NearbyCarePageComponent {
  protected readonly regionService = inject(RegionService);
  protected readonly services = CARE_SERVICES;
}
