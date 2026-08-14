import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);

async function render(path = "/") {
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
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

test("renders the post-payment instructions", async () => {
  const response = await render("/arborist-invoice-audit/thanks");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Payment received/);
  assert.match(html, /within one business day/i);
  assert.match(html, /do not email customer files/i);
});
