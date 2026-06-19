import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SnapshotBanner from "@/components/SnapshotBanner";
import DefiCoverage from "@/components/DefiCoverage";
import StatCard from "@/components/StatCard";
import { ASSETS, getAsset, type AssetVariant } from "@/data/assets";
import { getIssuer } from "@/data/issuers";
import { getAssetSnapshot } from "@/lib/snapshot";
import { formatNumber, formatUsd } from "@/lib/format";

export function generateStaticParams() {
  return ASSETS.map((a) => ({ symbol: a.symbol }));
}

export function generateMetadata({ params }: { params: { symbol: string } }): Metadata {
  const asset = getAsset(params.symbol);
  return { title: asset ? `${asset.name} — DeFi utilization by issuer` : "Asset not found" };
}

export default function AssetDetailPage({ params }: { params: { symbol: string } }) {
  const asset = getAsset(params.symbol);
  if (!asset) notFound();

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-6">
        <Link href="/assets" className="text-sm text-brand hover:underline">
          ← All tokens
        </Link>
        <h1 className="font-serif text-3xl font-semibold text-navy mt-3">{asset.name}</h1>
        <div className="text-xs text-neutral mt-1">
          {asset.sector}
          {asset.isPrivate && " · private company"}
          {asset.isETF && " · ETF"}
        </div>
        <p className="text-slate-600 leading-relaxed mt-3 max-w-3xl">{asset.note}</p>
      </div>

      <SnapshotBanner />

      <p className="text-sm text-slate-600">
        <span className="text-navy font-medium">{asset.variants.length} issuer variant(s).</span> The same
        underlying, wrapped differently — compare holders and how much of each is actually deployed in
        DeFi (tradeable liquidity and lending/borrow demand).
      </p>

      <div className="space-y-6">
        {asset.variants.map((variant) => (
          <VariantPanel key={variant.tokenSymbol} variant={variant} />
        ))}
      </div>
    </div>
  );
}

function VariantPanel({ variant }: { variant: AssetVariant }) {
  const issuer = getIssuer(variant.issuerSlug);
  const snap = getAssetSnapshot(variant.tokenSymbol);

  return (
    <section className="border border-line bg-paper">
      <div className="flex items-center justify-between gap-3 flex-wrap px-5 py-4 border-b border-line bg-surface">
        <div>
          <h2 className="text-lg font-semibold text-navy font-mono">
            {variant.tokenSymbol}
            <span className="text-sm font-sans font-normal text-neutral ml-2">
              by{" "}
              {issuer ? (
                <Link href={`/issuers/${issuer.slug}`} className="text-brand hover:underline">
                  {issuer.name}
                </Link>
              ) : (
                variant.issuerSlug
              )}
            </span>
          </h2>
          {issuer && <p className="text-xs text-neutral mt-0.5">{issuer.tagline}</p>}
        </div>
        {!variant.mint && (
          <span className="text-xs border border-caution/40 bg-caution/5 text-caution px-2 py-1">
            mint TODO — set in data/assets.ts to refresh
          </span>
        )}
      </div>

      {!snap ? (
        <p className="text-sm text-neutral px-5 py-4">No snapshot data for this variant yet.</p>
      ) : (
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            <StatCard label="Holders" value={formatNumber(snap.holders)} />
            <StatCard label="Market cap" value={formatUsd(snap.marketCapUsd, { compact: true })} />
            <StatCard label="24h volume" value={formatUsd(snap.volume24hUsd, { compact: true })} />
            <StatCard label="Price" value={formatUsd(snap.priceUsd)} />
          </div>
          <DefiCoverage snap={snap} />
        </div>
      )}
    </section>
  );
}
