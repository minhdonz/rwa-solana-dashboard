/**
 * Curated issuer rights dataset (the hero of this dashboard).
 *
 * Each issuer is profiled across the rights dimensions that differ for a holder.
 * Every cell carries a holder-facing verdict and a source link.
 *
 * Hand-curated from issuer docs and reporting. Issuers change terms; see each cell's
 * `source` and RIGHTS_LAST_REVIEWED. Not investment, legal, or tax advice.
 */

export const RIGHTS_LAST_REVIEWED = "2026-06-19";

export type Verdict = "good" | "bad" | "partial" | "neutral";

export interface RightCell {
  value: string;
  verdict: Verdict;
  note: string;
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
  tagline: string;
  summary: string;
  tickerStyle: string;
  website: string;
  rights: Record<DimensionKey, RightCell>;
}

export const ISSUERS: Issuer[] = [
  {
    slug: "xstocks-backed",
    name: "xStocks (Backed Finance)",
    shortName: "xStocks",
    tagline: "DeFi-native incumbent. Deepest composability, weakest direct claim.",
    summary:
      "Issued by Switzerland-based Backed Finance, xStocks is the dominant tokenized-equity brand on Solana (about 93% of volume, 57k holders, $393M TVL). Tokens are price trackers wrapped in a bankruptcy-remote SPV, 1:1 collateralized in segregated custody. Holders get exposure and full DeFi composability, but no shareholder rights and no easy retail redemption.",
    tickerStyle: "Suffix 'x' (AAPLx, SPCXx, NVDAx)",
    website: "https://xstocks.fi",
    rights: {
      buying: {
        value: "24/7 secondary (DEX/CEX)",
        verdict: "good",
        note: "Buy 24/7 on DEXs (Raydium, Jupiter, Kamino) or CEXs (Kraken, Bybit). Primary mint and redeem runs 24/5. When it is closed the price can drift from the underlying, but you can still trade.",
        source: "https://docs.xstocks.fi/docs",
      },
      legalWrapper: {
        value: "Bankruptcy-remote SPV",
        verdict: "neutral",
        note: "Issued by a Backed SPV. Holders own a tokenized tracker certificate, not the share. The SPV is bankruptcy-remote with an independent Security Agent overseeing collateral.",
        source: "https://docs.xstocks.fi/docs",
      },
      backing: {
        value: "1:1, Clearstream + InCore Bank",
        verdict: "good",
        note: "Fully 1:1 collateralized asset by asset in segregated custody accounts under a three-party Account Control Agreement. Custody at Clearstream Banking and InCore Bank.",
        source: "https://incrypted.com/en/how-xstocks-bridging-gap-between-stock-market-and-defi/",
      },
      voting: {
        value: "None",
        verdict: "bad",
        note: "No voting rights and no legal claim to the underlying shares or to residual assets if the company is liquidated.",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
      dividends: {
        value: "USDC airdrop / reinvested",
        verdict: "partial",
        note: "Cash dividends are paid to holders of record as USDC airdrops on Solana (net of withholding) or reinvested into the same asset. Not the underlying's native dividend.",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
      redemption: {
        value: "Institutional only ($5k + whitelist)",
        verdict: "bad",
        note: "Retail holders have no direct line to the underlying share. Issuer redemption sits with the institutional primary market only: onboarding, wallet whitelisting, and a $5,000 minimum. Retail exits by selling the token.",
        source: "https://incrypted.com/en/how-xstocks-bridging-gap-between-stock-market-and-defi/",
      },
      transferability: {
        value: "Permissionless",
        verdict: "good",
        note: "Freely transferable on-chain and self-custodiable. KYC happens at the on/off-ramp, not on the token.",
        source: "https://backed.fi/news-updates/xstocks-are-going-live-tokenized-stocks-for-the-defi-era",
      },
      defi: {
        value: "High (Kamino, Raydium, Jupiter)",
        verdict: "good",
        note: "Deepest DeFi integration: Kamino lending collateral, Raydium liquidity, Jupiter routing. Can be lent, pooled, or used as collateral.",
        source: "https://www.theblock.co/post/362284/solana-based-decentralized-lending-protocol-kamino-integrates-tokenized-xstocks-as-collateral-option",
      },
      eligibility: {
        value: "Non-US retail",
        verdict: "neutral",
        note: "Marketed to non-US retail; US persons restricted. Available via Kraken, Bybit, and Solana DeFi.",
        source: "https://www.prnewswire.com/news-releases/backeds-xstocks-go-live-today-on-bybit-kraken-and-solana-defi-302494374.html",
      },
      chains: {
        value: "Solana, Ethereum, TON, Ink",
        verdict: "neutral",
        note: "Multi-chain. Solana carries the dominant liquidity and DeFi integrations.",
        source: "https://backed.fi/news-updates/xstocks-are-going-live-tokenized-stocks-for-the-defi-era",
      },
    },
  },
  {
    slug: "backpack-securities",
    name: "Backpack Securities",
    shortName: "Backpack",
    tagline: "Broker-dealer model. Strongest redemption right to a real share.",
    summary:
      "Backpack Securities is a regulated US broker-dealer that buys and custodies the real share, then issues a 1:1 token against it. Its differentiator is redemption: holders can redeem to a real security entitlement and transfer the share into a Schwab or Fidelity account via ACATS. Its tokenized SpaceX (SPCX) crossed 10,000 holders, nearly double xStocks' SPCXx.",
    tickerStyle: "Plain ticker (SPCX)",
    website: "https://backpack.exchange",
    rights: {
      buying: {
        value: "24/7 on-chain secondary",
        verdict: "good",
        note: "SPCX trades 24/7 on Solana via Sunrise-routed liquidity. Nasdaq hours do not apply, so you can buy on weekends and after hours.",
        source: "https://solanacompass.com/news/backpack-and-sunrise-launch-spcx-a-tokenized-spacex-stock-on-solana-the-same-day-it-lists-on-nasdaq",
      },
      legalWrapper: {
        value: "US broker-dealer direct",
        verdict: "good",
        note: "Regulated US broker-dealer holding the real share in custody and issuing a token against it, not an offshore SPV. The token represents a security entitlement.",
        source: "https://learn.backpack.exchange/articles/what-are-tokenized-stocks",
      },
      backing: {
        value: "1:1 real share, broker custody",
        verdict: "good",
        note: "Backed 1:1 by a real share purchased and custodied by Backpack as a regulated US broker-dealer. For SPCX, an actual SpaceX share is held.",
        source: "https://moneycheck.com/spacex-stock-debuts-on-solana-blockchain-as-tokenized-asset-spcx/",
      },
      voting: {
        value: "Generally none",
        verdict: "bad",
        note: "Holders get a security entitlement but typically do not vote while the share is held in tokenized form. The strength here is redemption, not governance.",
        source: "https://learn.backpack.exchange/articles/what-are-tokenized-stocks",
      },
      dividends: {
        value: "Passed through (broker)",
        verdict: "partial",
        note: "Dividends and corporate actions are handled through the brokerage entitlement rather than as a synthetic on-chain payout.",
        source: "https://learn.backpack.exchange/articles/what-are-tokenized-stocks",
      },
      redemption: {
        value: "ACATS to Schwab/Fidelity",
        verdict: "good",
        note: "Redeem 1:1 to a real security entitlement and transfer the share into a Schwab or Fidelity account via ACATS, the standard US brokerage transfer system. The strongest redemption right of the group.",
        source: "https://www.benzinga.com/crypto/cryptocurrency/26/06/53160174/elon-musks-spacex-solana-tokenized-shares-foundation-president",
      },
      transferability: {
        value: "On-chain transferable",
        verdict: "good",
        note: "Tokens trade and transfer on Solana. Onboarding is KYC-gated at the broker-dealer layer.",
        source: "https://solanacompass.com/news/backpack-and-sunrise-launch-spcx-a-tokenized-spacex-stock-on-solana-the-same-day-it-lists-on-nasdaq",
      },
      defi: {
        value: "Limited / emerging",
        verdict: "partial",
        note: "Less DeFi-integrated than xStocks. The primary venue is the Backpack ecosystem; third-party composability is narrower.",
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
    tagline: "Breadth play. 400+ assets at brokerage prices across chains.",
    summary:
      "Ondo Finance brought 200+ tokenized US stocks and ETFs to Solana in January 2026, the largest issuer on the network by asset count (430+ across Solana, Ethereum, and BNB Chain). Liquidity is sourced from NASDAQ and NYSE, so tokens trade at brokerage prices. The pitch is breadth and price fidelity rather than DeFi composability.",
    tickerStyle: "Suffix 'on' (NVDAon, AAPLon)",
    website: "https://ondo.finance",
    rights: {
      buying: {
        value: "Intent mint/redeem, 24/5",
        verdict: "bad",
        note: "Acquired by intent: you submit a mint request and deposit funds, Alpaca (broker-dealer) buys the share, and the token is minted. Mint and redeem runs 24/5 on US market hours, so you cannot buy on weekends or holidays. Tokens transfer 24/7, but there is little secondary liquidity to buy from off-hours.",
        source: "https://docs.ondo.finance/ondo-global-markets/overview",
      },
      legalWrapper: {
        value: "Tokenized security (issuer)",
        verdict: "neutral",
        note: "Ondo Global Markets issues tokenized stocks and ETFs backed by underlying equities, structured as a regulated tokenized-securities platform.",
        source: "https://thedefiant.io/converge/defi/ondo-finance-adds-173-tokenized-stocks-etfs-430-assets-three-chains",
      },
      backing: {
        value: "1:1, segregated custody",
        verdict: "good",
        note: "Backed one-for-one by underlying equities in segregated custody. Liquidity sourced from NASDAQ and NYSE, so price tracks brokerage levels.",
        source: "https://finance.yahoo.com/news/ondo-brings-200-tokenized-stocks-171340632.html",
      },
      voting: {
        value: "None",
        verdict: "bad",
        note: "Price exposure only, no voting rights over the underlying shares.",
        source: "https://finance.yahoo.com/news/ondo-brings-200-tokenized-stocks-171340632.html",
      },
      dividends: {
        value: "Reflected by issuer",
        verdict: "partial",
        note: "Dividends and corporate actions are handled by the issuer and reflected in the position, not paid as the native dividend.",
        source: "https://thedefiant.io/converge/defi/ondo-finance-adds-173-tokenized-stocks-etfs-430-assets-three-chains",
      },
      redemption: {
        value: "Issuer primary market",
        verdict: "partial",
        note: "Mint and redeem sits with the issuer's primary-market channel. Retail typically transacts at brokerage prices via the platform rather than redeeming the physical share.",
        source: "https://finance.yahoo.com/news/ondo-brings-200-tokenized-stocks-171340632.html",
      },
      transferability: {
        value: "Platform / KYC",
        verdict: "partial",
        note: "Onboarding and transfer governed by Ondo's compliance layer. Less permissionless than xStocks.",
        source: "https://finance.yahoo.com/news/xstocks-vs-ondo-tokenized-asset-132806058.html",
      },
      defi: {
        value: "Limited (breadth-focused)",
        verdict: "partial",
        note: "Emphasizes asset breadth and brokerage-grade pricing over third-party DeFi composability.",
        source: "https://bingx.com/en/learn/article/ondo-global-markets-vs-xstocks-which-tokenized-stock-platform-is-better",
      },
      eligibility: {
        value: "Non-US (jurisdictional)",
        verdict: "neutral",
        note: "Availability governed by Ondo's jurisdictional rules. US-person access restricted.",
        source: "https://bingx.com/en/learn/article/ondo-global-markets-vs-xstocks-which-tokenized-stock-platform-is-better",
      },
      chains: {
        value: "Solana, Ethereum, BNB",
        verdict: "neutral",
        note: "430+ assets across Solana, Ethereum, and BNB Chain.",
        source: "https://thedefiant.io/converge/defi/ondo-finance-adds-173-tokenized-stocks-etfs-430-assets-three-chains",
      },
    },
  },
  {
    slug: "pre-stocks",
    name: "Pre-Stocks",
    shortName: "Pre-Stocks",
    tagline: "Pre-IPO and private-name exposure tokenized on Solana.",
    summary:
      "Pre-Stocks issues tokenized exposure to pre-IPO and private companies. Its SPACEX token was one of three tokenized SpaceX variants live on Solana around the IPO. Volume is smaller than Backpack and xStocks; structure and redemption are the key diligence items.",
    tickerStyle: "Plain name (SPACEX)",
    website: "https://pre-stocks.com",
    rights: {
      buying: {
        value: "Secondary DEX, 24/7 (thin)",
        verdict: "partial",
        note: "Trades on Solana DEXs around the clock, but liquidity is thin, so larger buys move the price. No broad retail primary-mint channel.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
      legalWrapper: {
        value: "Issuer-structured",
        verdict: "neutral",
        note: "Tokenized exposure product. Confirm the wrapper and collateral arrangement per asset.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
      backing: {
        value: "Issuer-backed (verify per asset)",
        verdict: "partial",
        note: "Backing varies by name, including private and pre-IPO exposure. Diligence the collateral and custody for the specific token.",
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
        note: "Focused on growth and pre-IPO names that typically pay no dividend. Treatment varies.",
        source: "https://coingape.com/tokenized-spacex-stocks-top-solana-dex-trading-after-record-ipo/",
      },
      redemption: {
        value: "Verify per asset",
        verdict: "partial",
        note: "Redemption depends on the specific product. For private names, physical redemption is generally not available.",
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
        note: "Lower volume than Backpack and xStocks variants, with thinner DEX liquidity.",
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
    tagline: "Exchange distributor of Backed's xStocks. Same rights, CEX wrapper.",
    summary:
      "Kraken distributes Backed's xStocks as a reseller, not the issuer. Its lineup went live May 2025 with about 60 tickers (AAPL, NVDA, TSLA, AMZN, MSFT, COIN, MSTR, SPY) trading 24/7. Token rights are Backed's xStocks rights; Kraken adds exchange custody, fiat rails, and a familiar CEX experience.",
    tickerStyle: "xStocks tickers (suffix 'x')",
    website: "https://www.kraken.com/features/xstocks",
    rights: {
      buying: {
        value: "CEX 24/7 (+ on-chain)",
        verdict: "good",
        note: "Buy and sell on Kraken 24/7, and withdraw on-chain to use the token in Solana DeFi. Underlying mint and redeem is 24/5, but the secondary market is always open.",
        source: "https://www.kraken.com/xstocks",
      },
      legalWrapper: {
        value: "Backed SPV (distributed)",
        verdict: "neutral",
        note: "Kraken is a distribution venue. The legal wrapper is Backed's bankruptcy-remote SPV, same as native xStocks.",
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
        note: "Inherits xStocks dividend handling (USDC airdrop or reinvestment).",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
      redemption: {
        value: "Institutional (via Backed)",
        verdict: "bad",
        note: "No retail redemption to the underlying. Same institutional-only primary market as xStocks. Retail exits by selling on Kraken.",
        source: "https://support.kraken.com/articles/xstocks-faq",
      },
      transferability: {
        value: "Withdraw to Solana",
        verdict: "good",
        note: "Tokens can be withdrawn on-chain to self-custody and used in Solana DeFi.",
        source: "https://www.fintechweekly.com/magazine/articles/kraken-bybit-xstocks-tokenized-us-stocks-solana-defi",
      },
      defi: {
        value: "High (once withdrawn)",
        verdict: "good",
        note: "Once withdrawn, the token is standard xStocks with full DeFi composability.",
        source: "https://www.fintechweekly.com/magazine/articles/kraken-bybit-xstocks-tokenized-us-stocks-solana-defi",
      },
      eligibility: {
        value: "Non-US (Kraken regions)",
        verdict: "neutral",
        note: "Available in supported Kraken jurisdictions. US-restricted.",
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
    tagline: "EU-listed tokenized stocks in a regulated retail app.",
    summary:
      "Robinhood offers EU-listed tokenized stocks through its regulated brokerage, targeting European retail with a familiar app. Strong consumer protections and UX, but a closed product with little permissionless on-chain composability compared with Solana-native issuers.",
    tickerStyle: "Ticker (EU listing)",
    website: "https://robinhood.com",
    rights: {
      buying: {
        value: "In-app brokerage hours",
        verdict: "bad",
        note: "Bought inside the Robinhood app under its brokerage model (extended hours, not 24/7 permissionless). A closed product with no open on-chain secondary market.",
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
        note: "Buy and sell within the Robinhood platform. Not a permissionless on-chain redemption model.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
      transferability: {
        value: "Walled-garden / KYC",
        verdict: "bad",
        note: "Little or no self-custody withdrawal to open DeFi. KYC'd within the app.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
      defi: {
        value: "None (closed)",
        verdict: "bad",
        note: "No third-party Solana DeFi composability. A closed retail product.",
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
        note: "Issued on Arbitrum with a proprietary L2 roadmap. Not Solana-native.",
        source: "https://eco.com/support/en/articles/15083160-robinhood-tokenized-stocks-what-s-live-and-how-it-works",
      },
    },
  },
];

export function getIssuer(slug: string): Issuer | undefined {
  return ISSUERS.find((i) => i.slug === slug);
}

export const VERDICT_META: Record<Verdict, { label: string; color: string }> = {
  good: { label: "Holder-favourable", color: "#047857" },
  partial: { label: "Partial", color: "#b45309" },
  bad: { label: "Limited", color: "#b91c1c" },
  neutral: { label: "Informational", color: "#64748b" },
};
