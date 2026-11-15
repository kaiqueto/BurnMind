import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, input, output, viewChild } from '@angular/core';

/**
 * Modal sobre o elemento nativo <dialog>: focus trap, Esc e retorno de foco vêm do navegador (RNF-05).
 * Fecha por Esc, clique no fundo, botão ✕ ou `close()`. Emite `closed` uma única vez.
 */
@Component({
  selector: 'bm-modal-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dlg
      class="bm-modal"
      [attr.aria-labelledby]="titleId()"
      (close)="closed.emit()"
      (click)="onBackdropClick($event)"
    >
      <div class="bm-modal__panel">
        <button type="button" class="btn-close bm-modal__close" aria-label="Fechar" (click)="close()"></button>
        <ng-content />
      </div>
    </dialog>
  `,
})
export class ModalShellComponent {
  /** id do título dentro do conteúdo projetado (rótulo acessível do diálogo). */
  readonly titleId = input.required<string>();
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  constructor() {
    afterNextRender(() => {
      const el = this.dialog().nativeElement;
      if (typeof el.showModal === 'function') el.showModal();
      else el.setAttribute('open', ''); // ambientes sem <dialog> completo (ex.: testes)
    });
  }

  close(): void {
    const el = this.dialog().nativeElement;
    if (typeof el.close === 'function') {
      el.close(); // dispara o evento "close" → closed
    } else {
      el.removeAttribute('open');
      this.closed.emit();
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
