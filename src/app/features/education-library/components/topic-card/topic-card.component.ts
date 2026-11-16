import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideActivity, LucideArrowUpRight, LucideCloud, LucideFlame, LucideMoon, LucideWind } from '@lucide/angular';
import { EducationTopic } from '../../../../shared/models/burnoutmind.models';

/** Cartão de tema. Só vira link quando o tema tem conteúdo; senão mostra "Em breve". */
@Component({
  selector: 'bm-topic-card',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink, LucideFlame, LucideWind, LucideCloud, LucideActivity, LucideMoon, LucideArrowUpRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block h-100' },
  template: `
    <ng-template #body>
      <div class="d-flex justify-content-between align-items-start mb-3">
        <span class="bm-icon-tile" aria-hidden="true">
          @switch (topic().icon) {
            @case ('flame') { <svg lucideFlame [size]="20"></svg> }
            @case ('wind') { <svg lucideWind [size]="20"></svg> }
            @case ('cloud') { <svg lucideCloud [size]="20"></svg> }
            @case ('activity') { <svg lucideActivity [size]="20"></svg> }
            @case ('moon') { <svg lucideMoon [size]="20"></svg> }
          }
        </span>
        @if (topic().content) {
          <svg lucideArrowUpRight class="bm-icon-strong" [size]="18" aria-hidden="true"></svg>
        }
      </div>
      <h2 class="bm-card-title">{{ topic().title }}</h2>
      <p class="bm-muted flex-grow-1">{{ topic().summary }}</p>
      @if (topic().content) {
        <span class="bm-eyebrow">{{ topic().tag }}</span>
      } @else {
        <span class="bm-chip bm-chip--outline align-self-start">Conteúdo em breve</span>
      }
    </ng-template>

    @if (topic().content) {
      <a class="bm-topic-card" [routerLink]="['/doencas', topic().slug]">
        <ng-container [ngTemplateOutlet]="body" />
      </a>
    } @else {
      <div class="bm-topic-card bm-topic-card--soon">
        <ng-container [ngTemplateOutlet]="body" />
      </div>
    }
  `,
})
export class TopicCardComponent {
  readonly topic = input.required<EducationTopic>();
}
