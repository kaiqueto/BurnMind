import { normalizeText } from './text';

describe('normalizeText', () => {
  it('ignora acentos, caixa e espaços nas pontas', () => {
    expect(normalizeText('  Depressão ')).toBe('depressao');
    expect(normalizeText('ANSIEDADE')).toBe('ansiedade');
    expect(normalizeText('Dificuldades de sono')).toBe('dificuldades de sono');
  });
});
