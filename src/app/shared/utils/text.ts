/** Minúsculas e sem acentos, para buscas e comparações tolerantes ("Depressão" = "depressao"). */
export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
