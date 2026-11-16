import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'bm-app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="visually-hidden-focusable" href="#conteudo">Pular para o conteúdo</a>
    <div class="bm-shell">
      <bm-header />
      <main id="conteudo" class="bm-shell__main" tabindex="-1"><router-outlet /></main>
      <bm-footer />
    </div>
  `,
})
export class AppShellComponent {
  private lastKey: string | null = null;

  constructor() {
    // Acessibilidade: ao trocar de tela, o foco vai para o título (h1), para o leitor de tela anunciar a nova página.
    inject(Router)
      .events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        const key = pageKey(e.urlAfterRedirects);
        const changed = this.lastKey !== null && key !== this.lastKey;
        this.lastKey = key;
        if (changed) setTimeout(focusPageTitle);
      });
  }
}

/** Modais (/perfis/:slug, /doencas/:slug) contam como a mesma página da lista; o foco não é roubado do diálogo. */
export function pageKey(url: string): string {
  const [first, second] = url.split(/[?#]/)[0].split('/').filter(Boolean);
  return first === 'perfis' || first === 'doencas' ? first : [first, second].filter(Boolean).join('/');
}

function focusPageTitle(): void {
  const target = document.querySelector<HTMLElement>('main h1') ?? document.getElementById('conteudo');
  if (!target) return;
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}
