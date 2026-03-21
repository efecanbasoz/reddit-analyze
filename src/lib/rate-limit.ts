const STALE_WINDOW_MS = 60_000;
// SEC-002: Cap store size to prevent unbounded memory growth
const MAX_STORE_ENTRIES = 10_000;

export function buildRateLimitKey(headers: Headers, scope: string): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headers.get("x-real-ip")?.trim();
  const userAgent = headers.get("user-agent")?.trim();
  const language = headers.get("accept-language")?.trim();
  const fingerprint = [forwarded, realIp, userAgent, language].filter(Boolean).join("|") || "anonymous";

  return `${scope}:${fingerprint}`;
}

export function createRateLimiter(minIntervalMs: number, store = new Map<string, number>()) {
  return {
    allow(key: string, now = Date.now()): boolean {
      const lastSeen = store.get(key);
      if (lastSeen !== undefined && now - lastSeen < minIntervalMs) {
        return false;
      }

      store.set(key, now);

      // SEC-002: Prune stale entries and enforce max size
      if (store.size > MAX_STORE_ENTRIES) {
        for (const [entryKey, entryTimestamp] of store.entries()) {
          if (now - entryTimestamp > STALE_WINDOW_MS) {
            store.delete(entryKey);
          }
        }
        // If still over limit after pruning, drop oldest entries
        if (store.size > MAX_STORE_ENTRIES) {
          const excess = store.size - MAX_STORE_ENTRIES;
          let dropped = 0;
          for (const entryKey of store.keys()) {
            if (dropped >= excess) break;
            store.delete(entryKey);
            dropped++;
          }
        }
      }

      return true;
    },
  };
}
