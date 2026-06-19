import Link from "next/link";
import SnapshotBanner from "@/components/SnapshotBanner";
import StatCard from "@/components/StatCard";
import { ISSUERS } from "@/data/issuers";
import { ASSETS } from "@/data/assets";
import { getSnapshot } from "@/lib/snapshot";
import { formatNumber, formatUsd } from "@/lib/format";

export default function HomePage() {
  const snap = getSnapshot();
  const variants = ASSETS.reduce((n, a) => n + a.variants.length, 0);
  const totalHolders = Object.values(snap.assets).reduce((s, a) => s + (a.holders ?? 0), 0);
  const totalMcap = Object.values(snap.assets).reduce((s, a) => s + (a.marketCapUsd ?? 0), 0);

  return (
    <div className="space-y-10">
      <section className="max-w-3xl border-b border-line pb-8">
        <p className="eyebrow mb-3">Tokenized equities on Solana</p>
        <h1 className="font-serif text-4xl font-semibold text-navy leading-[1.15]">
          Who treats holders best, and what gets used in DeFi.
        </h1>
        <p className="text-slate-600 leading-relaxed mt-4">
          A &quot;tokenized stock&quot; means different things depending on the issuer. Some give a real,
          redeemable claim to a share; most give price exposure with no voting rights and institution-only
          redemption. This reference compares the{" "}
          <Link href="/issuers" className="text-brand hover:underline">
            rights each issuer grants
          </Link>
          , then ranks the{" "}
          <Link href="/assets" className="text-brand hover:underline">
            leading tokens
          </Link>{" "}
          by how much is actually deployed in DeFi: tradeable liquidity and lending demand.
        </p>
      </section>

      <SnapshotBanner />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
        <StatCard label="Issuers compared" value={String(ISSUERS.length)} sub="rights matrix" />
        <StatCard
          label="Tokens tracked"
          value={`${ASSETS.length} · ${variants} variants`}
          sub="leading tokenized stocks"
        />
        <StatCard
          label="Holders in snapshot"
          value={formatNumber(totalHolders, { compact: true })}
          sub={snap.isSeed ? "illustrative" : "on-chain"}
        />
        <StatCard
          label="Market cap in snapshot"
          value={formatUsd(totalMcap, { compact: true })}
          sub={snap.isSeed ? "illustrative" : "on-chain"}
        />
      </section>

      <section className="grid md:grid-cols-2 gap-px bg-line border border-line">
        <Link href="/issuers" className="bg-paper p-6 hover:bg-surface group">
          <p className="eyebrow">Section 01</p>
          <h2 className="font-serif text-xl font-semibold text-navy mt-1 group-hover:text-brand">
            Issuer rights &amp; tradeoffs
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Voting, dividends, redemption, custody, DeFi composability and eligibility compared across{" "}
            {ISSUERS.length} issuers: xStocks, Backpack, Ondo, Pre-Stocks, Kraken, Robinhood.
            Every claim sourced.
          </p>
          <span className="text-brand text-sm mt-3 inline-block">View the rights matrix →</span>
        </Link>
        <Link href="/assets" className="bg-paper p-6 hover:bg-surface group">
          <p className="eyebrow">Section 02</p>
          <h2 className="font-serif text-xl font-semibold text-navy mt-1 group-hover:text-brand">
            Leading tokens &amp; their DeFi utilization
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            For the top tokenized stocks, see how much is actually deployed in DeFi: tradeable DEX
            liquidity plus collateral supplied and borrowed in lending markets (Kamino), with issuer
            variants side by side.
          </p>
          <span className="text-brand text-sm mt-3 inline-block">Explore the tokens →</span>
        </Link>
      </section>
    </div>
  );
}
