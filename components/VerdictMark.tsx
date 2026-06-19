import { VERDICT_META, type Verdict } from "@/data/issuers";

/**
 * Institutional status indicator: a small filled/hollow square in a muted semantic
 * colour. Replaces emoji glyphs. `size` in px for the square.
 */
export default function VerdictMark({
  verdict,
  size = 9,
}: {
  verdict: Verdict;
  size?: number;
}) {
  const meta = VERDICT_META[verdict];
  return (
    <span
      aria-label={meta.label}
      title={meta.label}
      className="inline-block shrink-0 align-middle"
      style={{
        width: size,
        height: size,
        backgroundColor: meta.filled ? meta.color : "transparent",
        border: `1.5px solid ${meta.color}`,
        borderRadius: 1,
      }}
    />
  );
}
