import { TestBed } from '@angular/core/testing';
import { REGION_MAX_LENGTH, RegionService } from './region.service';

describe('RegionService', () => {
  beforeEach(() => localStorage.clear());

  it('guarda a região aparada e persiste', () => {
    const s = TestBed.inject(RegionService);
    s.set('  São Paulo, SP ');
    expect(s.region()).toBe('São Paulo, SP');
    expect(JSON.parse(localStorage.getItem('bm:region')!)).toBe('São Paulo, SP');
  });

  it('limpa quando vazio e limita o tamanho', () => {
    const s = TestBed.inject(RegionService);
    s.set('x'.repeat(200));
    expect(s.region().length).toBe(REGION_MAX_LENGTH);
    s.set('');
    expect(s.region()).toBe('');
    expect(localStorage.getItem('bm:region')).toBeNull();
  });
});
