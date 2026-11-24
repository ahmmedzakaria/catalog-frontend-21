import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CatalogArticleSummaryView,
  CatalogCategoryView,
  CatalogContentSource,
  CatalogGalleryItemView,
  CatalogOrganizationView,
  CatalogPageContentView,
  CatalogPageView,
  CatalogProductDetailView,
  CatalogProductFilter,
  CatalogProductSummaryView,
  CatalogServiceView,
  CatalogSiteView,
  CatalogTenantContext,
  FixtureCatalogContentSource,
} from '@nexacore/catalog';
import { Observable } from 'rxjs';

/**
 * Phase 2 HTTP boundary. Site configuration is authoritative from the backend.
 * Remaining reads delegate explicitly to fixtures until their Phase 3 APIs exist.
 */
@Injectable()
export class HttpCatalogContentSource extends CatalogContentSource {
  private readonly fixtures = new FixtureCatalogContentSource();

  constructor(private readonly http: HttpClient) { super(); }

  override getSite(context: CatalogTenantContext): Observable<CatalogSiteView> {
    return this.http.get<CatalogSiteView>('/api/v1/public/site', {
      headers: { 'X-Client-Code': 'CATALOG' },
      params: new HttpParams().set('lang', context.locale),
      transferCache: false,
    });
  }

  override getCategories(context: CatalogTenantContext): Observable<readonly CatalogCategoryView[]> {
    return this.fixtures.getCategories(context);
  }
  override getProducts(context: CatalogTenantContext, filter: CatalogProductFilter): Observable<CatalogPageView<CatalogProductSummaryView>> {
    return this.fixtures.getProducts(context, filter);
  }
  override getProduct(context: CatalogTenantContext, slug: string): Observable<CatalogProductDetailView | null> {
    return this.fixtures.getProduct(context, slug);
  }
  override getPage(context: CatalogTenantContext, slug: string): Observable<CatalogPageContentView | null> {
    return this.fixtures.getPage(context, slug);
  }
  override getServices(context: CatalogTenantContext): Observable<readonly CatalogServiceView[]> {
    return this.fixtures.getServices(context);
  }
  override getArticles(context: CatalogTenantContext): Observable<readonly CatalogArticleSummaryView[]> {
    return this.fixtures.getArticles(context);
  }
  override getOrganizations(context: CatalogTenantContext): Observable<readonly CatalogOrganizationView[]> {
    return this.fixtures.getOrganizations(context);
  }
  override getGallery(context: CatalogTenantContext): Observable<readonly CatalogGalleryItemView[]> {
    return this.fixtures.getGallery(context);
  }
}
