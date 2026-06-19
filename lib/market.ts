/**
 * Market data (price / market cap / 24h volume) via Birdeye. Used only by the refresh script.
 * Birdeye is optional — if BIRDEYE_API_KEY is unset, market fields come back null and the
 * snapshot still records holders + venue distribution.
 */

export interface MarketData {
  priceUsd: number | null;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
}

export async function getMarketData(mint: string): Promise<MarketData> {
  // Read lazily so dotenv can populate it before this runs.
  const birdeyeKey = process.env.BIRDEYE_API_KEY;
  if (!birdeyeKey) return { priceUsd: null, marketCapUsd: null, volume24hUsd: null };
  try {
    const res = await fetch(`https://public-api.birdeye.so/defi/token_overview?address=${mint}`, {
      headers: { "X-API-KEY": birdeyeKey, "x-chain": "solana", accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Birdeye HTTP ${res.status}`);
    const json = await res.json();
    const d = json?.data ?? {};
    return {
      priceUsd: d.price ?? null,
      marketCapUsd: d.marketCap ?? d.mc ?? null,
      volume24hUsd: d.v24hUSD ?? null,
    };
  } catch (err) {
    console.warn(`  ! market data failed for ${mint}: ${(err as Error).message}`);
    return { priceUsd: null, marketCapUsd: null, volume24hUsd: null };
  }
}
