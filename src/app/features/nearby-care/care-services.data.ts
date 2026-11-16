import { CareService } from '../../shared/models/burnoutmind.models';

/** Descrições do wireframe. São TIPOS de serviço: nenhum local específico é indicado. */
export const CARE_SERVICES: readonly CareService[] = [
  {
    id: 'ubs',
    kind: 'UBS',
    name: 'UBS · Unidade Básica de Saúde',
    description: 'A atenção básica pode acolher suas queixas e orientar os próximos passos.',
  },
  {
    id: 'caps',
    kind: 'CAPS',
    name: 'CAPS · Centro de Atenção Psicossocial',
    description: 'Serviços da rede de atenção psicossocial para diferentes necessidades de cuidado.',
  },
];

/** Link de busca no Google Maps (abre fora do app; a busca acontece no mapa, não no BurnoutMind). */
export function mapsSearchUrl(kind: CareService['kind'], region: string): string {
  const where = region.trim() || 'perto de mim';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${kind} ${where}`)}`;
}
