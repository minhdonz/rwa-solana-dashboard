/**
 * MANUAL refresh — regenerates data/snapshot.json from live on-chain data.
 * Run by the project owner: `npm run refresh` (needs .env.local with HELIUS_API_KEY,
 * optionally BIRDEYE_API_KEY). The running app never does this.
 *
 * Pipeline per variant mint:
 *   1. getMintInfo -> decimals, supply
 *   2. getHolders -> all owners + balances (aggregated)
 *   3. getOwnerPrograms -> program that owns each holder account
 *   4. categorizeOwner -> venue bucket; aggregate into slices + top holders
 *   5. getMarketData -> price / mcap / volume (optional)
 *
 * GATE: if any asset's "Other / unknown" % exceeds UNKNOWN_THRESHOLD_PCT (15), the script
 * exits non-zero and tells you to extend data/venueLabels.ts. Pass --force to write anyway.
 */
import "dotenv/config";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ASSETS } from "../data/assets";
import { categorizeOwner } from "../lib/categorize";
import { getHolders, getMintInfo, getOwnerPrograms } from "../lib/helius";
import { getMarketData } from "../lib/market";
import { VENUE_BUCKETS, type VenueBucket } from "../lib/venues";

const UNKNOWN_THRESHOLD_PCT = 15;
const FORCE = process.argv.includes("--force");

interface OutAsset {
  symbol: string;
  mint: string | null;
  holders: number | null;
  priceUsd: number | null;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  venues: { bucket: VenueBucket; amount: number; pct: number }[];
  topHolders: { owner: string; label: string | null; bucket: VenueBucket; amount: number; pct: number }[];
  unknownPct: number | null;
}

async function processVariant(symbol: string, mint: string): Promise<OutAsset> {
  console.log(`\n• ${symbol} (${mint})`);
  const { decimals, supply } = await getMintInfo(mint);
  const holders = await getHolders(mint, decimals);
  console.log(`  holders: ${holders.length}, supply: ${supply.toLocaleString()}`);

  const owners = holders.map((h) => h.owner);
  const ownerPrograms = await getOwnerPrograms(owners);

  const bucketAmounts = new Map<VenueBucket, number>();
  const enriched = holders.map((h) => {
    const cat = categorizeOwner(h.owner, ownerPrograms.get(h.owner) ?? null);
    bucketAmounts.set(cat.bucket, (bucketAmounts.get(cat.bucket) ?? 0) + h.amount);
    return { ...h, ...cat };
  });

  const tracked = [...bucketAmounts.values()].reduce((a, b) => a + b, 0) || 1;
  const venues = VENUE_BUCKETS.map((bucket) => {
    const amount = bucketAmounts.get(bucket) ?? 0;
    return { bucket, amount: Math.round(amount), pct: round((amount / tracked) * 100) };
  });
  const unknownPct = venues.find((v) => v.bucket === "Other / unknown")!.pct;

  const topHolders = [...enriched]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
    .map((h) => ({
      owner: h.owner,
      label: h.label,
      bucket: h.bucket,
      amount: Math.round(h.amount),
      pct: round((h.amount / tracked) * 100),
    }));

  const market = await getMarketData(mint);
  console.log(
    `  unknown: ${unknownPct}% ${unknownPct > UNKNOWN_THRESHOLD_PCT ? "❌ OVER CAP" : "✓"}` +
      (market.priceUsd ? ` · $${market.priceUsd}` : "")
  );

  return {
    symbol,
    mint,
    holders: holders.length,
    priceUsd: market.priceUsd,
    marketCapUsd: market.marketCapUsd,
    volume24hUsd: market.volume24hUsd,
    venues,
    topHolders,
    unknownPct,
  };
}

const round = (n: number) => Math.round(n * 10) / 10;

async function main() {
  const assets: Record<string, OutAsset> = {};
  const offenders: string[] = [];
  let processed = 0;
  let skipped = 0;

  for (const asset of ASSETS) {
    for (const variant of asset.variants) {
      if (!variant.mint) {
        console.log(`\n• ${variant.tokenSymbol} — SKIP (no mint set in data/assets.ts)`);
        skipped += 1;
        continue;
      }
      try {
        const out = await processVariant(variant.tokenSymbol, variant.mint);
        assets[variant.tokenSymbol] = out;
        processed += 1;
        if ((out.unknownPct ?? 0) > UNKNOWN_THRESHOLD_PCT) offenders.push(variant.tokenSymbol);
      } catch (err) {
        console.error(`  ! failed ${variant.tokenSymbol}: ${(err as Error).message}`);
      }
    }
  }

  console.log(`\nProcessed ${processed} variant(s), skipped ${skipped} (missing mint).`);

  if (offenders.length && !FORCE) {
    console.error(
      `\n❌ Unknown-venue % exceeds ${UNKNOWN_THRESHOLD_PCT}% for: ${offenders.join(", ")}.\n` +
        `   Extend data/venueLabels.ts (likely missing CEX hot wallets or a new protocol),\n` +
        `   then re-run. Use --force to write the snapshot anyway.`
    );
    process.exit(1);
  }

  const out = {
    snapshotTakenAt: new Date().toISOString(),
    isSeed: false,
    unknownThresholdPct: UNKNOWN_THRESHOLD_PCT,
    assets,
  };
  const path = join(process.cwd(), "data", "snapshot.json");
  writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
  console.log(`\n✓ Wrote ${path}`);
  if (offenders.length) console.warn(`  (forced; over-cap: ${offenders.join(", ")})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
