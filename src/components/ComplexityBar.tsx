import type { Challenge } from "../data/types"
import { complexityLabel } from "../data/labels"

export function ComplexityBar({ value }: { value: Challenge["complexity"] }) {
  return (
    <div className="flex items-center gap-2" title={complexityLabel[value]}>
      <div className="flex gap-1" aria-hidden>
        {[1, 2, 3, 4, 5].map((step) => (
          <span
            key={step}
            className="h-1.5 w-4 rounded-full"
            style={{
              background:
                step <= value ? "var(--accent)" : "color-mix(in oklab, var(--line) 85%, transparent)",
            }}
          />
        ))}
      </div>
      <span className="mono text-[11px] text-[var(--muted)]">
        {value}/5 · {complexityLabel[value]}
      </span>
    </div>
  )
}
