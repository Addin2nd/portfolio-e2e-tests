import { test, expect } from '@playwright/test';

// Runs in the "mobile-chrome" project (Pixel 7 viewport).
test.describe('Mobile menu', () => {
  test('is hidden until the menu button is tapped', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open navigation' });
    const nav = page.locator('#mainNav');

    await expect(nav).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();

    await expect(nav).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('closes after a menu link is tapped and scrolls to the section', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open navigation' });

    await toggle.click();
    await page.locator('#mainNav').getByRole('link', { name: 'Skills' }).click();

    await expect(page.locator('#mainNav')).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#skills')).toBeInViewport();
  });

  test('page does not scroll sideways', async ({ page }) => {
    await page.goto('/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
