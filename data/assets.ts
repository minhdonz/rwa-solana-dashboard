/**
 * CURATED top tokenized stocks on Solana + their per-issuer variants.
 *
 * The same underlying (e.g. SpaceX) often exists as several distinct tokens from
 * different issuers with different rights. We track each `variant` so the deep-dive
 * can compare them side by side.
 *
 * `mint`: Solana SPL mint address. Required by `npm run refresh` to fetch holders.
 *   Mints below were resolved via the Jupiter token search API (scripts/resolve-mints.ts)
 *   and corroborated by issuer naming patterns (xStocks mints start "Xs" / name "… xStock";
 *   Ondo mints end "ondo" / name "… (Ondo Tokenized)") plus realistic holder counts & mcap.
 *   `null` = no verified token found. The refresh script skips null mints and the UI falls
 *   back to the seed snapshot for that symbol.
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
      { issuerSlug: "backpack-securities", tokenSymbol: "SPCX", mint: "SPCXxcqXj6e5dJDVNovHN8744zkbhM2bYudU45BimGb" },
      { issuerSlug: "xstocks-backed", tokenSymbol: "SPCXx", mint: "Xs3oZwbHvqis4NYcf4YKWmEia2eC84wSiVrcYcTqpH8" },
      { issuerSlug: "pre-stocks", tokenSymbol: "SPACEX", mint: "PreANxuXjsy2pvisWWMNB6YaJNzr7681wJJr2rHsfTh" },
    ],
  },
  {
    symbol: "nvda",
    name: "NVIDIA",
    sector: "Semiconductors",
    note: "Bellwether AI chip name and one of the most-traded tokenized equities on Solana DEXs.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "NVDAx", mint: "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh" },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "NVDAon", mint: "gEGtLTPNQ7jcg25zTetkbmF7teoDLcrfTnQfmn2ondo" },
    ],
  },
  {
    symbol: "tsla",
    name: "Tesla",
    sector: "Automotive / Energy",
    note: "High-retail-interest name with deep DEX liquidity across issuers.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "TSLAx", mint: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB" },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "TSLAon", mint: "KeGv7bsfR4MheC1CkmnAVceoApjrkvBhHYjWb67ondo" },
    ],
  },
  {
    symbol: "aapl",
    name: "Apple",
    sector: "Consumer electronics",
    note: "Core large-cap; part of the Magnificent-7 set most accessed by global traders via Solana.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "AAPLx", mint: "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp" },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "AAPLon", mint: "123mYEnRLM2LLYsJW3K6oyYh8uP1fngj732iG638ondo" },
    ],
  },
  {
    symbol: "mstr",
    name: "Strategy (MicroStrategy)",
    sector: "Bitcoin treasury",
    note: "Popular crypto-adjacent equity, a natural fit for crypto-native holders using DeFi leverage.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "MSTRx", mint: "XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ" },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "MSTRon", mint: "FSz4ouiqXpHuGPcpacZfTzbMjScoj5FfzHkiyu2ondo" },
    ],
  },
  {
    symbol: "coin",
    name: "Coinbase",
    sector: "Crypto exchange",
    note: "Crypto-native equity widely held alongside on-chain positions.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "COINx", mint: "Xs7ZdzSHLU9ftNJsii5fCeJhoRWSC32SQGzGQtePxNu" },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "COINon", mint: "5u6KDiNJXxX4rGMfYT4BApZQC5CuDNrG6MHkwp1ondo" },
    ],
  },
  {
    symbol: "amzn",
    name: "Amazon",
    sector: "E-commerce / Cloud",
    note: "Magnificent-7 large-cap available across the major issuers.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "AMZNx", mint: "Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg" },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "AMZNon", mint: "14Tqdo8V1FhzKsE3W2pFsZCzYPQxxupXRcqw9jv6ondo" },
    ],
  },
  {
    symbol: "msft",
    name: "Microsoft",
    sector: "Software / Cloud",
    note: "Magnificent-7 large-cap; part of Kraken's launch lineup.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "MSFTx", mint: "XspzcW1PRtgf6Wj92HCiZdjzKCyFekVD8P5Ueh3dRMX" },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "MSFTon", mint: "FRmH6iRkMr33DLG6zVLR7EM4LojBFAuq6NtFzG6ondo" },
    ],
  },
  {
    symbol: "googl",
    name: "Alphabet (Google)",
    sector: "Internet / AI",
    note: "Magnificent-7 large-cap accessed globally via Solana tokens.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "GOOGLx", mint: "XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN" },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "GOOGLon", mint: "bbahNA5vT9WJeYft8tALrH1LXWffjwqVoUbqYa1ondo" },
    ],
  },
  {
    symbol: "spy",
    name: "S&P 500 ETF (SPY)",
    sector: "Broad-market ETF",
    isETF: true,
    note: "Tokenized index exposure, a building block for on-chain diversified strategies.",
    variants: [
      { issuerSlug: "xstocks-backed", tokenSymbol: "SPYx", mint: "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W" },
      { issuerSlug: "ondo-global-markets", tokenSymbol: "SPYon", mint: "k18WJUULWheRkSpSquYGdNNmtuE2Vbw1hpuUi92ondo" },
    ],
  },
];

export function getAsset(symbol: string): Asset | undefined {
  return ASSETS.find((a) => a.symbol === symbol.toLowerCase());
}
