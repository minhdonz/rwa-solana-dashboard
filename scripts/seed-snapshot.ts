/**
 * Generates an ILLUSTRATIVE seed snapshot (data/snapshot.json) so the UI renders
 * before anyone runs the real `npm run refresh`. Figures are self-consistent but NOT
 * real — the snapshot is flagged `isSeed: true` and the UI warns loudly.
 *
 * Run: npx tsx scripts/seed-snapshot.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ASSETS } from "../data/assets";
import type { AssetSnapshot, LendingReserve } from "../lib/snapshot";

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

// xStocks are the DeFi-composable issuer; others have little/no lending coverage.
const HAS_KAMINO = (slug: string) => slug === "xstocks-backed";

const assets: Record<string, AssetSnapshot> = {};

for (const asset of ASSETS) {
  for (const variant of asset.variants) {
    const rand = mulberry32(hash(variant.tokenSymbol));
    const holders = Math.round(1000 + rand() * 40000);
    const price = Math.round((40 + rand() * 700) * 100) / 100;
    const mcap = Math.round(holders * price * (5 + rand() * 30));
    const dexLiq = Math.round(mcap * (0.02 + rand() * 0.08));
    const vol = Math.round(dexLiq * (0.5 + rand() * 4));

    let lending: LendingReserve[] = [];
    if (HAS_KAMINO(variant.issuerSlug)) {
      const supply = Math.round(mcap * (0.02 + rand() * 0.1));
      const util = round2(2 + rand() * 10);
      lending = [
        {
          protocol: "Kamino",
          market: "xStocks Market",
          supplyUsd: supply,
          borrowUsd: Math.round(supply * (util / 100)),
          utilization: util,
          supplyApy: round2((util / 100) * 4),
          borrowApy: round2(3.85 + rand() * 0.3),
          maxLtv: Math.round((0.3 + rand() * 0.45) * 100) / 100,
        },
      ];
    }
    const lendingSupplyUsd = lending.reduce((s, r) => s + r.supplyUsd, 0);
    const lendingBorrowUsd = lending.reduce((s, r) => s + r.borrowUsd, 0);

    assets[variant.tokenSymbol] = {
      symbol: variant.tokenSymbol,
      mint: variant.mint,
      holders,
      priceUsd: price,
      marketCapUsd: mcap,
      volume24hUsd: vol,
      dexLiquidityUsd: dexLiq,
      lending,
      lendingSupplyUsd,
      lendingBorrowUsd,
      defiTvlUsd: dexLiq + lendingSupplyUsd,
    };
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

const out = { snapshotTakenAt: new Date().toISOString(), isSeed: true, assets };
const path = join(process.cwd(), "data", "snapshot.json");
writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote illustrative seed snapshot for ${Object.keys(assets).length} tokens -> ${path}`);
