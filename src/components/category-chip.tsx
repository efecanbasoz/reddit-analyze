"use client";

interface CategoryChipProps {
  label: string;
  description: string;
  selected: boolean;
  onToggle: () => void;
}

export function CategoryChip({ label, description, selected, onToggle }: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        group relative px-4 py-2.5 rounded-xl border text-sm font-medium
        transition-all duration-200 cursor-pointer
        hover:scale-[1.02] active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50
        ${selected
          ? "border-orange-500/50 bg-orange-500/10 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]"
          : "border-zinc-700/50 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
        }
      `}
      title={description}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
