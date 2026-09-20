import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { FilterBar } from "../components/FilterBar"
import { LangBadge, OptionalBadge } from "../components/Badges"
import { PageHeader } from "../components/PageHeader"
import { TopicDrawer } from "../components/TopicDrawer"
import {
  LEVELS,
  PILLARS,
  levelBlurb,
  levelLabel,
  matchesLang,
  pillarDot,
  pillarLabel,
} from "../data/labels"
import { topics } from "../data/topics"
import type { LangFilter, Level, LevelFilter, PillarFilter } from "../data/types"
import { useProgress } from "../progress"
import { SeenToggle } from "../components/SeenToggle"

export function RoadmapPage() {
  const [params, setParams] = useSearchParams()
  const level = (params.get("level") as LevelFilter | null) ?? "all"
  const pillar = (params.get("pillar") as PillarFilter | null) ?? "all"
  const lang = (params.get("lang") as LangFilter | null) ?? "all"
  const topicId = params.get("topic")
  const [search, setSearch] = useState("")
  const [seenFilter, setSeenFilter] = useState<"all" | "pending" | "seen">("all")
  const { has } = useProgress()

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === "all") next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const openTopic = (id: string) => {
    const next = new URLSearchParams(params)
    next.set("topic", id)
    setParams(next)
  }

  const closeTopic = () => {
    const next = new URLSearchParams(params)
    next.delete("topic")
    setParams(next, { replace: true })
  }

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return topics.filter((topic) => {
      if (level !== "all" && topic.level !== level) return false
      if (pillar !== "all" && topic.pillar !== pillar) return false
      if (!matchesLang(topic.languages, lang)) return false
      const seen = has("topics", topic.id)
      if (seenFilter === "pending" && seen) return false
      if (seenFilter === "seen" && !seen) return false
      if (q) {
        const hay = `${topic.title} ${topic.summary} ${topic.id}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [level, pillar, lang, search, seenFilter, has])

  const columns: Level[] =
    level === "all" ? LEVELS : LEVELS.filter((item) => item === level)

  const levelFilter: LevelFilter =
    level === "all" || LEVELS.includes(level as Level) ? level : "all"

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8 pb-24 lg:px-8">
      <PageHeader kicker="02 · Carreira" title="Colunas JR → Staff">
        Quatro níveis. Faixas JR1…ST e o produto estão em{" "}
        <Link to="/plataforma">Lumen</Link> — cada serviço independente, plataforma no fim.
      </PageHeader>
      <div className="sticky top-[3.25rem] z-20 mt-6 bg-[var(--bg)]/90 py-2 backdrop-blur-md lg:top-0">
        <FilterBar
          level={levelFilter}
          pillar={pillar}
          lang={lang}
          onLevel={(value) => setFilter("level", value)}
          onPillar={(value) => setFilter("pillar", value)}
          onLang={(value) => setFilter("lang", value)}
          search={search}
          onSearch={setSearch}
          searchPlaceholder="OpenAPI, Terraform, Big-O…"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {(
            [
              ["all", "Todos"],
              ["pending", "Pendentes"],
              ["seen", "Já vi"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSeenFilter(value)}
              className={seenFilter === value ? "btn btn-primary" : "btn"}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const colTopics = visible.filter((topic) => topic.level === col)
          return (
            <section key={col} className="card min-w-0 overflow-hidden">
              <header className="border-b border-[var(--line)] bg-[var(--accent-soft)]/50 px-3 py-3">
                <h2 className="display text-xl">{levelLabel[col]}</h2>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                  {levelBlurb[col]}
                </p>
                <p className="mono mt-2 text-[11px] text-[var(--muted)]">
                  {colTopics.length} tópicos
                </p>
              </header>
              <div className="flex flex-col gap-4 p-3">
                {PILLARS.map((p) => {
                  const group = colTopics.filter((topic) => topic.pillar === p)
                  if (group.length === 0) return null
                  return (
                    <div key={p}>
                      <p className="mb-1.5 flex items-center gap-2 font-sans text-[11px] font-medium text-[var(--muted)]">
                        <span
                          className="inline-block h-1.5 w-1.5 shrink-0"
                          style={{ background: pillarDot[p] }}
                          aria-hidden
                        />
                        {pillarLabel[p]}
                      </p>
                      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                        {group.map((topic) => (
                          <li key={topic.id}>
                            <button
                              type="button"
                              onClick={() => openTopic(topic.id)}
                              className={[
                                "w-full rounded-r-lg border-l-[3px] px-2.5 py-2 text-left text-sm leading-snug",
                                topicId === topic.id
                                  ? "bg-[var(--accent-soft)]"
                                  : "bg-[var(--bg)] hover:bg-[var(--accent-soft)]/40",
                              ].join(" ")}
                              style={{ borderLeftColor: pillarDot[topic.pillar] }}
                            >
                              <span
                                className={`flex items-start justify-between gap-2 ${has("topics", topic.id) ? "text-[var(--muted)] line-through" : "text-[var(--ink)]"}`}
                              >
                                <span>{topic.title}</span>
                                <SeenToggle bucket="topics" id={topic.id} compact />
                              </span>
                              <span className="mt-1 flex flex-wrap items-center gap-2">
                                <LangBadge lang={topic.languages} />
                                {topic.optional ? <OptionalBadge /> : null}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--muted)]">Nenhum tópico com esses filtros.</p>
      ) : null}

      <TopicDrawer topicId={topicId} onClose={closeTopic} />
    </main>
  )
}
