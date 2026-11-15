import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideBatteryFull, LucideBatteryLow, LucideBatteryMedium } from '@lucide/angular';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ENERGY_LABEL, EnergyLevel } from '../../../../shared/models/burnoutmind.models';

/** Seleção de energia (3 opções). */
@Component({
  selector: 'bm-energy-picker',
  standalone: true,
  imports: [ReactiveFormsModule, CardComponent, LucideBatteryLow, LucideBatteryMedium, LucideBatteryFull],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bm-card>
      <fieldset class="bm-fieldset" [attr.aria-describedby]="showError() ? 'energy-error' : null">
        <legend class="bm-card-title mb-3">E sua energia?</legend>
        <div class="bm-option-grid bm-option-grid--3">
          @for (opt of options; track opt.value) {
            <label class="bm-option">
              <input class="visually-hidden" type="radio" name="energy" [value]="opt.value" [formControl]="control()" />
              @switch (opt.value) {
                @case ('low') { <svg lucideBatteryLow [size]="26"></svg> }
                @case ('medium') { <svg lucideBatteryMedium [size]="26"></svg> }
                @case ('high') { <svg lucideBatteryFull [size]="26"></svg> }
              }
              <span>{{ opt.label }}</span>
            </label>
          }
        </div>
      </fieldset>
      @if (showError()) {
        <p id="energy-error" class="bm-error mt-3 mb-0" role="alert">Escolha como está sua energia.</p>
      }
    </bm-card>
  `,
})
export class EnergyPickerComponent {
  readonly control = input.required<FormControl<EnergyLevel | null>>();
  protected readonly options = (Object.keys(ENERGY_LABEL) as EnergyLevel[]).map((value) => ({
    value,
    label: ENERGY_LABEL[value],
  }));
  protected showError = () => this.control().touched && this.control().invalid;
}
