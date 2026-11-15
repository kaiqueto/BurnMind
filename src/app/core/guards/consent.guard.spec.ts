import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { ConsentService } from '../services/consent.service';
import { consentGuard } from './consent.guard';

describe('consentGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });
  const run = () => TestBed.runInInjectionContext(() => consentGuard({} as never, {} as never));

  it('redireciona para as boas-vindas sem consentimento', () => {
    const result = run() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/boas-vindas');
  });

  it('libera com consentimento', () => {
    TestBed.inject(ConsentService).give();
    expect(run()).toBe(true);
  });
});
