"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface SubredditInputProps {
  subreddits: string[];
  onAdd: (subreddit: string) => void;
  onRemove: (subreddit: string) => void;
}

export function SubredditInput({ subreddits, onAdd, onRemove }: SubredditInputProps) {
  const [value, setValue] = useState("");

  function handleAdd() {
    const cleaned = value.trim().replace(/^r\//, "");
    if (cleaned && !subreddits.includes(cleaned)) {
      onAdd(cleaned);
      setValue("");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">r/</span>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
            placeholder="subreddit adi"
            aria-label="Subreddit adi girin"
            className="w-full pl-8 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus:border-orange-500/50 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-2.5 bg-zinc-800 border border-zinc-700/50 rounded-xl text-zinc-400 hover:text-orange-400 hover:border-orange-500/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
          aria-label="Subreddit ekle"
        >
          <Plus size={16} />
        </button>
      </div>
      {subreddits.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subreddits.map((sr) => (
            <span
              key={sr}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/50 rounded-lg text-xs text-zinc-300"
            >
              r/{sr}
              <button
                type="button"
                onClick={() => onRemove(sr)}
                className="text-zinc-500 hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 rounded-sm"
                aria-label={`${sr} subredditini kaldir`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
