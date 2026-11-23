import { AsyncPipe, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { CatalogLocale } from '@nexacore/catalog';
import { CatalogFacade } from './core/catalog-facade';

@Component({
  selector: 'catalog-root',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly facade = inject(CatalogFacade);
  readonly menuOpen = signal(false);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  constructor() {
    const destroyRef = inject(DestroyRef);
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed(destroyRef),
    ).subscribe(event => {
      const locale: CatalogLocale = event.urlAfterRedirects === '/bn' || event.urlAfterRedirects.startsWith('/bn/') ? 'bn' : 'en';
      this.facade.locale.set(locale);
      this.document.documentElement.lang = locale;
      this.menuOpen.set(false);
    });
  }

  switchLocale(locale: CatalogLocale): void {
    const cleanPath = this.router.url.split('?')[0].replace(/^\/bn(?=\/|$)/, '') || '/';
    void this.router.navigateByUrl(this.facade.localizedPath(cleanPath, locale));
  }
}
