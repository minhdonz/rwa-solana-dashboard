/** Venue taxonomy — kept JSON-free so scripts can import it without loading snapshot.json. */

/** Venue buckets a holding can be attributed to. Order = display order. */
export const VENUE_BUCKETS = [
  "Self-custody wallet",
  "Issuer treasury",
  "Raydium LP",
  "Orca LP",
  "Kamino (lending)",
  "Jupiter",
  "CEX wallet",
  "Other / unknown",
] as const;

export type VenueBucket = (typeof VENUE_BUCKETS)[number];

// Muted, print-friendly categorical palette (no neon).
export const VENUE_COLORS: Record<VenueBucket, string> = {
  "Self-custody wallet": "#1d4ed8",
  "Issuer treasury": "#334155",
  "Raydium LP": "#0f766e",
  "Orca LP": "#0369a1",
  "Kamino (lending)": "#b45309",
  Jupiter: "#9d174d",
  "CEX wallet": "#6d28d9",
  "Other / unknown": "#94a3b8",
};
