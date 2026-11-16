import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { PdfContent } from '../pdf-content';
import { PdfService } from './pdf.service';

const content: PdfContent = {
  generatedAt: new Date(2026, 9, 27),
  attentionLabel: 'Atenção moderada',
  headline: 'Vale abrir espaço para recuperar.',
  profileTitle: 'Sobrecarga e recuperação',
  summary: 'Nas suas respostas: cansaço em vários dias.',
  answers: [{ question: 'Pergunta?', answer: 'Em vários dias' }],
  note: { date: '27/10', text: 'minha nota secreta' },
};

async function bytesOf(blob: Blob): Promise<string> {
  return new TextDecoder('latin1').decode(await blob.arrayBuffer());
}

describe('PdfService', () => {
  let service: PdfService;
  beforeEach(() => (service = TestBed.inject(PdfService)));

  it('gera um PDF válido', async () => {
    const blob = await service.build(content);
    expect(blob.type).toBe('application/pdf');
    const raw = await bytesOf(blob);
    expect(raw.startsWith('%PDF-')).toBe(true);
    expect(raw.trimEnd().endsWith('%%EOF')).toBe(true);
  });

  it('inclui o aviso legal e, quando pedido, respostas e nota', async () => {
    const raw = await bytesOf(await service.build(content));
    expect(raw).toContain('Mind');
    expect(raw).toContain('previsão de risco');
    expect(raw).toContain('minha nota secreta');
    expect(raw).toContain('Em vários dias');
  });

  it('sem respostas e sem nota, o PDF não contém esses textos', async () => {
    const raw = await bytesOf(await service.build({ ...content, answers: undefined, note: undefined }));
    expect(raw).not.toContain('minha nota secreta');
    expect(raw).not.toContain('RESPOSTAS DO FORMUL');
  });

  it('baixa o arquivo com o nome certo', async () => {
    const create = vi.fn().mockReturnValue('blob:x');
    const revoke = vi.fn();
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toBe('burnoutmind-resumo-2026-10-27.pdf');
    });
    await service.download(content);
    expect(create).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
  });
});
