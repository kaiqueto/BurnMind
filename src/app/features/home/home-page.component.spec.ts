import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckInRepository, LocalStorageCheckInRepository } from '../check-in/services/check-in.repository';
import { DAILY_TIPS, HomePageComponent, tipForDate } from './home-page.component';

describe('HomePageComponent', () => {
  beforeEach(() => localStorage.clear());

  it('cumprimenta o usuário e oferece o check-in', async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideRouter([]), { provide: CheckInRepository, useClass: LocalStorageCheckInRepository }],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomePageComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Olá, Ana');
    expect(el.textContent).toContain('Fazer check-in');
  });

  it('escolhe a dica do dia de forma determinística', () => {
    const d = new Date(2026, 10, 15);
    expect(tipForDate(d)).toBe(tipForDate(new Date(2026, 10, 15, 23, 59)));
    expect(DAILY_TIPS).toContain(tipForDate(d));
  });
});
