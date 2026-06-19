import type { Metadata } from "next";
import Link from "next/link";
import SnapshotBanner from "@/components/SnapshotBanner";
import { ASSETS } from "@/data/assets";
import { getIssuer } from "@/data/issuers";
import { getAssetSnapshot } from "@/lib/snapshot";
import { formatNumber, formatUsd } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tokenized Stocks on Solana — DeFi Utilization",
};

interface Row {
  symbol: string;
  name: string;
  sector: string;
  isPrivate?: boolean;
  isETF?: boolean;
  variants: { tokenSymbol: string; issuerSlug: string }[];
  holders: number;
  defiTvlUsd: number;
  borrowUsd: number;
  lendingSupplyUsd: number;
}

export default function AssetsPage() {
  const rows: Row[] = ASSETS.map((asset) => {
    const snaps = asset.variants.map((v) => getAssetSnapshot(v.tokenSymbol)).filter(Boolean);
    return {
      symbol: asset.symbol,
      name: asset.name,
      sector: asset.sector,
      isPrivate: asset.isPrivate,
      isETF: asset.isETF,
      variants: asset.variants,
      holders: sum(snaps.map((s) => s!.holders ?? 0)),
      defiTvlUsd: sum(snaps.map((s) => s!.defiTvlUsd ?? 0)),
      borrowUsd: sum(snaps.map((s) => s!.lendingBorrowUsd ?? 0)),
      lendingSupplyUsd: sum(snaps.map((s) => s!.lendingSupplyUsd ?? 0)),
    };
  }).sort((a, b) => b.defiTvlUsd - a.defiTvlUsd);

  return (
    <div className="space-y-6">
      <header className="max-w-3xl border-b border-line pb-6">
        <p className="eyebrow mb-2">Reference · DeFi utilization</p>
        <h1 className="font-serif text-3xl font-semibold text-navy leading-tight">
          Where tokenized stocks are actually used in DeFi
        </h1>
        <p className="text-slate-600 leading-relaxed mt-3">
          Holding a tokenized stock is one thing; <em>using</em> it is another. This ranks the leading
          names by their DeFi footprint — tradeable DEX liquidity plus how much is supplied as collateral
          and borrowed against in lending markets (Kamino). Open one to compare issuer variants.
        </p>
      </header>

      <SnapshotBanner />

      <div className="border border-line bg-paper overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-surface border-b border-line-strong eyebrow">
              <th className="text-left px-4 py-2.5">Asset</th>
              <th className="text-right px-4 py-2.5">Holders</th>
              <th className="text-right px-4 py-2.5">DeFi footprint</th>
              <th className="text-right px-4 py-2.5">Lending supply</th>
              <th className="text-right px-4 py-2.5">Borrowed</th>
              <th className="text-left px-4 py-2.5">Variants</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.symbol} className="border-b border-line last:border-0 hover:bg-surface">
                <td className="px-4 py-3">
                  <Link href={`/assets/${r.symbol}`} className="font-semibold text-navy hover:text-brand">
                    {r.name}
                  </Link>
                  <div className="text-xs text-neutral mt-0.5">
                    {r.sector}
                    {r.isPrivate && " · private"}
                    {r.isETF && " · ETF"}
                  </div>
                </td>
                <td className="px-4 py-3 text-right tnum text-slate-700">
                  {formatNumber(r.holders, { compact: true })}
                </td>
                <td className="px-4 py-3 text-right tnum font-medium text-navy">
                  {formatUsd(r.defiTvlUsd, { compact: true })}
                </td>
                <td className="px-4 py-3 text-right tnum text-slate-700">
                  {r.lendingSupplyUsd > 0 ? formatUsd(r.lendingSupplyUsd, { compact: true }) : "—"}
                </td>
                <td className="px-4 py-3 text-right tnum text-slate-700">
                  {r.borrowUsd > 0 ? formatUsd(r.borrowUsd, { compact: true }) : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {r.variants.map((v) => (
                      <span
                        key={v.tokenSymbol}
                        className="text-xs bg-surface2 px-2 py-0.5 text-slate-600 border border-line font-mono"
                      >
                        {v.tokenSymbol}
                        <span className="text-neutral"> · {getIssuer(v.issuerSlug)?.shortName}</span>
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-neutral">
        DeFi footprint = DEX liquidity + lending supply. Lending data from Kamino; liquidity, price and
        holders from Jupiter. Ranked by DeFi footprint.
      </p>
    </div>
  );
}

function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}
