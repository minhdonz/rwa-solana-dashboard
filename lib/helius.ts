/**
 * Thin Helius/Solana-RPC client used ONLY by the refresh script (never at runtime).
 * Reads HELIUS_API_KEY from the environment.
 */

export function heliusUrl(): string {
  // Read lazily (not at module load) so dotenv has a chance to populate it first.
  const key = process.env.HELIUS_API_KEY;
  if (!key) throw new Error("HELIUS_API_KEY is not set (needed only for `npm run refresh`).");
  return `https://mainnet.helius-rpc.com/?api-key=${key}`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Gentle pacing between every RPC call to stay under free-tier rate limits. */
const BASE_DELAY_MS = Number(process.env.HELIUS_DELAY_MS ?? 120);
const MAX_RETRIES = 6;

async function rpc<T>(method: string, params: unknown): Promise<T> {
  let attempt = 0;
  for (;;) {
    await sleep(BASE_DELAY_MS);
    const res = await fetch(heliusUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: "1", method, params }),
    });

    // Rate limited (or transient 5xx) → exponential backoff and retry.
    if (res.status === 429 || res.status >= 500) {
      if (attempt >= MAX_RETRIES) throw new Error(`${method} HTTP ${res.status} after ${attempt} retries`);
      const retryAfter = Number(res.headers.get("retry-after")) * 1000;
      const backoff = retryAfter > 0 ? retryAfter : Math.min(500 * 2 ** attempt, 8000);
      attempt += 1;
      process.stdout.write(`    (rate limited, retry ${attempt}/${MAX_RETRIES} in ${backoff}ms)\r`);
      await sleep(backoff);
      continue;
    }

    if (!res.ok) throw new Error(`${method} HTTP ${res.status}: ${await res.text()}`);
    const json = await res.json();
    if (json.error) {
      // Some rate-limit responses arrive as a JSON-RPC error on a 200.
      if (json.error.code === -32429 && attempt < MAX_RETRIES) {
        const backoff = Math.min(500 * 2 ** attempt, 8000);
        attempt += 1;
        await sleep(backoff);
        continue;
      }
      throw new Error(`${method} RPC error: ${JSON.stringify(json.error)}`);
    }
    return json.result as T;
  }
}

export interface HolderAccount {
  owner: string;
  amount: number; // ui amount (decimals applied)
}

/** Token mint metadata. */
export async function getMintInfo(mint: string): Promise<{ decimals: number; supply: number }> {
  const result = await rpc<{ value: { decimals: number; uiAmount: number } }>("getTokenSupply", [mint]);
  return { decimals: result.value.decimals, supply: result.value.uiAmount };
}

/**
 * All holders of a mint via Helius DAS `getTokenAccounts`, paginated.
 * Aggregates balances by owner (a wallet may hold several token accounts).
 */
export async function getHolders(mint: string, decimals: number): Promise<HolderAccount[]> {
  const byOwner = new Map<string, number>();
  let page = 1;
  const limit = 1000;
  // DAS getTokenAccounts uses cursor/page; Helius supports `page`.
  for (;;) {
    const result = await rpc<{
      token_accounts: Array<{ owner: string; amount: number }>;
    }>("getTokenAccounts", { mint, page, limit, options: { showZeroBalance: false } });
    const accounts = result.token_accounts ?? [];
    for (const a of accounts) {
      const ui = a.amount / 10 ** decimals;
      byOwner.set(a.owner, (byOwner.get(a.owner) ?? 0) + ui);
    }
    if (accounts.length < limit) break;
    page += 1;
  }
  return [...byOwner.entries()].map(([owner, amount]) => ({ owner, amount }));
}

/**
 * For each owner, fetch the program that owns the owner account (System Program for
 * normal wallets, a protocol program for vault PDAs). Batched via getMultipleAccounts.
 */
export async function getOwnerPrograms(owners: string[]): Promise<Map<string, string | null>> {
  const out = new Map<string, string | null>();
  const batchSize = 100;
  for (let i = 0; i < owners.length; i += batchSize) {
    const batch = owners.slice(i, i + batchSize);
    const result = await rpc<{ value: Array<{ owner: string } | null> }>("getMultipleAccounts", [
      batch,
      { encoding: "base64", dataSlice: { offset: 0, length: 0 } },
    ]);
    result.value.forEach((acc, idx) => {
      out.set(batch[idx], acc ? acc.owner : null);
    });
  }
  return out;
}
