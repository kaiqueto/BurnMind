import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckInRepository, LocalStorageCheckInRepository } from '../check-in/services/check-in.repository';
import { CheckInService } from '../check-in/services/check-in.service';
import { addDays } from '../../shared/utils/date';
import { CalendarPageComponent } from './calendar-page.component';

describe('CalendarPageComponent', () => {
  async function setup(seed: (s: CheckInService) => Promise<void> = async () => {}) {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CalendarPageComponent],
      providers: [provideRouter([]), { provide: CheckInRepository, useClass: LocalStorageCheckInRepository }],
    }).compileComponents();
    await seed(TestBed.inject(CheckInService));
    const fixture = TestBed.createComponent(CalendarPageComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('mostra o mês atual, os dias da semana e o aviso de não diagnóstico', async () => {
    const { el } = await setup();
    const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
    expect(el.querySelector('h2')?.textContent?.toLowerCase()).toContain(month);
    expect(el.querySelectorAll('thead th').length).toBe(7);
    expect(el.textContent).toContain('não indicam um diagnóstico');
  });

  it('seleciona hoje por padrão e mostra "Sem registro" com link para o check-in', async () => {
    const { el } = await setup();
    expect(el.querySelector('.bm-calendar__day--selected')?.getAttribute('aria-current')).toBe('date');
    expect(el.textContent).toContain('Sem registro neste dia');
    expect(el.querySelector('a[href="/check-in"]')).toBeTruthy();
  });

  it('mostra marcador, nota e detalhe do check-in de hoje', async () => {
    const { el } = await setup((s) => s.save({ mood: 'tired', energy: 'low', note: 'dia cheio' }).then(() => {}));
    expect(el.querySelectorAll('bm-day-marker').length).toBe(1);
    expect(el.querySelector('bm-day-marker')?.textContent).toContain('B');
    expect(el.textContent).toContain('“dia cheio”');
    expect(el.textContent).toContain('Energia baixa');
  });

  it('seleciona outro dia ao clicar e descreve o dia no aria-label', async () => {
    const yesterday = addDays(new Date(), -1);
    // evita virar o mês: só testa se ontem ainda está no mês corrente
    if (yesterday.getMonth() !== new Date().getMonth()) return;
    const { fixture, el } = await setup((s) => s.save({ mood: 'good', energy: 'high' }, yesterday).then(() => {}));
    const marked = Array.from(el.querySelectorAll<HTMLButtonElement>('.bm-calendar__day')).find((b) => b.querySelector('bm-day-marker'))!;
    expect(marked.getAttribute('aria-label')).toContain('humor bem, energia alta');
    marked.click();
    fixture.detectChanges();
    expect(marked.getAttribute('aria-pressed')).toBe('true');
  });

  it('desabilita dias futuros e o botão de mês seguinte no mês atual', async () => {
    const { el } = await setup();
    expect((el.querySelector('[aria-label="Próximo mês"]') as HTMLButtonElement).disabled).toBe(true);
    const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    if (new Date().getDate() < lastDay) {
      expect(el.querySelectorAll('.bm-calendar__day:disabled').length).toBeGreaterThan(0);
    }
  });

  it('navega para o mês anterior e volta', async () => {
    const { fixture, el } = await setup();
    const before = el.querySelector('h2')?.textContent;
    (el.querySelector('[aria-label="Mês anterior"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el.querySelector('h2')?.textContent).not.toBe(before);
    expect((el.querySelector('[aria-label="Próximo mês"]') as HTMLButtonElement).disabled).toBe(false);
  });
});
