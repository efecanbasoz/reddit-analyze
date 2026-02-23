"use client";

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  fullWidth?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  fullWidth = true,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex gap-1.5 flex-wrap" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`${fullWidth ? "flex-1" : ""} flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 ${
            value === opt.value
              ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
              : "bg-zinc-800/50 text-zinc-500 border border-zinc-700/30 hover:text-zinc-300"
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
