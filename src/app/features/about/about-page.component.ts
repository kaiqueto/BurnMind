import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideCalendar, LucideInfo, LucidePenLine, LucideShieldCheck } from '@lucide/angular';
import { PageHeaderComponent } from '../../layout/components/page-header/page-header.component';
import { BrandComponent } from '../../shared/components/brand/brand.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';

/** SCR-12 — Sobre · Propósito e privacidade (/sobre). RF-21. */
@Component({
  selector: 'bm-about-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    BrandComponent,
    CardComponent,
    ChipComponent,
    DisclaimerComponent,
    LucidePenLine,
    LucideCalendar,
    LucideInfo,
    LucideShieldCheck,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-page">
      <bm-page-header
        eyebrow="No seu ritmo"
        backLink="/home"
        title="Cuidar começa por entender"
        subtitle="Sobre o BurnoutMind"
      />

      <div class="row g-4">
        <div class="col-lg-6 d-flex flex-column gap-4">
          <bm-card tone="brand-soft">
            <bm-brand class="mb-3" />
            <p class="fs-5 mb-0">
              Um espaço para conhecer o burnout, observar o cotidiano e encontrar possibilidades de
              cuidado. Sem metas de produtividade e sem transformar cansaço em culpa.
            </p>
          </bm-card>

          <section aria-labelledby="privacy-title">
            <h2 id="privacy-title" class="bm-card-title">Privacidade no seu ritmo</h2>
            <p class="bm-muted">
              Compartilhe apenas o que se sentir confortável em registrar. Evite informações de outras
              pessoas e revise o conteúdo antes de exportar ou enviar.
            </p>
            <bm-chip><svg lucideShieldCheck [size]="14"></svg>Você escolhe o que compartilhar</bm-chip>
          </section>
        </div>

        <div class="col-lg-6 d-flex flex-column gap-4">
          <bm-card>
            <h2 class="bm-card-title mb-3">Como funciona o questionário</h2>
            <div class="bm-tip">
              <span class="bm-tip__icon"><svg lucidePenLine [size]="16"></svg></span>
              <div>
                <span class="bm-tip__title">Autorrelato, não avaliação clínica</span>
                <p class="bm-tip__text bm-muted">Você conta como se percebeu nos últimos 14 dias.</p>
              </div>
            </div>
            <div class="bm-tip">
              <span class="bm-tip__icon"><svg lucideCalendar [size]="16"></svg></span>
              <div>
                <span class="bm-tip__title">Frequência e contexto</span>
                <p class="bm-tip__text bm-muted">
                  As perguntas abordam exaustão no trabalho, recuperação e impacto na rotina.
                </p>
              </div>
            </div>
            <div class="bm-tip mb-0">
              <span class="bm-tip__icon"><svg lucideInfo [size]="16"></svg></span>
              <div>
                <span class="bm-tip__title">Limites claros</span>
                <p class="bm-tip__text bm-muted">
                  Não é uma pesquisa clínica nem um instrumento validado. Não gera pontuação clínica.
                </p>
              </div>
            </div>
          </bm-card>

          <bm-card tone="care-soft">
            <h2 class="bm-card-title">Informação, não diagnóstico</h2>
            <p class="mb-0">
              Conteúdos, perfis e chat apoiam a reflexão. Não substituem diagnóstico, tratamento ou
              acompanhamento profissional. Procure um serviço de saúde quando precisar.
            </p>
          </bm-card>
        </div>
      </div>

      <bm-disclaimer class="mt-4">
        Seus registros ficam salvos apenas neste navegador. Não há cálculo clínico: o conteúdo é
        educativo.
      </bm-disclaimer>
    </div>
  `,
})
export class AboutPageComponent {}
