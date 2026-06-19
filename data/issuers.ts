/**
 * CURATED issuer rights dataset — the HERO of this dashboard.
 *
 * Each issuer is profiled across the rights dimensions that materially differ for a *holder*.
 * Every cell carries a holder-facing verdict + a source link so claims are auditable.
 *
 * ⚠️ This is hand-curated editorial data compiled from issuer docs/T&Cs and reporting.
 * Issuers change terms — see each cell's `source` and the `lastReviewed` date below.
 * NOT investment, legal, or tax advice.
 */

export const RIGHTS_LAST_REVIEWED = "2026-06-19";

export type Verdict = "good" | "bad" | "partial" | "neutral";

export interface RightCell {
  /** Short value shown in the matrix cell. */
  value: string;
  /** Holder-facing verdict that drives the glyph/colour. */
  verdict: Verdict;
  /** Longer explanation shown on expand — what this means for a holder. */
  note: string;
  /** Source URL backing the claim. */
  source: string;
}

/** The rights dimensions, in display order. */
export const DIMENSIONS = [
  { key: "legalWrapper", label: "Legal wrapper" },
  { key: "backing", label: "Backing & custody" },
  { key: "voting", label: "Shareholder & voting rights" },
  { key: "dividends", label: "Dividend treatment" },
  { key: "buying", label: "Buying mechanism & hours" },
  { key: "redemption", label: "Redemption right" },
  { key: "transferability", label: "Transferability & KYC" },
  { key: "defi", label: "DeFi composability" },
  { key: "eligibility", label: "Eligibility / jurisdiction" },
  { key: "chains", label: "Chains" },
] as const;

export type DimensionKey = (typeof DIMENSIONS)[number]["key"];

export interface Issuer {
  slug: string;
  name: string;
  shortName: string;
  /** One-line positioning. */
  tagline: string;
  /** Longer profile prose for the issuer detail page. */
  summary: string;
  /** Ticker convention, e.g. "AAPLx" for xStocks. */
  tickerStyle: string;
  website: string;
  rights: Record<DimensionKey, RightCell>;
}

