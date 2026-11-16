import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { LucideBot } from '@lucide/angular';
import { PageHeaderComponent } from '../../layout/components/page-header/page-header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';
import { ChatBubbleComponent } from './components/chat-bubble/chat-bubble.component';
import { ChatComposerComponent } from './components/chat-composer/chat-composer.component';
import { SuggestionChipComponent } from './components/suggestion-chip/suggestion-chip.component';
import { ChatService } from './services/chat.service';

export const SUGGESTIONS = ['Como descansar sem culpa?', 'O que posso tentar hoje?', 'Quando buscar apoio?'] as const;

/** SCR-11 — Chat (/chat). RF-19, RN-09. */
@Component({
  selector: 'bm-chat-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CardComponent,
    ChipComponent,
    DisclaimerComponent,
    ChatBubbleComponent,
    ChatComposerComponent,
    SuggestionChipComponent,
    LucideBot,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-page">
      <bm-page-header eyebrow="Chat" title="Vamos conversar?" subtitle="ChatBot • Assistente educativo" />

      <div class="row g-4">
        <section class="col-lg-8" aria-label="Conversa">
          <div #log class="bm-chat" role="log" aria-live="polite" aria-relevant="additions" tabindex="0">
            @for (m of chat.messages(); track m.id) {
              <bm-chat-bubble [message]="m" />
            }
            @if (chat.pending()) {
              <p class="bm-chat__typing" role="status">BurnoutMind está escrevendo…</p>
            }
          </div>
          <bm-chat-composer [disabled]="chat.pending()" (sent)="chat.send($event)" />
        </section>

        <aside class="col-lg-4 order-lg-first d-flex flex-column gap-3">
          <bm-card tone="care-soft">
            <svg lucideBot class="mb-2" [size]="24"></svg>
            <p class="mb-0">
              Sou um assistente virtual, não um profissional de saúde. Não faço diagnóstico nem substituo
              atendimento.
            </p>
          </bm-card>
          <div>
            <bm-chip variant="outline">Respostas pré-definidas</bm-chip>
            <p class="small bm-muted mt-2 mb-0">Este chat não é um atendimento ativo.</p>
          </div>
          <div class="d-flex flex-column gap-2">
            @for (s of suggestions; track s) {
              <bm-suggestion-chip [text]="s" [disabled]="chat.pending()" (picked)="chat.send($event)" />
            }
          </div>
          <bm-disclaimer>Evite enviar dados pessoais sensíveis. As respostas podem ter limitações.</bm-disclaimer>
        </aside>
      </div>
    </div>
  `,
})
export class ChatPageComponent {
  protected readonly chat = inject(ChatService);
  protected readonly suggestions = SUGGESTIONS;
  private readonly log = viewChild<ElementRef<HTMLElement>>('log');

  constructor() {
    // Mantém a última mensagem à vista.
    effect(() => {
      this.chat.messages();
      this.chat.pending();
      setTimeout(() => {
        const el = this.log()?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      });
    });
  }
}
