import type {
  RedditPost,
  RedditListing,
  FetchOptions,
  ListingType,
  TimeFrame,
  SortType,
} from "./types";
import {
  API_BASE_URL,
  USER_AGENT,
  MAX_LIMIT,
  DEFAULT_LIMIT,
  MAX_MULTI_SUBREDDIT_PATH_LENGTH,
} from "./constants";

function mapRawPost(raw: Record<string, unknown>): RedditPost {
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? ""),
    subreddit: String(raw.subreddit ?? ""),
    score: Number(raw.score) || 0,
    numComments: Number(raw.num_comments) || 0,
    url: String(raw.url ?? ""),
    selftext: String(raw.selftext ?? ""),
    createdUtc: Number(raw.created_utc) || 0,
    permalink: String(raw.permalink ?? ""),
    ups: Number(raw.ups) || 0,
    upvoteRatio: Number(raw.upvote_ratio) || 0,
    flairText: raw.link_flair_text ? String(raw.link_flair_text) : null,
    author: String(raw.author ?? "[deleted]"),
    isSelf: Boolean(raw.is_self),
    thumbnail: String(raw.thumbnail ?? ""),
  };
}

export function parseRedditListing(json: unknown): RedditListing {
  const data = (json as { data?: { children?: unknown[]; after?: string; before?: string; dist?: number } })?.data;
  if (!data || !Array.isArray(data.children)) {
    throw new Error("Malformed Reddit response");
  }

  const posts = data.children.map((child) => {
    if (!child || typeof child !== "object" || !("data" in child) || !child.data || typeof child.data !== "object") {
      throw new Error("Malformed Reddit response");
    }

    return mapRawPost(child.data as Record<string, unknown>);
  });

  return {
    posts,
    after: typeof data.after === "string" ? data.after : null,
    before: typeof data.before === "string" ? data.before : null,
    totalCount: Number(data.dist) || 0,
  };
}

// QA-007: Catch timeout/network errors and return stable app-level messages
async function fetchRedditJson(url: string, errorLabel: string): Promise<RedditListing> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`${errorLabel}: Reddit returned ${response.status}`);
    }

    const json: unknown = await response.json();
    return parseRedditListing(json);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`${errorLabel}: Request timed out`);
    }
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(`${errorLabel}: Network error`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchSubredditPosts(
  subreddit: string,
  listing: ListingType,
  timeFrame: TimeFrame,
  limit: number = DEFAULT_LIMIT,
  after?: string
): Promise<RedditListing> {
  const params = new URLSearchParams({
    limit: String(Math.min(limit, MAX_LIMIT)),
    t: timeFrame,
    raw_json: "1",
  });
  if (after) params.set("after", after);

  const url = `${API_BASE_URL}/r/${encodeURIComponent(subreddit)}/${listing}.json?${params}`;
  return fetchRedditJson(url, `Reddit API error for r/${subreddit}`);
}

export async function searchReddit(
  query: string,
  subreddit?: string,
  sort: SortType = "relevance",
  timeFrame: TimeFrame = "week",
  limit: number = DEFAULT_LIMIT,
  after?: string
): Promise<RedditListing> {
  const params = new URLSearchParams({
    q: query,
    sort,
    t: timeFrame,
    limit: String(Math.min(limit, MAX_LIMIT)),
    raw_json: "1",
  });
  if (after) params.set("after", after);

  let url: string;
  if (subreddit) {
    params.set("restrict_sr", "1");
    url = `${API_BASE_URL}/r/${encodeURIComponent(subreddit)}/search.json?${params}`;
  } else {
    url = `${API_BASE_URL}/search.json?${params}`;
  }

  return fetchRedditJson(url, "Reddit search error");
}

export async function fetchMultipleSubreddits(
  options: FetchOptions
): Promise<RedditListing> {
  const { subreddits, listing, timeFrame, limit, searchQuery, after } = options;

  if (searchQuery) {
    // QA-001: Always pass subreddit path to restrict search scope.
    // For multiple subreddits, use Reddit's multi-sub path (r/sub1+sub2/search.json).
    const multiSub = subreddits.join("+");
    return searchReddit(searchQuery, multiSub, "relevance", timeFrame, limit, after);
  }

  // Use Reddit's multi-subreddit endpoint: r/sub1+sub2+sub3/listing.json
  // This returns a single listing with consistent after tokens for pagination
  const multiSub = subreddits.join("+");
  if (multiSub.length > MAX_MULTI_SUBREDDIT_PATH_LENGTH) {
    throw new Error("Combined subreddit path is too large.");
  }

  return fetchSubredditPosts(multiSub, listing, timeFrame, limit, after);
}
