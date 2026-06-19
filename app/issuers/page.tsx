import type { Metadata } from "next";
import RightsMatrix from "@/components/RightsMatrix";
import { RIGHTS_LAST_REVIEWED } from "@/data/issuers";

export const metadata: Metadata = {
  title: "Issuer Rights Comparison — Tokenized Stocks on Solana",
};

export default function IssuersPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl border-b border-line pb-6">
        <p className="eyebrow mb-2">Reference · Issuer comparison</p>
        <h1 className="font-serif text-3xl font-semibold text-navy leading-tight">
          Issuer rights &amp; tradeoffs
        </h1>
        <p className="text-slate-600 leading-relaxed mt-3">
          A &quot;tokenized AAPL&quot; is not one instrument. The same underlying share is wrapped
          differently depending on the issuer — and those differences determine whether a holder can
          vote, collect dividends, redeem for a real share, or deploy the token in DeFi. The matrix below
          compares the major Solana tokenized-stock issuers across the dimensions that are material to a
          holder.
        </p>
        <p className="text-xs text-neutral mt-4">
          Rights data last reviewed {RIGHTS_LAST_REVIEWED}. Verify against the cited sources before
          transacting.
        </p>
      </header>

      <RightsMatrix />

      <section className="grid gap-px bg-line border border-line sm:grid-cols-3">
        <Takeaway
          title="Strongest direct claim"
          body="Backpack Securities (broker-dealer) lets a holder redeem 1:1 to a real share via ACATS into a Schwab or Fidelity account — the closest thing to genuine ownership."
        />
        <Takeaway
          title="Deepest composability"
          body="xStocks (Backed) is the DeFi-native option: Kamino collateral, Raydium liquidity, Jupiter routing — but with no shareholder rights and institution-only redemption."
        />
        <Takeaway
          title="Universal caveat"
          body="Across nearly every issuer, holders receive price exposure with no voting rights. Dividends are synthetic (USDC) or brokerage pass-throughs rather than native."
        />
      </section>
    </div>
  );
}

function Takeaway({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-paper p-5">
      <h3 className="font-semibold text-navy text-sm">{title}</h3>
      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{body}</p>
    </div>
  );
}
