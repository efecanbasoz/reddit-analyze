import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMultipleSubreddits = vi.fn();
let currentHeaders = new Headers();

vi.mock("next/headers", () => ({
  headers: async () => currentHeaders,
}));

vi.mock("@/lib/reddit-api", () => ({
  fetchMultipleSubreddits,
}));

const baseRequest = {
  scope: "global" as const,
  listing: "hot" as const,
  timeFrame: "week" as const,
  limit: 25,
  categories: ["saas"],
  customSubreddits: [] as string[],
};

async function loadAnalyzeReddit() {
  const mod = await import("@/app/actions");
  return mod.analyzeReddit;
}

describe("analyzeReddit", () => {
  beforeEach(() => {
    vi.resetModules();
    fetchMultipleSubreddits.mockReset();
    fetchMultipleSubreddits.mockResolvedValue({
      posts: [],
      after: null,
      before: null,
      totalCount: 0,
    });
    currentHeaders = new Headers();
  });

  it("does not let one caller throttle a different caller", async () => {
    const analyzeReddit = await loadAnalyzeReddit();

    currentHeaders = new Headers({ "x-forwarded-for": "203.0.113.10" });
    const first = await analyzeReddit(baseRequest);

    currentHeaders = new Headers({ "x-forwarded-for": "203.0.113.11" });
    const second = await analyzeReddit(baseRequest);

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
  });

  it("rejects requests with too many custom subreddits", async () => {
    const analyzeReddit = await loadAnalyzeReddit();

    const result = await analyzeReddit({
      ...baseRequest,
      customSubreddits: Array.from({ length: 11 }, (_, index) => `custom_${index}`),
    });

    expect(result).toEqual({
      success: false,
      error: "Too many custom subreddits. Maximum 10 allowed.",
    });
  });

  it("rejects oversized combined subreddit paths before hitting Reddit", async () => {
    const analyzeReddit = await loadAnalyzeReddit();

    const result = await analyzeReddit({
      ...baseRequest,
      categories: [],
      customSubreddits: Array.from({ length: 8 }, (_, index) => `averylongsubreddit_${index}`),
    });

    expect(result).toEqual({
      success: false,
      error: "Combined subreddit path is too large.",
    });
    expect(fetchMultipleSubreddits).not.toHaveBeenCalled();
  });
});
