// Refreshes assets/land/zillow-land-sold.json: lots/land that sold through the MLS in
// Travis, Williamson and Hays counties over the last 36 months, as Zillow's public
// "recently sold" search reports them (Zillow gets the price from the MLS feed; Texas
// deeds do not carry it). The Land Comp Generator matches these to CAD transfers by
// street address + ZIP to fill the Sale price column for the deals that touched the MLS.
// Runs on GitHub Actions. No dependencies. Exit 2 keeps the previous file when Zillow blocks the run.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";

const OUT = "assets/land/zillow-land-sold.json";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const AREA = { west: -98.35, east: -97.25, south: 29.8, north: 30.9 };
const GRID = 4;               // 4x4 tiles over the tri-county box; tiles with >500 results split again
const MAX_PAGES = 13;         // Zillow caps a search at ~500 results (41 per page)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function query(bounds, p) {
  return { isMapVisible: true, mapBounds: bounds, isListVisible: true, pagination: { currentPage: p },
    filterState: { sortSelection: { value: "globalrelevanceex" }, rs: { value: true }, doz: { value: "36m" },
      sf: { value: false }, con: { value: false }, tow: { value: false }, mf: { value: false }, land: { value: true },
      apa: { value: false }, manu: { value: false }, apco: { value: false }, fsba: { value: false }, fsbo: { value: false },
      nc: { value: false }, auc: { value: false }, fore: { value: false } } };
}

let requests = 0;
async function page(bounds, p) {
  const url = "https://www.zillow.com/homes/recently_sold/?searchQueryState=" + encodeURIComponent(JSON.stringify(query(bounds, p)));
  requests++;
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "text/html,application/xhtml+xml", "Accept-Language": "en-US,en;q=0.9" } });
  const html = await res.text();
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!res.ok || !m) throw new Error(`HTTP ${res.status}, next_data=${!!m}`);
  const sp = JSON.parse(m[1]).props.pageProps.searchPageState;
  const total = sp.cat1?.searchList?.totalResultCount ?? 0;
  const list = sp.cat1?.searchResults?.listResults || [];
  const rows = list.map((x) => {
    const h = x.hdpData?.homeInfo || {};
    let acres = null;
    if (h.lotAreaValue) acres = /sqft/i.test(h.lotAreaUnit || "") ? h.lotAreaValue / 43560 : h.lotAreaValue;
    const price = x.unformattedPrice || h.price || null;
    return [price, x.addressStreet || h.streetAddress || "", x.addressCity || h.city || "", String(x.addressZipcode || h.zipcode || ""),
      acres != null ? +acres.toFixed(3) : null, h.dateSold || null, String(x.zpid || h.zpid || ""), h.latitude ?? null, h.longitude ?? null, x.detailUrl ? "https://www.zillow.com" + x.detailUrl : ""];
  }).filter((r) => r[0] && r[1] && r[3]);
  return { total, rows, raw: list.length };
}

const all = new Map();
async function crawl(bounds, depth) {
  let first;
  try { first = await page(bounds, 1); } catch (e) { console.error("tile failed:", e.message); return; }
  first.rows.forEach((r) => all.set(r[6], r));
  if (first.total > 500 && depth < 2) {
    const mx = (bounds.west + bounds.east) / 2, my = (bounds.south + bounds.north) / 2;
    for (const b of [{ ...bounds, east: mx, north: my }, { ...bounds, west: mx, north: my }, { ...bounds, east: mx, south: my }, { ...bounds, west: mx, south: my }]) { await sleep(1200); await crawl(b, depth + 1); }
    return;
  }
  const pages = Math.min(MAX_PAGES, Math.ceil(first.total / 41));
  for (let p = 2; p <= pages; p++) {
    await sleep(1200);
    try { const r = await page(bounds, p); r.rows.forEach((x) => all.set(x[6], x)); if (r.raw === 0) break; }
    catch (e) { console.error(`tile page ${p} failed:`, e.message); break; }
  }
}

const dx = (AREA.east - AREA.west) / GRID, dy = (AREA.north - AREA.south) / GRID;
for (let i = 0; i < GRID; i++) for (let j = 0; j < GRID; j++) {
  await crawl({ west: AREA.west + i * dx, east: AREA.west + (i + 1) * dx, south: AREA.south + j * dy, north: AREA.south + (j + 1) * dy }, 0);
  await sleep(1200);
}

const rows = [...all.values()].sort((a, b) => (b[5] || 0) - (a[5] || 0));
console.log(`${requests} requests, ${rows.length} sold land records`);
if (rows.length < 50) { console.error(`only ${rows.length} records parsed; keeping previous file`); process.exit(2); }
const central = new Date().toLocaleString("sv-SE", { timeZone: "America/Chicago" }).replace(" ", "T");
mkdirSync("assets/land", { recursive: true });
const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : null;
writeFileSync(OUT, JSON.stringify({ updatedAt: central, source: "Zillow recently sold, lots/land, last 36 months, Travis/Williamson/Hays", fields: ["price", "street", "city", "zip", "acres", "soldMs", "zpid", "lat", "lng", "url"], rows }));
console.log(`wrote ${rows.length} (previous ${prev ? prev.rows.length : "none"})`);
