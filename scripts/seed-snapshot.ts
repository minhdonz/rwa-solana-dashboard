/**
 * Generates an ILLUSTRATIVE seed snapshot (data/snapshot.json) so the UI renders
 * before anyone runs the real `npm run refresh`. Figures are self-consistent
 * (venue slices sum to the tracked supply, unknown <= threshold) but are NOT real
 * on-chain data — the snapshot is flagged `isSeed: true` and the UI warns loudly.
 *
 * Run with: npx tsx scripts/seed-snapshot.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ASSETS } from "../data/assets";
import { VENUE_BUCKETS, type VenueBucket } from "../lib/venues";

const UNKNOWN_THRESHOLD = 15;

// Deterministic PRNG so the seed is reproducible.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Known/approximate holder counts from public reporting (illustrative anchors).
const KNOWN_HOLDERS: Record<string, number> = {
  SPCX: 10200,
  SPCXx: 5400,
  SPACEX: 1300,
};

// Issuers with deep DeFi composability skew toward LP/lending; closed ones skew to CEX.
const ISSUER_DEFI_BIAS: Record<string, number> = {
  "xstocks-backed": 1.0,
  "kraken-xstocks": 0.7,
  "backpack-securities": 0.4,
  "ondo-global-markets": 0.35,
  "dinari-dshares": 0.3,
  "pre-stocks": 0.25,
  robinhood: 0.0,
};

function buildVenues(rand: () => number, defiBias: number, supply: number) {
  // Base weights per bucket, modulated by issuer DeFi bias.
  const weights: Record<VenueBucket, number> = {
    "Self-custody wallet": 30 + rand() * 15,
    "Issuer treasury": 15 + rand() * 35,
    "Raydium LP": (8 + rand() * 12) * (0.3 + defiBias),
    "Orca LP": (3 + rand() * 7) * (0.3 + defiBias),
    "Kamino (lending)": (6 + rand() * 14) * (0.2 + defiBias),
    Jupiter: (1 + rand() * 3) * (0.3 + defiBias),
    "CEX wallet": (15 + rand() * 20) * (1.3 - defiBias),
    "Other / unknown": 4 + rand() * (UNKNOWN_THRESHOLD - 5), // keep < threshold
  };
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  return VENUE_BUCKETS.map((bucket) => {
    const pct = (weights[bucket] / total) * 100;
    return { bucket, pct: round(pct), amount: Math.round((pct / 100) * supply) };
  });
}

const round = (n: number) => Math.round(n * 10) / 10;

const assets: Record<string, unknown> = {};

for (const asset of ASSETS) {
  asset.variants.forEach((variant, idx) => {
    const seed = hash(variant.tokenSymbol);
    const rand = mulberry32(seed);
    const defiBias = ISSUER_DEFI_BIAS[variant.issuerSlug] ?? 0.4;

    const holders =
      KNOWN_HOLDERS[variant.tokenSymbol] ?? Math.round(400 + rand() * 6000 * (idx === 0 ? 1.4 : 1));
    const price = round(40 + rand() * 400);
    const supply = Math.round(holders * (8 + rand() * 40));
    const marketCap = Math.round(supply * price);
    const volume24h = Math.round(marketCap * (0.02 + rand() * 0.18));

    const venues = buildVenues(rand, defiBias, supply);
    const unknownPct = venues.find((v) => v.bucket === "Other / unknown")!.pct;

    // A few representative top holders, labelled by their (non-unknown) bucket.
    const labelled = venues.filter((v) => v.bucket !== "Other / unknown" && v.pct > 1);
    const topHolders = labelled.slice(0, 5).map((v, i) => ({
      owner: fakeAddr(rand),
      label: `${v.bucket} #${i + 1}`,
      bucket: v.bucket,
      amount: Math.round(v.amount * (0.3 + rand() * 0.4)),
      pct: round(v.pct * (0.3 + rand() * 0.4)),
    }));

    assets[variant.tokenSymbol] = {
      symbol: variant.tokenSymbol,
      mint: variant.mint,
      holders,
      priceUsd: price,
      marketCapUsd: marketCap,
      volume24hUsd: volume24h,
      venues,
      topHolders,
      unknownPct,
    };
  });
}

function fakeAddr(rand: () => number) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  let s = "";
  for (let i = 0; i < 44; i++) s += chars[Math.floor(rand() * chars.length)];
  return s;
}

const out = {
  snapshotTakenAt: new Date().toISOString(),
  isSeed: true,
  unknownThresholdPct: UNKNOWN_THRESHOLD,
  assets,
};

const path = join(process.cwd(), "data", "snapshot.json");
writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote illustrative seed snapshot for ${Object.keys(assets).length} tokens -> ${path}`);
