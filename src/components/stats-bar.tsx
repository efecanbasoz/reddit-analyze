"use client";

import { useMemo } from "react";
import { BarChart3, TrendingUp, MessageCircle, Hash } from "lucide-react";
import type { RedditPost } from "@/lib/types";

interface StatsBarProps {
  posts: RedditPost[];
}

export function StatsBar({ posts }: StatsBarProps) {
  const stats = useMemo(() => {
    const totalScore = posts.reduce((sum, p) => sum + p.score, 0);
    const totalComments = posts.reduce((sum, p) => sum + p.numComments, 0);
    const uniqueSubreddits = new Set(posts.map((p) => p.subreddit)).size;
    const avgScore = posts.length ? Math.round(totalScore / posts.length) : 0;

    return [
      { label: "Post", value: posts.length, icon: <BarChart3 size={14} /> },
      { label: "Subreddit", value: uniqueSubreddits, icon: <Hash size={14} /> },
      { label: "Ort. Score", value: avgScore, icon: <TrendingUp size={14} /> },
      { label: "Toplam Yorum", value: totalComments.toLocaleString(), icon: <MessageCircle size={14} /> },
    ];
  }, [posts]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="region" aria-label="Sonuc istatistikleri">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl text-center"
        >
          <div className="flex items-center justify-center gap-1.5 text-orange-500/60 mb-1">
            {stat.icon}
          </div>
          <div className="text-lg font-bold text-zinc-200">{stat.value}</div>
          <div className="text-[10px] text-zinc-600 uppercase tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
