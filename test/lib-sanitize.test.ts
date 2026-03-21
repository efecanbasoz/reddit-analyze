import { describe, expect, it } from "vitest";
import { sanitizeSearchQuery, sanitizeSubreddit } from "@/lib/sanitize";

describe("sanitizeSubreddit", () => {
  it("normalizes a subreddit name", () => {
    expect(sanitizeSubreddit("  r/nextjs ")).toBe("nextjs");
  });

  it("rejects invalid names", () => {
    expect(sanitizeSubreddit("bad/name")).toBeNull();
  });
});

describe("sanitizeSearchQuery", () => {
  it("removes risky characters and caps length", () => {
    const input = `alert('xss')<script>${"a".repeat(400)}`;
    const sanitized = sanitizeSearchQuery(input);

    expect(sanitized).not.toContain("<");
    expect(sanitized).not.toContain("'");
    expect(sanitized.length).toBe(200);
  });
});
