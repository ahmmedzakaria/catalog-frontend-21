import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogFacade } from '../core/catalog-facade';
import { SeoService } from '../core/seo.service';

const CONTENT = {
  about: {
    eyebrow: 'About us', title: 'Infrastructure decisions made clearer',
    introduction: 'NexaCore Solutions is a synthetic Phase 1 company profile demonstrating how approved corporate content will be presented.',
    sections: [
      ['Our approach', 'We connect requirements, product selection, implementation evidence, and operational handover in one accountable delivery path.'],
      ['What matters', 'Maintainability, security, documentation, and measurable acceptance criteria guide the solution.'],
    ],
  },
  privacy: {
    eyebrow: 'Legal', title: 'Privacy notice', introduction: 'This fixture application does not transmit or persist contact-form data.',
    sections: [
      ['Information handling', 'Production privacy content must identify the controller, lawful purposes, retention periods, processors, rights, and contact channel.'],
      ['Fixture limitation', 'Values entered into the demonstration form remain in the browser and are discarded on navigation or refresh.'],
    ],
  },
  terms: {
    eyebrow: 'Legal', title: 'Website terms', introduction: 'These synthetic terms are placeholders for reviewed legal content.',
    sections: [
      ['Catalog information', 'Product information is illustrative and does not constitute an offer, warranty, or confirmed availability.'],
      ['Quotation', 'Commercial terms apply only after an authorized written quotation is issued and accepted.'],
    ],
  },
} as const;

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="page-hero"><div class="container reading-width"><nav class="breadcrumb" aria-label="Breadcrumb"><a [routerLink]="facade.localizedPath('/')">Home</a><span>/</span><span>{{ content.title }}</span></nav><p class="eyebrow">{{ content.eyebrow }}</p><h1>{{ content.title }}</h1><p class="lead">{{ content.introduction }}</p></div></header>
    <article class="section container reading-width">@for (section of content.sections; track section[0]) { <section><h2>{{ section[0] }}</h2><p>{{ section[1] }}</p></section> }
      @if (pageKey === 'about') { <div class="callout"><h2>Ready to plan your project?</h2><a class="button" [routerLink]="facade.localizedPath('/contact')">Contact the team</a></div> }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticPageComponent {
  readonly facade = inject(CatalogFacade);
  readonly pageKey = inject(ActivatedRoute).snapshot.data['page'] as keyof typeof CONTENT;
  readonly content = CONTENT[this.pageKey];
  constructor() { inject(SeoService).apply({ title: `${this.content.title} | NexaCore Solutions`, description: this.content.introduction, canonicalPath: this.pageKey === 'about' ? '/about' : `/${this.pageKey}` }); }
}
