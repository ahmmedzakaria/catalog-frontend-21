import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CatalogFacade } from '../core/catalog-facade';
import { SeoService } from '../core/seo.service';
import { ImageFallbackDirective } from '../shared/image-fallback.directive';

@Component({
  standalone: true,
  imports: [AsyncPipe, RouterLink, ImageFallbackDirective],
  template: `
    @if (service$ | async; as service) {
      @if (service) { <section class="page-hero"><div class="container split-hero"><div><nav class="breadcrumb" aria-label="Breadcrumb"><a [routerLink]="facade.localizedPath('/services')">Services</a><span>/</span><span>{{ facade.text(service.translations).name }}</span></nav><p class="eyebrow">Service</p><h1>{{ facade.text(service.translations).name }}</h1><p class="lead">{{ facade.text(service.translations).summary }}</p><a class="button" [routerLink]="facade.localizedPath('/contact')">Discuss a project</a></div><img catalogImageFallback [src]="service.image?.url || '/assets/catalog/placeholder.svg'" [alt]="service.image?.alternativeText || facade.text(service.translations).name"></div></section>
        <section class="section container reading-width"><h2>Delivery approach</h2><p>We start with operating requirements, document constraints, coordinate implementation, validate the result, and hand over maintainable records.</p><ol class="process-list"><li>Discovery and site assessment</li><li>Solution design and product selection</li><li>Coordinated implementation</li><li>Testing, documentation, and handover</li></ol></section>
      } @else { <div class="container state-panel"><h1>Service not found</h1><a [routerLink]="facade.localizedPath('/services')">View all services</a></div> }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetailPageComponent {
  readonly facade = inject(CatalogFacade);
  readonly slug = inject(ActivatedRoute).snapshot.paramMap.get('serviceSlug') ?? '';
  readonly service$ = this.facade.services$.pipe(map(services => services.find(service => service.slug === this.slug) ?? null));
  constructor() { inject(SeoService).apply({ title: 'Service | NexaCore Solutions', description: 'Infrastructure service delivery approach.', canonicalPath: `/services/${this.slug}` }); }
}
