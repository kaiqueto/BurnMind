import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AFTER_SAVE_ROUTE, CheckInPageComponent } from './check-in-page.component';
import { CheckInRepository, LocalStorageCheckInRepository } from './services/check-in.repository';
import { CheckInService } from './services/check-in.service';

describe('CheckInPageComponent', () => {
  async function setup() {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CheckInPageComponent],
      providers: [provideRouter([]), { provide: CheckInRepository, useClass: LocalStorageCheckInRepository }],
    }).compileComponents();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(CheckInPageComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const pick = (name: string, index: number) =>
      (el.querySelectorAll(`input[name=${name}]`)[index] as HTMLInputElement).click();
    const submit = async () => {
      el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();
      await fixture.whenStable();
    };
    return { fixture, el, navigate, pick, submit, service: TestBed.inject(CheckInService) };
  }

  it('mostra 4 opções de humor e 3 de energia', async () => {
    const { el } = await setup();
    expect(el.querySelectorAll('input[name=mood]').length).toBe(4);
    expect(el.querySelectorAll('input[name=energy]').length).toBe(3);
  });

  it('valida humor e energia obrigatórios, sem salvar', async () => {
    const { el, navigate, submit, service } = await setup();
    await submit();
    const alerts = Array.from(el.querySelectorAll('[role=alert]')).map((a) => a.textContent);
    expect(alerts.some((t) => t?.includes('humor'))).toBe(true);
    expect(alerts.some((t) => t?.includes('energia'))).toBe(true);
    expect(service.today()).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('salva o check-in com a nota opcional e navega', async () => {
    const { el, navigate, pick, submit, service } = await setup();
    pick('mood', 1); // cansado
    pick('energy', 0); // baixa
    const note = el.querySelector('textarea') as HTMLTextAreaElement;
    note.value = 'dia cheio';
    note.dispatchEvent(new Event('input'));
    await submit();
    await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith(AFTER_SAVE_ROUTE));
    expect(service.today()).toMatchObject({ mood: 'tired', energy: 'low', note: 'dia cheio' });
  });

  it('pré-preenche quando já existe check-in hoje (RF-06)', async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CheckInPageComponent],
      providers: [provideRouter([]), { provide: CheckInRepository, useClass: LocalStorageCheckInRepository }],
    }).compileComponents();
    await TestBed.inject(CheckInService).save({ mood: 'good', energy: 'high' });
    const fixture = TestBed.createComponent(CheckInPageComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const checked = (name: string) =>
      Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>(`input[name=${name}]`)).findIndex((i) => i.checked);
    expect(checked('mood')).toBe(2);
    expect(checked('energy')).toBe(2);
  });
});
