# Tokenized Stocks on Solana — Issuer Rights & DeFi Utilization

Two questions, one dashboard:

1. **Issuer rights & tradeoffs** (the hero) — how each issuer treats holders: voting, dividends,
   redemption, custody, DeFi composability, eligibility. Fully sourced. `/issuers`
2. **DeFi utilization** — for the leading tokenized stocks, how much is actually *used* in DeFi:
   tradeable DEX liquidity plus collateral supplied and borrowed in lending markets. `/assets`

Built with Next.js 14 (App Router) + Tailwind + Recharts.

## Architecture (static snapshot, keyless)

The running app **never calls an API**. It imports curated TypeScript data plus a static
`data/snapshot.json` produced by a manual refresh script. The site is fast, can't be rate-limited, and
needs no secrets to serve. The refresh itself is also **keyless** — it uses only public APIs.

| Path | Role |
|---|---|
| `data/issuers.ts` | **Curated** issuer rights matrix (every cell sourced). The hero. |
| `data/assets.ts` | **Curated** top tokens + per-issuer variants + verified mint addresses. |
| `data/snapshot.json` | **Generated** per-token DeFi metrics + `snapshotTakenAt`. App reads this. |
| `scripts/refresh-snapshot.ts` | Manual refresh: Jupiter + Kamino → snapshot. |
| `scripts/resolve-mints.ts` | Helper: resolve token symbols → mints via Jupiter search. |
| `scripts/seed-snapshot.ts` | Generates the illustrative placeholder snapshot (`isSeed: true`). |
| `lib/kamino.ts` / `lib/jupiterData.ts` | Public API clients used only by the refresh script. |

### Data sources
- **Jupiter token search** (keyless) — price, market cap, DEX liquidity, 24h volume, holder count.
- **Kamino API** (keyless) — lending reserves per market: supply, borrow, utilization, APY, max LTV.

Jupiter Lend's public API exposes only the lend (stablecoin) side; tokenized stocks are used there as
collateral and that borrow data isn't public, so lending/borrow demand is sourced from Kamino.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # typecheck + lint + prerender
```

The repo ships an illustrative seed snapshot so the UI renders out of the box; a loud banner flags it
until you run a real refresh.

## Refreshing data (manual, keyless)

```bash
npm run refresh
```

For each variant in `data/assets.ts` it pulls Jupiter market data + Kamino lending, writes
`data/snapshot.json` with a fresh `snapshotTakenAt`, and merges onto any existing real snapshot so a
partial run never drops data. Commit the updated `snapshot.json` and redeploy — the banner flips to
"Data as of <timestamp>".

To add a token, add its variants (with verified mints) to `data/assets.ts` and re-run.
`scripts/resolve-mints.ts` helps find/verify mints from Jupiter's curated token list.

## Disclaimers
Not investment, legal, or tax advice. Issuer rights are hand-curated and may be out of date — verify via
each cell's source link. Metrics are point-in-time snapshots, not live.
