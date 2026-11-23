import { RenderMode, ServerRoute } from '@angular/ssr';

const staticPaths = [
  '', 'about', 'products', 'services', 'clients', 'partners', 'gallery',
  'news', 'contact', 'privacy', 'terms',
] as const;

export const serverRoutes: ServerRoute[] = [
  ...staticPaths.map(path => ({ path, renderMode: RenderMode.Prerender as const })),
  ...staticPaths.map(path => ({ path: `bn${path ? `/${path}` : ''}`, renderMode: RenderMode.Prerender as const })),
  { path: 'products/:categorySlug', renderMode: RenderMode.Server },
  { path: 'product/:productSlug', renderMode: RenderMode.Server },
  { path: 'services/:serviceSlug', renderMode: RenderMode.Server },
  { path: 'news/:articleSlug', renderMode: RenderMode.Server },
  { path: 'bn/products/:categorySlug', renderMode: RenderMode.Server },
  { path: 'bn/product/:productSlug', renderMode: RenderMode.Server },
  { path: 'bn/services/:serviceSlug', renderMode: RenderMode.Server },
  { path: 'bn/news/:articleSlug', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
