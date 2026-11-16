import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ChatResponder, ScriptedChatResponder } from './chat-responder';
import { ChatPageComponent } from './chat-page.component';
import { CHAT_REPLY_DELAY_MS } from './services/chat.service';

describe('ChatPageComponent', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [ChatPageComponent],
      providers: [{ provide: ChatResponder, useClass: ScriptedChatResponder }, { provide: CHAT_REPLY_DELAY_MS, useValue: 0 }],
    }).compileComponents();
    const fixture = TestBed.createComponent(ChatPageComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const bubbles = () => Array.from(el.querySelectorAll('bm-chat-bubble')).map((b) => b.textContent ?? '');
    return { fixture, el, bubbles };
  }

  it('mostra a saudação, as 3 sugestões e os avisos', async () => {
    const { el, bubbles } = await setup();
    expect(bubbles().length).toBe(1);
    expect(el.querySelectorAll('bm-suggestion-chip button').length).toBe(3);
    expect(el.textContent).toContain('Sou um assistente virtual, não um profissional de saúde');
    expect(el.textContent).toContain('Evite enviar dados pessoais sensíveis');
    expect(el.querySelector('[role=log]')).toBeTruthy();
  });

  it('clicar numa sugestão envia a pergunta e mostra a resposta', async () => {
    const { fixture, el, bubbles } = await setup();
    (el.querySelectorAll('bm-suggestion-chip button')[2] as HTMLButtonElement).click();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(bubbles().length).toBe(3);
    });
    expect(bubbles()[1]).toContain('Quando buscar apoio?');
    expect(bubbles()[2]).toContain('Vale buscar apoio quando');
  });

  it('Enter envia e Shift+Enter não; o campo é limpo depois do envio', async () => {
    const { fixture, el, bubbles } = await setup();
    const textarea = el.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'oi, tudo bem';
    textarea.dispatchEvent(new Event('input'));
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, cancelable: true }));
    fixture.detectChanges();
    expect(bubbles().length).toBe(1);
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(bubbles().length).toBe(3);
    });
    expect(bubbles()[1]).toContain('oi, tudo bem');
    expect(textarea.value).toBe('');
  });

  it('mensagem de crise mostra o CVV 188 na conversa', async () => {
    const { fixture, el, bubbles } = await setup();
    const textarea = el.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'não aguento mais viver';
    textarea.dispatchEvent(new Event('input'));
    (el.querySelector('.bm-composer__send') as HTMLButtonElement).click();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(bubbles().length).toBe(3);
    });
    expect(bubbles()[2]).toContain('188');
    expect(bubbles()[2]).toContain('192');
  });
});
