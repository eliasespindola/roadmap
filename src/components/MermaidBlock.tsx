import { useEffect, useId, useState } from "react"
import mermaid from "mermaid"

let started = false

function boot() {
  if (started) return
  started = true
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: window.matchMedia("(prefers-color-scheme: light)").matches ? "neutral" : "dark",
  })
}

let renderSeq = 0

export function MermaidBlock({ chart }: { chart: string }) {
  const reactId = useId().replace(/:/g, "")
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    let alive = true
    boot()
    const id = `mmd-${reactId}-${++renderSeq}`
    mermaid
      .render(id, chart)
      .then((result) => {
        if (alive) setSvg(result.svg)
      })
      .catch((err: unknown) => {
        if (alive) setError(err instanceof Error ? err.message : "Diagrama inválido")
      })
    return () => {
      alive = false
    }
  }, [chart, reactId])

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 text-xs text-[var(--warn)]">
        {chart}
      </pre>
    )
  }

  if (!svg) {
    return <p className="text-xs text-[var(--muted)]">Carregando diagrama…</p>
  }

  return (
    <div
      className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
