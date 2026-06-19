/** Shared formatting helpers used across pages. */

export function formatUsd(value: number | null | undefined, opts?: { compact?: boolean }): string {
  if (value == null || Number.isNaN(value)) return "—";
  if (opts?.compact) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 100 ? 2 : 0,
  }).format(value);
}

export function formatNumber(value: number | null | undefined, opts?: { compact?: boolean }): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: opts?.compact ? "compact" : "standard",
    maximumFractionDigits: opts?.compact ? 1 : 0,
  }).format(value);
}

export function formatPct(value: number | null | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

/** Shorten a Solana address: AbC...XyZ */
export function shortAddr(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

/** Human-readable "X ago" plus absolute timestamp for the snapshot banner. */
export function formatSnapshotTime(iso: string | null | undefined): { absolute: string; relative: string } {
  if (!iso) return { absolute: "no snapshot yet", relative: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { absolute: "invalid date", relative: "" };
  const absolute = d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
  const diffMs = Date.now() - d.getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  let relative: string;
  if (diffH < 1) relative = "less than an hour ago";
  else if (diffH < 24) relative = `${diffH}h ago`;
  else relative = `${Math.floor(diffH / 24)}d ago`;
  return { absolute, relative };
}
