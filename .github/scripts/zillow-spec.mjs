// Refreshes assets/market-intel/zillow-spec.json from Zillow's public search page.
// Runs on GitHub Actions daily. No dependencies. If Zillow blocks the request,
// the script exits 2 and the previous file is left untouched.
import { writeFileSync, readFileSync, existsSync } from "node:fs";

const OUT = "assets/market-intel/zillow-spec.json";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const base = { isMapVisible: true, mapBounds: { west: -98.35, east: -97.25, south: 29.8, north: 30.9 },
  filterState: { sortSelection: { value: "priced" }, price: { min: 1500000 }, nc: { value: true }, fsba: { value: false }, fsbo: { value: false },
    auc: { value: false }, fore: { value: false }, sf: { value: true }, con: { value: false }, tow: { value: false }, mf: { value: false },
    land: { value: false }, apa: { value: false }, manu: { value: false }, apco: { value: false } }, isListVisible: true };

const clean = (b) => (b || "").replace(/^(On File|ON FILE|See Records)$/i, "").replace("MileStone Community Builders", "Milestone Community Builders").replace("Toll Brothers, Inc.", "Toll Brothers").replace(/\s+LLC$/, " LLC").trim();
const med = (a) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function page(p) {
  const q = { ...base, pagination: { currentPage: p } };
  const url = "https://www.zillow.com/homes/for_sale/?searchQueryState=" + encodeURIComponent(JSON.stringify(q));
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "text/html,application/xhtml+xml", "Accept-Language": "en-US,en;q=0.9" } });
  const html = await res.text();
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!res.ok || !m) throw new Error(`page ${p}: HTTP ${res.status}, next_data=${!!m}`);
  const d = JSON.parse(m[1]);
  const sp = d.props.pageProps.searchPageState;
  const total = sp.cat1.searchList.totalResultCount;
  const rows = sp.cat1.searchResults.listResults
    .filter((x) => (x.hdpData?.homeInfo?.newConstructionType) !== "BUILDER_PLAN" && !/Mager Ln/.test(x.addressStreet || ""))
    .map((x) => { const h = x.hdpData?.homeInfo || {}; return [x.unformattedPrice, x.addressStreet, x.addressCity, String(x.addressZipcode), x.area || 0, clean(x.builderName), x.brokerName || "", h.daysOnZillow == null ? 0 : h.daysOnZillow, x.zpid]; });
  return { total, rows, raw: sp.cat1.searchResults.listResults.length };
}

const all = new Map(); let total = 0;
for (let p = 1; p <= 8; p++) {
  const r = await page(p);
  total = r.total;
  r.rows.forEach((row) => all.set(row[8], row));
  if (r.raw === 0 || p * 41 >= total) break;
  await sleep(1500);
}
const listings = [...all.values()].sort((a, b) => b[0] - a[0]);
if (listings.length < 30) { console.error(`only ${listings.length} listings parsed; keeping previous file`); process.exit(2); }

const by = {};
listings.forEach((l) => { if (!l[5]) return; (by[l[5]] = by[l[5]] || []).push(l); });
const zspec = Object.entries(by).map(([b, g]) => ({ b, n: g.length, lo: Math.min(...g.map((l) => l[0])), hi: Math.max(...g.map((l) => l[0])),
  zips: [...new Set(g.map((l) => l[3]))].sort().join(", "), ex: g.sort((x, y) => y[0] - x[0]).slice(0, 2).map((l) => l[1]).join(", "),
  ppsf: Math.round(med(g.filter((l) => l[4]).map((l) => l[0] / l[4]))) })).sort((a, b) => b.hi - a.hi);

const central = new Date().toLocaleString("sv-SE", { timeZone: "America/Chicago" }).replace(" ", "T");
const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : null;
const out = { updatedAt: central, source: "Zillow new construction, single family, $1.5M+, Travis/Williamson/Hays", listings, zspec };
writeFileSync(OUT, JSON.stringify(out));
console.log(`wrote ${listings.length} listings (${zspec.length} builders); Zillow reported ${total}; previous ${prev ? prev.listings.length : "none"}`);
