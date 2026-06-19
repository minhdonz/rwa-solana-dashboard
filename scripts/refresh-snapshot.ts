/**
 * MANUAL refresh — regenerates data/snapshot.json from live DeFi data.
 * Run: `npm run refresh`. Keyless — uses only the public Jupiter and Kamino APIs.
 *
 * Per tokenized-stock variant:
 *   - Jupiter token search -> price, market cap, DEX liquidity, 24h volume, holder count
 *   - Kamino API           -> lending reserves (supply / borrow / utilization / APY / LTV)
 *
 * The result captures DeFi utilization: how much of each stock is deployed in DeFi and
 * the borrow/lend demand for it.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ASSETS } from "../data/assets";
import { getKaminoReservesByMint, type KaminoReserve } from "../lib/kamino";
import { getTokenMarket } from "../lib/jupiterData";
import { getSlippageCurve } from "../lib/slippage";
import type { AssetSnapshot, LendingReserve } from "../lib/snapshot";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const round = (n: number) => Math.round(n * 100) / 100;

function toLending(reserves: KaminoReserve[]): LendingReserve[] {
  return reserves
    .sort((a, b) => b.supplyUsd - a.supplyUsd)
    .map((r) => ({
      protocol: "Kamino" as const,
      market: r.market,
      supplyUsd: Math.round(r.supplyUsd),
      borrowUsd: Math.round(r.borrowUsd),
      utilization: round(r.utilization),
      supplyApy: round(r.supplyApy),
      borrowApy: round(r.borrowApy),
      maxLtv: r.maxLtv,
    }));
}

async function main() {
  console.log("Fetching Kamino markets…");
  const kaminoByMint = await getKaminoReservesByMint();
  console.log(`Kamino: ${kaminoByMint.size} mints with lending reserves.\n`);

  const assets: Record<string, AssetSnapshot> = {};
  let processed = 0;
  let skipped = 0;

  for (const asset of ASSETS) {
    for (const variant of asset.variants) {
      if (!variant.mint) {
        console.log(`• ${variant.tokenSymbol} — SKIP (no mint)`);
        skipped += 1;
        continue;
      }
      try {
        const market = await getTokenMarket(variant.mint);
        const lending = toLending(kaminoByMint.get(variant.mint) ?? []);
        const lendingSupplyUsd = lending.reduce((s, r) => s + r.supplyUsd, 0);
        const lendingBorrowUsd = lending.reduce((s, r) => s + r.borrowUsd, 0);
        const defiTvlUsd = (market.dexLiquidityUsd ?? 0) + lendingSupplyUsd;
        const slippage = await getSlippageCurve(variant.mint);

        assets[variant.tokenSymbol] = {
          symbol: variant.tokenSymbol,
          mint: variant.mint,
          holders: market.holders,
          priceUsd: market.priceUsd,
          marketCapUsd: market.marketCapUsd,
          volume24hUsd: market.volume24hUsd,
          dexLiquidityUsd: market.dexLiquidityUsd,
          lending,
          lendingSupplyUsd,
          lendingBorrowUsd,
          defiTvlUsd,
          slippage,
        };
        processed += 1;
        const buy10k = slippage.find((s) => s.sizeUsd === 10_000);
        const impact10k = buy10k?.routable ? `${buy10k.priceImpactPct}%` : "no route";
        console.log(
          `• ${variant.tokenSymbol.padEnd(7)} holders=${market.holders ?? "?"}` +
            `  dexLiq=$${Math.round(market.dexLiquidityUsd ?? 0).toLocaleString()}` +
            `  kaminoSupply=$${Math.round(lendingSupplyUsd).toLocaleString()}` +
            `  $10k buy impact=${impact10k}` +
            (lending.length ? "  ✓ lending" : "")
        );
        await sleep(120); // be gentle on the Jupiter lite API
      } catch (err) {
        console.error(`• ${variant.tokenSymbol} — failed: ${(err as Error).message}`);
      }
    }
  }

  console.log(`\nProcessed ${processed} variant(s), skipped ${skipped}.`);

  const path = join(process.cwd(), "data", "snapshot.json");
  // Merge onto an existing real snapshot so a partial run doesn't drop variants.
  let merged: Record<string, AssetSnapshot> = assets;
  try {
    const prev = JSON.parse(readFileSync(path, "utf8"));
    if (prev && prev.isSeed === false && prev.assets) merged = { ...prev.assets, ...assets };
  } catch {
    /* none */
  }

  const out = { snapshotTakenAt: new Date().toISOString(), isSeed: false, assets: merged };
  writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
  console.log(`✓ Wrote ${path} (${Object.keys(merged).length} tokens)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
