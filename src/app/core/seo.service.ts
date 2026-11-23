import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CATALOG_ROUTE_MANIFEST, CatalogSeoView } from '@nexacore/catalog';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(seo: CatalogSeoView, structuredData?: Readonly<Record<string, unknown>>): void {
    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'robots', content: seo.noIndex ? 'noindex,nofollow' : 'index,follow' });
    this.setCanonical(seo.canonicalPath);
    this.setStructuredData(structuredData);
  }

  sitemapPaths(): readonly string[] {
    return CATALOG_ROUTE_MANIFEST
      .filter(route => route.prerender && !route.path.includes(':'))
      .flatMap(route => route.localized ? [route.path, `/bn${route.path === '/' ? '' : route.path}`] : [route.path]);
  }

  robots(origin: string): string {
    return `User-agent: *\nAllow: /\nDisallow: /preview/\nSitemap: ${origin}/sitemap.xml\n`;
  }

  private setCanonical(path: string): void {
    this.document.head.querySelector('link[rel="canonical"]')?.remove();
    const link = this.document.createElement('link');
    link.rel = 'canonical';
    link.setAttribute('href', path);
    this.document.head.appendChild(link);
  }

  private setStructuredData(data?: Readonly<Record<string, unknown>>): void {
    this.document.head.querySelector('script[data-catalog-structured-data]')?.remove();
    if (!data) return;
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-catalog-structured-data', 'true');
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    this.document.head.appendChild(script);
  }
}
