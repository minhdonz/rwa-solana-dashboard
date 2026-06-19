/**
 * Diagnostic: for the given mints, lists the owner-programs that fall into the
 * "Other / unknown" bucket, ranked by share of supply. Tells you exactly which
 * program IDs to add to data/venueLabels.ts (PROGRAM_BUCKETS) to close the gap.
 *
 * Usage: npx tsx scripts/diagnose-unknown.ts <mint> [<mint> ...]
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { getHolders, getMintInfo, getOwnerPrograms } from "../lib/helius";
import { PROGRAM_BUCKETS, ADDRESS_LABELS, SYSTEM_PROGRAM } from "../data/venueLabels";

const RESOLVE_THRESHOLD_PCT = 0.05;
const MAX_RESOLVE = 600;

async function diagnose(mint: string) {
  console.log(`\n=== ${mint} ===`);
  const { decimals } = await getMintInfo(mint);
  const holders = await getHolders(mint, decimals);
  const held = holders.reduce((a, h) => a + h.amount, 0) || 1;
  const min = (RESOLVE_THRESHOLD_PCT / 100) * held;
  const large = [...holders].sort((a, b) => b.amount - a.amount).filter((h) => h.amount >= min).slice(0, MAX_RESOLVE);
  const programs = await getOwnerPrograms(large.map((h) => h.owner));

  // Sum unknown amounts by owner-program.
  const byProgram = new Map<string, { amount: number; sample: string }>();
  for (const h of large) {
    if (ADDRESS_LABELS[h.owner]) continue;
    const prog = programs.get(h.owner) ?? "null";
    if (prog === SYSTEM_PROGRAM) continue; // self-custody, not unknown
    if (PROGRAM_BUCKETS[prog]) continue; // already mapped
    const cur = byProgram.get(prog) ?? { amount: 0, sample: h.owner };
    cur.amount += h.amount;
    byProgram.set(prog, cur);
  }

  const ranked = [...byProgram.entries()].sort((a, b) => b[1].amount - a[1].amount);
  if (!ranked.length) {
    console.log("  no unrecognized programs among large holders");
    return;
  }
  for (const [prog, info] of ranked) {
    console.log(`  ${((info.amount / held) * 100).toFixed(1)}%  program=${prog}  egAccount=${info.sample}`);
  }
}

async function main() {
  const mints = process.argv.slice(2);
  if (!mints.length) {
    console.error("Pass one or more mint addresses.");
    process.exit(1);
  }
  for (const m of mints) await diagnose(m);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
