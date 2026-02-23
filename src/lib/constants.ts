import type { Scope } from "./types";

export const SUBREDDIT_PRESETS = {
  marketing: [
    "marketing",
    "digital_marketing",
    "SEO",
    "socialmedia",
    "content_marketing",
    "growthhacking",
    "Entrepreneur",
  ],
  saas: [
    "SaaS",
    "startups",
    "indiehackers",
    "microsaas",
    "sideproject",
    "buildinpublic",
  ],
  aiDevTools: [
    "ClaudeAI",
    "OpenAI",
    "ChatGPT",
    "LocalLLaMA",
    "MachineLearning",
    "coding",
    "webdev",
    "nextjs",
  ],
  turkish: ["Turkey", "KGBTR", "Turkiye"],
} as const;

export const SCOPE_SUBREDDIT_MAP: Record<Scope, string[]> = {
  global: [],
  us: ["smallbusiness", "Entrepreneur", "startups"],
  turkey: ["Turkey", "Turkiye", "KGBTR"],
};

export const DEFAULT_LIMIT = 25;
export const MAX_LIMIT = 100;
export const API_BASE_URL = "https://www.reddit.com";
export const USER_AGENT = "reddit-analyzer/1.0 (topic-finder)";
