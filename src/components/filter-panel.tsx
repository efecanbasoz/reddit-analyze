"use client";

import { CategoryChip } from "./category-chip";
import { SubredditInput } from "./subreddit-input";
import { SegmentedControl } from "./segmented-control";
import { Search, Globe, MapPin, Clock, TrendingUp, Loader2 } from "lucide-react";
import type { Scope, ListingType, TimeFrame } from "@/lib/types";

interface FilterPanelProps {
  scope: Scope;
  setScope: (s: Scope) => void;
  listing: ListingType;
  setListing: (l: ListingType) => void;
  timeFrame: TimeFrame;
  setTimeFrame: (t: TimeFrame) => void;
  categories: string[];
  toggleCategory: (c: string) => void;
  customSubreddits: string[];
  addSubreddit: (s: string) => void;
  removeSubreddit: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const SCOPE_OPTIONS: { value: Scope; label: string; icon: React.ReactNode }[] = [
  { value: "global", label: "World", icon: <Globe size={14} /> },
  { value: "us", label: "US", icon: <MapPin size={14} /> },
];

const LISTING_OPTIONS: { value: ListingType; label: string }[] = [
  { value: "hot", label: "Hot" },
  { value: "top", label: "Top" },
  { value: "new", label: "New" },
  { value: "rising", label: "Rising" },
];

const TIME_OPTIONS: { value: TimeFrame; label: string }[] = [
  { value: "hour", label: "1 Hour" },
  { value: "day", label: "24 Hours" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
  { value: "all", label: "All" },
];

const CATEGORY_OPTIONS = [
  { key: "marketing", label: "Marketing", description: "r/marketing, r/SEO, r/digital_marketing..." },
  { key: "saas", label: "SaaS & Startup", description: "r/SaaS, r/indiehackers, r/microsaas..." },
  { key: "aiDevTools", label: "AI & Dev Tools", description: "r/ClaudeAI, r/OpenAI, r/webdev..." },
];

export function FilterPanel(props: FilterPanelProps) {
  return (
    <div className="space-y-6 p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
      {/* Search */}
      <div>
        <label htmlFor="search-input" className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
          Search (optional)
        </label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
          <input
            id="search-input"
            type="text"
            value={props.searchQuery}
            onChange={(e) => props.setSearchQuery(e.target.value)}
            placeholder="Search topic or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus:border-orange-500/50 transition-all"
          />
        </div>
      </div>

      {/* Scope */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
            <Globe size={12} className="inline mr-1" aria-hidden="true" /> Scope
          </label>
          <SegmentedControl
            options={SCOPE_OPTIONS}
            value={props.scope}
            onChange={props.setScope}
            ariaLabel="Scope selection"
          />
        </div>
      </div>

      {/* Listing & TimeFrame */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
            <TrendingUp size={12} className="inline mr-1" aria-hidden="true" /> Listing
          </label>
          <SegmentedControl
            options={LISTING_OPTIONS}
            value={props.listing}
            onChange={props.setListing}
            ariaLabel="Listing selection"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
            <Clock size={12} className="inline mr-1" aria-hidden="true" /> Timeframe
          </label>
          <SegmentedControl
            options={TIME_OPTIONS}
            value={props.timeFrame}
            onChange={props.setTimeFrame}
            ariaLabel="Timeframe selection"
            fullWidth={false}
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
          Categories
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category selection">
          {CATEGORY_OPTIONS.map((cat) => (
            <CategoryChip
              key={cat.key}
              label={cat.label}
              description={cat.description}
              selected={props.categories.includes(cat.key)}
              onToggle={() => props.toggleCategory(cat.key)}
            />
          ))}
        </div>
      </div>

      {/* Custom Subreddits */}
      <div>
        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
          Custom Subreddit (optional)
        </label>
        <SubredditInput
          subreddits={props.customSubreddits}
          onAdd={props.addSubreddit}
          onRemove={props.removeSubreddit}
        />
      </div>

      {/* Analyze Button */}
      <button
        type="button"
        onClick={props.onAnalyze}
        disabled={props.isLoading}
        className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 disabled:shadow-none flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        aria-label={props.isLoading ? "Analyzing" : "Start Reddit analysis"}
      >
        {props.isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            Analyzing...
          </>
        ) : (
          <>
            <Search size={18} aria-hidden="true" />
            Analyze
          </>
        )}
      </button>
    </div>
  );
}
