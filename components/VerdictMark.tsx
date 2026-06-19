import { VERDICT_META, type Verdict } from "@/data/issuers";

/**
 * Institutional status indicator: a thin vertical accent bar in a muted semantic colour.
 * Stretches to the height of its flex row (use inside a `flex items-stretch` parent), so it
 * aligns cleanly next to single- or multi-line text instead of floating like a checkbox.
 */
export default function VerdictMark({ verdict }: { verdict: Verdict }) {
  const meta = VERDICT_META[verdict];
  return (
    <span
      aria-label={meta.label}
      title={meta.label}
      className="self-stretch shrink-0 rounded-full"
      style={{ width: 3, minHeight: "1em", backgroundColor: meta.color }}
    />
  );
}
