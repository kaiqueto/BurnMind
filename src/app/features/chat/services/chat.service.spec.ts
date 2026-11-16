import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ChatResponder, GREETING, REPLIES, ScriptedChatResponder } from '../chat-responder';
import { CHAT_MAX_LENGTH, CHAT_REPLY_DELAY_MS, ChatService } from './chat.service';

describe('ChatService', () => {
  function setup(responder: ChatResponder = new ScriptedChatResponder()) {
    TestBed.configureTestingModule({
      providers: [{ provide: ChatResponder, useValue: responder }, { provide: CHAT_REPLY_DELAY_MS, useValue: 0 }],
    });
    return TestBed.inject(ChatService);
  }

  it('começa com a saudação do assistente', () => {
    const s = setup();
    expect(s.messages().map((m) => [m.role, m.text])).toEqual([['assistant', GREETING]]);
  });

  it('envia e recebe a resposta', async () => {
    const s = setup();
    await s.send('  Como descansar sem culpa?  ');
    expect(s.messages().map((m) => m.role)).toEqual(['assistant', 'user', 'assistant']);
    expect(s.messages()[1].text).toBe('Como descansar sem culpa?');
    expect(s.messages()[2].text).toBe(REPLIES.rest);
    expect(s.pending()).toBe(false);
  });

  it('ignora mensagem vazia e não aceita envio enquanto responde', async () => {
    const s = setup();
    await s.send('   ');
    expect(s.messages().length).toBe(1);
    const first = s.send('Quando buscar apoio?');
    await s.send('segunda mensagem'); // pending → ignorada
    await first;
    expect(s.messages().filter((m) => m.role === 'user').length).toBe(1);
  });

  it('limita o tamanho da mensagem', async () => {
    const s = setup();
    await s.send('a'.repeat(CHAT_MAX_LENGTH + 100));
    expect(s.messages()[1].text.length).toBe(CHAT_MAX_LENGTH);
  });

  it('mostra mensagem de erro se o responder falhar', async () => {
    const s = setup({ reply: vi.fn().mockRejectedValue(new Error('x')) } as ChatResponder);
    await s.send('oi');
    expect(s.messages().at(-1)?.text).toContain('Não consegui responder agora');
    expect(s.pending()).toBe(false);
  });

  it('sinal de crise sempre recebe o CVV 188 e o SAMU 192', async () => {
    const s = setup();
    await s.send('não quero mais viver');
    expect(s.messages().at(-1)?.text).toContain('188');
    expect(s.messages().at(-1)?.text).toContain('192');
  });
});
