import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = new URL('../public-site/', import.meta.url);
const home = readFileSync(new URL('index.html', root), 'utf8');
const support = readFileSync(new URL('support/index.html', root), 'utf8');

test('homepage clearly associates the trading name and PopaDex with the legal entity', () => {
  assert.match(home, /trading name of <strong>Administrative Burden Ltd/);
  assert.match(home, /This is our official company website/);
  assert.match(home, /PopaDex is developed and operated by Administrative Burden Ltd/);
  assert.match(home, /href="\/support\/"/);
  assert.match(home, /17363389/);
  assert.match(home, /WC2H 9JQ/);
});

test('public support page provides working contact destinations and legal details', () => {
  assert.match(support, /href="mailto:support@popadex.com"/);
  assert.match(support, /href="mailto:hello@modestambitions.co"/);
  assert.match(support, /without signing in or buying a product/);
  assert.match(support, /account deletion or privacy requests/);
  assert.match(support, /Never send passwords, verification codes/);
  assert.match(support, /17363389/);
  assert.match(support, /WC2H 9JQ/);
});

test('local navigation links resolve to published files', () => {
  for (const html of [home, support]) {
    for (const [, href] of html.matchAll(/href="(\/[^"#]*)"/g)) {
      const path = href.endsWith('/') ? `${href}index.html` : href;
      assert.ok(existsSync(resolve(root.pathname, `.${path}`)), href);
    }
  }
});
