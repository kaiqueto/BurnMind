import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { BrandComponent } from '../../../shared/components/brand/brand.component';
import { NAV_ITEMS, NavItem, isNavActive } from '../../nav-items';

@Component({
  selector: 'bm-header',
  standalone: true,
  imports: [RouterLink, BrandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bm-header">
      <div class="bm-header__inner">
        <a class="bm-header__home" routerLink="/home" aria-label="BurnoutMind, ir para a Home"><bm-brand /></a>

        <nav class="bm-header__nav" aria-label="Principal">
          @for (item of items; track item.path) {
            <a
              class="bm-header__nav-link"
              [class.bm-header__nav-link--active]="active(item)"
              [routerLink]="item.path"
              [attr.aria-current]="active(item) ? 'page' : null"
              >{{ item.label }}</a
            >
          }
        </nav>

        <div class="bm-header__user">
          <span class="bm-avatar" aria-hidden="true">{{ initial() }}</span>
          <span>{{ name() }}</span>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  protected readonly items = NAV_ITEMS;
  protected readonly name = computed(() => this.userService.user().name);
  protected readonly initial = computed(() => this.name().charAt(0).toUpperCase());

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected active(item: NavItem): boolean {
    return isNavActive(item, this.url());
  }
}
