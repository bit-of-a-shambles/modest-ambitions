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

test("links the Common Values public good", async () => {
  const homepage = await readFile(
    new URL("../public-site/index.html", import.meta.url),
    "utf8",
  );
  assert.match(homepage, /href="https:\/\/commonvalues\.eu">Common Values<\/a>/);
  assert.doesNotMatch(homepage, /Europe Versus|europe_versus/);
});

test("renders the arborist audit with the live checkout", async () => {
  const response = await render("/arborist-invoice-audit");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Find completed tree work/);
  assert.match(html, /multi-crew commercial tree-care businesses/i);
  assert.match(html, /£395/);
  assert.match(html, /https:\/\/buy\.stripe\.com\/3cIfZhbaK7b9drtgef5Rm03/);
  assert.match(html, /read-only operational check/i);
  assert.match(html, /Please do not email customer files/i);
  assert.match(html, /client_reference_id=EXP-0033-/i);
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

test("publishes the manual PAT register rescue and checkout", async () => {
  const offer = await readFile(
    new URL("../public-site/pat-testing-records/index.html", import.meta.url),
    "utf8",
  );
  assert.match(offer, /Turn one messy PAT register into a working client file/);
  assert.match(offer, /£295/);
  assert.match(offer, /100% money-back guarantee/i);
  assert.match(offer, /https:\/\/buy\.stripe\.com\/5kQdR97YygLJ5Z1bXZ5Rm07/);
  assert.match(offer, /requestedExperiment === "EXP-0032"/);
  assert.match(offer, /client_reference_id=" \+ experiment/);
  assert.match(offer, /It does not\s+decide whether equipment is safe/i);
  assert.doesNotMatch(offer, /software is not finished/i);

  const thanks = await readFile(
    new URL(
      "../public-site/pat-testing-records/thanks/index.html",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(thanks, /Your register rescue is booked/);
  assert.match(thanks, /Please do not email client files/i);
  assert.match(thanks, /hello@modestambitions\.studio/);
});

test("publishes the restaurant-accounting reconciliation pilot", async () => {
  const offer = await readFile(
    new URL(
      "../public-site/delivery-payout-reconciliation/index.html",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(offer, /For accounting firms with restaurant clients/i);
  assert.match(offer, /\$295/);
  assert.match(offer, /100% money-back guarantee/i);
  assert.match(offer, /https:\/\/buy\.stripe\.com\/14A14ngv41QP1IL8LN5Rm0b/);
  assert.match(offer, /review-ready posting pack/i);
  assert.doesNotMatch(offer, /For restaurants on DoorDash/i);

  const thanks = await readFile(
    new URL(
      "../public-site/delivery-payout-reconciliation/thanks/index.html",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(thanks, /Your reconciliation pilot is booked/);
  assert.match(thanks, /Please do not email client files/i);
});

test("buyer-facing manual offers contain no em dashes", async () => {
  for (const path of [
    "../public-site/pat-testing-records/index.html",
    "../public-site/delivery-payout-reconciliation/index.html",
  ]) {
    const html = await readFile(new URL(path, import.meta.url), "utf8");
    assert.doesNotMatch(html, /—/);
  }
});
