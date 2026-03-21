"use client";

import { useId } from "react";

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

// QA-004: Native radio inputs for proper keyboard navigation and screen reader support
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  fullWidth = true,
}: SegmentedControlProps<T>) {
  const groupId = useId();

  return (
    <fieldset className="flex gap-1.5 flex-wrap" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => {
        const inputId = `${groupId}-${opt.value}`;
        const checked = value === opt.value;
        return (
          <label
            key={opt.value}
            htmlFor={inputId}
            className={`${fullWidth ? "flex-1" : ""} flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange-500/50 ${
              checked
                ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                : "bg-zinc-800/50 text-zinc-500 border border-zinc-700/30 hover:text-zinc-300"
            }`}
          >
            <input
              type="radio"
              id={inputId}
              name={groupId}
              value={opt.value}
              checked={checked}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {opt.icon}
            {opt.label}
          </label>
        );
      })}
    </fieldset>
  );
}
