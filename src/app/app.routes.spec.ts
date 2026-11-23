import { routes } from './app.routes';

describe('catalog public routes', () => {
  it('declares English and Bengali route trees', () => {
    expect(routes.some(route => route.path === 'products')).toBe(true);
    expect(routes.find(route => route.path === 'bn')?.children?.some(route => route.path === 'products')).toBe(true);
  });

  it('keeps the wildcard route last', () => {
    expect(routes.at(-1)?.path).toBe('**');
  });
});
