import { useProgress } from "../progress"

export function SeenToggle({
  bucket,
  id,
  compact = false,
}: {
  bucket: "topics" | "challenges" | "lessons"
  id: string
  compact?: boolean
}) {
  const { has, toggle } = useProgress()
  const seen = has(bucket, id)

  return (
    <button
      type="button"
      aria-pressed={seen}
      title={seen ? "Desmarcar (ainda não vi)" : "Marcar como já vi"}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggle(bucket, id)
      }}
      className={[
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] uppercase tracking-wide",
        seen
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
          : "border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--accent)]",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-3.5 w-3.5 place-items-center rounded-sm border text-[9px] leading-none",
          seen
            ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]"
            : "border-[var(--muted)]",
        ].join(" ")}
        aria-hidden
      >
        {seen ? "✓" : ""}
      </span>
      {compact ? null : seen ? "Já vi" : "Marcar"}
    </button>
  )
}
