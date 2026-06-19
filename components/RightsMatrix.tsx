"use client";

import { useState } from "react";
import Link from "next/link";
import VerdictMark from "@/components/VerdictMark";
import { DIMENSIONS, ISSUERS, VERDICT_META, type DimensionKey, type Verdict } from "@/data/issuers";

/**
 * The HERO comparison: issuers as columns, rights dimensions as rows.
 * Click any cell to expand the holder-facing note + source link.
 */
export default function RightsMatrix() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <Legend />
      <div className="scroll-thin overflow-x-auto border border-line mt-4 bg-paper">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-surface border-b border-line-strong">
              <th className="sticky left-0 z-10 bg-surface text-left eyebrow px-4 py-3 min-w-[190px] border-r border-line">
                Right / dimension
              </th>
              {ISSUERS.map((issuer) => (
                <th
                  key={issuer.slug}
                  className="text-left px-4 py-3 min-w-[200px] border-l border-line align-top"
                >
                  <Link href={`/issuers/${issuer.slug}`} className="group">
                    <div className="font-semibold text-navy group-hover:text-brand">
                      {issuer.shortName}
                    </div>
                    <div className="text-xs text-neutral font-normal mt-0.5 leading-snug">
                      {issuer.tagline}
                    </div>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIMENSIONS.map((dim) => (
              <tr key={dim.key} className="border-b border-line last:border-0 hover:bg-surface/60">
                <th className="sticky left-0 z-10 bg-paper text-left font-medium text-slate-700 px-4 py-3 align-top border-r border-line">
                  {dim.label}
                </th>
                {ISSUERS.map((issuer) => {
                  const cell = issuer.rights[dim.key as DimensionKey];
                  const cellId = `${issuer.slug}:${dim.key}`;
                  const isOpen = open === cellId;
                  return (
                    <td
                      key={issuer.slug}
                      className="px-4 py-3 align-top border-l border-line cursor-pointer hover:bg-surface2"
                      onClick={() => setOpen(isOpen ? null : cellId)}
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-1">
                          <VerdictMark verdict={cell.verdict} />
                        </span>
                        <span className="text-navy leading-snug">{cell.value}</span>
                      </div>
                      {isOpen && (
                        <div className="mt-2 text-xs text-slate-600 leading-relaxed border-t border-line pt-2">
                          {cell.note}
                          <a
                            href={cell.source}
                            target="_blank"
                            rel="noreferrer"
                            className="block mt-1.5 text-brand hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Source ↗
                          </a>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-neutral mt-3">
        Select any cell for the detailed rationale and source. Assessments are made from a{" "}
        <span className="text-slate-700">holder&apos;s</span> perspective.
      </p>
    </div>
  );
}

function Legend() {
  const order: Verdict[] = ["good", "partial", "bad", "neutral"];
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
      {order.map((k) => (
        <span key={k} className="inline-flex items-center gap-2">
          <VerdictMark verdict={k} />
          {VERDICT_META[k].label}
        </span>
      ))}
    </div>
  );
}
