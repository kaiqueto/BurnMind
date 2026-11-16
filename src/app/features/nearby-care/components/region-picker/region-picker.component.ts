import { ChangeDetectionStrategy, Component, ElementRef, effect, input, output, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideMapPin, LucideSlidersHorizontal } from '@lucide/angular';
import { REGION_MAX_LENGTH } from '../../services/region.service';

/** Mostra a região informada e permite alterá-la. Nenhuma localização é acessada. */
@Component({
  selector: 'bm-region-picker',
  standalone: true,
  imports: [ReactiveFormsModule, LucideMapPin, LucideSlidersHorizontal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!editing()) {
      <div class="d-flex flex-wrap align-items-center gap-2">
        <span class="bm-chip"><svg lucideMapPin [size]="14"></svg>{{ region() || 'Região não informada' }}</span>
        <button type="button" class="btn btn-outline-secondary btn-sm" (click)="edit()">
          <svg lucideSlidersHorizontal [size]="14"></svg>{{ region() ? 'Alterar região' : 'Informar região' }}
        </button>
      </div>
    } @else {
      <form class="d-flex flex-wrap align-items-end gap-2" (submit)="save($event)">
        <div class="flex-grow-1">
          <label for="region" class="form-label small fw-bold mb-1">Cidade e UF</label>
          <input
            #field
            id="region"
            class="form-control"
            type="text"
            autocomplete="off"
            placeholder="Ex.: São Paulo, SP"
            [maxlength]="maxLength"
            [formControl]="control"
          />
        </div>
        <button type="submit" class="btn btn-primary">Salvar</button>
        <button type="button" class="btn btn-outline-secondary" (click)="cancel()">Cancelar</button>
      </form>
    }
  `,
})
export class RegionPickerComponent {
  readonly region = input('');
  readonly saved = output<string>();

  protected readonly editing = signal(false);
  protected readonly control = new FormControl('', { nonNullable: true });
  protected readonly maxLength = REGION_MAX_LENGTH;
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  constructor() {
    // Ao abrir a edição, leva o foco ao campo.
    effect(() => {
      const el = this.field()?.nativeElement;
      if (el) el.focus();
    });
  }

  protected edit(): void {
    this.control.setValue(this.region());
    this.editing.set(true);
  }

  protected cancel(): void {
    this.editing.set(false);
  }

  protected save(event: Event): void {
    event.preventDefault();
    this.saved.emit(this.control.value.trim());
    this.editing.set(false);
  }
}
