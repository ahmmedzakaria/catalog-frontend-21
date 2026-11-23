import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogProductSummaryView } from '@nexacore/catalog';
import { map } from 'rxjs';
import { CatalogFacade } from '../core/catalog-facade';
import { SeoService } from '../core/seo.service';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  standalone: true,
  imports: [AsyncPipe, RouterLink, ProductCardComponent],
  template: `
    <section class="page-hero page-hero--compact"><div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a [routerLink]="facade.localizedPath('/')">Home</a><span>/</span><span>Products</span></nav>
      <p class="eyebrow">Product catalog</p><h1>{{ categoryName() }}</h1><p>Compare representative fixture products and request a tailored quotation.</p>
    </div></section>
    <div class="container catalog-layout">
      <aside class="filter-panel" aria-label="Product filters">
        <h2>Categories</h2><a [routerLink]="facade.localizedPath('/products')">All products</a>
        @if (facade.categories$ | async; as categories) { @for (category of categories; track category.id) { <a [routerLink]="facade.localizedPath('/products/' + category.slug)">{{ facade.text(category.translations).name }}</a> } }
      </aside>
      <section>
        <div class="result-toolbar"><label for="product-search">Search products</label><input id="product-search" type="search" [value]="query()" (input)="setQuery($event)" placeholder="Name or description"><span aria-live="polite">{{ filteredProducts().length }} results</span></div>
        @if (filteredProducts().length) {
          <div class="product-grid">@for (product of pagedProducts(); track product.id) { <catalog-product-card [product]="product" /> }</div>
          <nav class="pagination" aria-label="Product pages">
            <button type="button" (click)="previous()" [disabled]="page() === 0">Previous</button><span>Page {{ page() + 1 }} of {{ totalPages() }}</span><button type="button" (click)="next()" [disabled]="page() + 1 >= totalPages()">Next</button>
          </nav>
        } @else { <div class="state-panel"><h2>No products found</h2><p>Try a broader term or clear the search.</p><button class="button button--secondary" type="button" (click)="query.set('')">Clear search</button></div> }
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPageComponent {
  readonly facade = inject(CatalogFacade);
  private readonly route = inject(ActivatedRoute);
  readonly categorySlug = this.route.snapshot.paramMap.get('categorySlug') ?? undefined;
  readonly query = signal('');
  readonly page = signal(0);
  readonly pageSize = 6;
  readonly allProducts = signal<readonly CatalogProductSummaryView[]>([]);
  readonly filteredProducts = computed(() => {
    const query = this.query().trim().toLocaleLowerCase(this.facade.locale());
    return this.allProducts().filter(product => !query || product.translations.some(item => `${item.name} ${item.summary ?? ''}`.toLocaleLowerCase(item.locale).includes(query)));
  });
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize)));
  readonly pagedProducts = computed(() => this.filteredProducts().slice(this.page() * this.pageSize, (this.page() + 1) * this.pageSize));
  readonly categoryName = signal('All products');

  constructor() {
    this.facade.products({ categorySlug: this.categorySlug, page: 0, size: 100 }).subscribe(result => this.allProducts.set(result.items));
    this.facade.categories$.pipe(map(categories => categories.find(item => item.slug === this.categorySlug))).subscribe(category => {
      if (category) this.categoryName.set(this.facade.text(category.translations).name);
    });
    inject(SeoService).apply({ title: 'Products | NexaCore Solutions', description: 'Browse infrastructure products and request a quotation.', canonicalPath: this.categorySlug ? `/products/${this.categorySlug}` : '/products' });
  }

  setQuery(event: Event): void { this.query.set((event.target as HTMLInputElement).value); this.page.set(0); }
  previous(): void { this.page.update(value => Math.max(0, value - 1)); }
  next(): void { this.page.update(value => Math.min(this.totalPages() - 1, value + 1)); }
}
