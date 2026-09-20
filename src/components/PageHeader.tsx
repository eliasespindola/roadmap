import type { ReactNode } from "react"

export function PageHeader({
  kicker,
  title,
  children,
}: {
  kicker?: string
  title: string
  children?: ReactNode
}) {
  return (
    <header className="max-w-3xl">
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h1 className="display mt-3 text-4xl leading-[0.95] md:text-5xl">{title}</h1>
      {children ? (
        <div className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{children}</div>
      ) : null}
    </header>
  )
}
