/**
 * Snapshot data model + loader.
 *
 * The running app NEVER hits an API. It imports the static `data/snapshot.json`
 * produced by `npm run refresh` (scripts/refresh-snapshot.ts). Every snapshot
 * carries `snapshotTakenAt` so the UI can stamp "Data as of <timestamp>".
 *
 * When `isSeed` is true the figures are an illustrative placeholder (the repo
 * ships one so the UI renders before you run the refresh with real API keys).
 */
import snapshotJson from "@/data/snapshot.json";
import { type VenueBucket } from "./venues";

export { VENUE_BUCKETS, VENUE_COLORS, type VenueBucket } from "./venues";

export interface VenueSlice {
  bucket: VenueBucket;
  amount: number; // token units
  pct: number; // 0..100 of circulating supply held in tracked accounts
}

export interface TopHolder {
  owner: string;
  label: string | null; // e.g. "Kamino main reserve", null if unknown
  bucket: VenueBucket;
  amount: number;
  pct: number;
}

export interface AssetSnapshot {
  symbol: string; // token symbol, e.g. "SPCXx"
  mint: string | null;
  holders: number | null;
  priceUsd: number | null;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  venues: VenueSlice[];
  topHolders: TopHolder[];
  unknownPct: number | null; // % of supply in "Other / unknown" — gated at <=15 by refresh
}

export interface Snapshot {
  snapshotTakenAt: string | null; // ISO timestamp
  isSeed: boolean;
  /** Max acceptable Other/unknown % the refresh script enforces. */
  unknownThresholdPct: number;
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
