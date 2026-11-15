import { TestBed } from '@angular/core/testing';
import { ConsentService } from '../../../core/services/consent.service';
import { QuestionnaireService } from './questionnaire.service';

describe('QuestionnaireService', () => {
  let service: QuestionnaireService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(QuestionnaireService);
  });

  const answerAll = () => {
    service.setAnswer('exhaustion', 'severalDays');
    service.setAnswer('recovery', 'fewDays');
    service.setAnswer('routine', 'little');
  };

  it('indica a primeira pergunta sem resposta', () => {
    expect(service.firstMissing()).toBe('exhaustion');
    service.setAnswer('exhaustion', 'never');
    expect(service.firstMissing()).toBe('recovery');
  });

  it('não conclui sem consentimento (RN-01)', () => {
    answerAll();
    expect(service.complete()).toBeNull();
  });

  it('não conclui com respostas faltando', () => {
    TestBed.inject(ConsentService).give();
    service.setAnswer('exhaustion', 'never');
    expect(service.complete()).toBeNull();
  });

  it('conclui, guarda o envio e limpa o rascunho', () => {
    TestBed.inject(ConsentService).give();
    answerAll();
    const submission = service.complete();
    expect(submission?.periodDays).toBe(14);
    expect(service.latest()?.id).toBe(submission?.id);
    expect(service.answers()).toEqual({});
  });
});
