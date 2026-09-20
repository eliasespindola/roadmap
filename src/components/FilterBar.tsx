import { SearchField } from "./SearchField"
import { LEVELS, PILLARS, levelLabel, pillarLabel } from "../data/labels"
import type { LangFilter, LevelFilter, PillarFilter } from "../data/types"

export function FilterBar({
  level,
  pillar,
  lang,
  onLevel,
  onPillar,
  onLang,
  search,
  onSearch,
  searchPlaceholder,
}: {
  level: LevelFilter
  pillar: PillarFilter
  lang: LangFilter
  onLevel: (value: LevelFilter) => void
  onPillar: (value: PillarFilter) => void
  onLang: (value: LangFilter) => void
  search?: string
  onSearch?: (value: string) => void
  searchPlaceholder?: string
}) {
  return (
    <div className="card flex flex-wrap items-end gap-3 p-3">
      {onSearch ? (
        <SearchField
          value={search ?? ""}
          onChange={onSearch}
          placeholder={searchPlaceholder}
        />
      ) : null}
      <label className="flex flex-col gap-1 text-[11px] text-[var(--muted)]">
        Nível
        <select
          value={level}
          onChange={(event) => onLevel(event.target.value as LevelFilter)}
          className="field"
        >
          <option value="all">Todos</option>
          {LEVELS.map((item) => (
            <option key={item} value={item}>
              {levelLabel[item]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[11px] text-[var(--muted)]">
        Pilar
        <select
          value={pillar}
          onChange={(event) => onPillar(event.target.value as PillarFilter)}
          className="field max-w-[14rem]"
        >
          <option value="all">Todos</option>
          {PILLARS.map((item) => (
            <option key={item} value={item}>
              {pillarLabel[item]}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="flex flex-col gap-1 border-0 p-0">
        <legend className="px-0 text-[11px] text-[var(--muted)]">Linguagem</legend>
        <div className="flex gap-1">
          {(
            [
              ["all", "Todas"],
              ["java", "Java"],
              ["go", "Go"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onLang(value)}
              className={[
                "px-3 py-1.5 text-sm",
                lang === value ? "btn-primary btn border-0" : "btn",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
