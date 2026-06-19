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
  jupeiUmn818Jg1ekPURTpr4mFo29p46vygyykFJ3wZC: { bucket: "Jupiter", label: "Jupiter Lend" },
  // Meteora (treat DLMM liquidity as DEX LP -> Orca/Raydium-style; bucketed under Raydium LP family)
  LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo: { bucket: "Raydium LP", label: "Meteora DLMM" },
};

/**
 * Specific owner addresses (CEX hot wallets, treasuries, etc.).
 *
 * Why this matters: a CEX hot wallet is an ordinary system-owned account — structurally
 * identical to a user's self-custody wallet. Without an explicit entry here it is bucketed
 * as "Self-custody wallet", silently understating CEX custody. The refresh script's
 * large-unlabeled-holder flag (LARGE_UNLABELED_PCT) surfaces any sizeable wallet that is
 * still unlabeled so you can classify it.
 *
 * Each active entry below cites a Solscan label. The exchanges that actually custody
 * tokenized stocks (Kraken, Bybit, Backpack, Gate, Bitget, Crypto.com) are the ones worth
 * adding — verify their Solana hot-wallet addresses on Solscan/Arkham before enabling.
 */
export const ADDRESS_LABELS: Record<string, { bucket: VenueBucket; label: string }> = {
  // Issuer treasury / minter — holds large unminted/reserve supply, not a user position.
  // The same wallet mints every xStocks token (also its on-chain metadata `dev` address).
  S7vYFFWH6BjJyEsdrPQpqpYTqLTrPRK6KW3VwsJuRaS: { bucket: "Issuer treasury", label: "xStocks minter (Backed)" }, // solscan.io/account/S7vYFFWH6BjJyEsdrPQpqpYTqLTrPRK6KW3VwsJuRaS

  // Verified via Solscan account labels (label shown on the linked account page):
  GJRs4FwHtemZ5ZE9x3FNvJ8TMwitKTh21yxdRPqn7npE: { bucket: "CEX wallet", label: "Coinbase" }, // solscan.io/account/GJRs4FwHtemZ5ZE9x3FNvJ8TMwitKTh21yxdRPqn7npE (Coinbase Hot Wallet 2)
  "53unSgGWqEWANcPYRF35B2Bgf8BkszUtcccKiXwGGLyr": { bucket: "CEX wallet", label: "Binance.US" }, // solscan.io/account/53unSgGWqEWANcPYRF35B2Bgf8BkszUtcccKiXwGGLyr
  "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM": { bucket: "CEX wallet", label: "Binance" }, // solscan.io/account/9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
  AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2: { bucket: "CEX wallet", label: "Bybit" }, // solscan.io/account/AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2 (Bybit Hot Wallet)
  u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w: { bucket: "CEX wallet", label: "Gate" }, // solscan.io/account/u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w (Gate.io)
  "7TWnq4WeYcwQWBCwKeEX2Q9xqVtthPGkB7adNvueuVuh": { bucket: "CEX wallet", label: "Bitget" }, // solscan.io/account/7TWnq4WeYcwQWBCwKeEX2Q9xqVtthPGkB7adNvueuVuh (Bitget cold wallet)

  // TODO — Kraken and Backpack matter most here (Kraken resells xStocks; Backpack issues SPCX)
  // but no Solscan-labeled Solana hot wallet was confirmable. Verify on Solscan/Arkham and add.
  // The refresh script's large-unlabeled-holder flag will point you at the likely addresses.
  // "<kraken_sol_hot_wallet>":   { bucket: "CEX wallet", label: "Kraken" },
  // "<backpack_sol_hot_wallet>": { bucket: "CEX wallet", label: "Backpack" },
};

/** Programs that mean "an ordinary self-custody wallet holds this". */
export const WALLET_OWNER_PROGRAMS = new Set([SYSTEM_PROGRAM]);
