import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CatalogContentSource,
  CatalogLocale,
  CatalogLocalizedText,
  CatalogProductFilter,
  CatalogTenantContext,
} from '@nexacore/catalog';
import { toObservable } from '@angular/core/rxjs-interop';
import { shareReplay, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CatalogFacade {
  private readonly source = inject(CatalogContentSource);
  readonly locale = signal<CatalogLocale>('en');
  readonly context = computed<CatalogTenantContext>(() => ({
    siteKey: 'nexacore-solutions-demo',
    hostname: 'catalog.localhost',
    locale: this.locale(),
  }));
  private readonly context$ = toObservable(this.context);

  readonly site$ = this.context$.pipe(
    switchMap(context => this.source.getSite(context)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  readonly categories$ = this.context$.pipe(
    switchMap(context => this.source.getCategories(context)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  readonly services$ = this.context$.pipe(
    switchMap(context => this.source.getServices(context)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  readonly articles$ = this.context$.pipe(
    switchMap(context => this.source.getArticles(context)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  readonly organizations$ = this.context$.pipe(
    switchMap(context => this.source.getOrganizations(context)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  readonly gallery$ = this.context$.pipe(
    switchMap(context => this.source.getGallery(context)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  products(filter: CatalogProductFilter) {
    return this.source.getProducts(this.context(), filter);
  }

  product(slug: string) {
    return this.source.getProduct(this.context(), slug);
  }

  page(slug: string) {
    return this.source.getPage(this.context(), slug);
  }

  pageStream(slug: string) {
    return this.context$.pipe(switchMap(context => this.source.getPage(context, slug)));
  }

  text(translations: readonly CatalogLocalizedText[]): CatalogLocalizedText {
    return translations.find(item => item.locale === this.locale())
      ?? translations.find(item => item.locale === 'en')
      ?? { locale: this.locale(), name: '' };
  }

  localizedPath(path: string, locale = this.locale()): string {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return locale === 'bn' ? `/bn${normalized === '/' ? '' : normalized}` : normalized;
  }
}
