/**
 * Slippage / price-impact analysis via the public Jupiter Quote API (keyless).
 * Quotes buying several USD sizes of a token with USDC and records the price impact,
 * i.e. what a buyer pays beyond mid-price. "No route" means the token can't be bought
 * on-chain at that size (no DEX liquidity).
 */

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const USDC_DECIMALS = 6;

/** Buy sizes (USD) to quote. */
export const SLIPPAGE_SIZES_USD = [1_000, 10_000, 100_000, 1_000_000];

export interface SlippagePoint {
  sizeUsd: number;
  /** Price impact as a percent (e.g. 0.65). null when not routable. */
  priceImpactPct: number | null;
  routable: boolean;
}

async function quoteImpact(mint: string, sizeUsd: number): Promise<SlippagePoint> {
  const amount = Math.round(sizeUsd * 10 ** USDC_DECIMALS);
  const url =
    `https://lite-api.jup.ag/swap/v1/quote?inputMint=${USDC_MINT}&outputMint=${mint}` +
    `&amount=${amount}&slippageBps=100`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { sizeUsd, priceImpactPct: null, routable: false };
    const j = await res.json();
    if (j.error || j.priceImpactPct == null) return { sizeUsd, priceImpactPct: null, routable: false };
    return { sizeUsd, priceImpactPct: Math.round(Number(j.priceImpactPct) * 100 * 1000) / 1000, routable: true };
  } catch {
    return { sizeUsd, priceImpactPct: null, routable: false };
  }
}

export async function getSlippageCurve(mint: string): Promise<SlippagePoint[]> {
  const out: SlippagePoint[] = [];
  for (const size of SLIPPAGE_SIZES_USD) {
    out.push(await quoteImpact(mint, size));
    await new Promise((r) => setTimeout(r, 100));
  }
  return out;
}
