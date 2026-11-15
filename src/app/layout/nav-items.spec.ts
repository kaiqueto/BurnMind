import { NAV_ITEMS, isNavActive } from './nav-items';

describe('isNavActive', () => {
  const find = (label: string) => NAV_ITEMS.find((i) => i.label === label)!;

  it('mantém Home ativo em check-in, calendário e formulário', () => {
    for (const url of ['/home', '/boas-vindas', '/check-in', '/calendario/insights', '/formulario/rotina']) {
      expect(isNavActive(find('Home'), url)).toBe(true);
    }
  });

  it('mantém Resultados ativo na assistência próxima', () => {
    expect(isNavActive(find('Resultados'), '/resultados/assistencia-proxima')).toBe(true);
  });

  it('ignora query string e não confunde prefixos parecidos', () => {
    expect(isNavActive(find('Perfis'), '/perfis?x=1')).toBe(true);
    expect(isNavActive(find('Home'), '/homepage')).toBe(false);
  });
});
