import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { ProductListPageComponent } from './pages/product-list-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page.component';
import { ServicesPageComponent } from './pages/services-page.component';
import { ServiceDetailPageComponent } from './pages/service-detail-page.component';
import { OrganizationsPageComponent } from './pages/organizations-page.component';
import { GalleryPageComponent } from './pages/gallery-page.component';
import { NewsPageComponent } from './pages/news-page.component';
import { ArticlePageComponent } from './pages/article-page.component';
import { ContactPageComponent } from './pages/contact-page.component';
import { StaticPageComponent } from './pages/static-page.component';
import { NotFoundPageComponent } from './pages/not-found-page.component';

const publicRoutes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'about', component: StaticPageComponent, data: { page: 'about' } },
  { path: 'products', component: ProductListPageComponent },
  { path: 'products/:categorySlug', component: ProductListPageComponent },
  { path: 'product/:productSlug', component: ProductDetailPageComponent },
  { path: 'services', component: ServicesPageComponent },
  { path: 'services/:serviceSlug', component: ServiceDetailPageComponent },
  { path: 'clients', component: OrganizationsPageComponent, data: { kind: 'CLIENT' } },
  { path: 'partners', component: OrganizationsPageComponent, data: { kind: 'PARTNER' } },
  { path: 'gallery', component: GalleryPageComponent },
  { path: 'news', component: NewsPageComponent },
  { path: 'news/:articleSlug', component: ArticlePageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'privacy', component: StaticPageComponent, data: { page: 'privacy' } },
  { path: 'terms', component: StaticPageComponent, data: { page: 'terms' } },
];

export const routes: Routes = [
  ...publicRoutes,
  { path: 'bn', children: publicRoutes },
  { path: '**', component: NotFoundPageComponent },
];
