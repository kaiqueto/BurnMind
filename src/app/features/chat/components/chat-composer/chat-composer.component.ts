import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideArrowUp } from '@lucide/angular';
import { CHAT_MAX_LENGTH } from '../../services/chat.service';

/** Campo de mensagem. Enter envia; Shift+Enter quebra a linha. */
@Component({
  selector: 'bm-chat-composer',
  standalone: true,
  imports: [FormsModule, LucideArrowUp],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="bm-composer" (submit)="submit($event)">
      <label for="chat-input" class="visually-hidden">Escreva sua mensagem</label>
      <textarea
        id="chat-input"
        class="bm-composer__input"
        rows="1"
        placeholder="Escreva sua mensagem"
        [maxlength]="maxLength"
        [ngModel]="text()"
        (ngModelChange)="text.set($event)"
        name="message"
        (keydown.enter)="onEnter($event)"
      ></textarea>
      <button type="submit" class="bm-composer__send" aria-label="Enviar mensagem" [disabled]="disabled()">
        <svg lucideArrowUp [size]="18"></svg>
      </button>
    </form>
  `,
})
export class ChatComposerComponent {
  readonly disabled = input(false);
  readonly sent = output<string>();
  protected readonly text = signal('');
  protected readonly maxLength = CHAT_MAX_LENGTH;

  protected onEnter(event: Event): void {
    if ((event as KeyboardEvent).shiftKey) return;
    event.preventDefault();
    this.submit();
  }

  protected submit(event?: Event): void {
    event?.preventDefault();
    const value = this.text().trim();
    if (!value || this.disabled()) return;
    this.sent.emit(value);
    this.text.set('');
  }
}
