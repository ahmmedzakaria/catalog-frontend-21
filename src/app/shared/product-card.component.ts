import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogProductSummaryView } from '@nexacore/catalog';
import { CatalogFacade } from '../core/catalog-facade';
import { ImageFallbackDirective } from './image-fallback.directive';

@Component({
  selector: 'catalog-product-card',
  standalone: true,
  imports: [RouterLink, ImageFallbackDirective],
  template: `
    <article class="product-card">
      <a class="product-card__image" [routerLink]="facade.localizedPath('/product/' + product().slug)" tabindex="-1">
        <img catalogImageFallback [src]="product().primaryImage?.url || '/assets/catalog/placeholder.svg'"
             [alt]="product().primaryImage?.alternativeText || text().name" loading="lazy">
      </a>
      <div class="product-card__body">
        @if (product().brand; as brand) { <p class="eyebrow">{{ brand.name }}</p> }
        <h3><a [routerLink]="facade.localizedPath('/product/' + product().slug)">{{ text().name }}</a></h3>
        <p>{{ text().summary }}</p>
        @if (product().model) { <p class="product-card__model">Model {{ product().model }}</p> }
        <a class="text-link" [routerLink]="facade.localizedPath('/product/' + product().slug)">View details <span aria-hidden="true">→</span></a>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  readonly product = input.required<CatalogProductSummaryView>();
  readonly facade = inject(CatalogFacade);
  readonly text = () => this.facade.text(this.product().translations);
}
