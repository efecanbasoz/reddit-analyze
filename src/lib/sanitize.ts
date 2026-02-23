const SUBREDDIT_REGEX = /^[a-zA-Z0-9_]{1,21}$/;
const MAX_QUERY_LENGTH = 200;

export function sanitizeSubreddit(name: string): string | null {
  const cleaned = name.trim().replace(/^r\//, "");
  return SUBREDDIT_REGEX.test(cleaned) ? cleaned : null;
}

export function sanitizeSearchQuery(query: string): string {
  return query.slice(0, MAX_QUERY_LENGTH).replace(/[<>"'&`]/g, "");
}
