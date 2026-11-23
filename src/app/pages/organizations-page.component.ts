import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CatalogOrganizationView } from '@nexacore/catalog';
import { CatalogFacade } from '../core/catalog-facade';
import { SeoService } from '../core/seo.service';
import { ImageFallbackDirective } from '../shared/image-fallback.directive';

@Component({
  standalone: true,
  imports: [AsyncPipe, RouterLink, ImageFallbackDirective],
  template: `
    <section class="page-hero page-hero--compact"><div class="container"><p class="eyebrow">Trust and collaboration</p><h1>{{ title }}</h1><p>Approved fixture identities demonstrate the intended presentation without claiming real relationships.</p></div></section>
    <section class="section container">@if (items$ | async; as items) { @if (items.length) { <div class="logo-grid">@for (item of items; track item.id) { <article class="logo-card"><img catalogImageFallback [src]="item.logo?.url || '/assets/catalog/placeholder.svg'" [alt]="item.logo?.alternativeText || item.name"><h2>{{ item.name }}</h2></article> }</div> } @else { <div class="state-panel"><h2>No published organizations</h2></div> } }</section>
    <section class="container callout"><h2>Planning an infrastructure project?</h2><a class="button" [routerLink]="facade.localizedPath('/contact')">Talk to our team</a></section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationsPageComponent {
  readonly facade = inject(CatalogFacade);
  readonly kind = inject(ActivatedRoute).snapshot.data['kind'] as CatalogOrganizationView['kind'];
  readonly title = this.kind === 'CLIENT' ? 'Selected clients' : 'Technology partners';
  readonly items$ = this.facade.organizations$.pipe(map(items => items.filter(item => item.kind === this.kind)));
  constructor() { inject(SeoService).apply({ title: `${this.title} | NexaCore Solutions`, description: `Synthetic ${this.title.toLowerCase()} showcase.`, canonicalPath: this.kind === 'CLIENT' ? '/clients' : '/partners' }); }
}
