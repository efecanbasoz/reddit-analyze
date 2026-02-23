"use server";

import { fetchMultipleSubreddits } from "@/lib/reddit-api";
import { SUBREDDIT_PRESETS, SCOPE_SUBREDDIT_MAP } from "@/lib/constants";
import { sanitizeSubreddit, sanitizeSearchQuery } from "@/lib/sanitize";
import type { FetchOptions, ListingType, TimeFrame, Scope, Language, RedditListing } from "@/lib/types";

const VALID_LISTINGS: ListingType[] = ["hot", "top", "new", "rising"];
const VALID_TIMEFRAMES: TimeFrame[] = ["hour", "day", "week", "month", "year", "all"];
const VALID_SCOPES: Scope[] = ["global", "us", "turkey"];
const VALID_LANGUAGES: Language[] = ["en", "tr"];

// Simple in-memory rate limiter (best-effort; resets across serverless cold starts)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 3000; // 3 seconds between requests

interface AnalyzeRequest {
  scope: Scope;
  language: Language;
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
    // Rate limiting
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      return { success: false, error: "Too many requests. Please wait a moment and try again." };
    }
    lastRequestTime = now;

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
    if (!VALID_LANGUAGES.includes(request.language)) {
      return { success: false, error: "Invalid language." };
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

    if (request.language === "tr") {
      for (const sr of SUBREDDIT_PRESETS.turkish) {
        subreddits.add(sr);
      }
    }

    if (subreddits.size === 0) {
      return { success: false, error: "Select at least one subreddit." };
    }

    const searchQuery = request.searchQuery
      ? sanitizeSearchQuery(request.searchQuery)
      : undefined;

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
      language: request.language,
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
