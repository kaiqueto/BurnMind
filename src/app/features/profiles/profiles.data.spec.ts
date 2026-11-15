import { PROFILES, answerBullets, findProfile } from './profiles.data';

describe('profiles.data', () => {
  it('tem os 3 perfis do wireframe', () => {
    expect(PROFILES.map((p) => p.title)).toEqual(['Sobrecarga e recuperação', 'Ritmo em oscilação', 'Espaço para recuperar']);
    expect(findProfile('overload-recovery')?.title).toBe('Sobrecarga e recuperação');
    expect(findProfile('inexistente')).toBeUndefined();
  });

  it('gera os marcadores do exemplo do wireframe a partir das respostas', () => {
    expect(answerBullets({ exhaustion: 'severalDays', recovery: 'fewDays', routine: 'little' })).toEqual([
      'Cansaço ligado ao trabalho em vários dias.',
      'Descanso ajudou em poucos dias.',
      'A rotina foi afetada um pouco.',
    ]);
  });

  it('todos os perfis trazem o aviso de que não confirmam diagnóstico', () => {
    expect(PROFILES.every((p) => p.details.disclaimer.includes('não confirma'))).toBe(true);
  });
});
