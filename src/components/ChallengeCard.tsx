import { Link } from "react-router-dom"
import { challengeById } from "../data/challenges"
import { bandLabel, kindLabel, langLabel, levelLabel } from "../data/labels"
import { useProgress } from "../progress"
import type { Lang } from "../data/types"
import { ComplexityBar } from "./ComplexityBar"
import { LangBadge, StandaloneBadge } from "./Badges"
import { SeenToggle } from "./SeenToggle"

export function ChallengeCard({
  id,
  compact = false,
}: {
  id: string
  compact?: boolean
}) {
  const challenge = challengeById[id]
  const { has } = useProgress()
  if (!challenge) return null

  const langs = challenge.languages.length === 2 ? "ambos" : challenge.languages[0]
  const seen = has("challenges", challenge.id)

  return (
    <article className={`card h-full overflow-hidden ${seen ? "opacity-70" : ""}`}>
      <div className="flex items-start justify-between gap-2 px-4 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <LangBadge lang={langs as Lang} />
          <StandaloneBadge />
          {challenge.kind === "plataforma" ? (
            <span className="mono rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
              {kindLabel.plataforma}
            </span>
          ) : null}
        </div>
        <SeenToggle bucket="challenges" id={challenge.id} compact />
      </div>
      <Link
        to={`/desafios/${challenge.id}`}
        className="flex flex-col p-4 pt-2 text-[var(--ink)] no-underline"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
            {bandLabel(challenge.level, challenge.rung)} · {levelLabel[challenge.level]}
          </span>
        </div>
        <h3
          className={`display mt-2 text-xl leading-tight ${seen ? "line-through decoration-[var(--muted)]" : ""}`}
        >
          {challenge.title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{challenge.domain}</p>
        <div className="mt-3">
          <ComplexityBar value={challenge.complexity} />
        </div>
        {!compact ? (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">
            {challenge.problem}
          </p>
        ) : null}
        <p className="mono mt-4 text-[11px] text-[var(--muted)]">
          {challenge.estimatedHours} · {challenge.languages.map((item) => langLabel[item]).join(" / ")}
        </p>
      </Link>
    </article>
  )
}
