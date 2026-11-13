import { test, expect } from '@playwright/test';

test.describe('Links', () => {
  test('external links open in a new tab with rel="noreferrer"', async ({ page }) => {
    await page.goto('/');

    const external = page.locator('a[href^="http"]');
    expect(await external.count()).toBeGreaterThan(0);

    for (const link of await external.all()) {
      const href = await link.getAttribute('href');
      await expect(link, `link to ${href}`).toHaveAttribute('target', '_blank');
      await expect(link, `link to ${href}`).toHaveAttribute('rel', /noreferrer/);
    }
  });

  test('links to other pages on this site are not broken', async ({ page, request }) => {
    await page.goto('/');

    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((links) =>
        links
          .map((a) => a.getAttribute('href')!)
          .filter((href) => !/^(https?:|mailto:|#)/.test(href)),
      );
    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of new Set(hrefs)) {
      const response = await request.get(href);
      expect(response.status(), `${href} returned ${response.status()}`).toBeLessThan(400);
    }
  });

  test('a case study link opens its page in the same tab', async ({ page }) => {
    await page.goto('/#projects');

    const caseStudy = page.getByRole('link', { name: /Read Case Study/ }).first();
    const href = await caseStudy.getAttribute('href');
    await caseStudy.click();

    await expect(page).toHaveURL(new RegExp(`${href!.replace('.', '\\.')}$`));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('contact links point to email, LinkedIn and GitHub', async ({ page }) => {
    await page.goto('/#contact');
    const contact = page.locator('#contact');

    await expect(contact.getByRole('link', { name: /@/ })).toHaveAttribute('href', /^mailto:/);
    await expect(contact.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', /linkedin\.com\/in\//);
    await expect(contact.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', /github\.com\//);
  });
});
