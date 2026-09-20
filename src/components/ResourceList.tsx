import { getResources } from "../data/resources"
import { relevanceLabel, typeLabel } from "../data/labels"
import type { Relevance } from "../data/types"

const relevanceClass: Record<Relevance, string> = {
  essencial: "text-[var(--accent)]",
  complementar: "text-[var(--muted)]",
  historico: "text-[var(--warn)]",
}

export function ResourceList({ ids }: { ids: string[] }) {
  const items = getResources(ids)
  if (items.length === 0) return null

  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {items.map((resource) => (
        <li
          key={resource.id}
          className="card px-3 py-2"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            {resource.url ? (
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[var(--ink)] underline decoration-[var(--line)] underline-offset-2 hover:decoration-[var(--accent)]"
              >
                {resource.title}
              </a>
            ) : (
              <span className="text-sm text-[var(--ink)]">{resource.title}</span>
            )}
            <span className="mono flex gap-2 text-[10px] uppercase tracking-wide">
              <span className="text-[var(--muted)]">{typeLabel[resource.type]}</span>
              <span className={relevanceClass[resource.relevance]}>
                {relevanceLabel[resource.relevance]}
              </span>
            </span>
          </div>
          {resource.note ? (
            <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{resource.note}</p>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
