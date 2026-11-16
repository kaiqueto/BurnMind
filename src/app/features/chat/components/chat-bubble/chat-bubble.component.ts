import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ChatMessage } from '../../../../shared/models/burnoutmind.models';

/** Balão de mensagem. Quebras de linha do texto são preservadas. */
@Component({
  selector: 'bm-chat-bubble',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"bm-chat-bubble bm-chat-bubble--" + message().role' },
  template: `
    <span class="bm-chat-bubble__author">{{ message().role === 'user' ? 'Você' : 'BurnoutMind' }}</span>
    <p class="bm-chat-bubble__text">{{ message().text }}</p>
  `,
})
export class ChatBubbleComponent {
  readonly message = input.required<ChatMessage>();
}
