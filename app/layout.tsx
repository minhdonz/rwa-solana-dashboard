import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700"],
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Tokenized Stocks on Solana: Issuer Rights & DeFi Usage",
  description:
    "An institutional reference comparing how tokenized-stock issuers on Solana treat holder rights, and where the leading tokens are held and used.",
};

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/issuers", label: "Issuer Rights" },
  { href: "/assets", label: "Tokens" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col bg-paper text-navy">
        <header className="border-b border-line bg-paper sticky top-0 z-20">
          <div className="mx-auto max-w-screen-2xl px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-baseline gap-3">
              <span className="font-semibold tracking-label text-[0.95rem] uppercase">RWA · Solana</span>
              <span className="hidden sm:inline text-xs text-neutral border-l border-line pl-3">
                Tokenized Equities Reference
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-slate-600 hover:text-brand transition-colors"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 mx-auto max-w-screen-2xl w-full px-6 py-10">{children}</main>

        <footer className="border-t border-line bg-surface mt-16">
          <div className="mx-auto max-w-screen-2xl px-6 py-8 text-xs text-neutral leading-relaxed space-y-2">
            <p className="text-slate-700">
              Built by{" "}
              <a
                href="https://x.com/0xminhdonz"
                target="_blank"
                rel="noreferrer"
                className="text-brand hover:underline"
              >
                @0xminhdonz
              </a>{" "}
              ·{" "}
              <a
                href="https://github.com/minhdonz/rwa-solana-dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-brand hover:underline"
              >
                GitHub
              </a>
            </p>
            <p className="font-semibold text-slate-700 tracking-label uppercase text-[0.6875rem] pt-2">
              Important disclosures
            </p>
            <p>
              This material is for informational purposes only and does not constitute investment, legal,
              or tax advice, or an offer or solicitation to buy or sell any security or token. Issuer
              rights data is compiled by hand from public issuer documentation and reporting; it may be
              incomplete or out of date. Verify every figure against each issuer&apos;s own terms via the
              cited sources before acting.
            </p>
            <p>
              Tokenized stocks generally convey price exposure only and, for most issuers, no shareholder
              or voting rights. Redemption rights and custody arrangements differ materially by issuer.
              On-chain metrics are point-in-time snapshots and not live data.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
