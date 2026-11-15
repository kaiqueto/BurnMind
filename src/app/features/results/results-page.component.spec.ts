import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConsentService } from '../../core/services/consent.service';
import { QuestionnaireService } from '../questionnaire/services/questionnaire.service';
import { ResultsPageComponent } from './results-page.component';

describe('ResultsPageComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ResultsPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('sem questionário respondido, convida a responder', async () => {
    const fixture = TestBed.createComponent(ResultsPageComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('ainda não respondeu');
    expect(el.querySelector('bm-attention-ring')).toBeNull();
  });

  it('com respostas do wireframe, mostra atenção moderada e o perfil', async () => {
    TestBed.inject(ConsentService).give();
    const service = TestBed.inject(QuestionnaireService);
    service.setAnswer('exhaustion', 'severalDays');
    service.setAnswer('recovery', 'fewDays');
    service.setAnswer('routine', 'little');
    service.complete();

    const fixture = TestBed.createComponent(ResultsPageComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent!;
    expect(text).toContain('Atenção moderada');
    expect(text).toContain('Vale abrir espaço para recuperar.');
    expect(text).toContain('Sobrecarga e recuperação');
    expect(text).toContain('Isso merece cuidado, não culpa.');
    expect(text).not.toContain('CVV');
  });

  it('em atenção alta, mostra CVV 188 e SAMU 192', async () => {
    TestBed.inject(ConsentService).give();
    const service = TestBed.inject(QuestionnaireService);
    service.setAnswer('exhaustion', 'almostEveryDay');
    service.setAnswer('recovery', 'never');
    service.setAnswer('routine', 'veryMuch');
    service.complete();

    const fixture = TestBed.createComponent(ResultsPageComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent!;
    expect(text).toContain('CVV 188');
    expect(text).toContain('SAMU 192');
  });
});
