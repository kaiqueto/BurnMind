import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideSearch } from '@lucide/angular';

/** Campo de busca de temas. Recebe o FormControl do pai. */
@Component({
  selector: 'bm-topic-search',
  standalone: true,
  imports: [ReactiveFormsModule, LucideSearch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
  template: `
    <div class="bm-search">
      <svg lucideSearch class="bm-search__icon" [size]="18"></svg>
      <label for="topic-search" class="visually-hidden">Buscar um tema</label>
      <input
        id="topic-search"
        class="form-control bm-search__input"
        type="search"
        autocomplete="off"
        placeholder="Buscar um tema"
        [formControl]="control()"
      />
    </div>
  `,
})
export class TopicSearchComponent {
  readonly control = input.required<FormControl<string>>();
}
