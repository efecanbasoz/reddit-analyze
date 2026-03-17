const STALE_WINDOW_MS = 60_000;

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
      for (const [entryKey, entryTimestamp] of store.entries()) {
        if (now - entryTimestamp > STALE_WINDOW_MS) {
          store.delete(entryKey);
        }
      }

      return true;
    },
  };
}
