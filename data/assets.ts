/**
 * CURATED top tokenized stocks on Solana + their per-issuer variants.
 *
 * The same underlying (e.g. SpaceX) often exists as several distinct tokens from
 * different issuers with different rights — we track each `variant` so the deep-dive
 * can compare them side by side.
 *
 * `mint`: Solana SPL mint address. Required by `npm run refresh` to fetch holders.
 *   ⚠️ Mints marked null are TODO — fill & verify against Solscan before refreshing
 *   that variant. The refresh script skips null mints (and the UI falls back to the
 *   seed snapshot for that symbol).
 */

export interface AssetVariant {
  issuerSlug: string; // -> data/issuers.ts
  tokenSymbol: string; // -> key into snapshot.assets
  mint: string | null;
}

export interface Asset {
  /** Canonical underlying symbol used as the route param, lower-cased. */
  symbol: string;
  name: string;
  sector: string;
  /** Pre-IPO / private name (no public listing). */
  isPrivate?: boolean;
  isETF?: boolean;
  /** Why this asset is interesting / notable on Solana. */
  note: string;
  variants: AssetVariant[];
}

export const ASSETS: Asset[] = [
  {
    symbol: "spacex",
    name: "SpaceX",
    sector: "Aerospace (private)",
    isPrivate: true,
    note: "The flagship tokenized private name. Three issuers shipped variants around the IPO; Solana hit ~99% of cross-chain tokenized-SpaceX volume. Backpack's SPCX crossed 10k holders, ~2x xStocks' SPCXx.",
    variants: [
      { issuerSlug: "backpack-securities", tokenSymbol: "SPCX", mint: null },
      { issuerSlug: "xstocks-backed", tokenSymbol: "SPCXx", mint: null },
      { issuerSlug: "pre-stocks", tokenSymbol: "SPACEX", mint: null },
    ],
  },
  {
    symbol: "nvda",
    name: "NVIDIA",
    sector: "Semiconductors",
    note: "Bellwether AI chip name and one of the most-traded tokenized equities on Solana DEXs.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "NVDAx", mint: null },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "NVDA.o", mint: null },
      { issuerSlug: "dinari-dshares", tokenSymbol: "dNVDA", mint: null },
    ],
  },
  {
    symbol: "tsla",
    name: "Tesla",
    sector: "Automotive / Energy",
    note: "High-retail-interest name with deep DEX liquidity across issuers.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "TSLAx", mint: null },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "TSLA.o", mint: null },
      { issuerSlug: "dinari-dshares", tokenSymbol: "dTSLA", mint: null },
    ],
  },
  {
    symbol: "aapl",
    name: "Apple",
    sector: "Consumer electronics",
    note: "Core large-cap; part of the Magnificent-7 set most accessed by global traders via Solana.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "AAPLx", mint: null },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "AAPL.o", mint: null },
      { issuerSlug: "dinari-dshares", tokenSymbol: "dAAPL", mint: null },
    ],
  },
  {
    symbol: "mstr",
    name: "Strategy (MicroStrategy)",
    sector: "Bitcoin treasury",
    note: "Popular crypto-adjacent equity — natural fit for crypto-native holders using DeFi leverage.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "MSTRx", mint: null },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "MSTR.o", mint: null },
    ],
  },
  {
    symbol: "coin",
    name: "Coinbase",
    sector: "Crypto exchange",
    note: "Crypto-native equity widely held alongside on-chain positions.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "COINx", mint: null },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "COIN.o", mint: null },
    ],
  },
  {
    symbol: "amzn",
    name: "Amazon",
    sector: "E-commerce / Cloud",
    note: "Magnificent-7 large-cap available across the major issuers.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "AMZNx", mint: null },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "AMZN.o", mint: null },
    ],
  },
  {
    symbol: "msft",
    name: "Microsoft",
    sector: "Software / Cloud",
    note: "Magnificent-7 large-cap; part of Kraken's launch lineup.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "MSFTx", mint: null },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "MSFT.o", mint: null },
    ],
  },
  {
    symbol: "googl",
    name: "Alphabet (Google)",
    sector: "Internet / AI",
    note: "Magnificent-7 large-cap accessed globally via Solana tokens.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "GOOGLx", mint: null },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "GOOGL.o", mint: null },
    ],
  },
  {
    symbol: "spy",
    name: "S&P 500 ETF (SPY)",
    sector: "Broad-market ETF",
    isETF: true,
    note: "Tokenized index exposure — a building block for on-chain diversified strategies.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "SPYx", mint: null },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "SPY.o", mint: null },
    ],
  },
];

export function getAsset(symbol: string): Asset | undefined {
  return ASSETS.find((a) => a.symbol === symbol.toLowerCase());
}