export const ISSUERS: Issuer[] = [
  {
    slug: "xstocks-backed",
    name: "xStocks (Backed Finance)",
    shortName: "xStocks",
    tagline: "The DeFi-native incumbent — deepest composability, weakest direct claim.",
    summary:
      "xStocks, issued by Switzerland-based Backed Finance, is the dominant tokenized-equity brand on Solana (~93% of volume since launching June 2025, ~57k+ holders, ~$393M TVL). Tokens are price-tracking instruments wrapped in a bankruptcy-remote SPV with 1:1 collateral in segregated custody. The trade-off is explicit: holders get exposure and full DeFi composability, but no shareholder rights and no easy retail redemption.",
    tickerStyle: "Suffix 'x' (e.g. AAPLx, SPCXx, NVDAx)",
    website: "https://xstocks.fi",
    rights: {
      buying: {
        value: "24/7 secondary (DEX/CEX)",
        verdict: "good",
        note: "Retail buys on the open secondary market 24/7 — DEXs (Raydium, Jupiter, Kamino) or CEXs (Kraken, Bybit) — with no market-hours gate. Primary mint/redeem via the issuer runs 24/5 (US market hours); while it's closed the price can drift from the underlying since arbitrage pauses, but you can still transact any time.",
        source: "https://docs.xstocks.fi/docs",
      },
      legalWrapper: {
        value: "Bankruptcy-remote SPV",
        verdict: "neutral",
        note: "Issued by a Backed SPV. Holders own a tokenized tracker certificate, not the share itself. SPV is bankruptcy-remote with an independent Security Agent overseeing collateral.",
        source: "https://docs.xstocks.fi/docs",
      },
      backing: {
        value: "1:1, Clearstream + InCore Bank",
        verdict: "good",
        note: "Each token is fully 1:1 collateralized asset-by-asset in segregated custody accounts under a three-party Account Control Agreement. Custody at Clearstream Banking and InCore Bank.",
        source: "https://incrypted.com/en/how-xstocks-bridging-gap-between-stock-market-and-defi/",
      },
      voting: {
        value: "None",
        verdict: "bad",
        note: "No shareholder rights, no voting, and no legal claim to the underlying shares or to residual assets if the underlying company is liquidated. You cannot participate in corporate governance.",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
      dividends: {
        value: "USDC airdrop / reinvested",
        verdict: "partial",
        note: "Cash dividends are passed to holders of record as USDC airdrops on Solana (net of withholding), or reflected by reinvestment into the same asset. Not paid as the underlying's native dividend.",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
      redemption: {
        value: "Institutional only ($5k + whitelist)",
        verdict: "bad",
        note: "Retail holders have no direct line to the underlying share. Direct issuer redemption sits with the institutional primary market only — onboarding, wallet whitelisting and a $5,000 minimum. Retail exits by selling the token for cash/USDC.",
        source: "https://incrypted.com/en/how-xstocks-bridging-gap-between-stock-market-and-defi/",
      },
      transferability: {
        value: "Permissionless",
        verdict: "good",
        note: "Tokens are freely transferable on-chain and self-custodiable. KYC happens at the on/off-ramp (exchange), not the token — so they move permissionlessly once held.",
        source: "https://backed.fi/news-updates/xstocks-are-going-live-tokenized-stocks-for-the-defi-era",
      },
      defi: {
        value: "High (Kamino, Raydium, Jupiter)",
        verdict: "good",
        note: "Deepest DeFi integration: Kamino lending collateral, Raydium AMM liquidity hub, Jupiter routing. Can be lent, pooled, or used as collateral — the core composability pitch.",
        source: "https://www.theblock.co/post/362284/solana-based-decentralized-lending-protocol-kamino-integrates-tokenized-xstocks-as-collateral-option",
      },
      eligibility: {
        value: "Non-US retail",
        verdict: "neutral",
        note: "Marketed to non-US retail; US persons are restricted. Available via Kraken, Bybit and Solana DeFi.",
        source: "https://www.prnewswire.com/news-releases/backeds-xstocks-go-live-today-on-bybit-kraken-and-solana-defi-302494374.html",
      },
      chains: {
        value: "Solana, Ethereum, TON, Ink",
        verdict: "neutral",
        note: "Multi-chain issuance; Solana carries the dominant liquidity and DeFi integrations.",
        source: "https://backed.fi/news-updates/xstocks-are-going-live-tokenized-stocks-for-the-defi-era",
      },
    },
  },
  {
    slug: "backpack-securities",
    name: "Backpack Securities",
    shortName: "Backpack",
    tagline: "Broker-dealer model — the strongest redemption right to a real share.",
    summary:
      "Backpack Securities is a regulated US broker-dealer that buys and custodies the actual underlying share, then issues a 1:1 token against it. Its differentiator is redemption: holders can redeem to a real security entitlement and transfer the share into a Schwab or Fidelity account via ACATS — closer to true ownership than the SPV trackers. Its tokenized SpaceX (SPCX) crossed 10,000 holders, nearly double xStocks' SPCXx.",
    tickerStyle: "Plain ticker (e.g. SPCX)",
    website: "https://backpack.exchange",
    rights: {
      buying: {
        value: "24/7 on-chain secondary",
        verdict: "good",
        note: "SPCX trades 24/7 on Solana via Sunrise-routed liquidity — Nasdaq hours don't apply, so you can buy on weekends and after hours. Each token is backed 1:1 by a custodied share.",
        source: "https://solanacompass.com/news/backpack-and-sunrise-launch-spcx-a-tokenized-spacex-stock-on-solana-the-same-day-it-lists-on-nasdaq",
      },
      legalWrapper: {
        value: "US broker-dealer direct",
        verdict: "good",
        note: "Regulated US broker-dealer holding the real share in custody and issuing a token against it — not an offshore SPV tracker. Token represents a security entitlement.",
        source: "https://learn.backpack.exchange/articles/what-are-tokenized-stocks",
      },
      backing: {
        value: "1:1 real share, broker custody",
        verdict: "good",
        note: "Backed 1:1 by a real share purchased and held in custody by Backpack as a regulated US broker-dealer. For SPCX, an actual SpaceX share is held.",
        source: "https://moneycheck.com/spacex-stock-debuts-on-solana-blockchain-as-tokenized-asset-spcx/",
      },
      voting: {
        value: "Generally none",
        verdict: "bad",
        note: "Holders get a security entitlement but typically do not exercise corporate voting/governance directly while held in tokenized form. Strength here is redemption, not governance.",
        source: "https://learn.backpack.exchange/articles/what-are-tokenized-stocks",
      },
      dividends: {
        value: "Passed through (broker)",
        verdict: "partial",
        note: "As a broker-dealer custody model, corporate actions/dividends are handled through the brokerage entitlement rather than as a synthetic on-chain payout.",
        source: "https://learn.backpack.exchange/articles/what-are-tokenized-stocks",
      },
      redemption: {
        value: "ACATS to Schwab/Fidelity",
        verdict: "good",
        note: "Strongest redemption right of the group: redeem 1:1 to a real security entitlement and transfer the share into a Schwab or Fidelity account via ACATS, the standard US brokerage transfer system.",
        source: "https://www.benzinga.com/crypto/cryptocurrency/26/06/53160174/elon-musks-spacex-solana-tokenized-shares-foundation-president",
      },
      transferability: {
        value: "On-chain transferable",
        verdict: "good",
        note: "Tokens trade and transfer on Solana; access/onboarding is KYC-gated at the broker-dealer layer.",
        source: "https://solanacompass.com/news/backpack-and-sunrise-launch-spcx-a-tokenized-spacex-stock-on-solana-the-same-day-it-lists-on-nasdaq",
      },
      defi: {
        value: "Limited / emerging",
        verdict: "partial",
        note: "Less DeFi-integrated than xStocks today; primary venue is the Backpack ecosystem. Composability across third-party Solana DeFi is narrower.",
        source: "https://learn.backpack.exchange/articles/what-are-tokenized-stocks",
      },
      eligibility: {
        value: "Broker-dealer KYC",
        verdict: "neutral",
        note: "Access governed by Backpack Securities' broker-dealer onboarding and jurisdictional rules.",
        source: "https://learn.backpack.exchange/articles/what-are-tokenized-stocks",
      },
      chains: {
        value: "Solana",
        verdict: "neutral",
        note: "Issued on Solana.",
        source: "https://moneycheck.com/spacex-stock-debuts-on-solana-blockchain-as-tokenized-asset-spcx/",
      },
    },
  },
  {
    slug: "ondo-global-markets",
    name: "Ondo Global Markets",
    shortName: "Ondo",
    tagline: "Breadth play — 400+ assets at brokerage prices across multiple chains.",
    summary:
      "Ondo Finance brought 200+ tokenized US stocks and ETFs to Solana in January 2026, making it the largest tokenized-stock issuer on the network by asset count (430+ assets across Solana, Ethereum and BNB Chain). Liquidity is sourced from exchanges including NASDAQ and NYSE, so tokens trade at brokerage prices. The pitch is breadth and price fidelity rather than DeFi composability.",
    tickerStyle: "Ticker (Ondo Global Markets)",
    website: "https://ondo.finance",
    rights: {
      buying: {
        value: "Intent mint/redeem · 24/5 — no weekends",
        verdict: "bad",
        note: "Acquired by intent: you submit a mint request and deposit funds, Alpaca (broker-dealer) buys the underlying share, and the token is minted to your wallet. Mint/redeem runs 24/5 aligned with US market hours — you cannot buy when markets are closed (weekends/holidays). Tokens transfer 24/7, but there is little secondary DEX liquidity to buy from off-hours.",
        source: "https://docs.ondo.finance/ondo-global-markets/overview",
      },
      legalWrapper: {
        value: "Tokenized security (issuer)",
        verdict: "neutral",
        note: "Ondo Global Markets issues tokenized stocks/ETFs backed by underlying equities; structured as a regulated tokenized-securities platform.",
        source: "https://thedefiant.io/converge/defi/ondo-finance-adds-173-tokenized-stocks-etfs-430-assets-three-chains",
      },
      backing: {
        value: "1:1, segregated custody",
        verdict: "good",
        note: "Backed one-for-one by underlying equities held by segregated, secure custodians; liquidity sourced from NASDAQ/NYSE so price tracks brokerage levels.",
        source: "https://finance.yahoo.com/news/ondo-brings-200-tokenized-stocks-171340632.html",
      },
      voting: {
        value: "None",
        verdict: "bad",
        note: "Holders get price exposure, not corporate governance/voting rights over the underlying shares.",
        source: "https://finance.yahoo.com/news/ondo-brings-200-tokenized-stocks-171340632.html",
      },
      dividends: {
        value: "Reflected by issuer",
        verdict: "partial",
        note: "Dividends/corporate actions are handled by the issuer and reflected in the tokenized position rather than paid as the native share dividend.",
        source: "https://thedefiant.io/converge/defi/ondo-finance-adds-173-tokenized-stocks-etfs-430-assets-three-chains",
      },
      redemption: {
        value: "Issuer primary market",
        verdict: "partial",
        note: "Redemption/mint sits with the issuer's primary-market channel; retail typically transacts at brokerage prices via the platform rather than redeeming the physical share directly.",
        source: "https://finance.yahoo.com/news/ondo-brings-200-tokenized-stocks-171340632.html",
      },
      transferability: {
        value: "Platform / KYC",
        verdict: "partial",
        note: "Onboarding and transfer governed by Ondo's compliance layer; less permissionless than xStocks.",
        source: "https://finance.yahoo.com/news/xstocks-vs-ondo-tokenized-asset-132806058.html",
      },
      defi: {
        value: "Limited (breadth-focused)",
        verdict: "partial",
        note: "Strategy emphasizes asset breadth and brokerage-grade pricing over deep third-party DeFi composability.",
        source: "https://bingx.com/en/learn/article/ondo-global-markets-vs-xstocks-which-tokenized-stock-platform-is-better",
      },
      eligibility: {
        value: "Non-US (jurisdictional)",
        verdict: "neutral",
        note: "Availability governed by Ondo's jurisdictional rules; US-person access restricted.",
        source: "https://bingx.com/en/learn/article/ondo-global-markets-vs-xstocks-which-tokenized-stock-platform-is-better",
      },
      chains: {
        value: "Solana, Ethereum, BNB",
        verdict: "neutral",
        note: "430+ assets issued across Solana, Ethereum and BNB Chain.",
        source: "https://thedefiant.io/converge/defi/ondo-finance-adds-173-tokenized-stocks-etfs-430-assets-three-chains",
      },
    },
  },
  {
    slug: "pre-stocks",
    name: "Pre-Stocks",
    shortName: "Pre-Stocks",
    tagline: "Pre-IPO / private-name exposure tokenized on Solana.",
    summary:
      "Pre-Stocks issues tokenized exposure to names including pre-IPO and private companies — its SPACEX token was one of three tokenized SpaceX variants live on Solana around the IPO. Smaller volume than Backpack/xStocks; structure and redemption are the key diligence items for holders.",
    tickerStyle: "Plain name (e.g. SPACEX)",
    website: "https://pre-stocks.com",
    rights: {
      buying: {
        value: "Secondary DEX · 24/7 (thin)",
        verdict: "partial",
        note: "Trades on Solana DEXs around the clock, but liquidity is thin — larger buys move the price meaningfully. No broad retail primary-mint channel.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
      legalWrapper: {
        value: "Issuer-structured",
        verdict: "neutral",
        note: "Tokenized exposure product; holders should confirm the precise wrapper and collateral arrangement per asset.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
      backing: {
        value: "Issuer-backed (verify per asset)",
        verdict: "partial",
        note: "Backing arrangements vary by name (including private/pre-IPO exposure); diligence the collateral and custody for the specific token.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
      voting: {
        value: "None",
        verdict: "bad",
        note: "Exposure product without shareholder governance rights.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
      dividends: {
        value: "N/A (mostly non-dividend names)",
        verdict: "neutral",
        note: "Focus on growth/pre-IPO names that typically pay no dividend; treatment varies.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
      redemption: {
        value: "Verify per asset",
        verdict: "partial",
        note: "Redemption mechanics depend on the specific product; for private names physical redemption is generally not available.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
      transferability: {
        value: "On-chain",
        verdict: "neutral",
        note: "Tokens trade on Solana DEXs.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
      defi: {
        value: "Thin liquidity",
        verdict: "partial",
        note: "Lower trading volume than Backpack/xStocks variants; thinner DEX liquidity.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
      eligibility: {
        value: "Non-US (verify)",
        verdict: "neutral",
        note: "Confirm jurisdictional eligibility before transacting.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
      chains: {
        value: "Solana",
        verdict: "neutral",
        note: "Issued on Solana.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
    },
  },
  {
    slug: "kraken-xstocks",
    name: "Kraken (xStocks)",
    shortName: "Kraken",
    tagline: "Exchange distributor of Backed's xStocks — same rights, CEX wrapper.",
    summary:
      "Kraken distributes Backed's xStocks (it is a reseller/venue, not the issuer). Its lineup went live May 2025 with ~60 tickers (AAPL, NVDA, TSLA, AMZN, MSFT, COIN, MSTR, SPY ETF) trading 24/7. Underlying token rights are Backed's xStocks rights; what Kraken adds is exchange custody, fiat rails and a familiar CEX UX.",
    tickerStyle: "xStocks tickers (suffix 'x')",
    website: "https://www.kraken.com/features/xstocks",
    rights: {
      buying: {
        value: "CEX 24/7 (+ on-chain)",
        verdict: "good",
        note: "Buy/sell on Kraken 24/7, and withdraw on-chain to trade the xStocks token in Solana DeFi. The underlying issuer mint/redeem is 24/5, but the secondary market is always open.",
        source: "https://www.kraken.com/xstocks",
      },
      legalWrapper: {
        value: "Backed SPV (distributed)",
        verdict: "neutral",
        note: "Kraken is a distribution venue; the legal wrapper is Backed's bankruptcy-remote SPV, same as native xStocks.",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
      backing: {
        value: "1:1 (Backed custody)",
        verdict: "good",
        note: "Same 1:1 segregated collateralization as Backed's xStocks.",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
      voting: {
        value: "None",
        verdict: "bad",
        note: "Inherits xStocks: no voting or shareholder rights.",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
      dividends: {
        value: "USDC / reinvested",
        verdict: "partial",
        note: "Inherits xStocks dividend handling (USDC airdrop / reinvestment).",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
      redemption: {
        value: "Institutional (via Backed)",
        verdict: "bad",
        note: "Retail redemption to the underlying not available; same institutional-only primary market as xStocks. Retail exits by selling on Kraken.",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
      transferability: {
        value: "Withdraw to Solana",
        verdict: "good",
        note: "Tokens can be withdrawn on-chain to self-custody (they are permissionless xStocks), then used in Solana DeFi.",
        source: "https://www.fintechweekly.com/magazine/articles/kraken-bybit-xstocks-tokenized-us-stocks-solana-defi",
      },
      defi: {
        value: "High (once withdrawn)",
        verdict: "good",
        note: "Once withdrawn the token is standard xStocks with full DeFi composability.",
        source: "https://www.fintechweekly.com/magazine/articles/kraken-bybit-xstocks-tokenized-us-stocks-solana-defi",
      },
      eligibility: {
        value: "Non-US (Kraken regions)",
        verdict: "neutral",
        note: "Available in supported Kraken jurisdictions; US-restricted.",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
      chains: {
        value: "Solana (+ xStocks chains)",
        verdict: "neutral",
        note: "Withdrawals to Solana; underlying xStocks issued multi-chain.",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
    },
  },
  {
    slug: "robinhood",
    name: "Robinhood",
    shortName: "Robinhood",
    tagline: "EU-listed tokenized stocks — regulated retail brokerage UX.",
    summary:
      "Robinhood offers EU-listed tokenized stocks through its regulated brokerage, targeting European retail with a familiar app experience. It sits at the 'regulated retail' end: strong consumer protections and UX, but a walled-garden product with limited permissionless on-chain composability compared with Solana-native issuers.",
    tickerStyle: "Ticker (EU listing)",
    website: "https://robinhood.com",
    rights: {
      buying: {
        value: "In-app brokerage hours",
        verdict: "bad",
        note: "Bought within the Robinhood app under its brokerage model (extended hours, but not 24/7 permissionless). A closed product with no open on-chain secondary market to buy from.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
      legalWrapper: {
        value: "EU-regulated brokerage",
        verdict: "good",
        note: "Tokenized stocks offered via Robinhood's EU-regulated brokerage entity.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
      backing: {
        value: "Backed by underlying",
        verdict: "good",
        note: "Tokens backed by the underlying equities held via the brokerage.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
      voting: {
        value: "Generally none",
        verdict: "bad",
        note: "Retail tokenized-stock product without direct shareholder governance.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
      dividends: {
        value: "Brokerage pass-through",
        verdict: "partial",
        note: "Dividends handled through the brokerage account.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
      redemption: {
        value: "In-platform",
        verdict: "partial",
        note: "Buy/sell within the Robinhood platform; not a permissionless on-chain redemption model.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
      transferability: {
        value: "Walled-garden / KYC",
        verdict: "bad",
        note: "Limited or no self-custody withdrawal to open DeFi; KYC'd within the app.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
      defi: {
        value: "None (closed)",
        verdict: "bad",
        note: "No third-party Solana DeFi composability — a closed retail product.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
      eligibility: {
        value: "EU retail",
        verdict: "neutral",
        note: "Targeted at EU retail customers.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
      chains: {
        value: "Arbitrum (own L2 planned)",
        verdict: "neutral",
        note: "Issued on Arbitrum with a proprietary L2 roadmap; not Solana-native.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
    },
  },
];

export function getIssuer(slug: string): Issuer | undefined {
  return ISSUERS.find((i) => i.slug === slug);
}

export const VERDICT_META: Record<
  Verdict,
  { label: string; short: string; color: string; textClass: string; filled: boolean }
> = {
  good: { label: "Holder-favourable", short: "Favourable", color: "#047857", textClass: "text-pos", filled: true },
  partial: { label: "Partial / conditional", short: "Partial", color: "#b45309", textClass: "text-caution", filled: true },
  bad: { label: "Limited / absent", short: "Limited", color: "#b91c1c", textClass: "text-neg", filled: true },
  neutral: { label: "Informational", short: "Info", color: "#64748b", textClass: "text-neutral", filled: false },
};
