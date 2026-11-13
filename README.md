# Portfolio E2E Tests

[![E2E tests](https://github.com/Addin2nd/portfolio-e2e-tests/actions/workflows/e2e.yml/badge.svg)](https://github.com/Addin2nd/portfolio-e2e-tests/actions/workflows/e2e.yml)

End-to-end tests for my portfolio site, [addin-porto.netlify.app](https://addin-porto.netlify.app), written with [Playwright](https://playwright.dev) and TypeScript. GitHub Actions runs them on every push, on pull requests, and once a day against the live site, so a broken deploy shows up as a failed run.

## What is tested

20 tests across a desktop and a mobile (Pixel 7) browser:

| Area | Checks |
| --- | --- |
| Home page | Title, headline and call-to-action links; no JavaScript errors on load; footer shows the current year; unknown URLs return 404 |
| Navigation | Each header link updates the URL and scrolls its section into view |
| Projects | One card per project; one filter button per category; each filter shows exactly the projects in that category; every image has alt text and loads |
| Links | External links open in a new tab with `rel="noreferrer"`; internal links are not broken; case study links open in the same tab; contact links point to email, LinkedIn and GitHub |
| Mobile | Menu stays hidden until tapped, updates `aria-expanded`, closes after a link is tapped; no sideways scrolling |
| Accessibility | No critical WCAG 2 A/AA issues, checked with axe-core |

The project tests read `window.PORTFOLIO_PROJECTS`, the same data the page renders from, so they keep passing when projects are added or removed and fail only when the page and its data disagree.

## Run locally

```bash
npm ci
npx playwright install chromium
npm test                                   # against the live site
BASE_URL=http://localhost:5500 npm test    # against a local copy
npm run report                             # open the HTML report
```

## Layout

```
tests/
  home.spec.ts           page load, errors, footer, 404
  navigation.spec.ts     header links
  projects.spec.ts       project cards and filters
  links.spec.ts          external, internal and contact links
  mobile.spec.ts         mobile menu and layout (mobile project only)
  accessibility.spec.ts  axe-core scan
playwright.config.ts     desktop and mobile projects, BASE_URL, retries in CI
.github/workflows/e2e.yml
```

In CI, failed tests are retried twice with a trace recorded, and the HTML report is uploaded as a build artifact.
