import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideCheck } from '@lucide/angular';
import { PageHeaderComponent } from '../../layout/components/page-header/page-header.component';
import { EnergyLevel, MoodLevel } from '../../shared/models/burnoutmind.models';
import { formatShortDate } from '../../shared/utils/date';
import { EnergyPickerComponent } from './components/energy-picker/energy-picker.component';
import { MoodPickerComponent } from './components/mood-picker/mood-picker.component';
import { NOTE_MAX_LENGTH, NoteFieldComponent } from './components/note-field/note-field.component';
import { CheckInService } from './services/check-in.service';

/** Rota após salvar: o calendário já mostra o registro do dia. */
export const AFTER_SAVE_ROUTE = '/calendario';

/** SCR-03 — Check-in diário (/check-in). RF-05, RF-06, RN-04. */
@Component({
  selector: 'bm-check-in-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    MoodPickerComponent,
    EnergyPickerComponent,
    NoteFieldComponent,
    LucideCheck,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bm-page">
      <bm-page-header
        eyebrow="No seu ritmo"
        backLink="/home"
        title="Um minuto para você"
        [subtitle]="subtitle"
      />

      <form class="row g-4" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="col-lg-6 d-flex flex-column gap-4">
          <bm-mood-picker [control]="form.controls.mood" />
          <bm-energy-picker [control]="form.controls.energy" />
        </div>

        <div class="col-lg-6 d-flex flex-column gap-3">
          <bm-note-field [control]="form.controls.note" />

          @if (saveError()) {
            <p class="bm-error mb-0" role="alert">
              Não foi possível salvar neste navegador. Verifique se o armazenamento está liberado e tente
              de novo.
            </p>
          }

          <button class="btn btn-primary btn-lg w-100" type="submit" [attr.aria-busy]="saving()">
            <svg lucideCheck [size]="18"></svg>{{ saving() ? 'Salvando…' : 'Salvar check-in' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class CheckInPageComponent {
  private readonly checkIns = inject(CheckInService);
  private readonly router = inject(Router);

  protected readonly subtitle = `${formatShortDate(new Date())} • Check-in diário`;
  protected readonly saving = signal(false);
  protected readonly saveError = signal(false);

  protected readonly form = new FormGroup({
    mood: new FormControl<MoodLevel | null>(null, Validators.required),
    energy: new FormControl<EnergyLevel | null>(null, Validators.required),
    note: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(NOTE_MAX_LENGTH)] }),
  });

  constructor() {
    // RF-06: se já existe check-in hoje, pré-preenche para edição (sem sobrescrever o que o usuário já mexeu).
    effect(() => {
      const today = this.checkIns.today();
      if (today && this.form.pristine) {
        this.form.patchValue({ mood: today.mood, energy: today.energy, note: today.note ?? '' });
      }
    });
  }

  protected async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;

    this.saving.set(true);
    this.saveError.set(false);
    try {
      const { mood, energy, note } = this.form.getRawValue();
      await this.checkIns.save({ mood: mood!, energy: energy!, note });
      await this.router.navigateByUrl(AFTER_SAVE_ROUTE);
    } catch {
      this.saveError.set(true);
    } finally {
      this.saving.set(false);
    }
  }
}
