import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VerdictMark from "@/components/VerdictMark";
import { DIMENSIONS, ISSUERS, getIssuer, type DimensionKey } from "@/data/issuers";

export function generateStaticParams() {
  return ISSUERS.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const issuer = getIssuer(params.slug);
  return { title: issuer ? `${issuer.name} — Holder Rights` : "Issuer not found" };
}

export default function IssuerDetailPage({ params }: { params: { slug: string } }) {
  const issuer = getIssuer(params.slug);
  if (!issuer) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/issuers" className="text-sm text-brand hover:underline">
        ← All issuers
      </Link>

      <div className="mt-4 pb-6 border-b border-line">
        <h1 className="font-serif text-3xl font-semibold text-navy">{issuer.name}</h1>
        <p className="text-slate-700 mt-1.5">{issuer.tagline}</p>
        <p className="text-slate-600 leading-relaxed mt-4">{issuer.summary}</p>
        <div className="flex flex-wrap gap-x-8 gap-y-1 mt-5 text-sm text-neutral">
          <span>
            <span className="eyebrow">Ticker style</span>{" "}
            <span className="text-slate-700">{issuer.tickerStyle}</span>
          </span>
          <a href={issuer.website} target="_blank" rel="noreferrer" className="text-brand hover:underline">
            {issuer.website.replace(/^https?:\/\//, "")} ↗
          </a>
        </div>
      </div>

      <h2 className="eyebrow mt-8 mb-3">Holder rights, dimension by dimension</h2>
      <div className="border border-line divide-y divide-line bg-paper">
        {DIMENSIONS.map((dim) => {
          const cell = issuer.rights[dim.key as DimensionKey];
          return (
            <div key={dim.key} className="p-4 grid sm:grid-cols-[210px_1fr] gap-x-5 gap-y-1.5">
              <div className="text-sm font-medium text-neutral">{dim.label}</div>
              <div>
                <div className="flex items-center gap-2">
                  <VerdictMark verdict={cell.verdict} />
                  <span className="text-navy font-medium">{cell.value}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{cell.note}</p>
                <a
                  href={cell.source}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand hover:underline mt-1.5 inline-block font-medium"
                >
                  Source ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
