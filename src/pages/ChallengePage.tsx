import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ComplexityBar } from "../components/ComplexityBar"
import { LangBadge, Pill, StandaloneBadge } from "../components/Badges"
import { MermaidBlock } from "../components/MermaidBlock"
import { SeenToggle } from "../components/SeenToggle"
import { ResourceList } from "../components/ResourceList"
import { challengeById } from "../data/challenges"
import { bandLabel, defaultRubric, kindLabel, langLabel, levelLabel, protocolLabel } from "../data/labels"
import { lumen } from "../data/lumen"
import { topicById } from "../data/topics"
import type { Lang } from "../data/types"

export function ChallengePage() {
  const { id } = useParams()
  const challenge = id ? challengeById[id] : undefined
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  useEffect(() => {
    setChecked({})
  }, [id])

  const relatedTopics = useMemo(() => {
    if (!challenge) return []
    return challenge.topicIds.flatMap((topicId) => {
      const topic = topicById[topicId]
      return topic ? [topic] : []
    })
  }, [challenge])

  if (!challenge) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 pb-24">
        <h1 className="display text-3xl">Desafio não encontrado</h1>
        <Link to="/desafios" className="mt-4 inline-block text-sm">
          Voltar ao catálogo
        </Link>
      </main>
    )
  }

  const langs = challenge.languages.length === 2 ? "ambos" : challenge.languages[0]
  const done = challenge.criteria.filter((_, index) => checked[index]).length
  const kind = challenge.kind ?? "laboratorio"
  const neighbors = [
    ...(challenge.platform?.dependsOn ?? []),
    ...(challenge.platform?.consumedBy ?? []),
  ]

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 pb-24 lg:px-8">
      <p className="mono text-xs text-[var(--muted)]">
        <Link to={kind === "plataforma" ? "/plataforma" : "/desafios"} className="text-[var(--muted)]">
          {kind === "plataforma" ? "Lumen" : "Desafios"}
        </Link>{" "}
        / {challenge.id}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Pill>{bandLabel(challenge.level, challenge.rung)}</Pill>
        <Pill>{levelLabel[challenge.level]}</Pill>
        <Pill>{kindLabel[kind]}</Pill>
        <LangBadge lang={langs as Lang} />
        <StandaloneBadge />
        <SeenToggle bucket="challenges" id={challenge.id} />
      </div>
      <h1 className="display mt-4 text-4xl leading-[0.95]">{challenge.title}</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">{challenge.domain}</p>
      {challenge.platform ? (
        <p className="mono mt-2 text-xs text-[var(--muted)]">
          Serviço <strong className="text-[var(--ink)]">{challenge.platform.service}</strong> ·{" "}
          {challenge.platform.stack}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <ComplexityBar value={challenge.complexity} />
        <span className="mono text-xs text-[var(--muted)]">{challenge.estimatedHours}</span>
        <span className="mono text-xs text-[var(--muted)]">
          {challenge.languages.map((item) => langLabel[item]).join(" · ")}
        </span>
      </div>

      {kind === "plataforma" ? (
        <aside className="mt-6 rounded-2xl border border-[var(--accent)] bg-[var(--accent-soft)] p-4">
          <p className="kicker">Independente</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">{lumen.rule}</p>
        </aside>
      ) : null}

      <section className="mt-8">
        <h2 className="font-sans text-sm font-semibold tracking-wide">Contexto</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">{challenge.problem}</p>
      </section>

      {challenge.trigger ? (
        <section className="mt-8">
          <h2 className="font-sans text-sm font-semibold tracking-wide">Gatilho</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">{challenge.trigger}</p>
        </section>
      ) : null}

      {challenge.hops && challenge.hops.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-sans text-sm font-semibold tracking-wide">
            Fluxo — quem dispara o quê
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Protocolo em cada hop. Se não aparece Kafka/gRPC/fila, não invente.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-[11px] uppercase tracking-wide text-[var(--muted)]">
                  <th className="py-2 pr-3 font-normal">#</th>
                  <th className="py-2 pr-3 font-normal">Quem</th>
                  <th className="py-2 pr-3 font-normal">Faz</th>
                  <th className="py-2 pr-3 font-normal">Protocolo</th>
                  <th className="py-2 font-normal">Alvo</th>
                </tr>
              </thead>
              <tbody>
                {challenge.hops.map((hop) => (
                  <tr key={hop.step} className="border-b border-[var(--line)] align-top">
                    <td className="mono py-2 pr-3 text-[var(--muted)]">{hop.step}</td>
                    <td className="py-2 pr-3">{hop.who}</td>
                    <td className="py-2 pr-3 text-[var(--muted)]">{hop.does}</td>
                    <td className="py-2 pr-3">
                      <span className="mono text-[11px] text-[var(--accent)]">
                        {protocolLabel[hop.protocol]}
                      </span>
                    </td>
                    <td className="mono py-2 text-xs text-[var(--muted)]">{hop.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {challenge.rules && challenge.rules.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-sans text-sm font-semibold tracking-wide">Regras de negócio</h2>
          <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-[var(--muted)]">
            {challenge.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {challenge.contracts && challenge.contracts.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-sans text-sm font-semibold tracking-wide">
            Contratos (request / response)
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            O feliz tem que bater neste JSON. Erro no formato Lumen.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {challenge.contracts.map((contract) => (
              <article key={`${contract.method}-${contract.path}-${contract.name}`} className="card p-4">
                <p className="mono text-[11px] text-[var(--accent)]">
                  {contract.method} {contract.path}
                </p>
                <h3 className="mt-1 font-sans text-sm font-semibold">{contract.name}</h3>
                {contract.auth ? (
                  <p className="mt-1 text-xs text-[var(--muted)]">Auth: {contract.auth}</p>
                ) : null}
                {contract.request ? (
                  <>
                    <p className="mono mt-3 text-[10px] uppercase text-[var(--muted)]">Request</p>
                    <pre className="mt-1 overflow-x-auto rounded-lg bg-[var(--bg)] p-3 text-xs">
                      {contract.request}
                    </pre>
                  </>
                ) : null}
                {contract.response ? (
                  <>
                    <p className="mono mt-3 text-[10px] uppercase text-[var(--muted)]">Response</p>
                    <pre className="mt-1 overflow-x-auto rounded-lg bg-[var(--bg)] p-3 text-xs">
                      {contract.response}
                    </pre>
                  </>
                ) : null}
                {contract.errors && contract.errors.length > 0 ? (
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    Erros: {contract.errors.join(" · ")}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {challenge.mocks && challenge.mocks.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-sans text-sm font-semibold tracking-wide">
            Mocks — o que stubar (feliz e erro)
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Copie estes JSON no WireMock, httptest, fila ou tópico. Não precisa do serviço vizinho no ar.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {challenge.mocks.map((mock) => (
              <article key={`${mock.neighbor}-${mock.endpoint}`} className="card p-4">
                <p className="mono text-[11px] text-[var(--accent)]">
                  {protocolLabel[mock.protocol]} · {mock.direction}
                </p>
                <h3 className="mt-1 font-sans text-sm font-semibold">{mock.neighbor}</h3>
                <p className="mono mt-1 text-xs text-[var(--muted)]">{mock.endpoint}</p>
                {mock.timeout ? (
                  <p className="mt-1 text-xs text-[var(--muted)]">Timeout: {mock.timeout}</p>
                ) : null}
                {mock.request ? (
                  <>
                    <p className="mono mt-3 text-[10px] uppercase text-[var(--muted)]">Request / payload</p>
                    <pre className="mt-1 overflow-x-auto rounded-lg bg-[var(--bg)] p-3 text-xs">
                      {mock.request}
                    </pre>
                  </>
                ) : null}
                <div className="mt-4 flex flex-col gap-3">
                  {mock.cases.map((item) => (
                    <div key={item.name} className="rounded-xl border border-[var(--line)] p-3">
                      <p className="font-sans text-sm font-semibold">{item.name}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{item.when}</p>
                      {item.status !== undefined ? (
                        <p className="mono mt-1 text-[11px] text-[var(--accent)]">HTTP {item.status}</p>
                      ) : null}
                      {item.headers ? (
                        <p className="mono mt-1 text-[11px] text-[var(--muted)]">{item.headers}</p>
                      ) : null}
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-[var(--bg)] p-3 text-xs">
                        {item.body}
                      </pre>
                      <p className="mt-2 text-xs leading-relaxed text-[var(--ink)]">
                        O seu serviço: {item.youDo}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {challenge.diagram ? (
        <section className="mt-8">
          <h2 className="font-sans text-sm font-semibold tracking-wide">Fluxo</h2>
          <div className="mt-3">
            <MermaidBlock chart={challenge.diagram} />
          </div>
        </section>
      ) : null}

      {challenge.expected && challenge.expected.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-sans text-sm font-semibold tracking-wide">
            Resultado final (o que tem que existir)
          </h2>
          <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-[var(--muted)]">
            {challenge.expected.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {neighbors.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-sans text-sm font-semibold tracking-wide">
            Peças da plataforma (mock)
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Não são pré-requisitos. Use o JSON dessas fichas no WireMock / httptest / JWT fake.
            Ligar os serviços de verdade é o extra do fim.
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {(challenge.platform?.dependsOn ?? []).map((dep) => (
              <p key={dep} className="text-sm">
                Mock de{" "}
                <Link to={`/desafios/${dep}`}>{challengeById[dep]?.title ?? dep}</Link>
              </p>
            ))}
            {(challenge.platform?.consumedBy ?? []).map((next) => (
              <p key={next} className="text-sm">
                Contrato útil em{" "}
                <Link to={`/desafios/${next}`}>{challengeById[next]?.title ?? next}</Link>
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="font-sans text-sm font-semibold tracking-wide">Critérios de aceite</h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {done}/{challenge.criteria.length} nesta sessão. “Já vi” fica no browser.
        </p>
        <ul className="mt-3 m-0 list-none p-0">
          {challenge.criteria.map((item, index) => (
            <li key={item} className="border-b border-[var(--line)] py-2">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
                <input
                  type="checkbox"
                  checked={Boolean(checked[index])}
                  onChange={() =>
                    setChecked((current) => ({ ...current, [index]: !current[index] }))
                  }
                  className="mt-1"
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <p className="kicker">Rubrica · o suficiente</p>
          <ul className="mt-2 list-disc pl-4 text-sm leading-relaxed text-[var(--muted)]">
            {(challenge.rubric?.enough ?? defaultRubric.enough).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <p className="kicker">Rubrica · forte</p>
          <ul className="mt-2 list-disc pl-4 text-sm leading-relaxed text-[var(--muted)]">
            {(challenge.rubric?.strong ?? defaultRubric.strong).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-sans text-sm font-semibold tracking-wide">Dicas</h2>
        <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-[var(--muted)]">
          {challenge.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      {relatedTopics.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-sans text-sm font-semibold tracking-wide">Tópicos</h2>
          <ul className="mt-2 flex list-none flex-col gap-1 p-0">
            {relatedTopics.map((topic) => (
              <li key={topic.id}>
                <Link to={`/roadmap?topic=${topic.id}&level=${topic.level}`} className="text-sm">
                  {topic.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="font-sans text-sm font-semibold tracking-wide">Recursos da ficha</h2>
        <div className="mt-2">
          <ResourceList ids={challenge.resourceIds} />
        </div>
      </section>
    </main>
  )
}
