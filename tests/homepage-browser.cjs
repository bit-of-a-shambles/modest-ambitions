// Serve public-site/ locally; set NODE_PATH to an installed Playwright package.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const origin = process.env.HOMEPAGE_TEST_ORIGIN || 'http://127.0.0.1:8766';
  const screenshotDir = process.env.HOMEPAGE_SCREENSHOT_DIR;
  if (screenshotDir) fs.mkdirSync(screenshotDir, { recursive: true });

  try {
    for (const [name, width, javaScriptEnabled] of [
      ['desktop', 1280, true],
      ['mobile', 390, true],
      ['narrow', 320, true],
      ['no-js', 390, false],
    ]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 }, javaScriptEnabled,
      });
      const page = await context.newPage();
      const errors = [];
      const externalRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      // Follow real links without reaching product accounts or Google Analytics.
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.origin === origin) return route.continue();
        externalRequests.push(url.href);
        if (route.request().isNavigationRequest()) {
          return route.fulfill({ contentType: 'text/html', body: '<h1>Product destination</h1>' });
        }
        return route.fulfill({ contentType: 'application/javascript', body: '' });
      });

      const response = await page.goto(origin);
      assert.equal(response.status(), 200);
      await page.getByRole('heading', { level: 1, name: /Modest Ambitions/ }).waitFor();
      assert.equal(await page.locator('time').innerText(), '11 November 2026');
      assert.equal(externalRequests.length, 0, 'no external requests before consent');
      if (javaScriptEnabled) {
        await page.getByRole('button', { name: 'No thanks', exact: true }).click();
      }

      const portfolio = page.locator('#portfolio + ul');
      const lookup = portfolio.getByRole('listitem').filter({ has: page.getByRole('link', { name: 'LookupDock', exact: true }) });
      assert.match(await lookup.innerText(), /Live\./);
      assert.match(await lookup.innerText(), /Phone, email and IP checks[\s\S]*API, CSV uploads and MCP/);
      assert.doesNotMatch(await lookup.innerText(), /free checks|no card|coming soon/i);
      const popadex = portfolio.getByRole('listitem').filter({ has: page.getByRole('link', { name: 'PopaDex', exact: true }) });
      assert.match(await popadex.innerText(), /Live on web and iPhone/);
      assert.match(await popadex.innerText(), /Track accounts, assets, liabilities and net worth/);
      assert.doesNotMatch(await popadex.innerText(), /Premium|support/i);
      const relay = portfolio.getByRole('listitem').filter({ has: page.getByRole('link', { name: 'Relay', exact: true }) });
      assert.match(await relay.innerText(), /iPhone app is not publicly available/);
      assert.doesNotMatch(await page.locator('main').innerText(), /Reorder CSV|Shopify/i);
      assert.doesNotMatch(await popadex.innerText(), /developed and operated by/);
      assert.equal(await page.getByText('Services being tested', { exact: true }).count(), 0);

      await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Failed experiments' }).click();
      assert.equal(new URL(page.url()).hash, '#experiments');
      await page.getByRole('heading', { name: 'Failed experiments', exact: true }).waitFor();
      const failures = page.locator('#experiments + ul');
      for (const [label, rationale] of [
        ['Completed-work invoice exception audit for commercial tree-care contractors', /person responsible for invoicing[\s\S]*bounced emails[\s\S]*did not establish paid demand/],
        ['PAT register rescue for testing businesses', /software shoppers[\s\S]*Landing-page errors[\s\S]*never established a costly cleanup problem/],
        ['Delivery payout reconciliation for restaurant accounting firms', /without validating that buyer[\s\S]*no positive replies[\s\S]*did not establish paid demand/],
        ['Outoffer', /burdensome outreach[\s\S]*wrong customer profile[\s\S]*chance of success[\s\S]*opportunity cost/],
      ]) {
        const item = failures.getByRole('listitem').filter({ has: page.getByRole('link', { name: label, exact: true }) });
        assert.equal(await item.count(), 1, `${label} is listed under failed experiments`);
        assert.match(await item.innerText(), rationale);
      }

      for (const [label, destination] of [
        ['LookupDock', 'https://lookupdock.com/'],
      ]) {
        await page.getByRole('link', { name: label, exact: true }).last().click();
        await page.getByRole('heading', { name: 'Product destination' }).waitFor();
        assert.equal(page.url(), destination);
        await page.goBack();
      }
      await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Support & contact', exact: true }).click();
      await page.getByRole('heading', { name: 'Support & contact', exact: true }).waitFor();
      assert.equal(await page.getByRole('link', { name: 'support@popadex.com', exact: true }).getAttribute('href'), 'mailto:support@popadex.com');
      await page.goBack();

      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'page fits viewport');
      assert.deepEqual(errors, [], 'no browser JavaScript errors');
      assert(!externalRequests.some(url => /google-analytics|googletagmanager/.test(url)), 'no analytics sent by the test');
      if (screenshotDir && name !== 'no-js') {
        await page.screenshot({ path: `${screenshotDir}/${name}.png`, fullPage: true });
      }
      await context.close();
      console.log(`PASS ${name}: product availability, pending features, navigation, support and layout`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
