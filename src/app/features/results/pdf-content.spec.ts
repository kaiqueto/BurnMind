import { DailyCheckIn, QuestionnaireSubmission } from '../../shared/models/burnoutmind.models';
import { buildPdfContent, latestNote, pdfFileName } from './pdf-content';

const submission: QuestionnaireSubmission = {
  id: 's1', periodDays: 14, consentAt: '2026-10-27T10:00:00Z', createdAt: '2026-10-27T10:00:00Z',
  answers: { exhaustion: 'severalDays', recovery: 'fewDays', routine: 'little' },
};
const checkIn = (date: string, note?: string): DailyCheckIn => ({ id: date, date, mood: 'tired', energy: 'low', note, createdAt: '', updatedAt: '' });
const note = { date: '27/10', text: 'dia cheio' };
const now = new Date(2026, 9, 27);

describe('pdf-content', () => {
  it('traz resultado, perfil e resumo do wireframe', () => {
    const c = buildPdfContent(submission, { includeAnswers: false, includeNote: false }, note, now);
    expect(c.attentionLabel).toBe('Atenção moderada');
    expect(c.profileTitle).toBe('Sobrecarga e recuperação');
    expect(c.summary).toContain('cansaço em vários dias');
  });

  it('respostas e nota só entram quando marcadas (privacidade por padrão)', () => {
    const none = buildPdfContent(submission, { includeAnswers: false, includeNote: false }, note, now);
    expect(none.answers).toBeUndefined();
    expect(none.note).toBeUndefined();

    const all = buildPdfContent(submission, { includeAnswers: true, includeNote: true }, note, now);
    expect(all.answers?.map((a) => a.answer)).toEqual(['Em vários dias', 'Em poucos dias', 'Afetou um pouco']);
    expect(all.note).toEqual(note);
  });

  it('marcar a nota sem ter nota não quebra', () => {
    expect(buildPdfContent(submission, { includeAnswers: false, includeNote: true }, null, now).note).toBeUndefined();
  });

  it('pega a nota mais recente e ignora check-ins sem texto', () => {
    const n = latestNote([checkIn('2026-10-20', 'antiga'), checkIn('2026-10-26', 'recente'), checkIn('2026-10-27', '  ')]);
    expect(n).toEqual({ date: '26/10', text: 'recente' });
    expect(latestNote([checkIn('2026-10-27')])).toBeNull();
  });

  it('nome do arquivo leva a data', () => {
    expect(pdfFileName(now)).toBe('burnoutmind-resumo-2026-10-27.pdf');
  });
});
