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

      <section className="border-l-2 border-brand bg-surface px-5 py-4 max-w-3xl">
        <h3 className="font-semibold text-navy text-sm">
          Reading &quot;buying mechanism&quot;: primary vs. secondary
        </h3>
        <div className="text-sm text-slate-600 mt-2 leading-relaxed space-y-2">
          <p>
            There are two ways to acquire a tokenized stock, and they have different hours:
          </p>
          <ul className="space-y-1.5 list-none">
            <li>
              <span className="font-medium text-slate-700">Primary (mint/redeem)</span> — transacting
              directly with the issuer, which buys or sells the real share through its broker-dealer
              (e.g. Alpaca for Ondo). This settles on US-equity rails, so it runs <span className="tnum">24/5</span>{" "}
              and pauses on weekends and market holidays.
            </li>
            <li>
              <span className="font-medium text-slate-700">Secondary (DEX/CEX)</span> — buying existing
              tokens from other holders on an exchange or AMM. This runs <span className="tnum">24/7</span>{" "}
              and needs no issuer involvement.
            </li>
          </ul>
          <p>
            The practical difference is liquidity. <span className="font-medium text-slate-700">xStocks</span>{" "}
            and <span className="font-medium text-slate-700">Backpack</span> have deep secondary markets, so
            you can buy any time — though when the primary market is closed, the token&apos;s price can
            drift from the underlying since the arbitrage that holds the peg is paused.{" "}
            <span className="font-medium text-slate-700">Ondo</span> is effectively primary-only (its tokens
            have almost no secondary DEX liquidity), so its <span className="tnum">24/5</span> intent
            mechanism is, in practice, the <em>only</em> way in — no weekend buying.
          </p>
        </div>
      </section>

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
