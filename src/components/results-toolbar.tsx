"use client";

import { ArrowUpDown, Calendar, MessageCircle, TrendingUp, LayoutGrid, LayoutList } from "lucide-react";

export type SortBy = "score" | "comments" | "date";
export type ViewMode = "expanded" | "compact";

interface ResultsToolbarProps {
  sortBy: SortBy;
  setSortBy: (s: SortBy) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  totalCount: number;
}

const SORT_OPTIONS: { value: SortBy; label: string; icon: React.ReactNode }[] = [
  { value: "score", label: "Score", icon: <TrendingUp size={13} /> },
  { value: "comments", label: "Yorum", icon: <MessageCircle size={13} /> },
  { value: "date", label: "Tarih", icon: <Calendar size={13} /> },
];

export function ResultsToolbar({
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalCount,
}: ResultsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl">
      {/* Left: Sort controls */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-zinc-500 text-xs">
          <ArrowUpDown size={12} />
          Sirala:
        </span>
        <div className="flex gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSortBy(opt.value)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 ${
                sortBy === opt.value
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                  : "text-zinc-500 hover:text-zinc-300 border border-transparent"
              }`}
              aria-label={`${opt.label} gore sirala`}
              aria-pressed={sortBy === opt.value}
            >
              {opt.icon}
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Center: Count */}
      <span className="text-xs text-zinc-600 hidden sm:block">
        {totalCount} sonuc
      </span>

      {/* Right: View mode toggle */}
      <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-0.5">
        <button
          type="button"
          onClick={() => setViewMode("expanded")}
          className={`p-1.5 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 ${
            viewMode === "expanded"
              ? "bg-zinc-700/50 text-orange-400"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
          aria-label="Genis gorunum"
          aria-pressed={viewMode === "expanded"}
        >
          <LayoutGrid size={14} />
        </button>
        <button
          type="button"
          onClick={() => setViewMode("compact")}
          className={`p-1.5 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 ${
            viewMode === "compact"
              ? "bg-zinc-700/50 text-orange-400"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
          aria-label="Kompakt gorunum"
          aria-pressed={viewMode === "compact"}
        >
          <LayoutList size={14} />
        </button>
      </div>
    </div>
  );
}
