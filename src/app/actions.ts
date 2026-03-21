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
    // SEC-001: Use only trusted IP for rate limiting, not mutable headers
    const clientIp = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim()
      || requestHeaders.get("x-real-ip")?.trim()
      || "anonymous";
    const rateLimitKey = `analyze:${clientIp}`;
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

    // SEC-003: Validate array types and sizes before processing
    if (!Array.isArray(request.categories) || !Array.isArray(request.customSubreddits)) {
      return { success: false, error: "Invalid request format." };
    }
    if (request.categories.length > 20) {
      return { success: false, error: "Too many categories." };
    }

    // Build subreddit list
    const subreddits = new Set<string>();

    for (const category of request.categories) {
      if (typeof category !== "string") continue;
      if (!Object.hasOwn(SUBREDDIT_PRESETS, category)) continue;
      const presetKey = category as keyof typeof SUBREDDIT_PRESETS;
      for (const sr of SUBREDDIT_PRESETS[presetKey]) {
        subreddits.add(sr);
      }
    }

    for (const sr of SCOPE_SUBREDDIT_MAP[request.scope]) {
      subreddits.add(sr);
    }

    // SEC-003: Validate count before iterating
    if (request.customSubreddits.length > MAX_CUSTOM_SUBREDDITS) {
      return { success: false, error: `Too many custom subreddits. Maximum ${MAX_CUSTOM_SUBREDDITS} allowed.` };
    }

    for (const sr of request.customSubreddits) {
      if (typeof sr !== "string") continue;
      const cleaned = sanitizeSubreddit(sr);
      if (cleaned) subreddits.add(cleaned);
    }

    if (subreddits.size === 0) {
      return { success: false, error: "Select at least one subreddit." };
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

    // QA-008: scope removed from FetchOptions (was dead API surface)
    const options: FetchOptions = {
      subreddits: Array.from(subreddits),
      listing: request.listing,
      timeFrame: request.timeFrame,
      limit,
      searchQuery,
      after,
    };

    const data = await fetchMultipleSubreddits(options);
    return { success: true, data };
  } catch (error) {
    // SEC-004: Generic error to avoid leaking internal details
    console.error("analyzeReddit failed:", error);
    return { success: false, error: "Request failed. Please try again." };
  }
}
