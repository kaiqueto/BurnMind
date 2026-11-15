import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AnswerOption } from '../../questions';

/** Opções de resposta como radio-cards (radios nativos ligados ao FormControl). */
@Component({
  selector: 'bm-answer-options',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="bm-fieldset d-flex flex-column gap-2">
      <legend class="visually-hidden">{{ legend() }}</legend>
      @for (opt of options(); track opt.value) {
        <label class="bm-answer">
          <input class="form-check-input mt-0" type="radio" [name]="name()" [value]="opt.value" [formControl]="control()" />
          <span>{{ opt.label }}</span>
        </label>
      }
    </fieldset>
  `,
})
export class AnswerOptionsComponent {
  readonly control = input.required<FormControl<string | null>>();
  readonly options = input.required<readonly AnswerOption[]>();
  readonly name = input.required<string>();
  readonly legend = input('Escolha uma opção');
}
