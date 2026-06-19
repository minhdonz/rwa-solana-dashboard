/**
 * Maps a token holder to a venue bucket. Pure + dependency-free so it is unit-testable
 * and shared by the refresh script.
 *
 * Inputs per holder:
 *  - owner: the wallet/PDA that owns the token account
 *  - ownerProgram: the program that owns the `owner` account (from getAccountInfo on owner).
 *    For a normal user wallet this is the System Program; for a protocol position it is the
 *    protocol's program id.
 */
import {
  ADDRESS_LABELS,
  PROGRAM_BUCKETS,
  WALLET_OWNER_PROGRAMS,
} from "@/data/venueLabels";
import type { VenueBucket } from "@/lib/venues";

export interface Categorized {
  bucket: VenueBucket;
  label: string | null;
}

export function categorizeOwner(owner: string, ownerProgram: string | null): Categorized {
  // 1. Explicit address label (CEX hot wallets, named treasuries) wins.
  const explicit = ADDRESS_LABELS[owner];
  if (explicit) return { bucket: explicit.bucket, label: explicit.label };

  // 2. Protocol-owned account (LP/lending vault PDA).
  if (ownerProgram) {
    const prog = PROGRAM_BUCKETS[ownerProgram];
    if (prog) return { bucket: prog.bucket, label: prog.label };

    // 3. Ordinary system-owned wallet => self-custody.
    if (WALLET_OWNER_PROGRAMS.has(ownerProgram)) {
      return { bucket: "Self-custody wallet", label: null };
    }
  }

  // 4. Unrecognised program / missing info => unknown (counts against the 15% cap).
  return { bucket: "Other / unknown", label: null };
}
