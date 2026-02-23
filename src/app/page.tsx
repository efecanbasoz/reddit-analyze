"use client";

import { useState, useCallback } from "react";
import { FilterPanel } from "@/components/filter-panel";
import { ResultsGrid } from "@/components/results-grid";
import { analyzeReddit } from "./actions";
import { Radar } from "lucide-react";
import type { Scope, ListingType, TimeFrame, RedditPost } from "@/lib/types";
import type { SortBy, ViewMode } from "@/components/results-toolbar";

export default function HomePage() {
  const [scope, setScope] = useState<Scope>("global");
  const [listing, setListing] = useState<ListingType>("hot");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("week");
  const [categories, setCategories] = useState<string[]>(["saas", "aiDevTools"]);
  const [customSubreddits, setCustomSubreddits] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [afterToken, setAfterToken] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<SortBy>("score");
  const [viewMode, setViewMode] = useState<ViewMode>("expanded");

  const toggleCategory = useCallback((cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const addSubreddit = useCallback((sr: string) => {
    setCustomSubreddits((prev) => [...prev, sr]);
  }, []);

  const removeSubreddit = useCallback((sr: string) => {
    setCustomSubreddits((prev) => prev.filter((s) => s !== sr));
  }, []);

  async function handleAnalyze() {
    setIsLoading(true);
    setError(null);
    setAfterToken(null);
    try {
      const result = await analyzeReddit({
        scope,
        listing,
        timeFrame,
        limit: 50,
        categories,
        customSubreddits,
        searchQuery: searchQuery || undefined,
      });
      if (result.success) {
        setPosts(result.data.posts);
        setAfterToken(result.data.after);
      } else {
        setError(result.error);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoadMore() {
    if (!afterToken || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const result = await analyzeReddit({
        scope,
        listing,
        timeFrame,
        limit: 50,
        categories,
        customSubreddits,
        searchQuery: searchQuery || undefined,
        after: afterToken,
      });
      if (result.success) {
        setPosts((prev) => [...prev, ...result.data.posts]);
        setAfterToken(result.data.after);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Failed to load more posts.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3" aria-label="Main navigation">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Radar size={20} className="text-orange-500" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-zinc-100">Reddit Analyzer</h1>
            <p className="text-[10px] sm:text-xs text-zinc-500">Topic Finder & Idea Discovery</p>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 lg:gap-8">
          <aside aria-label="Filters">
            <FilterPanel
              scope={scope}
              setScope={setScope}
              listing={listing}
              setListing={setListing}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
              categories={categories}
              toggleCategory={toggleCategory}
              customSubreddits={customSubreddits}
              addSubreddit={addSubreddit}
              removeSubreddit={removeSubreddit}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          </aside>
          <section aria-label="Results" aria-live="polite">
            {error && (
              <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm" role="alert">
                {error}
              </div>
            )}
            <ResultsGrid
              posts={posts}
              isLoading={isLoading}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            {afterToken && posts.length > 0 && (
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-6 py-2.5 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
