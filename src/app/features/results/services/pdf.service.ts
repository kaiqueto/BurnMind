import { Injectable } from '@angular/core';
import { PdfContent, pdfFileName } from '../pdf-content';

const INK: [number, number, number] = [27, 34, 40];
const MUTED: [number, number, number] = [89, 100, 98];
const BRAND: [number, number, number] = [242, 96, 53];
const BRAND_STRONG: [number, number, number] = [146, 55, 29];

const DISCLAIMER =
  'Este resumo é educativo: não é diagnóstico nem previsão de risco e não substitui avaliação, tratamento ou acompanhamento profissional. Contém informações pessoais: compartilhe com cuidado.';

/**
 * Gera o PDF inteiramente no navegador (nenhum dado sai do dispositivo).
 * A biblioteca é carregada sob demanda, só quando o usuário pede o PDF.
 * Fonte padrão do PDF (Helvetica) cobre os acentos do português.
 */
@Injectable({ providedIn: 'root' })
export class PdfService {
  async build(content: PdfContent): Promise<Blob> {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const left = 20;
    const width = 170;
    const bottom = 262;
    let y = 24;

    const ensure = (needed: number) => {
      if (y + needed > bottom) {
        doc.addPage();
        y = 24;
      }
    };
    const text = (value: string, size: number, color: [number, number, number], bold = false, gap = 1.5) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal').setFontSize(size).setTextColor(...color);
      const lines: string[] = doc.splitTextToSize(value, width);
      const lineHeight = size * 0.5;
      ensure(lines.length * lineHeight + gap);
      doc.text(lines, left, y);
      y += lines.length * lineHeight + gap;
    };

    // Cabeçalho
    doc.setFont('helvetica', 'bold').setFontSize(22).setTextColor(...INK);
    doc.text('Burnout', left, y);
    doc.setTextColor(...BRAND);
    doc.text('Mind', left + doc.getTextWidth('Burnout'), y);
    y += 8;
    text(`Resumo educativo - ${content.generatedAt.toLocaleDateString('pt-BR')}`, 11, MUTED, false, 4);
    doc.setDrawColor(...BRAND).setLineWidth(0.8).line(left, y, left + width, y);
    y += 9;

    // Resultado
    text(content.attentionLabel, 18, BRAND_STRONG, true, 1);
    text(content.headline, 13, INK, true, 2);
    text('Representação educativa, sem pontuação ou cálculo clínico.', 10, MUTED, false, 7);

    text('PERFIL EDUCATIVO', 9, BRAND_STRONG, true, 1);
    text(content.profileTitle, 15, INK, true, 2);
    text(content.summary, 11, INK, false, 7);

    if (content.answers) {
      text('RESPOSTAS DO FORMULÁRIO (ÚLTIMOS 14 DIAS)', 9, BRAND_STRONG, true, 2);
      for (const a of content.answers) {
        text(a.question, 10, MUTED, false, 0.5);
        text(a.answer, 11, INK, true, 4);
      }
      y += 3;
    }

    if (content.note) {
      text(`NOTA DO DIÁRIO (${content.note.date})`, 9, BRAND_STRONG, true, 2);
      text(content.note.text, 11, INK, false, 6);
    }

    // Rodapé em todas as páginas
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...MUTED);
      doc.text(doc.splitTextToSize(DISCLAIMER, width), left, 278);
      doc.text(`${p}/${pages}`, left + width, 290, { align: 'right' });
    }
    return doc.output('blob');
  }

  /** Gera e baixa o arquivo. */
  async download(content: PdfContent): Promise<void> {
    const blob = await this.build(content);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = pdfFileName(content.generatedAt);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
