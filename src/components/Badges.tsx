import type { Lang } from "../data/types"

const tone: Record<Lang, string> = {
  java: "text-[var(--java)]",
  go: "text-[var(--go)]",
  ambos: "text-[var(--muted)]",
}

export function LangBadge({ lang }: { lang: Lang | "java" | "go" }) {
  const label = lang === "ambos" ? "Java + Go" : lang === "java" ? "Java" : "Go"
  return (
    <span className={`mono text-[10px] uppercase tracking-wider ${tone[lang]}`}>
      {label}
    </span>
  )
}

export function Pill({ children }: { children: string }) {
  return (
    <span className="inline-block rounded-full border border-[var(--line)] bg-[var(--bg)] px-2.5 py-0.5 text-[11px] text-[var(--muted)]">
      {children}
    </span>
  )
}

export function StandaloneBadge() {
  return (
    <span className="mono inline-block rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--accent)]">
      Repo novo
    </span>
  )
}

export function OptionalBadge() {
  return (
    <span className="mono inline-block rounded-full border border-[var(--line)] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--muted)]">
      Opcional
    </span>
  )
}
