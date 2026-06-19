import type { Metadata } from "next";
import Link from "next/link";
import SnapshotBanner from "@/components/SnapshotBanner";
import { ASSETS } from "@/data/assets";
import { getIssuer } from "@/data/issuers";
import { getAssetSnapshot } from "@/lib/snapshot";
import { formatNumber, formatUsd } from "@/lib/format";

export const metadata: Metadata = {
  title: "Top Tokenized Stocks on Solana — Where They're Held",
};

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-3xl border-b border-line pb-6">
        <p className="eyebrow mb-2">Reference · Holdings analysis</p>
        <h1 className="font-serif text-3xl font-semibold text-navy leading-tight">
          Leading tokenized stocks
        </h1>
        <p className="text-slate-600 leading-relaxed mt-3">
          The most significant tokenized stocks on Solana, each frequently issued in several variants.
          Open an asset to review total holders and the venue distribution — the share held in
          self-custody wallets versus DEX liquidity, lending collateral, and exchange wallets — and to
          compare issuer variants side by side.
        </p>
      </header>

      <SnapshotBanner />

      <div className="border border-line bg-paper">
        <div className="hidden md:grid grid-cols-[1fr_140px_140px_minmax(220px,1fr)] gap-4 px-5 py-2.5 border-b border-line-strong bg-surface eyebrow">
          <span>Asset</span>
          <span className="text-right">Holders</span>
          <span className="text-right">Market cap</span>
          <span>Issuer variants</span>
        </div>
        {ASSETS.map((asset) => {
          const totalHolders = asset.variants.reduce(
            (sum, v) => sum + (getAssetSnapshot(v.tokenSymbol)?.holders ?? 0),
            0
          );
          const totalMcap = asset.variants.reduce(
            (sum, v) => sum + (getAssetSnapshot(v.tokenSymbol)?.marketCapUsd ?? 0),
            0
          );
          return (
            <Link
              key={asset.symbol}
              href={`/assets/${asset.symbol}`}
              className="grid md:grid-cols-[1fr_140px_140px_minmax(220px,1fr)] gap-x-4 gap-y-2 px-5 py-4 border-b border-line last:border-0 hover:bg-surface group"
            >
              <div>
                <div className="font-semibold text-navy group-hover:text-brand">{asset.name}</div>
                <div className="text-xs text-neutral mt-0.5">
                  {asset.sector}
                  {asset.isPrivate && " · private"}
                  {asset.isETF && " · ETF"}
                </div>
              </div>
              <div className="md:text-right text-sm text-slate-700 tnum">
                {formatNumber(totalHolders, { compact: true })}
                <span className="md:hidden text-neutral"> holders</span>
              </div>
              <div className="md:text-right text-sm text-slate-700 tnum">
                {formatUsd(totalMcap, { compact: true })}
                <span className="md:hidden text-neutral"> mcap</span>
              </div>
              <div className="flex flex-wrap gap-1.5 self-center">
                {asset.variants.map((v) => (
                  <span
                    key={v.tokenSymbol}
                    className="text-xs bg-surface2 px-2 py-0.5 text-slate-600 border border-line font-mono"
                  >
                    {v.tokenSymbol}
                    <span className="text-neutral"> · {getIssuer(v.issuerSlug)?.shortName}</span>
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
