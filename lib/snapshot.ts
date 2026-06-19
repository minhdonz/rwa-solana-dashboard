/**
 * Snapshot data model + loader.
 *
 * The running app NEVER hits an API. It imports the static `data/snapshot.json`
 * produced by `npm run refresh` (scripts/refresh-snapshot.ts). Every snapshot
 * carries `snapshotTakenAt` so the UI can stamp "Data as of <timestamp>".
 *
 * The deep-dive is built around DeFi utilization: how much of each tokenized stock
 * is deployed in DeFi (DEX liquidity + lending) and the borrow/lend demand for it.
 */
import snapshotJson from "@/data/snapshot.json";

/** Price impact for buying a given USD size (from Jupiter Quote). */
export interface SlippagePoint {
  sizeUsd: number;
  priceImpactPct: number | null; // percent; null when not routable
  routable: boolean;
}

/** One Kamino lending reserve for a token (a token can be in several markets). */
export interface LendingReserve {
  protocol: "Kamino";
  market: string;
  supplyUsd: number;
  borrowUsd: number;
  utilization: number; // 0..100
  supplyApy: number; // %
  borrowApy: number; // %
  maxLtv: number; // 0..1
}

export interface AssetSnapshot {
  symbol: string;
  mint: string | null;
  holders: number | null;
  priceUsd: number | null;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  /** Tradeable DEX liquidity across Solana AMMs (USD). */
  dexLiquidityUsd: number | null;
  /** Kamino lending reserves for this token (empty = not listed for lending). */
  lending: LendingReserve[];
  /** Convenience aggregates over `lending`. */
  lendingSupplyUsd: number;
  lendingBorrowUsd: number;
  /** DEX liquidity + lending supply (USD), the token's total DeFi footprint. */
  defiTvlUsd: number;
  /** Price impact to buy on-chain at several USD sizes (empty if not measured). */
  slippage: SlippagePoint[];
}

export interface Snapshot {
  snapshotTakenAt: string | null;
  isSeed: boolean;
  /** keyed by token symbol */
  assets: Record<string, AssetSnapshot>;
}

const snapshot = snapshotJson as unknown as Snapshot;

export function getSnapshot(): Snapshot {
  return snapshot;
}

export function getAssetSnapshot(symbol: string): AssetSnapshot | undefined {
  return snapshot.assets[symbol];
}
