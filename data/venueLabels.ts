/**
 * CURATED label map — the accuracy lever for "where is it held / used".
 *
 * Two mechanisms:
 *  1. PROGRAM_BUCKETS: if a token-account's *owner* is itself an account owned by one of
 *     these programs (i.e. a protocol vault/PDA), the holding is attributed to that venue.
 *  2. ADDRESS_LABELS: explicit owner addresses (e.g. CEX hot wallets) that are ordinary
 *     system-owned wallets and can only be identified by a known-address list.
 *
 * Coverage here directly determines the "Other / unknown" %. The refresh script enforces
 * unknown <= UNKNOWN_THRESHOLD_PCT (15) per asset and tells you which buckets to expand.
 *
 * ⚠️ Program IDs below are well-known Solana protocol IDs. CEX hot-wallet addresses are
 * deployment-specific and must be filled/verified before relying on the CEX bucket — they
 * are intentionally left as a TODO so we never mislabel.
 */
import type { VenueBucket } from "@/lib/venues";

export const SYSTEM_PROGRAM = "11111111111111111111111111111111";
export const TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
export const TOKEN_2022_PROGRAM = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
export const ATA_PROGRAM = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";

/** Program owner of a holder account -> venue bucket + label. */
export const PROGRAM_BUCKETS: Record<string, { bucket: VenueBucket; label: string }> = {
  // Raydium
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": { bucket: "Raydium LP", label: "Raydium AMM v4" },
  CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK: { bucket: "Raydium LP", label: "Raydium CLMM" },
  CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C: { bucket: "Raydium LP", label: "Raydium CPMM" },
  // Orca
  whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc: { bucket: "Orca LP", label: "Orca Whirlpools" },
  // Kamino lending
  KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD: { bucket: "Kamino (lending)", label: "Kamino Lend" },
  // Jupiter
  JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4: { bucket: "Jupiter", label: "Jupiter Aggregator v6" },
  // Meteora (treat DLMM liquidity as DEX LP -> Orca/Raydium-style; bucketed under Raydium LP family)
  LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo: { bucket: "Raydium LP", label: "Meteora DLMM" },
};

/** Specific owner addresses (CEX hot wallets, treasuries, etc.). */
export const ADDRESS_LABELS: Record<string, { bucket: VenueBucket; label: string }> = {
  // TODO: fill verified CEX hot-wallet addresses before relying on the CEX bucket, e.g.:
  // "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9": { bucket: "CEX wallet", label: "Binance hot wallet" },
  // Without these, exchange-custodied supply falls into "Other / unknown" and will (correctly)
  // push the unknown % up, signalling that labels need extending.
};

/** Programs that mean "an ordinary self-custody wallet holds this". */
export const WALLET_OWNER_PROGRAMS = new Set([SYSTEM_PROGRAM]);
