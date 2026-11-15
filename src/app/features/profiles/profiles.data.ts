import { FrequencyAnswer, ImpactAnswer, ProfileSlug, QuestionnaireAnswers, WellbeingProfile } from '../../shared/models/burnoutmind.models';

const DISCLAIMER =
  'Este perfil não confirma burnout. Se o sofrimento persistir ou afetar sua rotina, procure avaliação profissional.';

/*
 * Textos de "Sobrecarga e recuperação" vêm do wireframe.
 * Os de "Ritmo em oscilação" (intro e dicas) e "Espaço para recuperar" (intro e dicas) são [SUGESTÃO]
 * e precisam de revisão da equipe de conteúdo / profissional de saúde (RN-08).
 */
export const PROFILES: readonly WellbeingProfile[] = [
  {
    slug: 'overload-recovery',
    title: 'Sobrecarga e recuperação',
    summary: 'Quando as demandas ocupam mais espaço do que os momentos de recuperação.',
    details: {
      intro:
        'Às vezes, as demandas continuam mesmo quando a energia pede uma pausa. Esse perfil convida a olhar para a recuperação e para as condições ao seu redor.',
      exampleAnswers: [],
      helpNow: [
        { title: 'Uma pausa possível', text: 'Tente 2 minutos longe da tela, sem cobrança.' },
        { title: 'Limites e apoio', text: 'Se for seguro, converse sobre prioridades e demandas no trabalho.' },
      ],
      disclaimer: DISCLAIMER,
    },
  },
  {
    slug: 'fluctuating-rhythm',
    title: 'Ritmo em oscilação',
    summary: 'Dias com diferentes níveis de energia. Um convite para observar seu contexto.',
    details: {
      intro:
        'Há dias mais leves e dias mais pesados. Esse perfil convida a notar o que muda entre eles: demandas, pausas, sono e apoio. O contexto importa tanto quanto a frequência.',
      exampleAnswers: [],
      helpNow: [
        { title: 'Observe o que muda', text: 'No próximo check-in, anote o que ajudou ou pesou no seu dia.' },
        { title: 'Uma pausa possível', text: 'Tente 2 minutos longe da tela, sem cobrança.' },
      ],
      disclaimer: DISCLAIMER,
    },
  },
  {
    slug: 'room-to-recover',
    title: 'Espaço para recuperar',
    summary: 'Quando há oportunidades de descanso e apoio. Cuidar também é preservar esse espaço.',
    details: {
      intro:
        'Quando o descanso e o apoio estão presentes, vale cuidar para que continuem acessíveis, inclusive em semanas mais cheias.',
      exampleAnswers: [],
      helpNow: [
        { title: 'Proteja o que já ajuda', text: 'Mantenha as pausas e os apoios que funcionam para você.' },
        { title: 'Observe com gentileza', text: 'Se a energia mudar por vários dias, registre e converse com alguém de confiança.' },
      ],
      disclaimer: DISCLAIMER,
    },
  },
];

export function findProfile(slug: string): WellbeingProfile | undefined {
  return PROFILES.find((p) => p.slug === (slug as ProfileSlug));
}

const EXHAUSTION: Record<FrequencyAnswer, string> = {
  never: 'Cansaço ligado ao trabalho quase ausente.',
  fewDays: 'Cansaço ligado ao trabalho em poucos dias.',
  severalDays: 'Cansaço ligado ao trabalho em vários dias.',
  almostEveryDay: 'Cansaço ligado ao trabalho quase todos os dias.',
};
const RECOVERY: Record<FrequencyAnswer, string> = {
  never: 'Descanso não ajudou a recuperar.',
  fewDays: 'Descanso ajudou em poucos dias.',
  severalDays: 'Descanso ajudou em vários dias.',
  almostEveryDay: 'Descanso ajudou quase todos os dias.',
};
const ROUTINE: Record<ImpactAnswer, string> = {
  none: 'A rotina não foi afetada.',
  little: 'A rotina foi afetada um pouco.',
  quite: 'A rotina foi afetada bastante.',
  veryMuch: 'A rotina foi muito afetada.',
};

/** Marcadores "Nas suas respostas" do modal do perfil do próprio usuário. */
export function answerBullets(a: QuestionnaireAnswers): string[] {
  return [EXHAUSTION[a.exhaustion], RECOVERY[a.recovery], ROUTINE[a.routine]];
}
