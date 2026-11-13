import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads with the right title, headline and calls to action', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Addin/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('turn data into decisions');
    await expect(page.getByRole('link', { name: 'View Projects' })).toHaveAttribute('href', '#projects');
    await expect(page.getByRole('link', { name: 'Contact Me' })).toHaveAttribute('href', '#contact');
  });

  test('has no JavaScript errors while loading', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });

  test('shows the current year in the footer', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#currentYear')).toHaveText(String(new Date().getFullYear()));
  });

  test('returns 404 for a page that does not exist', async ({ request }) => {
    const response = await request.get('/this-page-does-not-exist');

    expect(response.status()).toBe(404);
  });
});
