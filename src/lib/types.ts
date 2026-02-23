export interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  score: number;
  numComments: number;
  url: string;
  selftext: string;
  createdUtc: number;
  permalink: string;
  ups: number;
  upvoteRatio: number;
  flairText: string | null;
  author: string;
  isSelf: boolean;
  thumbnail: string;
}

export interface RedditListing {
  posts: RedditPost[];
  after: string | null;
  before: string | null;
  totalCount: number;
}

export type ListingType = "hot" | "top" | "new" | "rising";
export type TimeFrame = "hour" | "day" | "week" | "month" | "year" | "all";
export type SortType = "hot" | "new" | "top" | "relevance" | "comments";
export type Scope = "global" | "us" | "turkey";

export type Language = "en" | "tr";

export interface FetchOptions {
  subreddits: string[];
  listing: ListingType;
  timeFrame: TimeFrame;
  limit: number;
  scope: Scope;
  language: Language;
  searchQuery?: string;
  after?: string;
}
