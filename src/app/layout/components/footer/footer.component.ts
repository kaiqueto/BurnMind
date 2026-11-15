import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bm-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bm-footer">
      <div class="bm-footer__inner">
        <p class="bm-footer__brand">BurnoutMind</p>
        <p class="bm-footer__text">
          Conteúdo educativo. Não substitui diagnóstico, tratamento ou acompanhamento profissional. Em
          sofrimento intenso, procure o CVV (188) ou o SAMU (192).
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
