import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { ConsentService } from '../../core/services/consent.service';
import { QuestionStepPageComponent } from './question-step-page.component';
import { QuestionnaireService } from './services/questionnaire.service';

describe('QuestionStepPageComponent', () => {
  async function setup(step: string) {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [QuestionStepPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(QuestionStepPageComponent);
    fixture.componentRef.setInput('step', step);
    await fixture.whenStable();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const pick = (i: number) => {
      (el.querySelectorAll('input[type=radio]')[i] as HTMLInputElement).click();
    };
    const submit = async () => {
      el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();
      await fixture.whenStable();
    };
    return { fixture, el, navigate, pick, submit, service: TestBed.inject(QuestionnaireService) };
  }

  it('mostra a pergunta, 4 opções e o aviso de não diagnóstico', async () => {
    const { el } = await setup('exaustao');
    expect(el.querySelector('h1')?.textContent).toContain('deixou você sem energia');
    expect(el.querySelectorAll('input[type=radio]').length).toBe(4);
    expect(el.textContent).toContain('não produz pontuação clínica');
  });

  it('exige uma opção para continuar', async () => {
    const { el, navigate, submit } = await setup('exaustao');
    await submit();
    expect(el.querySelector('[role=alert]')?.textContent).toContain('Escolha uma opção');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('guarda a resposta e avança para a próxima pergunta', async () => {
    const { navigate, pick, submit, service } = await setup('exaustao');
    pick(2);
    await submit();
    expect(service.answers().exhaustion).toBe('severalDays');
    expect(navigate).toHaveBeenCalledWith('/formulario/recuperacao');
  });

  it('restaura a resposta ao voltar para a pergunta', async () => {
    localStorage.clear();
    localStorage.setItem('bm:draft', JSON.stringify({ exhaustion: 'fewDays' }));
    await TestBed.configureTestingModule({ imports: [QuestionStepPageComponent], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionStepPageComponent);
    fixture.componentRef.setInput('step', 'exaustao');
    await fixture.whenStable();
    fixture.detectChanges();
    const radios = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('input[type=radio]');
    expect(Array.from(radios).findIndex((r) => r.checked)).toBe(1);
  });

  it('na última pergunta conclui e vai para os resultados', async () => {
    const { navigate, pick, submit, service } = await setup('rotina');
    TestBed.inject(ConsentService).give();
    service.setAnswer('exhaustion', 'severalDays');
    service.setAnswer('recovery', 'fewDays');
    pick(1);
    await submit();
    await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith('/resultados'));
    expect(service.latest()?.answers.routine).toBe('little');
  });

  it('redireciona para a primeira pergunta se o passo for inválido', async () => {
    const { navigate } = await setup('passo-que-nao-existe');
    await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith('/formulario/exaustao'));
  });
});
