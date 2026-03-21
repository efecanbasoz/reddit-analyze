import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchSubredditPosts } from "@/lib/reddit-api";

describe("fetchSubredditPosts", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns parsed Reddit listings for valid payloads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            children: [
              {
                data: {
                  id: "abc",
                  title: "Hello",
                  subreddit: "nextjs",
                  score: 10,
                  num_comments: 5,
                  url: "https://example.com",
                  selftext: "",
                  created_utc: 1,
                  permalink: "/r/nextjs/abc",
                  ups: 10,
                  upvote_ratio: 0.9,
                  author: "tester",
                  is_self: true,
                  thumbnail: "self",
                },
              },
            ],
            after: "t3_next",
            before: null,
            dist: 1,
          },
        }),
      }),
    );

    const result = await fetchSubredditPosts("nextjs", "hot", "week");

    expect(result.posts).toHaveLength(1);
    expect(result.after).toBe("t3_next");
  });

  it("fails closed when Reddit returns a malformed listing payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { children: [{ nope: true }] } }),
      }),
    );

    await expect(fetchSubredditPosts("nextjs", "hot", "week")).rejects.toThrow(
      "Malformed Reddit response",
    );
  });
});
