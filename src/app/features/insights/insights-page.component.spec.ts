import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { addDays } from '../../shared/utils/date';
import { CheckInRepository, LocalStorageCheckInRepository } from '../check-in/services/check-in.repository';
import { CheckInService } from '../check-in/services/check-in.service';
import { InsightsPageComponent } from './insights-page.component';

describe('InsightsPageComponent', () => {
  async function setup(seed: (s: CheckInService) => Promise<void> = async () => {}) {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [InsightsPageComponent],
      providers: [provideRouter([]), { provide: CheckInRepository, useClass: LocalStorageCheckInRepository }],
    }).compileComponents();
    await seed(TestBed.inject(CheckInService));
    const fixture = TestBed.createComponent(InsightsPageComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('sem registros, convida ao check-in e mostra todos os dias sem registro', async () => {
    const el = await setup();
    expect(el.textContent).toContain('Ainda não há registros nesta semana.');
    expect(el.querySelector('a[href="/check-in"]')).toBeTruthy();
    expect(el.querySelector('.bm-chart__dot')).toBeNull();
    expect(el.textContent).toContain('Sem registro em');
  });

  it('com variação de energia, mostra o gráfico, a mensagem acolhedora e as sugestões', async () => {
    const el = await setup(async (s) => {
      const today = new Date();
      await s.save({ mood: 'tired', energy: 'low' }, today);
      await s.save({ mood: 'good', energy: 'medium' }, addDays(today, -1));
      await s.save({ mood: 'tired', energy: 'low' }, addDays(today, -2));
    });
    expect(el.querySelectorAll('.bm-chart__dot').length).toBe(3);
    expect(el.querySelector('svg.bm-chart')?.getAttribute('role')).toBe('img');
    expect(el.textContent).toContain('Sua energia variou. Isso não é uma falha.');
    expect(el.textContent).toContain('Combine um limite possível');
    expect(el.textContent).toContain('Tendências descritivas, não diagnósticas');
    expect(el.querySelectorAll('table.visually-hidden tbody tr').length).toBe(7);
  });

  it('quebra a linha no dia sem registro (lacuna)', async () => {
    const el = await setup(async (s) => {
      const today = new Date();
      await s.save({ mood: 'good', energy: 'high' }, today);
      await s.save({ mood: 'good', energy: 'high' }, addDays(today, -2)); // ontem sem registro
    });
    expect(el.querySelectorAll('.bm-chart__line').length).toBe(0); // dois pontos isolados não formam segmento
    expect(el.querySelectorAll('.bm-chart__dot').length).toBe(2);
  });
});
