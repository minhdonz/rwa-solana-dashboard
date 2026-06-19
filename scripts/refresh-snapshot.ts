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
import { config } from "dotenv";
// Load .env.local first (where keys live, per the README), then .env as a fallback.
config({ path: ".env.local" });
config();
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ASSETS } from "../data/assets";
import { categorizeOwner } from "../lib/categorize";
import { getHolders, getMintInfo, getOwnerPrograms } from "../lib/helius";
import { getMarketData } from "../lib/market";
import { SYSTEM_PROGRAM } from "../data/venueLabels";
import { VENUE_BUCKETS, type VenueBucket } from "../lib/venues";

const UNKNOWN_THRESHOLD_PCT = 15;
// Any single *unlabeled* wallet holding >= this % of tracked supply is almost certainly a
// CEX/protocol we haven't labeled (a real individual rarely holds this much). Flag it so the
// gap is visible instead of silently counted as self-custody.
const LARGE_UNLABELED_PCT = 3;

// Venue positions (LP / lending / CEX) are always sizeable holders, never dust. So we only
// fetch the program-owner (the costly RPC) for holders above this share of supply, capped at
// MAX_RESOLVE accounts. The long tail below it is treated as individual self-custody. This
// cuts owner-lookups ~50x on large tokens while preserving venue attribution.
const RESOLVE_THRESHOLD_PCT = Number(process.env.RESOLVE_THRESHOLD_PCT ?? 0.05);
const MAX_RESOLVE = Number(process.env.MAX_RESOLVE ?? 600);
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
  reviewFlags: { owner: string; bucket: VenueBucket; amount: number; pct: number }[];
}

async function processVariant(symbol: string, mint: string): Promise<OutAsset> {
  console.log(`\n• ${symbol} (${mint})`);
  const { decimals, supply } = await getMintInfo(mint);
  const holders = await getHolders(mint, decimals);
  console.log(`  holders: ${holders.length}, supply: ${supply.toLocaleString()}`);

  // Only resolve program-owners for holders large enough to plausibly be a venue.
  const heldTotal = holders.reduce((a, h) => a + h.amount, 0) || 1;
  const minAmount = (RESOLVE_THRESHOLD_PCT / 100) * heldTotal;
  const toResolve = [...holders]
    .sort((a, b) => b.amount - a.amount)
    .filter((h) => h.amount >= minAmount)
    .slice(0, MAX_RESOLVE)
    .map((h) => h.owner);
  const resolveSet = new Set(toResolve);
  console.log(`  resolving program-owner for ${toResolve.length} large holder(s) (rest = self-custody)`);
  const ownerPrograms = await getOwnerPrograms(toResolve);

  const bucketAmounts = new Map<VenueBucket, number>();
  const enriched = holders.map((h) => {
    // Large holders: full categorisation via program-owner. Small holders: explicit address
    // label if any (cheap, no RPC), else individual self-custody.
    const cat = resolveSet.has(h.owner)
      ? categorizeOwner(h.owner, ownerPrograms.get(h.owner) ?? null)
      : categorizeOwner(h.owner, SYSTEM_PROGRAM);
    bucketAmounts.set(cat.bucket, (bucketAmounts.get(cat.bucket) ?? 0) + h.amount);
    return { ...h, ...cat };
  });

  const tracked = [...bucketAmounts.values()].reduce((a, b) => a + b, 0) || 1;
  const venues = VENUE_BUCKETS.map((bucket) => {
    const amount = bucketAmounts.get(bucket) ?? 0;
    return { bucket, amount: Math.round(amount), pct: round((amount / tracked) * 100) };
  });
  const unknownPct = venues.find((v) => v.bucket === "Other / unknown")!.pct;

  // Large unlabeled wallets => likely unlabeled CEX/protocol. Surface for manual classification.
  const reviewFlags = enriched
    .map((h) => ({ ...h, pct: round((h.amount / tracked) * 100) }))
    .filter(
      (h) =>
        h.label === null &&
        (h.bucket === "Self-custody wallet" || h.bucket === "Other / unknown") &&
        h.pct >= LARGE_UNLABELED_PCT
    )
    .sort((a, b) => b.pct - a.pct)
    .map((h) => ({ owner: h.owner, bucket: h.bucket, amount: Math.round(h.amount), pct: h.pct }));

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
  if (reviewFlags.length) {
    console.log(`  ⚑ ${reviewFlags.length} large unlabeled wallet(s) — likely CEX/protocol, please label:`);
    for (const f of reviewFlags) {
      console.log(`      ${f.pct}%  ${f.owner}  (now counted as ${f.bucket})`);
    }
  }

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
    reviewFlags,
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

  const flagged = Object.values(assets).filter((a) => a.reviewFlags.length);
  if (flagged.length) {
    const total = flagged.reduce((n, a) => n + a.reviewFlags.length, 0);
    console.log(
      `\n⚑ ${total} large unlabeled wallet(s) across ${flagged.length} token(s): ` +
        `${flagged.map((a) => a.symbol).join(", ")}.\n` +
        `   Check each on Solscan; if it's an exchange/protocol, add it to data/venueLabels.ts ` +
        `(ADDRESS_LABELS) so it lands in the right bucket, then re-run.`
    );
  }

  if (offenders.length && !FORCE) {
    console.error(
      `\n❌ Unknown-venue % exceeds ${UNKNOWN_THRESHOLD_PCT}% for: ${offenders.join(", ")}.\n` +
        `   Extend data/venueLabels.ts (likely missing CEX hot wallets or a new protocol),\n` +
        `   then re-run. Use --force to write the snapshot anyway.`
    );
    process.exit(1);
  }

  const path = join(process.cwd(), "data", "snapshot.json");

  // Merge onto any existing *real* snapshot so a partial run doesn't drop previously-good
  // variants. (A seed snapshot is discarded — never mix illustrative + real data.)
  let merged: Record<string, OutAsset> = assets;
  try {
    const prev = JSON.parse(readFileSync(path, "utf8"));
    if (prev && prev.isSeed === false && prev.assets) {
      merged = { ...prev.assets, ...assets };
    }
  } catch {
    /* no existing snapshot */
  }

  const out = {
    snapshotTakenAt: new Date().toISOString(),
    isSeed: false,
    unknownThresholdPct: UNKNOWN_THRESHOLD_PCT,
    assets: merged,
  };
  writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
  console.log(`\n✓ Wrote ${path} (${Object.keys(merged).length} tokens total)`);
  if (offenders.length) console.warn(`  (forced; over-cap: ${offenders.join(", ")})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
