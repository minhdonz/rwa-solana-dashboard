/**
 * Per-token market data via Jupiter's token search API (keyless).
 * One call yields price, market cap, DEX liquidity (USD), 24h volume and holder count.
 */

export interface TokenMarket {
  priceUsd: number | null;
  marketCapUsd: number | null;
  dexLiquidityUsd: number | null;
  volume24hUsd: number | null;
  holders: number | null;
}

interface JupSearchToken {
  id: string;
  symbol: string;
  usdPrice?: number;
  mcap?: number;
  liquidity?: number;
  holderCount?: number;
  stats24h?: { buyVolume?: number; sellVolume?: number };
}

export async function getTokenMarket(mint: string): Promise<TokenMarket> {
  const url = `https://lite-api.jup.ag/tokens/v2/search?query=${encodeURIComponent(mint)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Jupiter search ${mint} HTTP ${res.status}`);
  const arr = (await res.json()) as JupSearchToken[];
  const t = arr.find((x) => x.id === mint) ?? arr[0];
  if (!t) return { priceUsd: null, marketCapUsd: null, dexLiquidityUsd: null, volume24hUsd: null, holders: null };
  const vol = (t.stats24h?.buyVolume ?? 0) + (t.stats24h?.sellVolume ?? 0);
  return {
    priceUsd: t.usdPrice ?? null,
    marketCapUsd: t.mcap ?? null,
    dexLiquidityUsd: t.liquidity ?? null,
    volume24hUsd: vol > 0 ? vol : null,
    holders: t.holderCount ?? null,
  };
}
