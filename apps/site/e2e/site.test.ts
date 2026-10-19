// End-to-end tests against the built site. Run with `pnpm test:e2e` (builds first).
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { serializeSeed } from '@machine-ui/theme-engine';
import { REFERENCE_THEMES } from '@machine-ui/tokens';
import { chromium, type Browser, type Page } from 'playwright';
import { preview, type PreviewServer } from 'vite';

const PORT = 4175;
const BASE = `http://localhost:${PORT}`;
const theme = (name: string) => REFERENCE_THEMES.find((t) => t.name === name)!;

let server: PreviewServer;
let browser: Browser;

before(async () => {
  server = await preview({ root: fileURLToPath(new URL('..', import.meta.url)), preview: { port: PORT, strictPort: true } });
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.httpServer.close();
});

/** Tests must not depend on the network: web fonts are blocked and pages use their fallback stacks. */
const OFFLINE_HOSTS = /fonts\.(googleapis|gstatic)\.com/;

async function open(path: string, viewport = { width: 1280, height: 900 }): Promise<Page> {
  const page = await browser.newPage({ viewport });
  await page.route(OFFLINE_HOSTS, (route) => route.abort());
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  // Blocked font requests log a network error; they're expected here, not app errors.
  page.on('console', (m) => m.type() === 'error' && !OFFLINE_HOSTS.test(m.location().url) && errors.push(m.text()));
  (page as Page & { errors: string[] }).errors = errors;
  await page.goto(BASE + path);
  // Wait for the app to render rather than for "network idle", which any late request can reset.
  await page.locator('h1').first().waitFor();
  return page;
}

const rootVar = (page: Page, name: string) =>
  page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);

describe('theme', () => {
  test('a share link applies its theme, then hands over to the visitor’s own choices', async () => {
    const page = await open(`/?theme=${serializeSeed(theme('bloom'))}&mode=dark`);
    assert.equal(await page.getAttribute('html', 'data-mode'), 'dark');
    const bloomPrimary = await rootVar(page, '--primary');

    await page.getByRole('button', { name: /Use the forge theme/ }).click();
    const forgePrimary = await rootVar(page, '--primary');
    assert.notEqual(forgePrimary, bloomPrimary);

    await page.reload();
    await page.locator('h1').first().waitFor();
    assert.equal(await rootVar(page, '--primary'), forgePrimary, 'reload keeps the theme the visitor picked');
    await page.close();
  });

  test('the mode toggle switches and persists across pages', async () => {
    const page = await open(`/?theme=${serializeSeed(theme('graphite'))}&mode=light`);
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    assert.equal(await page.getAttribute('html', 'data-mode'), 'dark');
    await page.getByRole('link', { name: 'Get started' }).first().click();
    assert.equal(await page.getAttribute('html', 'data-mode'), 'dark');
    await page.close();
  });

  test('picking a specimen marks it as the current theme', async () => {
    const page = await open('/');
    const folio = page.getByRole('button', { name: /folio theme|Current theme/ }).filter({ hasText: 'Folio' });
    await folio.click();
    assert.equal(await folio.getAttribute('aria-pressed'), 'true');
    assert.equal(await page.getByRole('combobox', { name: 'Theme preset' }).textContent(), 'folio');
    await page.close();
  });
});

describe('navigation', () => {
  test('search finds a component and opens its page', async () => {
    const page = await open('/');
    await page.keyboard.press('ControlOrMeta+k');
    await page.getByRole('dialog').getByRole('combobox').fill('data table');
    await page.keyboard.press('Enter');
    await page.waitForURL('**/components/data-table');
    await page.getByRole('heading', { level: 1, name: 'Data Table' }).waitFor({ timeout: 3000 });
    await page.close();
  });

  for (const path of ['/components', '/components/command', '/screens']) {
    test(`${path} opens at the top of the page`, async () => {
      const page = await open(path);
      await page.waitForTimeout(500);
      assert.equal(await page.evaluate(() => window.scrollY), 0);
      await page.close();
    });
  }

  test('an unknown route says so and offers a way back', async () => {
    const page = await open('/definitely-not-here');
    assert.ok(await page.getByText('There’s no page here').isVisible());
    assert.ok(await page.getByRole('link', { name: 'Browse components' }).isVisible());
    await page.close();
  });

  test('Ctrl+B toggles the site navigation, not the sidebars inside previews', async () => {
    const page = await open('/');
    const sidebars = page.locator('[data-slot=sidebar]');
    const states = () => sidebars.evaluateAll((els) => els.map((el) => el.getAttribute('data-state')));
    const before = await states();
    assert.ok(before.length >= 2, 'site nav and the embedded screen both have sidebars');
    await page.locator('main').first().click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('Control+b');
    const afterToggle = await states();
    assert.equal(afterToggle[0], 'collapsed');
    assert.deepEqual(afterToggle.slice(1), before.slice(1));
    await page.close();
  });
});

describe('layout', () => {
  for (const path of ['/', '/components', '/components/data-table', '/screens', '/themes', '/get-started']) {
    test(`${path} has no horizontal overflow on a phone`, async () => {
      const page = await open(path, { width: 390, height: 844 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert.equal(overflow, 0);
      await page.close();
    });
  }

  test('pages render without runtime errors', async () => {
    for (const path of ['/', '/components', '/screens', '/themes', '/get-started', '/components/chart']) {
      const page = await open(path);
      assert.deepEqual((page as Page & { errors: string[] }).errors, [], path);
      await page.close();
    }
  });
});
