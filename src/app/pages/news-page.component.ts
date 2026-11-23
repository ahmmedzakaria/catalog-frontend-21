import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogFacade } from '../core/catalog-facade';
import { SeoService } from '../core/seo.service';
import { ImageFallbackDirective } from '../shared/image-fallback.directive';

@Component({
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink, ImageFallbackDirective],
  template: `
    <section class="page-hero page-hero--compact"><div class="container"><p class="eyebrow">Knowledge</p><h1>Technical news and guidance</h1><p>Practical notes for infrastructure planning and operations.</p></div></section>
    <section class="section container">@if (facade.articles$ | async; as articles) { @if (articles.length) { <div class="content-grid">@for (article of articles; track article.id) { <article class="image-card image-card--vertical"><img catalogImageFallback [src]="article.heroImage?.url || '/assets/catalog/placeholder.svg'" [alt]="article.heroImage?.alternativeText || article.title"><div><p class="eyebrow">{{ article.publishedAt | date:'longDate' }}</p><h2><a [routerLink]="facade.localizedPath('/news/' + article.slug)">{{ article.title }}</a></h2><p>{{ article.excerpt }}</p><div class="tag-list">@for (tag of article.tags; track tag) { <span>{{ tag }}</span> }</div></div></article> }</div> } @else { <div class="state-panel"><h2>No published articles</h2></div> } }</section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsPageComponent {
  readonly facade = inject(CatalogFacade);
  constructor() { inject(SeoService).apply({ title: 'News | NexaCore Solutions', description: 'Technical infrastructure guidance and company news.', canonicalPath: '/news' }); }
}
