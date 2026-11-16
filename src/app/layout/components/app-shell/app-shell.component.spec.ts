import { pageKey } from './app-shell.component';

describe('pageKey', () => {
  it('modais contam como a mesma página da lista (não roubam o foco)', () => {
    expect(pageKey('/perfis')).toBe('perfis');
    expect(pageKey('/perfis/overload-recovery')).toBe('perfis');
    expect(pageKey('/doencas/burnout?x=1')).toBe('doencas');
  });

  it('passos do questionário contam como páginas diferentes (o foco acompanha a pergunta)', () => {
    expect(pageKey('/formulario/exaustao')).not.toBe(pageKey('/formulario/recuperacao'));
    expect(pageKey('/calendario')).not.toBe(pageKey('/calendario/insights'));
  });
});
