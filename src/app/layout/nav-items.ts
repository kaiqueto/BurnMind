export interface NavItem {
  label: string;
  path: string;
  /** Prefixos de rota que mantêm este item ativo (ver navegacao.mapaDeAtivo no JSON). */
  matches: string[];
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', path: '/home', matches: ['/home', '/boas-vindas', '/check-in', '/calendario', '/formulario'] },
  { label: 'Sobre', path: '/sobre', matches: ['/sobre'] },
  { label: 'Doenças', path: '/doencas', matches: ['/doencas'] },
  { label: 'Perfis', path: '/perfis', matches: ['/perfis'] },
  { label: 'Resultados', path: '/resultados', matches: ['/resultados'] },
  { label: 'Chat', path: '/chat', matches: ['/chat'] },
];

export function isNavActive(item: NavItem, url: string): boolean {
  const path = url.split(/[?#]/)[0];
  return item.matches.some((m) => path === m || path.startsWith(`${m}/`));
}
