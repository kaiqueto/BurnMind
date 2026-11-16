import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { ConsentService } from '../../core/services/consent.service';
import { CheckInRepository, LocalStorageCheckInRepository } from '../check-in/services/check-in.repository';
import { CheckInService } from '../check-in/services/check-in.service';
import { QuestionnaireService } from '../questionnaire/services/questionnaire.service';
import { PdfService } from './services/pdf.service';
import { ResultsPageComponent } from './results-page.component';

describe('ResultsPageComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ResultsPageComponent],
      providers: [provideRouter([]), { provide: CheckInRepository, useClass: LocalStorageCheckInRepository }],
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

  describe('exportar PDF', () => {
    function answerWireframe() {
      TestBed.inject(ConsentService).give();
      const q = TestBed.inject(QuestionnaireService);
      q.setAnswer('exhaustion', 'severalDays');
      q.setAnswer('recovery', 'fewDays');
      q.setAnswer('routine', 'little');
      q.complete();
    }
    const find = (el: HTMLElement, label: string) =>
      Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes(label)) as HTMLButtonElement;

    async function open(withNote = false) {
      answerWireframe();
      if (withNote) await TestBed.inject(CheckInService).save({ mood: 'tired', energy: 'low', note: 'dia cheio' });
      const download = vi.spyOn(TestBed.inject(PdfService), 'download').mockResolvedValue();
      const fixture = TestBed.createComponent(ResultsPageComponent);
      await fixture.whenStable();
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      find(el, 'Exportar resultado (PDF)').click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      return { fixture, el, download };
    }

    it('abre o modal com prévia, respostas marcadas e nota desmarcada (privacidade por padrão)', async () => {
      const { el } = await open(true);
      expect(el.querySelector('#pdf-title')?.textContent).toContain('Preparar resumo em PDF');
      expect((el.querySelector('#opt-answers') as HTMLInputElement).checked).toBe(true);
      expect((el.querySelector('#opt-note') as HTMLInputElement).checked).toBe(false);
      expect(el.querySelector('.bm-pdf-preview')?.textContent).toContain('Atenção moderada');
      expect(el.querySelector('.bm-pdf-preview')?.textContent).not.toContain('dia cheio');
      expect(el.textContent).toContain('Um PDF pode conter informações pessoais');
    });

    it('sem nota no diário, a opção de nota fica indisponível', async () => {
      const { el } = await open(false);
      expect((el.querySelector('#opt-note') as HTMLInputElement).disabled).toBe(true);
      expect(el.textContent).toContain('Você ainda não tem nota diária');
    });

    it('a prévia acompanha as opções e o PDF respeita o que foi marcado', async () => {
      const { fixture, el, download } = await open(true);
      const note = el.querySelector('#opt-note') as HTMLInputElement;
      note.click();
      fixture.detectChanges();
      expect(el.querySelector('.bm-pdf-preview')?.textContent).toContain('dia cheio');

      (el.querySelector('#opt-answers') as HTMLInputElement).click();
      fixture.detectChanges();
      expect(el.querySelector('.bm-pdf-preview ul')).toBeNull();

      el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
      await vi.waitFor(() => expect(download).toHaveBeenCalledOnce());
      const content = download.mock.calls[0][0];
      expect(content.answers).toBeUndefined();
      expect(content.note?.text).toBe('dia cheio');
      fixture.detectChanges();
      await vi.waitFor(() => {
        fixture.detectChanges();
        expect(el.textContent).toContain('PDF gerado');
      });
    });

    it('cancelar fecha o modal sem gerar PDF', async () => {
      const { fixture, el, download } = await open();
      find(el, 'Cancelar').click();
      await vi.waitFor(() => {
        fixture.detectChanges();
        expect(el.querySelector('#pdf-title')).toBeNull();
      });
      expect(download).not.toHaveBeenCalled();
    });

    it('mostra erro se a geração falhar', async () => {
      const { fixture, el, download } = await open();
      download.mockRejectedValue(new Error('x'));
      el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
      await vi.waitFor(() => {
        fixture.detectChanges();
        expect(el.textContent).toContain('Não foi possível gerar o PDF agora');
      });
    });
  });
});
