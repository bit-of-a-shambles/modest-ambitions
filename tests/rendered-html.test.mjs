import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);

async function render(path = "/", extraHeaders = {}) {
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html", ...extraHeaders },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the studio homepage with the manual service", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Modest Ambitions/);
  assert.match(html, /Completed-work invoice exception audit/);
  assert.match(html, /href="\/arborist-invoice-audit\/"/);
});

test("renders the arborist audit with the live checkout", async () => {
  const response = await render("/arborist-invoice-audit");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Find completed tree work/);
  assert.match(html, /£395/);
  assert.match(html, /https:\/\/buy\.stripe\.com\/3cIfZhbaK7b9drtgef5Rm03/);
  assert.match(html, /read-only operational check/i);
  assert.match(html, /Please do not email customer files/i);
});

test("states an unconditional refund next to the price", async () => {
  const response = await render("/arborist-invoice-audit");
  const html = await response.text();
  assert.match(html, /100% money-back guarantee/i);
  assert.match(html, /Illustrative layout using invented jobs/i);
  // The registration number is checkable proof for a stranger being asked for
  // money, and it is the one trust signal on the page that is not self-asserted.
  assert.match(html, /17363389/);
});

test("shows one currency, and the same one, everywhere on the page", async () => {
  // Whatever market the edge resolves to, the price block, the refund promise
  // and the checkout link must agree. A half-applied localisation would show a
  // local price beside a link that charges in another currency.
  for (const country of ["GB", "US", "CA", "DE", ""]) {
    const response = await render("/arborist-invoice-audit", {
      "cf-ipcountry": country,
    });
    assert.equal(response.status, 200, `status for ${country || "no country"}`);
    // React splits interpolated text with comment markers; drop them so the
    // assertions read the rendered sentence rather than its fragments.
    const html = (await response.text()).replaceAll("<!-- -->", "");

    const price = html.match(/<p class="price"[^>]*>\s*([^<\s]+)/)?.[1];
    assert.ok(price, `price rendered for ${country || "no country"}`);

    const refundPromise = html.match(/refund the full ([^<\s.\\"]+)/)?.[1];
    assert.equal(refundPromise, price, `refund amount matches for ${country}`);

    const checkoutLinks = [
      ...html.matchAll(/https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+/g),
    ].map((match) => match[0]);
    assert.equal(
      new Set(checkoutLinks).size,
      1,
      `exactly one checkout link for ${country || "no country"}`,
    );
  }
});

test("renders the post-payment instructions", async () => {
  const response = await render("/arborist-invoice-audit/thanks");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Payment received/);
  assert.match(html, /within one business day/i);
  assert.match(html, /do not email customer files/i);
});

test("publishes PAT founding-access payment confirmation", async () => {
  const html = await readFile(
    new URL(
      "../public-site/pat-testing-records/thanks/index.html",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(html, /Your founding place is confirmed/);
  assert.match(html, /software is still being built/i);
  assert.match(html, /full refund at any time/i);
  assert.match(html, /hello@modestambitions\.studio/);
});
