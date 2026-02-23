"use client";

import { useMemo } from "react";
import { PostCard } from "./post-card";
import { StatsBar } from "./stats-bar";
import { ResultsToolbar } from "./results-toolbar";
import { Radar } from "lucide-react";
import type { RedditPost } from "@/lib/types";
import type { SortBy, ViewMode } from "./results-toolbar";

interface ResultsGridProps {
  posts: RedditPost[];
  isLoading: boolean;
  sortBy: SortBy;
  setSortBy: (s: SortBy) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
}

export function ResultsGrid({ posts, isLoading, sortBy, setSortBy, viewMode, setViewMode }: ResultsGridProps) {
  const sortedPosts = useMemo(() => {
    const sorted = [...posts];
    switch (sortBy) {
      case "score":
        sorted.sort((a, b) => b.score - a.score);
        break;
      case "comments":
        sorted.sort((a, b) => b.numComments - a.numComments);
        break;
      case "date":
        sorted.sort((a, b) => b.createdUtc - a.createdUtc);
        break;
    }
    return sorted;
  }, [posts, sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading results">
        <span className="sr-only">Loading results...</span>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-5 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl animate-pulse">
            <div className="flex gap-2 mb-3">
              <div className="h-5 w-20 bg-zinc-800 rounded-md" />
              <div className="h-5 w-16 bg-zinc-800 rounded-md" />
            </div>
            <div className="h-4 w-3/4 bg-zinc-800 rounded mb-2" />
            <div className="h-4 w-1/2 bg-zinc-800 rounded mb-3" />
            <div className="flex gap-4">
              <div className="h-3 w-12 bg-zinc-800 rounded" />
              <div className="h-3 w-12 bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex p-4 bg-zinc-900/50 rounded-2xl mb-4">
          <Radar size={40} className="text-zinc-700" />
        </div>
        <p className="text-zinc-500 text-sm">No results yet.</p>
        <p className="text-zinc-600 text-xs mt-1">Adjust filters and click &quot;Analyze&quot;.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StatsBar posts={posts} />
      <ResultsToolbar
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalCount={sortedPosts.length}
      />
      <div className={`grid gap-3 ${viewMode === "compact" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
        {sortedPosts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            compact={viewMode === "compact"}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
