# Tokenized Stocks on Solana — Issuer Rights & Usage Dashboard

Two questions, one dashboard:

1. **Issuer rights & tradeoffs** (the hero) — how each issuer treats holders: voting, dividends,
   redemption, custody, DeFi composability, eligibility. Fully sourced. `/issuers`
2. **Top tokens deep-dive** — for the most-held tokenized stocks, *where* holders keep them
   (self-custody wallets, Raydium/Orca LPs, Kamino lending, Jupiter, CEX wallets), with issuer
   variants side by side. `/assets`

Built with Next.js 14 (App Router) + Tailwind + Recharts.

## Architecture (static snapshot, keyless app)

The running app **never calls an API**. It imports curated TypeScript data plus a static
`data/snapshot.json`. A manual refresh script regenerates the snapshot from on-chain data; you commit
the result and redeploy. So the site is fast, can't be rate-limited, and needs no secrets to serve.

| Path | Role |
|---|---|
| `data/issuers.ts` | **Curated** issuer rights matrix (every cell sourced). The hero. |
| `data/assets.ts` | **Curated** top tokens + per-issuer variants + mint addresses. |
| `data/venueLabels.ts` | **Curated** program / address → venue label map (accuracy lever). |
| `data/snapshot.json` | **Generated** holders/mcap/venue buckets + `snapshotTakenAt`. App reads this. |
| `scripts/refresh-snapshot.ts` | Manual refresh: Helius + Birdeye → snapshot, with ≤15% unknown gate. |
| `scripts/seed-snapshot.ts` | Generates the illustrative placeholder snapshot (flagged `isSeed`). |
| `lib/categorize.ts` | Holder → venue bucket (pure, shared). |

## Develop

```bash
npm install
npm run dev        # http://localhost:3000 — works immediately on seed data
npm run build      # typecheck + lint + prerender
```

The repo ships an **illustrative seed** snapshot so the UI renders out of the box. Every data view shows
a loud "⚠ Illustrative seed data" banner until you run a real refresh.

## Refreshing on-chain data (manual, owner-run)

1. Fill in the `mint` for each variant in `data/assets.ts` (verify each against
   [Solscan](https://solscan.io)). Variants with `mint: null` are skipped.
2. Copy `.env.local.example` → `.env.local` and set `HELIUS_API_KEY` (required) and `BIRDEYE_API_KEY`
   (optional — enables price/mcap/volume).
3. Run the refresh:
   ```bash
   npm run refresh
   ```
   It fetches holders, classifies each by venue, computes the "Other / unknown" %, and **fails if any
   asset exceeds the 15% unknown cap** — extend `data/venueLabels.ts` (usually a missing CEX hot wallet
   or new protocol) and re-run. `--force` writes anyway.
4. Commit the updated `data/snapshot.json` and redeploy. The banner flips to "Data as of <timestamp>".

### Why the 15% cap matters
"Unknown" holdings are owners we can't attribute to a venue. A high unknown % means the chart is
misleading, so the cap forces label coverage. **CEX hot wallets in particular must be labeled** — one
exchange wallet can custody thousands of users' tokens, so unlabeled it both inflates "unknown" and
hides that the supply is really exchange-held.

## Disclaimers
Not investment, legal, or tax advice. Issuer rights are hand-curated and may be out of date — verify via
each cell's source link. On-chain figures are point-in-time snapshots, not live.

## Deferred (v2)
Live/real-time data, historical trends, and full 400+ asset coverage would need a dedicated indexer +
data warehouse — out of scope for this snapshot-based v1.
