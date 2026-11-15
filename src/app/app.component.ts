import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/components/footer/footer.component';
import { HeaderComponent } from './layout/components/header/header.component';

/** Casca da aplicação: cabeçalho, conteúdo da rota e rodapé. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-shell">
      <a class="visually-hidden-focusable" href="#conteudo">Ir para o conteúdo</a>
      <bm-header />
      <main id="conteudo" class="bm-shell__main" tabindex="-1">
        <router-outlet />
      </main>
      <bm-footer />
    </div>
  `,
})
export class AppComponent {}
