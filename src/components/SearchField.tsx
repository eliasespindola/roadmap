export function SearchField({
  value,
  onChange,
  placeholder = "Buscar…",
  label = "Buscar",
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}) {
  return (
    <label className="flex min-w-[14rem] flex-1 flex-col gap-1 text-[11px] text-[var(--muted)]">
      {label}
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="field w-full"
      />
    </label>
  )
}
