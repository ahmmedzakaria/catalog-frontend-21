import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogFacade } from '../core/catalog-facade';
import { SeoService } from '../core/seo.service';
import { ImageFallbackDirective } from '../shared/image-fallback.directive';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  standalone: true,
  imports: [AsyncPipe, RouterLink, ImageFallbackDirective, ProductCardComponent],
  template: `
    @if (page$ | async; as page) {
      @for (section of page.sections; track section.id) {
        @switch (section.type) {
          @case ('HERO') {
            <section class="hero">
              <div class="container hero__grid">
                <div><p class="eyebrow">Infrastructure solutions</p><h1>{{ section.heading }}</h1><p class="lead">{{ section.body }}</p>
                  <div class="actions">
                    @if (section.primaryAction) { <a class="button" [routerLink]="facade.localizedPath(section.primaryAction.path)">{{ section.primaryAction.label }}</a> }
                    @if (section.secondaryAction) { <a class="button button--secondary" [routerLink]="facade.localizedPath(section.secondaryAction.path)">{{ section.secondaryAction.label }}</a> }
                  </div>
                </div>
                @if (section.image) { <img catalogImageFallback [src]="section.image.url" [alt]="section.image.alternativeText"> }
              </div>
            </section>
          }
          @case ('FEATURE_GRID') {
            <section class="section container"><div class="section-heading"><p class="eyebrow">Our approach</p><h2>{{ section.heading }}</h2></div>
              <div class="feature-grid">@for (item of section.items; track item.id) { <article class="surface-card"><h3>{{ item.title }}</h3><p>{{ item.description }}</p></article> }</div>
            </section>
          }
        }
      }
    } @else { <div class="container state-panel" aria-live="polite">Loading the catalog experience…</div> }

    <section class="section container">
      <div class="section-heading"><p class="eyebrow">Browse</p><h2>Product categories</h2><a [routerLink]="facade.localizedPath('/products')">View all products</a></div>
      @if (facade.categories$ | async; as categories) {
        <div class="category-grid">@for (category of categories; track category.id) {
          <a class="image-card" [routerLink]="facade.localizedPath('/products/' + category.slug)">
            <img catalogImageFallback [src]="category.image?.url || '/assets/catalog/placeholder.svg'" [alt]="category.image?.alternativeText || facade.text(category.translations).name">
            <span><strong>{{ facade.text(category.translations).name }}</strong><small>{{ category.productCount }} products</small></span>
          </a>
        }</div>
      }
    </section>

    <section class="section section--tint"><div class="container"><div class="section-heading"><p class="eyebrow">Selected products</p><h2>Featured solutions</h2></div>
      @if (featured$ | async; as products) { <div class="product-grid">@for (product of products.items; track product.id) { <catalog-product-card [product]="product" /> }</div> }
    </div></section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly facade = inject(CatalogFacade);
  readonly page$ = this.facade.pageStream('');
  readonly featured$ = this.facade.products({ featured: true, page: 0, size: 3 });

  constructor() {
    inject(SeoService).apply({
      title: 'NexaCore Solutions | IT infrastructure and security',
      description: 'Explore network, data center, power, and security infrastructure products and services.',
      canonicalPath: '/',
    }, { '@context': 'https://schema.org', '@type': 'Organization', name: 'NexaCore Solutions' });
  }
}
