import { CARE_SERVICES, mapsSearchUrl } from './care-services.data';

describe('care-services.data', () => {
  it('descreve UBS e CAPS', () => {
    expect(CARE_SERVICES.map((s) => s.kind)).toEqual(['UBS', 'CAPS']);
  });

  it('monta o link de busca com a região codificada', () => {
    expect(mapsSearchUrl('UBS', 'São Paulo, SP')).toBe(
      'https://www.google.com/maps/search/?api=1&query=UBS%20S%C3%A3o%20Paulo%2C%20SP',
    );
  });

  it('sem região, busca "perto de mim"', () => {
    expect(mapsSearchUrl('CAPS', '  ')).toContain('CAPS%20perto%20de%20mim');
  });
});
