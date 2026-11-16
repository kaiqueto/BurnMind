import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import axe from 'axe-core';
import { ConsentService } from './core/services/consent.service';
import { AboutPageComponent } from './features/about/about-page.component';
import { CalendarPageComponent } from './features/calendar/calendar-page.component';
import { CheckInPageComponent } from './features/check-in/check-in-page.component';
import { CheckInRepository, LocalStorageCheckInRepository } from './features/check-in/services/check-in.repository';
import { CheckInService } from './features/check-in/services/check-in.service';
import { ChatPageComponent } from './features/chat/chat-page.component';
import { ChatResponder, ScriptedChatResponder } from './features/chat/chat-responder';
import { CHAT_REPLY_DELAY_MS } from './features/chat/services/chat.service';
import { TopicDetailModalComponent } from './features/education-library/components/topic-detail-modal/topic-detail-modal.component';
import { EducationLibraryPageComponent } from './features/education-library/education-library-page.component';
import { HomePageComponent } from './features/home/home-page.component';
import { InsightsPageComponent } from './features/insights/insights-page.component';
import { NearbyCarePageComponent } from './features/nearby-care/nearby-care-page.component';
import { ProfileDetailModalComponent } from './features/profiles/components/profile-detail-modal/profile-detail-modal.component';
import { ProfilesPageComponent } from './features/profiles/profiles-page.component';
import { QuestionStepPageComponent } from './features/questionnaire/question-step-page.component';
import { QuestionnaireService } from './features/questionnaire/services/questionnaire.service';
import { ResultsPageComponent } from './features/results/results-page.component';
import { WelcomePageComponent } from './features/welcome/welcome-page.component';
import { AppShellComponent } from './layout/components/app-shell/app-shell.component';

/**
 * Auditoria automática de acessibilidade (axe-core, regras WCAG 2.x A/AA) sobre todas as telas e modais.
 * Limite: o jsdom não calcula layout, então contraste de cor e alvos de toque NÃO são verificados aqui
 * (foram revisados à mão: ver SETUP-ETAPA-6.md). Isto não substitui teste com leitor de tela.
 */
async function audit(component: Type<unknown>, inputs: Record<string, unknown> = {}, seed?: () => Promise<void> | void) {
  localStorage.clear();
  TestBed.configureTestingModule({
    imports: [component],
    providers: [
      provideRouter([]),
      { provide: CheckInRepository, useClass: LocalStorageCheckInRepository },
      { provide: ChatResponder, useClass: ScriptedChatResponder },
      { provide: CHAT_REPLY_DELAY_MS, useValue: 0 },
    ],
  });
  await seed?.();
  const fixture = TestBed.createComponent(component);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  await fixture.whenStable();
  fixture.detectChanges();
  document.body.appendChild(fixture.nativeElement);
  const results = await axe.run(fixture.nativeElement as HTMLElement, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false }, 'landmark-one-main': { enabled: false }, 'page-has-heading-one': { enabled: false } },
  });
  fixture.nativeElement.remove();
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')})`);
}

function answerQuestionnaire() {
  TestBed.inject(ConsentService).give();
  const q = TestBed.inject(QuestionnaireService);
  q.setAnswer('exhaustion', 'severalDays');
  q.setAnswer('recovery', 'fewDays');
  q.setAnswer('routine', 'little');
  q.complete();
}

describe('Acessibilidade (axe-core)', () => {
  const cases: [string, Type<unknown>, Record<string, unknown>?, (() => Promise<void> | void)?][] = [
    ['Boas-vindas', WelcomePageComponent],
    ['Sobre', AboutPageComponent],
    ['Home', HomePageComponent],
    ['Check-in', CheckInPageComponent],
    ['Questionário (passo 1)', QuestionStepPageComponent, { step: 'exaustao' }],
    ['Questionário (passo 3)', QuestionStepPageComponent, { step: 'rotina' }],
    ['Resultados (com dados)', ResultsPageComponent, {}, answerQuestionnaire],
    ['Resultados (vazio)', ResultsPageComponent],
    ['Calendário', CalendarPageComponent],
    ['Insights', InsightsPageComponent],
    ['Perfis', ProfilesPageComponent, {}, answerQuestionnaire],
    ['Perfis · modal', ProfileDetailModalComponent, { slug: 'overload-recovery' }, answerQuestionnaire],
    ['Doenças', EducationLibraryPageComponent],
    ['Doenças · modal', TopicDetailModalComponent, { slug: 'burnout' }],
    ['Chat', ChatPageComponent],
    ['Assistência próxima', NearbyCarePageComponent],
    ['Shell (header e rodapé)', AppShellComponent],
  ];

  for (const [name, component, inputs, seed] of cases) {
    it(`${name}: sem violações`, async () => {
      expect(await audit(component, inputs, seed)).toEqual([]);
    });
  }

  it('Resultados com dados e check-in com nota: sem violações', async () => {
    const v = await audit(ResultsPageComponent, {}, async () => {
      answerQuestionnaire();
      await TestBed.inject(CheckInService).save({ mood: 'tired', energy: 'low', note: 'dia cheio' });
    });
    expect(v).toEqual([]);
  });
});
