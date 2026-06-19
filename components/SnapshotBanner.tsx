import { getSnapshot } from "@/lib/snapshot";
import { formatSnapshotTime } from "@/lib/format";

/**
 * "Data as of <timestamp>" line shown on every view backed by snapshot data.
 * Warns clearly when the snapshot is the illustrative seed rather than real on-chain data.
 */
export default function SnapshotBanner() {
  const snap = getSnapshot();
  const { absolute, relative } = formatSnapshotTime(snap.snapshotTakenAt);

  if (snap.isSeed) {
    return (
      <div className="border-l-2 border-caution bg-caution/5 px-4 py-2.5 text-xs flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-semibold text-caution tracking-label uppercase text-[0.6875rem]">
          Illustrative data
        </span>
        <span className="text-slate-600">
          On-chain figures below are placeholders, not actual holdings. Run{" "}
          <code className="bg-surface2 px-1 py-0.5 text-slate-700 font-mono">npm run refresh</code> with
          API keys to populate live data.
        </span>
        <span className="text-neutral">· generated {absolute}</span>
      </div>
    );
  }

  return (
    <div className="border-l-2 border-pos bg-surface px-4 py-2.5 text-xs flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-600">
      <span className="font-semibold text-slate-700 tracking-label uppercase text-[0.6875rem]">
        Data as of {absolute}
      </span>
      {relative && <span className="text-neutral">({relative})</span>}
      <span className="text-neutral">· point-in-time snapshot · Jupiter + Kamino</span>
    </div>
  );
}
