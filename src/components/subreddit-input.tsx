"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { sanitizeSubreddit } from "@/lib/sanitize";

interface SubredditInputProps {
  subreddits: string[];
  onAdd: (subreddit: string) => void;
  onRemove: (subreddit: string) => void;
}

export function SubredditInput({ subreddits, onAdd, onRemove }: SubredditInputProps) {
  const [value, setValue] = useState("");
  const [validationError, setValidationError] = useState("");

  // QA-005: Client-side validation using shared sanitizer
  function handleAdd() {
    const cleaned = sanitizeSubreddit(value);
    if (!cleaned) {
      setValidationError("Invalid subreddit name (letters, numbers, underscores only)");
      return;
    }
    setValidationError("");
    if (!subreddits.includes(cleaned)) {
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
            placeholder="subreddit name"
            aria-label="Enter subreddit name"
            className="w-full pl-8 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus:border-orange-500/50 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-2.5 bg-zinc-800 border border-zinc-700/50 rounded-xl text-zinc-400 hover:text-orange-400 hover:border-orange-500/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
          aria-label="Add subreddit"
        >
          <Plus size={16} />
        </button>
      </div>
      {validationError && (
        <p className="text-red-400 text-xs">{validationError}</p>
      )}
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
                aria-label={`Remove ${sr}`}
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
