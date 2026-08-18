import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
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

test("server-renders the Craig's Bikes storefront", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Craig(?:&#x27;|')s Bikes/);
  assert.match(html, /Old-school BMX\./);
  assert.match(html, /View all (?:<!-- -->)?35(?:<!-- -->)? bikes/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("lists all five Oldtimes additions in the shop", async () => {
  const response = await render("/shop");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /1984 SE Racing Quadangle — Coca-Cola Cowboy/);
  assert.match(html, /1984 Skyway T\/A — Original Chrome/);
  assert.match(html, /1984 Skyway T\/A XL — California Lite/);
  assert.match(html, /1984 Skyway T\/A XL — Redline 401 Build/);
  assert.match(html, /1986 GT Pro Performer — Maui Blue/);
});

test("gives the two Skyway T/A XL builds distinct product pages and social metadata", async () => {
  const [californiaResponse, redlineResponse] = await Promise.all([
    render("/shop/1984-skyway-ta-xl-118169"),
    render("/shop/1984-skyway-ta-xl-122620"),
  ]);
  const [california, redline] = await Promise.all([
    californiaResponse.text(),
    redlineResponse.text(),
  ]);

  assert.match(california, /California Lite/);
  assert.match(california, /bmxmuseum\.com\/bikes\/skyway\/118169/);
  assert.match(california, /twitter:image/);
  assert.match(california, /products\/bmxmuseum-118169\/cover\.jpg/);

  assert.match(redline, /Redline 401 Build/);
  assert.match(redline, /bmxmuseum\.com\/bikes\/skyway\/122620/);
  assert.match(redline, /twitter:image/);
  assert.match(redline, /products\/bmxmuseum-122620\/cover\.jpg/);
});

test("keeps every imported gallery photograph on disk", async () => {
  const expectedCounts = {
    "bmxmuseum-117439": 5,
    "bmxmuseum-122510": 8,
    "bmxmuseum-118169": 8,
    "bmxmuseum-122620": 6,
    "bmxmuseum-117389": 6,
  };

  for (const [directory, expected] of Object.entries(expectedCounts)) {
    const files = await readdir(new URL(`../public/products/${directory}/`, import.meta.url));
    assert.equal(files.filter((file) => file.endsWith(".jpg")).length, expected, directory);
  }
});
