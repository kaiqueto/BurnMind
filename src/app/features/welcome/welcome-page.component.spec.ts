import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { ConsentService } from '../../core/services/consent.service';
import { AFTER_CONSENT_ROUTE, WelcomePageComponent } from './welcome-page.component';

describe('WelcomePageComponent', () => {
  async function setup() {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [WelcomePageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(WelcomePageComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const submit = async () => {
      el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();
      await fixture.whenStable();
    };
    return { fixture, el, navigate, submit, consent: TestBed.inject(ConsentService) };
  }

  it('exige o consentimento antes de começar (RN-01)', async () => {
    const { el, navigate, submit, consent } = await setup();
    await submit();
    expect(el.querySelector('[role=alert]')?.textContent).toContain('Marque a caixa');
    expect(consent.hasConsent()).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('registra o consentimento e segue para o questionário', async () => {
    const { el, navigate, submit, consent } = await setup();
    (el.querySelector('input[type=checkbox]') as HTMLInputElement).click();
    await submit();
    expect(consent.hasConsent()).toBe(true);
    expect(navigate).toHaveBeenCalledWith(AFTER_CONSENT_ROUTE);
  });
});
