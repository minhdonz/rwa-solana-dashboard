"use client";

import { VENUE_COLORS, type TopHolder } from "@/lib/snapshot";
import { shortAddr, formatNumber } from "@/lib/format";

/** Top holders with their venue label and share of tracked supply. */
export default function HolderConcentration({ holders }: { holders: TopHolder[] }) {
  if (!holders.length) {
    return <p className="text-sm text-neutral">No holder breakdown in this snapshot.</p>;
  }
  const max = Math.max(...holders.map((h) => h.pct), 1);
  return (
    <div className="space-y-2.5">
      {holders.map((h, i) => (
        <div key={`${h.owner}-${i}`} className="text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 shrink-0"
                style={{ background: VENUE_COLORS[h.bucket] }}
              />
              <span className="text-slate-700 truncate">{h.label ?? "Unlabeled wallet"}</span>
              <a
                href={`https://solscan.io/account/${h.owner}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-neutral hover:text-brand font-mono shrink-0"
              >
                {shortAddr(h.owner)} ↗
              </a>
            </span>
            <span className="tnum text-slate-600 shrink-0">
              {h.pct}% · {formatNumber(h.amount, { compact: true })}
            </span>
          </div>
          <div className="h-1.5 bg-surface2 mt-1 overflow-hidden">
            <div
              className="h-full"
              style={{ width: `${(h.pct / max) * 100}%`, background: VENUE_COLORS[h.bucket] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
