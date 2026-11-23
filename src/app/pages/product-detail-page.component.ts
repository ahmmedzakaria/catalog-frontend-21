import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogFacade } from '../core/catalog-facade';
import { SeoService } from '../core/seo.service';
import { ImageFallbackDirective } from '../shared/image-fallback.directive';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  standalone: true,
  imports: [AsyncPipe, RouterLink, ImageFallbackDirective, ProductCardComponent],
  template: `
    @if (product$ | async; as product) {
      <div class="container detail-page">
        <nav class="breadcrumb" aria-label="Breadcrumb"><a [routerLink]="facade.localizedPath('/')">Home</a><span>/</span><a [routerLink]="facade.localizedPath('/products')">Products</a><span>/</span><span>{{ facade.text(product.translations).name }}</span></nav>
        <section class="product-detail">
          <div class="product-gallery"><img catalogImageFallback [src]="product.primaryImage?.url || '/assets/catalog/placeholder.svg'" [alt]="product.primaryImage?.alternativeText || facade.text(product.translations).name"></div>
          <div><p class="eyebrow">{{ product.brand?.name || 'Infrastructure product' }}</p><h1>{{ facade.text(product.translations).name }}</h1><p class="lead">{{ facade.text(product.translations).summary }}</p><p><strong>Model:</strong> {{ product.model }}</p><a class="button" [routerLink]="facade.localizedPath('/contact')" [queryParams]="{ product: product.slug }">Request a quote</a></div>
        </section>
        <section class="section"><h2>Specifications</h2><div class="specification-list">@for (specification of product.specifications; track specification.group + specification.label) { <div><span>{{ specification.label }}</span><strong>{{ specification.value }} {{ specification.unit }}</strong></div> }</div></section>
        <section class="section"><h2>Documents</h2>@if (product.documents.length) { @for (document of product.documents; track document.id) { <a [href]="document.media.url">{{ document.label }}</a> } } @else { <div class="state-panel state-panel--compact">Documents will be supplied with the quotation.</div> }</section>
        <section class="section"><h2>Related products</h2><div class="product-grid">@for (related of product.relatedProducts; track related.id) { <catalog-product-card [product]="related" /> }</div></section>
      </div>
    } @else { <section class="container state-panel"><h1>Product not found</h1><p>This fixture product is unavailable.</p><a class="button" [routerLink]="facade.localizedPath('/products')">Browse products</a></section> }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPageComponent {
  readonly facade = inject(CatalogFacade);
  readonly slug = inject(ActivatedRoute).snapshot.paramMap.get('productSlug') ?? '';
  readonly product$ = this.facade.product(this.slug);

  constructor() {
    inject(SeoService).apply({ title: 'Product details | NexaCore Solutions', description: 'Product specifications and quotation information.', canonicalPath: `/product/${this.slug}` }, { '@context': 'https://schema.org', '@type': 'Product', name: this.slug });
  }
}
