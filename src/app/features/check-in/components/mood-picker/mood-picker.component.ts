import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideFrown, LucideLaugh, LucideMeh, LucideSmile } from '@lucide/angular';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { MOOD_LABEL, MoodLevel } from '../../../../shared/models/burnoutmind.models';

/** Seleção de humor (4 opções). Radios nativos ligados ao FormControl recebido. */
@Component({
  selector: 'bm-mood-picker',
  standalone: true,
  imports: [ReactiveFormsModule, CardComponent, LucideFrown, LucideMeh, LucideSmile, LucideLaugh],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bm-card>
      <fieldset class="bm-fieldset" [attr.aria-describedby]="showError() ? 'mood-error' : null">
        <legend class="bm-card-title mb-3">Como está seu humor?</legend>
        <div class="bm-option-grid bm-option-grid--4">
          @for (opt of options; track opt.value) {
            <label class="bm-option">
              <input class="visually-hidden" type="radio" name="mood" [value]="opt.value" [formControl]="control()" />
              @switch (opt.value) {
                @case ('hard') { <svg lucideFrown [size]="26"></svg> }
                @case ('tired') { <svg lucideMeh [size]="26"></svg> }
                @case ('good') { <svg lucideSmile [size]="26"></svg> }
                @case ('great') { <svg lucideLaugh [size]="26"></svg> }
              }
              <span>{{ opt.label }}</span>
            </label>
          }
        </div>
      </fieldset>
      @if (showError()) {
        <p id="mood-error" class="bm-error mt-3 mb-0" role="alert">Escolha como está seu humor.</p>
      }
    </bm-card>
  `,
})
export class MoodPickerComponent {
  readonly control = input.required<FormControl<MoodLevel | null>>();
  protected readonly options = (Object.keys(MOOD_LABEL) as MoodLevel[]).map((value) => ({
    value,
    label: MOOD_LABEL[value],
  }));
  protected showError = () => this.control().touched && this.control().invalid;
}
