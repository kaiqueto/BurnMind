import { REPLIES, ScriptedChatResponder, classify } from './chat-responder';

describe('chat-responder', () => {
  it('classifica as 3 sugestões do wireframe', () => {
    expect(classify('Como descansar sem culpa?')).toBe('rest');
    expect(classify('O que posso tentar hoje?')).toBe('try');
    expect(classify('Quando buscar apoio?')).toBe('support');
  });

  it('a pergunta do wireframe ("tenho burnout?") recebe resposta sem diagnóstico', () => {
    const q = 'Meu resultado mostrou “Sobrecarga e recuperação”. Isso quer dizer que tenho burnout?';
    expect(classify(q)).toBe('diagnosis');
    expect(REPLIES.diagnosis).toContain('não uma doença');
  });

  it('sinal de crise tem prioridade e traz CVV 188 e SAMU 192', () => {
    for (const msg of ['Quero morrer', 'penso em me matar', 'não aguento mais viver', 'Estou pensando em suicídio']) {
      expect(classify(msg)).toBe('crisis');
    }
    expect(classify('quero morrer e tenho burnout')).toBe('crisis');
    expect(REPLIES.crisis).toContain('188');
    expect(REPLIES.crisis).toContain('192');
  });

  it('cansaço comum não dispara o fluxo de crise', () => {
    expect(classify('Estou morrendo de cansaço depois da reunião')).not.toBe('crisis');
    expect(classify('Estou exausta do trabalho')).not.toBe('crisis');
  });

  it('mensagem sem tema cai na resposta padrão, e nenhuma resposta promete diagnóstico', async () => {
    const responder = new ScriptedChatResponder();
    expect(await responder.reply('bom dia')).toBe(REPLIES.fallback);
    const all = Object.values(REPLIES).join(' ');
    expect(all).not.toMatch(/voce tem (burnout|depress|ansiedade)|seu diagnostico/i);
  });
});
