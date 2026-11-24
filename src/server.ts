import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDirectory = dirname(fileURLToPath(import.meta.url));
const browserDirectory = resolve(serverDirectory, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();

app.get('/healthz', (_request, response) => response.status(200).type('text/plain').send('ok\n'));
app.use(express.static(browserDirectory, { maxAge: '1y', index: false, redirect: false }));
app.use((request, response, next) => {
  angularApp.handle(request)
    .then(result => result ? writeResponseToNodeResponse(result, response) : next())
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT'] ?? 4000);
  app.listen(port, () => console.log(`Catalog SSR server listening on http://localhost:${port}`));
}

export const reqHandler = createNodeRequestHandler(app);
