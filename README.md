# Catalog frontend 21

Public SSR Angular application for the NexaCore catalog. Phase 1 uses the
fixture-backed `CatalogContentSource` from `@nexacore/catalog`; it requires no
backend, database, object storage, cache, or identity provider.

```bash
cd ../frontend-libs-21
npx ng build catalog

cd ../catalog-frontend-21
npm install
npm start
```

English routes use the root path. Bengali routes use the `/bn` prefix.
All content and imagery are synthetic fixtures.
