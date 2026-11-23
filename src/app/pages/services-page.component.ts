import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogFacade } from '../core/catalog-facade';
import { SeoService } from '../core/seo.service';
import { ImageFallbackDirective } from '../shared/image-fallback.directive';

@Component({
  standalone: true,
  imports: [AsyncPipe, RouterLink, ImageFallbackDirective],
  template: `
    <section class="page-hero"><div class="container"><p class="eyebrow">Services</p><h1>From requirements to operational handover</h1><p class="lead">Practical infrastructure services built around measurable outcomes.</p></div></section>
    <section class="section container">
      @if (facade.services$ | async; as services) { <div class="content-grid">@for (service of services; track service.id) {
        <article class="image-card image-card--vertical"><img catalogImageFallback [src]="service.image?.url || '/assets/catalog/placeholder.svg'" [alt]="service.image?.alternativeText || facade.text(service.translations).name"><div><h2>{{ facade.text(service.translations).name }}</h2><p>{{ facade.text(service.translations).summary }}</p><a class="text-link" [routerLink]="facade.localizedPath('/services/' + service.slug)">View service <span aria-hidden="true">→</span></a></div></article>
      }</div> }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPageComponent {
  readonly facade = inject(CatalogFacade);
  constructor() { inject(SeoService).apply({ title: 'Services | NexaCore Solutions', description: 'Infrastructure design, implementation, and support services.', canonicalPath: '/services' }); }
}
