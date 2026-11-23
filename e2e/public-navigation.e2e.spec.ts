import { expect, test } from '@playwright/test';

test('browses from home to a product and quote form', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Plan, build');
  await page.getByRole('link', { name: 'Explore products' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('All products');
  await page.getByRole('link', { name: 'Cat6 network cable', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Cat6 network cable');
  await page.getByRole('link', { name: 'Request a quote' }).click();
  await expect(page.getByLabel('Subject')).toHaveValue('Quote request: cat6-network-cable');
});

test('switches to the Bengali localized home route', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'বাংলা' }).click();
  await expect(page).toHaveURL(/\/bn$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'bn');
});

test('mobile navigation is keyboard and button operable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile navigation is only rendered at the mobile breakpoint.');
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
});

test('every launch route renders a primary heading', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'One route smoke matrix is sufficient.');
  const paths = [
    '/', '/about', '/products', '/products/structured-cabling',
    '/product/cat6-network-cable', '/services', '/services/network-design-and-cabling',
    '/clients', '/partners', '/gallery', '/news',
    '/news/structured-cabling-project-checklist', '/contact', '/privacy', '/terms', '/bn',
  ];

  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.ok(), `${path} should return a successful response`).toBe(true);
    await expect(page.getByRole('heading', { level: 1 }), `${path} should render an h1`).toBeVisible();
  }
});
