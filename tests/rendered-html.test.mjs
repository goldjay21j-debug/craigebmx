import assert from "node:assert/strict";
import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import test, { after, before } from "node:test";

const projectDirectory = fileURLToPath(new URL("../", import.meta.url));
const outputDirectory = join(projectDirectory, "out");
const port = 3400 + (process.pid % 500);
const origin = `http://127.0.0.1:${port}`;
let staticServer;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

before(() => new Promise((resolve, reject) => {
  staticServer = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url ?? "/", origin).pathname);
      const safePath = normalize(pathname).replace(/^([.][.][/\\])+/, "");
      let filePath = join(outputDirectory, safePath);
      const fileStats = await stat(filePath).catch(() => null);
      if (fileStats?.isDirectory()) filePath = join(filePath, "index.html");
      if (!fileStats && !extname(filePath)) filePath = join(filePath, "index.html");
      await stat(filePath);
      response.writeHead(200, { "content-type": contentTypes[extname(filePath)] ?? "application/octet-stream" });
      createReadStream(filePath).pipe(response);
    } catch {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
    }
  });
  staticServer.once("error", reject);
  staticServer.listen(port, "127.0.0.1", resolve);
}));

after(() => staticServer?.close());

async function render(pathname = "/") {
  return fetch(`${origin}${pathname}`, {
    headers: { accept: "text/html" },
  });
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
