import { useMemo, useState } from "react"
import { ChallengeCard } from "../components/ChallengeCard"
import { FilterBar } from "../components/FilterBar"
import { PageHeader } from "../components/PageHeader"
import { challenges } from "../data/challenges"
import { complexityLabel } from "../data/labels"
import { topicById } from "../data/topics"
import type { Challenge, ComplexityFilter, LangFilter, LevelFilter, PillarFilter } from "../data/types"
import { useProgress } from "../progress"

export function ChallengesPage() {
  const [level, setLevel] = useState<LevelFilter>("all")
  const [pillar, setPillar] = useState<PillarFilter>("all")
  const [lang, setLang] = useState<LangFilter>("all")
  const [complexity, setComplexity] = useState<ComplexityFilter>("all")
  const [search, setSearch] = useState("")
  const [seenFilter, setSeenFilter] = useState<"all" | "pending" | "seen">("all")
  const [kind, setKind] = useState<"all" | "plataforma" | "laboratorio">("all")
  const { has } = useProgress()

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return challenges.filter((challenge) => {
      if (level !== "all" && challenge.level !== level) return false
      if (complexity !== "all" && challenge.complexity !== complexity) return false
      if (lang !== "all" && !challenge.languages.includes(lang)) return false
      if (pillar !== "all") {
        const matchesPillar = challenge.topicIds.some(
          (topicId) => topicById[topicId]?.pillar === pillar,
        )
        if (!matchesPillar) return false
      }
      const seen = has("challenges", challenge.id)
      if (seenFilter === "pending" && seen) return false
      if (seenFilter === "seen" && !seen) return false
      const challengeKind = challenge.kind ?? "laboratorio"
      if (kind !== "all" && challengeKind !== kind) return false
      if (q) {
        const hay = `${challenge.title} ${challenge.domain} ${challenge.problem} ${challenge.id}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [level, lang, complexity, pillar, search, seenFilter, kind, has])

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 lg:px-8">
      <PageHeader kicker="04 · Catálogo" title="Desafios">
        <strong className="text-[var(--ink)]">Lumen</strong> é a plataforma. Cada ficha Lumen
        sobe sozinha (hops mockados). Labs são outros universos, também isolados.
      </PageHeader>
      <div className="mt-6 flex flex-col gap-3">
        <FilterBar
          level={level}
          pillar={pillar}
          lang={lang}
          onLevel={setLevel}
          onPillar={setPillar}
          onLang={setLang}
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Kafka, checkout, GitHub…"
        />
        <div className="flex flex-wrap items-end gap-3">
        <label className="flex max-w-xs flex-col gap-1 text-[11px] text-[var(--muted)]">
          Complexidade
          <select
            value={complexity}
            onChange={(event) =>
              setComplexity(
                event.target.value === "all"
                  ? "all"
                  : (Number(event.target.value) as Challenge["complexity"]),
              )
            }
            className="field"
          >
            <option value="all">Todas</option>
            {([1, 2, 3, 4, 5] as const).map((value) => (
              <option key={value} value={value}>
                {value} · {complexityLabel[value]}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="flex flex-col gap-1 border-0 p-0">
          <legend className="px-0 text-[11px] text-[var(--muted)]">Tipo</legend>
          <div className="flex gap-1">
            {(
              [
                ["all", "Todos"],
                ["plataforma", "Lumen"],
                ["laboratorio", "Labs"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setKind(value)}
                className={kind === value ? "btn btn-primary" : "btn"}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-1 border-0 p-0">
          <legend className="px-0 text-[11px] text-[var(--muted)]">Visto</legend>
          <div className="flex gap-1">
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
        </fieldset>
        </div>
      </div>
      <p className="mono mt-4 text-xs text-[var(--muted)]">{visible.length} fichas</p>
      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--muted)]">Nenhuma ficha com esses filtros.</p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((challenge) => (
            <ChallengeCard key={challenge.id} id={challenge.id} />
          ))}
        </div>
      )}
    </main>
  )
}
