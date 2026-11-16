import { Injectable } from '@angular/core';
import { normalizeText } from '../../shared/utils/text';

/*
 * [PENDENTE] Decisão de produto: respostas roteirizadas (esta versão) ou IA generativa.
 * O chat é uma estratégia trocável: basta outra classe que estenda ChatResponder e um novo provider.
 * Regras fixas: nunca diagnosticar (RN-09); sinais de crise têm prioridade sobre qualquer outra resposta.
 */

export type ChatIntent = 'crisis' | 'diagnosis' | 'support' | 'rest' | 'try' | 'burnout' | 'fallback';

const CRISIS =
  /suicid|me matar|vou me matar|quero morrer|queria morrer|queria sumir|acabar com (tudo|minha vida)|tirar minha vida|nao quero (mais )?viver|nao aguento mais viver|me machucar|me ferir|automutil|me cortar/;
const DIAGNOSIS =
  /\btenho (burnout|depressao|ansiedade|um transtorno)|estou com (burnout|depressao|ansiedade)|diagnostic|sou depressiv|sou ansios/;
const SUPPORT = /buscar apoio|procurar (ajuda|apoio)|quando (buscar|procurar)|psicolog|terapia|medico|ajuda profissional/;
const REST = /descans|culpa|pausa|relax/;
const TRY = /tentar hoje|o que (posso|devo) (fazer|tentar)|o que fazer hoje|uma dica/;
const BURNOUT = /burnout/;

export function classify(text: string): ChatIntent {
  const t = normalizeText(text);
  if (CRISIS.test(t)) return 'crisis';
  if (DIAGNOSIS.test(t)) return 'diagnosis';
  if (SUPPORT.test(t)) return 'support';
  if (REST.test(t)) return 'rest';
  if (TRY.test(t)) return 'try';
  if (BURNOUT.test(t)) return 'burnout';
  return 'fallback';
}

export const GREETING =
  'Olá! Posso conversar sobre pausas, limites no trabalho e quando buscar apoio. Não faço diagnóstico nem substituo atendimento.';

/** Respostas de "try" e "diagnosis" seguem o wireframe; as demais são [SUGESTÃO] para revisão de conteúdo. */
export const REPLIES: Record<ChatIntent, string> = {
  crisis:
    'Sinto muito que você esteja passando por isso. Você não precisa enfrentar isso sozinho(a). Se houver risco imediato, ligue para o SAMU (192) ou procure o pronto-atendimento mais próximo. Você também pode falar agora com o CVV pelo telefone 188, gratuito e 24 horas. Se puder, avise uma pessoa de confiança que esteja perto de você.',
  diagnosis:
    'Isso eu não consigo dizer, e nenhum questionário ou chat consegue: diagnóstico só vem de uma avaliação profissional. O seu resultado é educativo e descreve suas respostas, não uma doença. O cansaço e a dificuldade de recuperar energia podem ter diferentes causas. Se isso está pesando, vale procurar um serviço de saúde.',
  support:
    'Vale buscar apoio quando o cansaço ou o sofrimento persistem por semanas, atrapalham o sono, o trabalho ou as relações, ou quando você sente que não consegue se recuperar. Uma UBS ou um serviço de saúde mental pode avaliar o seu contexto. Se houver risco imediato, ligue 192 (SAMU) ou 188 (CVV).',
  rest:
    'Descansar não é abandonar suas responsabilidades: é parte de sustentá-las. Comece pequeno, com 2 minutos longe da tela, um copo de água ou uma caminhada curta. Se a culpa aparecer, tente notá-la sem brigar com ela. Se o cansaço persistir, vale conversar sobre demandas e procurar orientação de saúde.',
  try:
    'Se for possível, faça uma pausa curta e escolha uma demanda para renegociar. Se o sofrimento persistir ou afetar sua rotina, procure avaliação em um serviço de saúde.',
  burnout:
    'Burnout é um fenômeno ligado ao estresse crônico no trabalho que não foi bem manejado. Não é sinônimo de qualquer cansaço. Você encontra mais na página Doenças. Sinais isolados não confirmam diagnóstico.',
  fallback:
    'Posso conversar sobre pausas, limites no trabalho e quando buscar apoio. Não faço diagnóstico nem substituo atendimento. Experimente uma das sugestões ou conte, com suas palavras, o que está pesando.',
};

export abstract class ChatResponder {
  abstract reply(text: string): Promise<string>;
}

@Injectable()
export class ScriptedChatResponder extends ChatResponder {
  async reply(text: string): Promise<string> {
    return REPLIES[classify(text)];
  }
}
