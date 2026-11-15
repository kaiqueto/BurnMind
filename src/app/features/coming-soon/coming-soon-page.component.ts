import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../layout/components/page-header/page-header.component';
import { CardComponent } from '../../shared/components/card/card.component';

/** Placeholder das páginas previstas (Doenças, Chat, Assistência próxima). */
@Component({
  selector: 'bm-coming-soon-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-page">
      <bm-page-header backLink="/home" title="Em breve" subtitle="Esta página ainda está sendo preparada." />
      <bm-card tone="brand-soft">
        <p class="mb-3">Enquanto isso, você pode continuar pelo que já está disponível.</p>
        <a class="btn btn-primary" routerLink="/home">Voltar para a Home</a>
      </bm-card>
    </div>
  `,
})
export class ComingSoonPageComponent {}
