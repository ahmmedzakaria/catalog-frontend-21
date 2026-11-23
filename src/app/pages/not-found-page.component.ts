import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogFacade } from '../core/catalog-facade';
import { SeoService } from '../core/seo.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `<section class="container state-panel not-found"><p class="eyebrow">404</p><h1>Page not found</h1><p>The requested fixture page does not exist.</p><a class="button" [routerLink]="facade.localizedPath('/')">Return home</a></section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {
  readonly facade = inject(CatalogFacade);
  constructor() { inject(SeoService).apply({ title: 'Page not found | NexaCore Solutions', description: 'The requested page was not found.', canonicalPath: '/404', noIndex: true }); }
}
