import { useMemo, useState } from "react"
import { PageHeader } from "../components/PageHeader"
import { ResourceList } from "../components/ResourceList"
import { SearchField } from "../components/SearchField"
import { levelLabel, relevanceLabel, typeLabel } from "../data/labels"
import { recommendations } from "../data/recommendations"
import { resourceById, resources } from "../data/resources"
import type { Relevance, ResourceType } from "../data/types"

const types: ResourceType[] = ["doc", "artigo", "livro", "rfc", "repo", "curso", "video"]
const relevances: Relevance[] = ["essencial", "complementar", "historico"]

export function BibliotecaPage() {
  const [tab, setTab] = useState<"mercado" | "catalogo">("mercado")
  const [type, setType] = useState<"all" | ResourceType>("all")
  const [relevance, setRelevance] = useState<"all" | Relevance>("all")
  const [search, setSearch] = useState("")

  const livros = recommendations.filter((item) => item.kind === "livro")
  const cursos = recommendations.filter((item) => item.kind === "curso")

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return resources.filter((resource) => {
      if (type !== "all" && resource.type !== type) return false
      if (relevance !== "all" && resource.relevance !== relevance) return false
      if (q && !`${resource.title} ${resource.note ?? ""}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [type, relevance, search])

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-24 lg:px-8">
      <PageHeader kicker="05 · Biblioteca" title="Leitura e prática">
        Primeiro o que o mercado de 2026 realmente usa. Depois o catálogo completo (incluindo
        histórico). Cursos Udemy não têm URL fixa — busque pelo nome.
      </PageHeader>

      <div className="mt-6 flex gap-1">
        <button
          type="button"
          className={tab === "mercado" ? "btn btn-primary" : "btn"}
          onClick={() => setTab("mercado")}
        >
          Mercado 2026
        </button>
        <button
          type="button"
          className={tab === "catalogo" ? "btn btn-primary" : "btn"}
          onClick={() => setTab("catalogo")}
        >
          Catálogo
        </button>
      </div>

      {tab === "mercado" ? (
        <>
          <h2 className="display mt-8 text-2xl">Livros</h2>
          <div className="mt-3 flex flex-col gap-3">
            {livros.map((item) => {
              const resource = resourceById[item.resourceId]
              if (!resource) return null
              return (
                <article key={item.id} className="card p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    {resource.url ? (
                      <a href={resource.url} target="_blank" rel="noreferrer" className="text-sm">
                        {resource.title}
                      </a>
                    ) : (
                      <h3 className="text-sm font-medium">{resource.title}</h3>
                    )}
                    <span className="mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      {item.audience.map((level) => levelLabel[level]).join(" · ")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {item.whyMarket}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--ink)]">
                    Como usar: {item.howToUse}
                  </p>
                </article>
              )
            })}
          </div>
          <h2 className="display mt-10 text-2xl">Cursos</h2>
          <p className="mt-2 text-xs text-[var(--muted)]">
            URL de Udemy muda. O nome na ficha é o que você procura.
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {cursos.map((item) => {
              const resource = resourceById[item.resourceId]
              if (!resource) return null
              return (
                <article key={item.id} className="card p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-sm font-medium">{resource.title}</h3>
                    <span className="mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      {item.audience.map((level) => levelLabel[level]).join(" · ")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {item.whyMarket}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--ink)]">
                    Como usar: {item.howToUse}
                  </p>
                </article>
              )
            })}
          </div>
        </>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-end gap-3">
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="DDIA, Kafka, MCP…"
            />
            <label className="flex flex-col gap-1 text-[11px] text-[var(--muted)]">
              Tipo
              <select
                value={type}
                onChange={(event) => setType(event.target.value as "all" | ResourceType)}
                className="field"
              >
                <option value="all">Todos</option>
                {types.map((item) => (
                  <option key={item} value={item}>
                    {typeLabel[item]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-[11px] text-[var(--muted)]">
              Relevância 2026
              <select
                value={relevance}
                onChange={(event) =>
                  setRelevance(event.target.value as "all" | Relevance)
                }
                className="field"
              >
                <option value="all">Todas</option>
                {relevances.map((item) => (
                  <option key={item} value={item}>
                    {relevanceLabel[item]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mono mt-4 text-xs text-[var(--muted)]">{visible.length} itens</p>
          <div className="mt-3">
            <ResourceList ids={visible.map((resource) => resource.id)} />
          </div>
        </>
      )}
    </main>
  )
}
