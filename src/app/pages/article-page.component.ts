import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CatalogFacade } from '../core/catalog-facade';
import { SeoService } from '../core/seo.service';
import { ImageFallbackDirective } from '../shared/image-fallback.directive';

@Component({
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink, ImageFallbackDirective],
  template: `
    @if (article$ | async; as article) {
      @if (article) { <article><header class="page-hero"><div class="container reading-width"><nav class="breadcrumb" aria-label="Breadcrumb"><a [routerLink]="facade.localizedPath('/news')">News</a><span>/</span><span>Article</span></nav><p class="eyebrow">{{ article.publishedAt | date:'longDate' }}</p><h1>{{ article.title }}</h1><p class="lead">{{ article.excerpt }}</p></div></header>
        <div class="container reading-width article-body"><img catalogImageFallback [src]="article.heroImage?.url || '/assets/catalog/placeholder.svg'" [alt]="article.heroImage?.alternativeText || article.title"><h2>Start with operating requirements</h2><p>Document capacity, environment, maintainability, compliance, and handover expectations before selecting equipment. This fixture article demonstrates the intended readable layout without representing production advice.</p><h2>Validate before handover</h2><p>Agree test evidence, labeling, drawings, asset records, and ownership before implementation begins.</p><a class="button" [routerLink]="facade.localizedPath('/contact')">Discuss your requirements</a></div></article>
      } @else { <div class="container state-panel"><h1>Article not found</h1><a [routerLink]="facade.localizedPath('/news')">Back to news</a></div> }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlePageComponent {
  readonly facade = inject(CatalogFacade);
  readonly slug = inject(ActivatedRoute).snapshot.paramMap.get('articleSlug') ?? '';
  readonly article$ = this.facade.articles$.pipe(map(items => items.find(item => item.slug === this.slug) ?? null));
  constructor() { inject(SeoService).apply({ title: 'Article | NexaCore Solutions', description: 'Technical infrastructure guidance.', canonicalPath: `/news/${this.slug}` }, { '@context': 'https://schema.org', '@type': 'Article', headline: this.slug }); }
}
