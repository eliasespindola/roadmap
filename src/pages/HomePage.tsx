import { Link } from "react-router-dom"
import { ChallengeCard } from "../components/ChallengeCard"
import { LEVELS, levelBlurb, levelLabel } from "../data/labels"
import { challenges } from "../data/challenges"
import { coverage } from "../data/gaps"
import { studyPath } from "../data/mindmap"
import { recommendations } from "../data/recommendations"
import { resourceById } from "../data/resources"
import { topics } from "../data/topics"
import { useProgress } from "../progress"

export function HomePage() {
  const featured = recommendations.filter((item) =>
    ["rec-ddia", "rec-grokking", "rec-learning-go", "rec-sre"].includes(item.id),
  )
  const firstPhase = studyPath[0]
  const optionalCount = topics.filter((topic) => topic.optional).length
  const { topics: seenTopics, challenges: seenChallenges } = useProgress()
  const topicSeen = [...seenTopics].filter((id) => topics.some((topic) => topic.id === id)).length
  const challengeSeen = [...seenChallenges].filter((id) =>
    challenges.some((challenge) => challenge.id === id),
  ).length

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 lg:px-8 lg:py-12">
      <p className="kicker">Trilha 2026 / 2027</p>
      <h1 className="display mt-4 max-w-4xl text-5xl leading-[0.9] md:text-7xl">
        Backend
        <span className="block text-[var(--accent)]">JR → Staff</span>
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted)]">
        Java 25 e Go 1.26. A trilha constrói a <strong className="text-[var(--ink)]">Lumen</strong>
        — uma feira urbana. Cada serviço é um desafio independente: mock dos hops, repo
        isolado. No fim, se ligar tudo, é a plataforma.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/plataforma" className="btn btn-primary">
          Plataforma Lumen
        </Link>
        <Link to="/desafios" className="btn">
          {challenges.length} desafios
        </Link>
        <Link to="/roadmap" className="btn">
          Quatro colunas
        </Link>
      </div>

      <section className="mt-12 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [`${topicSeen}/${topics.length}`, "tópicos já vistos"],
          [`${challengeSeen}/${challenges.length}`, "desafios já vistos"],
          [studyPath.length, "fases"],
          [optionalCount, "opcionais"],
        ].map(([value, label]) => (
          <article key={String(label)} className="card px-5 py-5">
            <p className="display text-4xl">{value}</p>
            <p className="mono mt-1 text-[11px] uppercase tracking-wide text-[var(--muted)]">
              {label}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-12 grid gap-3 md:grid-cols-3">
        <article className="card p-5 md:col-span-2">
          <p className="kicker">Premissa</p>
          <h2 className="display mt-2 text-3xl">Um recorte, não a internet</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Só Java e Go. Desafios independentes: cada ficha é um repo novo. Event-driven
            (publicar e reagir) não é event sourcing (o log é o estado). GraphQL não substitui
            REST no emprego brasileiro médio.
          </p>
        </article>
        <article className="card p-5">
          <p className="kicker">Opcional</p>
          <h2 className="display mt-2 text-2xl">Nicho marcado</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            GraphQL, sourcing, MinIO, PostGIS e o README de perfil. Faça se a vaga pedir.
          </p>
        </article>
      </section>

      {firstPhase ? (
        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="display text-3xl">Fase 0</h2>
            <Link to="/mental" className="text-sm">
              Percurso completo
            </Link>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">{firstPhase.blurb}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {firstPhase.challengeIds.map((id) => (
              <ChallengeCard key={id} id={id} compact />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14">
        <h2 className="display text-3xl">Níveis</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {LEVELS.map((level, index) => (
            <Link
              key={level}
              to={`/roadmap?level=${level}`}
              className="card p-5 text-[var(--ink)] no-underline"
            >
              <p className="mono text-[11px] text-[var(--accent)]">
                {String(index).padStart(2, "0")}
              </p>
              <p className="display mt-2 text-2xl">{levelLabel[level]}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {levelBlurb[level]}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="display text-3xl">O mercado lê</h2>
          <Link to="/biblioteca" className="text-sm">
            Biblioteca
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {featured.map((item) => {
            const resource = resourceById[item.resourceId]
            if (!resource) return null
            return (
              <article key={item.id} className="card p-5">
                <p className="kicker">{item.kind === "livro" ? "Livro" : "Curso"}</p>
                <h3 className="display mt-2 text-xl">{resource.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {item.whyMarket}
                </p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mt-14 grid gap-3 lg:grid-cols-2">
        <article className="card p-5">
          <p className="kicker">Coberto</p>
          <h2 className="display mt-2 text-2xl">No mapa</h2>
          <ul className="mt-3 list-disc pl-5 text-sm leading-relaxed text-[var(--muted)]">
            {coverage.inScope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card p-5">
          <p className="kicker">De fora</p>
          <h2 className="display mt-2 text-2xl">Não é este site</h2>
          <ul className="mt-3 m-0 flex list-none flex-col gap-3 p-0">
            {coverage.outOfScope.map((item) => (
              <li key={item.title}>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.why}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-14 card overflow-hidden p-6 md:p-8">
        <p className="kicker">Leigo em IA</p>
        <h2 className="display mt-2 text-3xl">LLM ≠ agente ≠ MCP</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
          Seis blocos e um review de PR escrito por agente. O mesmo critério de um humano.
        </p>
        <Link to="/ia" className="btn btn-primary mt-6">
          Trilha de IA
        </Link>
      </section>
    </main>
  )
}
