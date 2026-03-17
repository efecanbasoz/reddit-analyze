"use server";

import { headers } from "next/headers";
import { fetchMultipleSubreddits } from "@/lib/reddit-api";
import {
  MAX_CUSTOM_SUBREDDITS,
  MAX_MULTI_SUBREDDIT_PATH_LENGTH,
  MAX_TOTAL_SUBREDDITS,
  SUBREDDIT_PRESETS,
  SCOPE_SUBREDDIT_MAP,
} from "@/lib/constants";
import { buildRateLimitKey, createRateLimiter } from "@/lib/rate-limit";
import { sanitizeSubreddit, sanitizeSearchQuery } from "@/lib/sanitize";
import type { FetchOptions, ListingType, TimeFrame, Scope, RedditListing } from "@/lib/types";

const VALID_LISTINGS: ListingType[] = ["hot", "top", "new", "rising"];
const VALID_TIMEFRAMES: TimeFrame[] = ["hour", "day", "week", "month", "year", "all"];
const VALID_SCOPES: Scope[] = ["global", "us"];
const requestLimiter = createRateLimiter(3_000);

interface AnalyzeRequest {
  scope: Scope;
  listing: ListingType;
  timeFrame: TimeFrame;
  limit: number;
  categories: string[];
  customSubreddits: string[];
  searchQuery?: string;
  after?: string;
}

export async function analyzeReddit(
  request: AnalyzeRequest
): Promise<{ success: true; data: RedditListing } | { success: false; error: string }> {
  try {
    const requestHeaders = await headers();
    const rateLimitKey = buildRateLimitKey(requestHeaders, `analyze:${request.scope}:${request.listing}`);
    if (!requestLimiter.allow(rateLimitKey)) {
      return { success: false, error: "Too many requests. Please wait a moment and try again." };
    }

    // Validate enum values
    if (!VALID_LISTINGS.includes(request.listing)) {
      return { success: false, error: "Invalid listing type." };
    }
    if (!VALID_TIMEFRAMES.includes(request.timeFrame)) {
      return { success: false, error: "Invalid timeframe." };
    }
    if (!VALID_SCOPES.includes(request.scope)) {
      return { success: false, error: "Invalid scope." };
    }
    // Clamp limit
    const limit = Math.max(1, Math.min(100, request.limit));

    // Build subreddit list
    const subreddits = new Set<string>();

    for (const category of request.categories) {
      const presetKey = category as keyof typeof SUBREDDIT_PRESETS;
      if (SUBREDDIT_PRESETS[presetKey]) {
        for (const sr of SUBREDDIT_PRESETS[presetKey]) {
          subreddits.add(sr);
        }
      }
    }

    for (const sr of SCOPE_SUBREDDIT_MAP[request.scope]) {
      subreddits.add(sr);
    }

    for (const sr of request.customSubreddits) {
      const cleaned = sanitizeSubreddit(sr);
      if (cleaned) subreddits.add(cleaned);
    }

    if (subreddits.size === 0) {
      return { success: false, error: "Select at least one subreddit." };
    }

    if (request.customSubreddits.length > MAX_CUSTOM_SUBREDDITS) {
      return { success: false, error: `Too many custom subreddits. Maximum ${MAX_CUSTOM_SUBREDDITS} allowed.` };
    }

    const searchQuery = request.searchQuery
      ? sanitizeSearchQuery(request.searchQuery)
      : undefined;

    if (subreddits.size > MAX_TOTAL_SUBREDDITS) {
      return { success: false, error: `Too many subreddits selected. Maximum ${MAX_TOTAL_SUBREDDITS} allowed.` };
    }

    if (!searchQuery && Array.from(subreddits).join("+").length > MAX_MULTI_SUBREDDIT_PATH_LENGTH) {
      return { success: false, error: "Combined subreddit path is too large." };
    }

    // Sanitize after token (alphanumeric + underscore, max 50 chars)
    const after = request.after && /^[a-zA-Z0-9_]{1,50}$/.test(request.after)
      ? request.after
      : undefined;

    const options: FetchOptions = {
      subreddits: Array.from(subreddits),
      listing: request.listing,
      timeFrame: request.timeFrame,
      limit,
      scope: request.scope,
      searchQuery,
      after,
    };

    const data = await fetchMultipleSubreddits(options);
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
