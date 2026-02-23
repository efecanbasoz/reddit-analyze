import type {
  RedditPost,
  RedditListing,
  FetchOptions,
  ListingType,
  TimeFrame,
  SortType,
} from "./types";
import { API_BASE_URL, USER_AGENT, MAX_LIMIT, DEFAULT_LIMIT } from "./constants";

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

function parseRedditListing(json: unknown): RedditListing {
  const data = (json as { data?: { children?: unknown[]; after?: string; before?: string; dist?: number } })?.data;
  if (!data || !Array.isArray(data.children)) {
    return { posts: [], after: null, before: null, totalCount: 0 };
  }
  return {
    posts: data.children
      .filter((child): child is { data: Record<string, unknown> } =>
        child != null && typeof child === "object" && "data" in child
      )
      .map((child) => mapRawPost(child.data)),
    after: typeof data.after === "string" ? data.after : null,
    before: typeof data.before === "string" ? data.before : null,
    totalCount: Number(data.dist) || 0,
  };
}

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
      throw new Error(`${errorLabel}: ${response.status}`);
    }

    const json: unknown = await response.json();
    return parseRedditListing(json);
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
    const subredditParam = subreddits.length === 1 ? subreddits[0] : undefined;
    return searchReddit(searchQuery, subredditParam, "relevance", timeFrame, limit, after);
  }

  // Use Reddit's multi-subreddit endpoint: r/sub1+sub2+sub3/listing.json
  // This returns a single listing with consistent after tokens for pagination
  const multiSub = subreddits.join("+");
  return fetchSubredditPosts(multiSub, listing, timeFrame, limit, after);
}
