import { test, expect } from '@playwright/test';

const sections = [
  { link: 'About', id: 'about' },
  { link: 'Projects', id: 'projects' },
  { link: 'Skills', id: 'skills' },
  { link: "Let's Talk", id: 'contact' },
];

test.describe('Header navigation', () => {
  for (const { link, id } of sections) {
    test(`"${link}" scrolls to the ${id} section`, async ({ page }) => {
      await page.goto('/');

      await page.locator('#mainNav').getByRole('link', { name: link }).click();

      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    });
  }
});
