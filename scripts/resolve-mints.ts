/**
 * Resolves token symbols in data/assets.ts to Solana mint addresses via Jupiter's
 * token search API (curated; filters most scam/copycat tokens). Read-only: prints
 * candidates with name / holders / mcap so you can confirm before pasting.
 *
 * Run: npx tsx scripts/resolve-mints.ts
 */
import { ASSETS } from "../data/assets";

interface JupToken {
  id: string; // mint address
  name: string;
  symbol: string;
  holderCount?: number;
  mcap?: number;
  usdPrice?: number;
}

async function search(query: string): Promise<JupToken[]> {
  const url = `https://lite-api.jup.ag/tokens/v2/search?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`search ${query}: HTTP ${res.status}`);
  return (await res.json()) as JupToken[];
}

const fmt = (n?: number) =>
  n == null ? "—" : new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);

async function main() {
  for (const asset of ASSETS) {
    console.log(`\n=== ${asset.name} (${asset.symbol}) ===`);
    for (const v of asset.variants) {
      let results: JupToken[] = [];
      try {
        results = await search(v.tokenSymbol);
      } catch (e) {
        console.log(`  ${v.tokenSymbol}: search failed (${(e as Error).message})`);
        continue;
      }
      // Exact symbol match first, ranked by holders then mcap.
      const exact = results
        .filter((r) => r.symbol?.toLowerCase() === v.tokenSymbol.toLowerCase())
        .sort((a, b) => (b.holderCount ?? 0) - (a.holderCount ?? 0) || (b.mcap ?? 0) - (a.mcap ?? 0));
      const shown = (exact.length ? exact : results).slice(0, 3);
      const flag = v.mint ? "(currently set)" : "(null)";
      console.log(`  ${v.tokenSymbol} ${flag} [${v.issuerSlug}]`);
      if (!shown.length) {
        console.log("      → no candidates; resolve manually on Solscan");
        continue;
      }
      for (const m of shown) {
        console.log(
          `      ${m.id}  "${m.name}"  holders=${fmt(m.holderCount)} mcap=${fmt(m.mcap)}`
        );
      }
      await new Promise((r) => setTimeout(r, 120)); // be gentle on the API
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
