import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideArrowUpRight } from '@lucide/angular';

/** Sugestão de pergunta: um clique envia o texto. */
@Component({
  selector: 'bm-suggestion-chip',
  standalone: true,
  imports: [LucideArrowUpRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
  template: `
    <button type="button" class="bm-suggestion" [disabled]="disabled()" (click)="picked.emit(text())">
      <svg lucideArrowUpRight [size]="14"></svg>{{ text() }}
    </button>
  `,
})
export class SuggestionChipComponent {
  readonly text = input.required<string>();
  readonly disabled = input(false);
  readonly picked = output<string>();
}
