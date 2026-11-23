import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CatalogGalleryItemView } from '@nexacore/catalog';
import { CatalogFacade } from '../core/catalog-facade';
import { SeoService } from '../core/seo.service';
import { ImageFallbackDirective } from '../shared/image-fallback.directive';

@Component({
  standalone: true,
  imports: [AsyncPipe, ImageFallbackDirective],
  template: `
    <section class="page-hero page-hero--compact"><div class="container"><p class="eyebrow">Project evidence</p><h1>Gallery</h1><p>Photos, certifications, and approved video references.</p></div></section>
    <section class="section container"><div class="chip-group" aria-label="Gallery type"><button type="button" [attr.aria-pressed]="filter() === 'ALL'" (click)="filter.set('ALL')">All</button><button type="button" [attr.aria-pressed]="filter() === 'PHOTO'" (click)="filter.set('PHOTO')">Photos</button><button type="button" [attr.aria-pressed]="filter() === 'CERTIFICATION'" (click)="filter.set('CERTIFICATION')">Certifications</button></div>
      @if (facade.gallery$ | async; as items) { <div class="gallery-grid">@for (item of filtered(items); track item.id) { <figure><img catalogImageFallback [src]="item.media.url" [alt]="item.media.alternativeText"><figcaption><span class="eyebrow">{{ item.type }}</span>{{ item.title }}</figcaption></figure> }</div> }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryPageComponent {
  readonly facade = inject(CatalogFacade);
  readonly filter = signal<CatalogGalleryItemView['type'] | 'ALL'>('ALL');
  constructor() { inject(SeoService).apply({ title: 'Gallery | NexaCore Solutions', description: 'Infrastructure project and certification gallery.', canonicalPath: '/gallery' }); }
  filtered(items: readonly CatalogGalleryItemView[]) { return this.filter() === 'ALL' ? items : items.filter(item => item.type === this.filter()); }
}
