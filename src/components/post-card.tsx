"use client";

import { ArrowUpCircle, MessageCircle, ExternalLink, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import type { RedditPost } from "@/lib/types";

interface PostCardProps {
  post: RedditPost;
  compact?: boolean;
  index?: number;
}

function formatScore(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function PostCard({ post, compact = false, index = 0 }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.createdUtc * 1000), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <a
      href={`https://www.reddit.com${post.permalink}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block bg-zinc-900/40 border border-zinc-800/50 rounded-2xl hover:border-orange-500/30 hover:bg-zinc-900/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.08)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 ${compact ? "p-3.5" : "p-5"}`}
      style={{
        animation: "fadeInUp 0.4s ease-out both",
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Header */}
      <div className={`flex items-center gap-2 ${compact ? "mb-2" : "mb-3"}`}>
        <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-xs font-medium rounded-md">
          r/{post.subreddit}
        </span>
        {post.flairText && (
          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-md">
            {post.flairText}
          </span>
        )}
        <span className="ml-auto text-zinc-600 text-xs flex items-center gap-1">
          <Clock size={10} aria-hidden="true" /> {timeAgo}
        </span>
      </div>

      {/* Title */}
      <h3 className={`font-semibold text-zinc-200 group-hover:text-orange-300 transition-colors line-clamp-2 ${compact ? "text-xs mb-2" : "text-sm mb-3"}`}>
        {post.title}
      </h3>

      {/* Preview - hidden in compact mode */}
      {!compact && post.selftext && (
        <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
          {post.selftext.slice(0, 200)}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <ArrowUpCircle size={13} className="text-orange-500/60" aria-hidden="true" />
          {formatScore(post.score)}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={13} aria-hidden="true" />
          {formatScore(post.numComments)}
        </span>
        {!compact && (
          <span className="text-zinc-700">
            {Math.round(post.upvoteRatio * 100)}% upvoted
          </span>
        )}
        <span className="ml-auto text-zinc-600 group-hover:text-orange-500/60 transition-colors" aria-hidden="true">
          <ExternalLink size={13} />
        </span>
      </div>
    </a>
  );
}
