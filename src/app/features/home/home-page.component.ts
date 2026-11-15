import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight, LucideClipboardList, LucidePenLine } from '@lucide/angular';
import { UserService } from '../../core/services/user.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';
import { DailyTip } from '../../shared/models/burnoutmind.models';
import { formatLongDate } from '../../shared/utils/date';
import { CheckInService } from '../check-in/services/check-in.service';
import { FIRST_STEP_URL } from '../questionnaire/questions';
import { CareShortcutsComponent } from './components/care-shortcuts/care-shortcuts.component';
import { DailyTipCardComponent } from './components/daily-tip-card/daily-tip-card.component';

/** [SUGESTÃO] Dicas curtas e não prescritivas; revisar com a equipe de conteúdo (RN-08). */
export const DAILY_TIPS: readonly DailyTip[] = [
  { title: 'Uma pausa possível', text: 'Experimente 2 minutos longe da tela, sem cobrança.', footnote: 'Pequenas pausas também contam.' },
  { title: 'Água e respiração', text: 'Beba um copo de água e respire fundo três vezes.', footnote: 'Faça no seu ritmo.' },
  { title: 'Fechar o dia', text: 'Escolha um horário possível para encerrar o trabalho hoje.', footnote: 'Avalie o que é viável no seu contexto.' },
  { title: 'Apoio por perto', text: 'Pense em alguém com quem você pode conversar sobre seu dia.', footnote: 'Você escolhe o que compartilhar.' },
];

/** Dica determinística por dia (muda a cada dia, igual para todos os acessos do mesmo dia). */
export function tipForDate(date: Date): DailyTip {
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return DAILY_TIPS[dayNumber % DAILY_TIPS.length];
}

/** SCR-02 — Home (/home). */
@Component({
  selector: 'bm-home-page',
  standalone: true,
  imports: [
    RouterLink,
    CardComponent,
    DisclaimerComponent,
    DailyTipCardComponent,
    CareShortcutsComponent,
    LucideArrowRight,
    LucideClipboardList,
    LucidePenLine,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-page">
      <header class="bm-page__header">
        <p class="bm-eyebrow">{{ today }}</p>
        <h1 class="bm-page-title">Olá, {{ name() }}.</h1>
        <p class="bm-page-subtitle">Como você está hoje? Vá no seu ritmo.</p>
      </header>

      <div class="row g-4 mb-4">
        <div class="col-lg-6">
          <bm-card tone="brand-soft" class="h-100">
            <h2 class="bm-card-title">{{ checkedInToday() ? 'Check-in de hoje feito' : 'Um minuto para você' }}</h2>
            <p class="bm-muted">
              {{ checkedInToday() ? 'Você pode revisar ou editar o registro quando quiser.' : 'Registre seu humor e sua energia de hoje.' }}
            </p>
            <a class="btn btn-primary" routerLink="/check-in">
              <svg lucidePenLine [size]="18"></svg>{{ checkedInToday() ? 'Editar check-in' : 'Fazer check-in' }}
            </a>
          </bm-card>
        </div>
        <div class="col-lg-6">
          <bm-card class="h-100">
            <h2 class="bm-card-title">Seu momento de cuidado</h2>
            <p class="bm-muted">3 perguntas educativas sobre os últimos 14 dias.</p>
            <a class="btn btn-primary" [routerLink]="firstStep">
              <svg lucideClipboardList [size]="18"></svg>Responder questionário
              <svg lucideArrowRight [size]="18"></svg>
            </a>
          </bm-card>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-lg-6"><bm-daily-tip-card [tip]="tip" /></div>
        <div class="col-lg-6"><bm-care-shortcuts /></div>
      </div>

      <bm-disclaimer>Conteúdo educativo, sem diagnóstico. Não substitui avaliação profissional.</bm-disclaimer>
    </div>
  `,
})
export class HomePageComponent {
  private readonly user = inject(UserService);
  private readonly checkIns = inject(CheckInService);
  private readonly now = new Date();

  protected readonly today = formatLongDate(this.now);
  protected readonly tip = tipForDate(this.now);
  protected readonly firstStep = FIRST_STEP_URL;
  protected readonly name = computed(() => this.user.user().name);
  protected readonly checkedInToday = computed(() => this.checkIns.today() !== null);
}
