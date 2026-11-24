import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { CatalogContentSource, FixtureCatalogContentSource } from '@nexacore/catalog';

export const config = mergeApplicationConfig(appConfig, {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Prerender remains deterministic and backend-independent. Browser hydration
    // does not transfer this value and immediately loads the authoritative site API.
    { provide: CatalogContentSource, useFactory: () => new FixtureCatalogContentSource() },
  ],
});
