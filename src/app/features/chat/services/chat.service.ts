import { Injectable, InjectionToken, inject, signal } from '@angular/core';
import { ChatMessage } from '../../../shared/models/burnoutmind.models';
import { ChatResponder, GREETING } from '../chat-responder';

/** Atraso simulado antes da resposta (dá ritmo à conversa). Nos testes use 0. */
export const CHAT_REPLY_DELAY_MS = new InjectionToken<number>('CHAT_REPLY_DELAY_MS', {
  providedIn: 'root',
  factory: () => 600,
});

export const CHAT_MAX_LENGTH = 500;
const ERROR_TEXT = 'Não consegui responder agora. Tente de novo em instantes.';

function message(role: ChatMessage['role'], text: string): ChatMessage {
  return { id: crypto.randomUUID(), role, text, createdAt: new Date().toISOString() };
}

/** Conversa da sessão. Fica só em memória: nada é gravado nem enviado (privacidade). */
@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly responder = inject(ChatResponder);
  private readonly delay = inject(CHAT_REPLY_DELAY_MS);

  private readonly _messages = signal<ChatMessage[]>([message('assistant', GREETING)]);
  readonly messages = this._messages.asReadonly();
  readonly pending = signal(false);

  async send(text: string): Promise<void> {
    const clean = text.trim().slice(0, CHAT_MAX_LENGTH);
    if (!clean || this.pending()) return;

    this._messages.update((m) => [...m, message('user', clean)]);
    this.pending.set(true);
    try {
      if (this.delay > 0) await new Promise((resolve) => setTimeout(resolve, this.delay));
      const reply = await this.responder.reply(clean);
      this._messages.update((m) => [...m, message('assistant', reply)]);
    } catch {
      this._messages.update((m) => [...m, message('assistant', ERROR_TEXT)]);
    } finally {
      this.pending.set(false);
    }
  }
}
