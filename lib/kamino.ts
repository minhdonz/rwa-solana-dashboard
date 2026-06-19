/**
 * Kamino lending data via the public Kamino API (keyless).
 * Fetches every market's reserve metrics and returns a map keyed by the reserve's
 * underlying mint, so we can look up lend/borrow demand for each tokenized stock.
 *
 * Docs: https://api.kamino.finance/
 */

const KAMINO_API = "https://api.kamino.finance";

interface KaminoMarket {
  lendingMarket: string;
  name: string;
}

interface ReserveMetric {
  liquidityToken: string;
  liquidityTokenMint: string;
  maxLtv: string;
  borrowApy: string;
  supplyApy: string;
  totalSupplyUsd: string;
  totalBorrowUsd: string;
}

export interface KaminoReserve {
  market: string; // human market name
  token: string; // reserve liquidity token symbol
  supplyUsd: number;
  borrowUsd: number;
  utilization: number; // 0..100
  supplyApy: number; // %
  borrowApy: number; // %
  maxLtv: number; // 0..1
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Kamino ${url} HTTP ${res.status}`);
  return (await res.json()) as T;
}

/** Build mint -> list of Kamino reserves (a token can appear in several markets). */
export async function getKaminoReservesByMint(): Promise<Map<string, KaminoReserve[]>> {
  const markets = await getJson<KaminoMarket[]>(`${KAMINO_API}/v2/kamino-market`);
  const byMint = new Map<string, KaminoReserve[]>();

  for (const m of markets) {
    let reserves: ReserveMetric[];
    try {
      reserves = await getJson<ReserveMetric[]>(
        `${KAMINO_API}/kamino-market/${m.lendingMarket}/reserves/metrics`
      );
    } catch {
      continue; // skip a market that fails rather than abort the whole refresh
    }
    for (const r of reserves) {
      const supplyUsd = Number(r.totalSupplyUsd) || 0;
      const borrowUsd = Number(r.totalBorrowUsd) || 0;
      // Ignore dust reserves (avoids listing a $1 placeholder reserve as "coverage").
      if (supplyUsd < 1000) continue;
      const entry: KaminoReserve = {
        market: m.name,
        token: r.liquidityToken,
        supplyUsd,
        borrowUsd,
        utilization: supplyUsd > 0 ? (borrowUsd / supplyUsd) * 100 : 0,
        supplyApy: (Number(r.supplyApy) || 0) * 100,
        borrowApy: (Number(r.borrowApy) || 0) * 100,
        maxLtv: Number(r.maxLtv) || 0,
      };
      const list = byMint.get(r.liquidityTokenMint) ?? [];
      list.push(entry);
      byMint.set(r.liquidityTokenMint, list);
    }
  }
  return byMint;
}
