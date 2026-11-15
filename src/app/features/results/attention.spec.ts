import { QuestionnaireAnswers, QuestionnaireSubmission } from '../../shared/models/burnoutmind.models';
import { ATTENTION_META, attentionLevel, buildResult, profileFor, summarize } from './attention';

// Respostas de exemplo do wireframe: cansaço em vários dias, descanso em poucos dias, algum impacto.
const wireframe: QuestionnaireAnswers = { exhaustion: 'severalDays', recovery: 'fewDays', routine: 'little' };
const calm: QuestionnaireAnswers = { exhaustion: 'never', recovery: 'almostEveryDay', routine: 'none' };
const heavy: QuestionnaireAnswers = { exhaustion: 'almostEveryDay', recovery: 'never', routine: 'veryMuch' };

describe('attention', () => {
  it('reproduz o exemplo do wireframe: atenção moderada + sobrecarga e recuperação', () => {
    expect(attentionLevel(wireframe)).toBe('moderate');
    expect(profileFor(wireframe)).toBe('overload-recovery');
  });

  it('classifica os extremos', () => {
    expect(attentionLevel(calm)).toBe('low');
    expect(profileFor(calm)).toBe('room-to-recover');
    expect(attentionLevel(heavy)).toBe('high');
  });

  it('gera o resumo no texto do wireframe', () => {
    expect(summarize(wireframe)).toBe(
      'Nas suas respostas: cansaço em vários dias, descanso que ajudou em poucos dias e algum impacto na rotina. Isso merece cuidado, não culpa.',
    );
  });

  it('nunca expõe pontuação, risco ou diagnóstico nos textos (RN-02)', () => {
    const submission: QuestionnaireSubmission = {
      id: 's1', periodDays: 14, answers: heavy, consentAt: '2026-10-27T10:00:00Z', createdAt: '2026-10-27T10:00:00Z',
    };
    const texts = [
      JSON.stringify(buildResult(submission)),
      ...Object.values(ATTENTION_META).flatMap((m) => [m.label, m.headline]),
    ].join(' ');
    expect(texts).not.toMatch(/pontua|risco|diagn[óo]stic|transtorno|\b\d+\s*\/\s*\d+/i);
  });
});
