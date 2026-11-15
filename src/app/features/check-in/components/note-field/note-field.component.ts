import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideShieldCheck } from '@lucide/angular';
import { CardComponent } from '../../../../shared/components/card/card.component';

export const NOTE_MAX_LENGTH = 500;

/** Nota opcional e privada do check-in. */
@Component({
  selector: 'bm-note-field',
  standalone: true,
  imports: [ReactiveFormsModule, CardComponent, LucideShieldCheck],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bm-card>
      <div class="d-flex justify-content-between align-items-baseline gap-3 mb-3">
        <label id="note-label" for="note" class="bm-card-title mb-0">Quer contar um pouco?</label>
        <span class="small bm-muted">Opcional</span>
      </div>
      <textarea
        id="note"
        class="form-control bm-note"
        rows="5"
        [maxlength]="maxLength"
        [formControl]="control()"
        aria-describedby="note-hint"
      ></textarea>
      <div class="d-flex justify-content-between small bm-muted mt-1">
        <span>Anotação só para o seu cuidado</span>
        <span aria-live="off">{{ control().value.length }}/{{ maxLength }}</span>
      </div>
      <p id="note-hint" class="bm-disclaimer mt-3">
        <svg lucideShieldCheck [size]="16"></svg>
        <span>
          Sua nota é pessoal. Evite dados sensíveis de outras pessoas. Você escolhe o que registrar e
          compartilhar.
        </span>
      </p>
    </bm-card>
  `,
})
export class NoteFieldComponent {
  readonly control = input.required<FormControl<string>>();
  protected readonly maxLength = NOTE_MAX_LENGTH;
}
