import { test, expect, type Page } from '@playwright/test';

type Project = { title: string; category: string };

// Read the project list the page itself renders from, so the tests keep
// working when projects are added or removed.
async function loadProjects(page: Page): Promise<Project[]> {
  return page.evaluate(() =>
    (window as any).PORTFOLIO_PROJECTS.map((p: Project) => ({ title: p.title, category: p.category })),
  );
}

const cardTitles = (page: Page) => page.locator('#projectsGrid .project-title');

test.describe('Projects section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#projects');
  });

  test('renders one card per project, each with a title and description', async ({ page }) => {
    const projects = await loadProjects(page);
    expect(projects.length).toBeGreaterThan(0);

    const cards = page.locator('#projectsGrid .project-card');
    await expect(cards).toHaveCount(projects.length);
    await expect(cardTitles(page)).toHaveText(projects.map((p) => p.title));

    for (const card of await cards.all()) {
      await expect(card.locator('.project-description')).not.toBeEmpty();
    }
  });

  test('has one filter button per category, with "All" selected first', async ({ page }) => {
    const projects = await loadProjects(page);
    const categories = ['All', ...new Set(projects.map((p) => p.category))];

    const buttons = page.locator('#projectFilters .filter-btn');
    await expect(buttons).toHaveText(categories);
    await expect(buttons.first()).toHaveClass(/active/);
  });

  test('each filter shows only the projects in that category', async ({ page }) => {
    const projects = await loadProjects(page);
    const categories = [...new Set(projects.map((p) => p.category))];

    for (const category of categories) {
      const button = page.locator('#projectFilters .filter-btn', { hasText: category });
      await button.click();

      await expect(button).toHaveClass(/active/);
      await expect(page.locator('#projectFilters .filter-btn.active')).toHaveCount(1);
      await expect(cardTitles(page)).toHaveText(
        projects.filter((p) => p.category === category).map((p) => p.title),
      );
    }

    await page.locator('#projectFilters .filter-btn', { hasText: 'All' }).click();
    await expect(cardTitles(page)).toHaveCount(projects.length);
  });

  test('every project image has alt text and loads', async ({ page }) => {
    const images = page.locator('#projectsGrid img');

    for (const image of await images.all()) {
      await expect(image).toHaveAttribute('alt', /\S/);
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), {
          message: `image ${await image.getAttribute('src')} did not load`,
        })
        .toBe(true);
    }
  });
});
