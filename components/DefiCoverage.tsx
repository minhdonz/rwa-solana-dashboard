import { type AssetSnapshot } from "@/lib/snapshot";
import { formatUsd, formatPct } from "@/lib/format";

function impactClass(pct: number): string {
  if (pct < 0.5) return "text-pos";
  if (pct < 2) return "text-caution";
  return "text-neg";
}

/**
 * DeFi utilization for a single token variant: tradeable DEX liquidity plus the
 * lending markets it's listed in (supply / borrow demand / utilization / rates / LTV).
 */
export default function DefiCoverage({ snap }: { snap: AssetSnapshot }) {
  const hasLending = snap.lending.length > 0;
  const hasLiquidity = (snap.dexLiquidityUsd ?? 0) > 0;
  const defiVsMcap =
    snap.marketCapUsd && snap.marketCapUsd > 0 ? (snap.defiTvlUsd / snap.marketCapUsd) * 100 : null;

  if (!hasLending && !hasLiquidity) {
    return (
      <p className="text-sm text-neutral">
        Not listed in any tracked DeFi venue. No measurable DEX liquidity or lending market.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
        <Cell label="DeFi footprint" value={formatUsd(snap.defiTvlUsd, { compact: true })} sub="DEX liq + lending supply" />
        <Cell label="DEX liquidity" value={formatUsd(snap.dexLiquidityUsd, { compact: true })} sub="tradeable on AMMs" />
        <Cell label="Lending supply" value={formatUsd(snap.lendingSupplyUsd, { compact: true })} sub="deposited as collateral" />
        <Cell
          label="% of mcap in DeFi"
          value={defiVsMcap == null ? "—" : formatPct(defiVsMcap)}
          sub="deployed vs total value"
        />
      </div>

      <div>
        <h4 className="eyebrow mb-2">Lending markets &amp; borrow demand</h4>
        {hasLending ? (
          <div className="overflow-x-auto border border-line">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-surface border-b border-line-strong eyebrow">
                  <th className="text-left px-3 py-2 font-semibold">Market</th>
                  <th className="text-right px-3 py-2 font-semibold">Supplied</th>
                  <th className="text-right px-3 py-2 font-semibold">Borrowed</th>
                  <th className="text-right px-3 py-2 font-semibold">Utilization</th>
                  <th className="text-right px-3 py-2 font-semibold">Borrow APY</th>
                  <th className="text-right px-3 py-2 font-semibold">Max LTV</th>
                </tr>
              </thead>
              <tbody>
                {snap.lending.map((r, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="px-3 py-2">
                      <span className="text-navy">{r.protocol}</span>
                      <span className="text-neutral"> · {r.market}</span>
                    </td>
                    <td className="px-3 py-2 text-right tnum">{formatUsd(r.supplyUsd, { compact: true })}</td>
                    <td className="px-3 py-2 text-right tnum">{formatUsd(r.borrowUsd, { compact: true })}</td>
                    <td className="px-3 py-2 text-right tnum">
                      <UtilBar pct={r.utilization} />
                    </td>
                    <td className="px-3 py-2 text-right tnum">{formatPct(r.borrowApy)}</td>
                    <td className="px-3 py-2 text-right tnum">{(r.maxLtv * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-neutral">
            Tradeable on DEXs, but not listed as collateral in any tracked lending market, so there is no
            borrow/lend demand to measure.
          </p>
        )}
      </div>

      {snap.slippage && snap.slippage.length > 0 && (
        <div>
          <h4 className="eyebrow mb-2">Buy slippage (price impact)</h4>
          <div className="overflow-x-auto border border-line">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-surface border-b border-line-strong eyebrow">
                  <th className="text-left px-3 py-2 font-semibold">Buy size</th>
                  {snap.slippage.map((p) => (
                    <th key={p.sizeUsd} className="text-right px-3 py-2 font-semibold">
                      {formatUsd(p.sizeUsd, { compact: true })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 text-neutral">Price impact</td>
                  {snap.slippage.map((p) => (
                    <td key={p.sizeUsd} className="px-3 py-2 text-right tnum">
                      {p.routable && p.priceImpactPct != null ? (
                        <span className={impactClass(p.priceImpactPct)}>{formatPct(p.priceImpactPct, 2)}</span>
                      ) : (
                        <span className="text-neutral">no route</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-neutral mt-1.5">
            Price impact to market-buy with USDC, routed via Jupiter. &quot;No route&quot; means the size
            can&apos;t be filled on-chain at current liquidity.
          </p>
        </div>
      )}
    </div>
  );
}

function Cell({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-paper p-3">
      <div className="eyebrow">{label}</div>
      <div className="text-lg font-semibold text-navy mt-1 tnum">{value}</div>
      <div className="text-xs text-neutral mt-0.5">{sub}</div>
    </div>
  );
}

function UtilBar({ pct }: { pct: number }) {
  return (
    <span className="inline-flex items-center gap-2 justify-end">
      <span className="inline-block w-16 h-1.5 bg-surface2 overflow-hidden align-middle">
        <span className="block h-full bg-brand" style={{ width: `${Math.min(pct, 100)}%` }} />
      </span>
      {pct.toFixed(1)}%
    </span>
  );
}
