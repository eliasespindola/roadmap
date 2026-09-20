import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ChallengeCard } from "../components/ChallengeCard"
import { OptionalBadge } from "../components/Badges"
import { PageHeader } from "../components/PageHeader"
import { SearchField } from "../components/SearchField"
import { levelLabel, pillarDot } from "../data/labels"
import { mindRoot, studyPath, type MindNode } from "../data/mindmap"
import { topicById } from "../data/topics"
import { useProgress } from "../progress"
import { SeenToggle } from "../components/SeenToggle"

const branchColor: Record<string, string> = {
  base: pillarDot.fundamentos,
  algo: pillarDot.algoritmos,
  dados: pillarDot.dados,
  langs: pillarDot.linguagem,
  eng: pillarDot.engenharia,
  api: pillarDot.api,
  run: pillarDot.cloud,
  arch: pillarDot.arquitetura,
  ia: pillarDot.ia,
  staff: pillarDot.lideranca,
}

function matchesQuery(node: MindNode, query: string): boolean {
  if (!query) return true
  const hay = `${node.title} ${node.topicId ?? ""}`.toLowerCase()
  if (hay.includes(query)) return true
  return (node.children ?? []).some((child) => matchesQuery(child, query))
}

function Branch({ node, query, index }: { node: MindNode; query: string; index: number }) {
  const [open, setOpen] = useState(true)
  const { has } = useProgress()
  const color = branchColor[node.id] ?? "var(--accent)"
  const kids = (node.children ?? []).filter((child) => matchesQuery(child, query))

  if (query && kids.length === 0) return null

  return (
    <section className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 border-0 bg-transparent px-4 py-3 text-left"
      >
        <span className="mono text-[11px] text-[var(--accent)]">
          {String(index).padStart(2, "0")}
        </span>
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
        <span className="display text-xl text-[var(--ink)]">{node.title}</span>
        <span className="mono ml-auto text-[10px] text-[var(--muted)]">
          {kids.length} · {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <div className="border-t border-[var(--line)] px-3 py-3">
          <div className="ml-2 border-l-2 pl-3" style={{ borderColor: color }}>
            {kids.map((child) => {
              const topic = child.topicId ? topicById[child.topicId] : undefined
              return (
                <div key={child.id} className="relative py-1">
                  <span
                    className="absolute top-3 -left-[15px] h-px w-3"
                    style={{ background: color }}
                    aria-hidden
                  />
                  {topic ? (
                    <Link
                      to={`/roadmap?topic=${topic.id}&level=${topic.level}`}
                      className="block rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] no-underline hover:border-[var(--accent)]"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className={has("topics", topic.id) ? "line-through text-[var(--muted)]" : ""}>
                          {child.title}
                        </span>
                        <span className="flex items-center gap-1">
                          {topic.optional ? <OptionalBadge /> : null}
                          <SeenToggle bucket="topics" id={topic.id} compact />
                        </span>
                      </span>
                      <span className="mono mt-0.5 block text-[10px] uppercase tracking-wide text-[var(--muted)]">
                        {levelLabel[topic.level]}
                      </span>
                    </Link>
                  ) : (
                    <span className="block px-3 py-1.5 text-sm">{child.title}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export function MindMapPage() {
  const [query, setQuery] = useState("")
  const branches = mindRoot.children ?? []
  const normalized = query.trim().toLowerCase()
  const counts = useMemo(() => {
    return branches.flatMap((branch) => branch.children ?? []).length
  }, [branches])

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 lg:px-8">
      <PageHeader kicker="01 · Visão" title="Mapa mental">
        Dez ramos a partir do centro. Event-driven ≠ event sourcing. Opcional leva selo.
      </PageHeader>

      <div className="mt-8 card overflow-hidden">
        <div className="bg-[var(--accent-soft)] px-6 py-8">
          <p className="kicker">Centro</p>
          <p className="display mt-2 text-4xl">{mindRoot.title}</p>
          <p className="mono mt-2 text-[11px] text-[var(--muted)]">
            {counts} nós · {branches.length} ramos
          </p>
        </div>
        <div className="border-t border-[var(--line)] px-4 py-3">
          <SearchField
            value={query}
            onChange={setQuery}
            label="Filtrar nós"
            placeholder="GraphQL, sourcing, Kafka…"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {branches.map((branch, index) => (
          <Branch key={branch.id} node={branch} query={normalized} index={index} />
        ))}
      </div>

      <section className="mt-16">
        <h2 className="display text-3xl">Percurso</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Ordem se você começa do zero. Cada desafio é um repo novo.
        </p>
        <ol className="mt-6 m-0 flex list-none flex-col gap-5 p-0">
          {studyPath.map((step) => (
            <li key={step.id} className="card p-5">
              <p className="kicker">
                Fase {step.phase} · {levelLabel[step.level]} · {step.weeks}
              </p>
              <h3 className="display mt-2 text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{step.blurb}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {step.challengeIds.map((id) => (
                  <ChallengeCard key={id} id={id} compact />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
