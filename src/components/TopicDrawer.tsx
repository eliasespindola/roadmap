import { useEffect } from "react"
import { Link } from "react-router-dom"
import { topicById } from "../data/topics"
import { levelLabel, pillarDot, pillarLabel } from "../data/labels"
import { ChallengeCard } from "./ChallengeCard"
import { LangBadge, OptionalBadge, Pill } from "./Badges"
import { SeenToggle } from "./SeenToggle"
import { ResourceList } from "./ResourceList"

export function TopicDrawer({
  topicId,
  onClose,
}: {
  topicId: string | null
  onClose: () => void
}) {
  const topic = topicId ? topicById[topicId] : undefined

  useEffect(() => {
    if (!topic) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [topic, onClose])

  if (!topic) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Fechar painel"
        className="h-full flex-1 cursor-default border-0 bg-black/45"
        onClick={onClose}
      />
      <aside
        className="flex h-full w-full max-w-lg flex-col border-l border-[var(--line)] bg-[var(--bg)]"
        role="dialog"
        aria-labelledby="topic-title"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: pillarDot[topic.pillar] }}
                aria-hidden
              />
              <Pill>{levelLabel[topic.level]}</Pill>
              <Pill>{pillarLabel[topic.pillar]}</Pill>
              <LangBadge lang={topic.languages} />
              {topic.optional ? <OptionalBadge /> : null}
              <SeenToggle bucket="topics" id={topic.id} />
            </div>
            <h2 id="topic-title" className="display mt-3 text-3xl leading-tight text-[var(--ink)]">
              {topic.title}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="btn shrink-0 text-sm">
            Fechar
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">
          <p className="text-sm leading-relaxed text-[var(--ink)]">{topic.summary}</p>
          <h3 className="mt-6 font-sans text-sm font-semibold tracking-wide text-[var(--ink)]">
            Por que em 2026
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{topic.why2026}</p>
          <h3 className="mt-6 font-sans text-sm font-semibold tracking-wide text-[var(--ink)]">
            Recursos
          </h3>
          <div className="mt-2">
            <ResourceList ids={topic.resourceIds} />
          </div>
          {topic.challengeIds.length > 0 ? (
            <>
              <h3 className="mt-6 font-sans text-sm font-semibold tracking-wide text-[var(--ink)]">
                Desafios (independentes)
              </h3>
              <div className="mt-2 flex flex-col gap-3">
                {topic.challengeIds.map((id) => (
                  <ChallengeCard key={id} id={id} compact />
                ))}
              </div>
            </>
          ) : (
            <p className="mt-6 text-sm text-[var(--muted)]">
              Sem desafio próprio — veja a{" "}
              <Link to="/desafios" className="text-[var(--ink)]">
                lista
              </Link>
              .
            </p>
          )}
        </div>
      </aside>
    </div>
  )
}
