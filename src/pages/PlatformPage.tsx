import { Link } from "react-router-dom"
import { ChallengeCard } from "../components/ChallengeCard"
import { MermaidBlock } from "../components/MermaidBlock"
import { PageHeader } from "../components/PageHeader"
import { bands } from "../data/bands"
import { bandLabel, levelLabel } from "../data/labels"
import { lumen, lumenCheckoutDiagram, lumenDiagram } from "../data/lumen"

export function PlatformPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 lg:px-8">
      <PageHeader kicker="Plataforma" title={lumen.name}>
        {lumen.blurb} Labs soltos continuam em <Link to="/desafios">Desafios</Link>.
      </PageHeader>

      <section className="mt-8 card border-[var(--accent)] p-5">
        <p className="kicker">Regra de ouro</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]">{lumen.rule}</p>
        <ul className="mt-3 list-disc pl-5 text-sm leading-relaxed text-[var(--muted)]">
          <li>
            Quer fazer só Orders? Mock JWT, mock gRPC GetProduct, mock gRPC Reserve. Testes
            passam sem Identity/Catalog/Inventory no ar.
          </li>
          <li>
            No fim da trilha, se ligar os repos de verdade, você tem a feira completa. Isso é
            o prêmio, não a entrada.
          </li>
        </ul>
      </section>

      <section className="mt-8 card p-5">
        <p className="kicker">Checkout feliz — gatilho até o e-mail</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Borda: HTTP/GraphQL. Interno síncrono: gRPC. Depois do placed: Kafka (evento). Depois
          do captured: Rabbit (comando de e-mail). JWT local — Identity não entra no checkout.
          gRPC não vai para a internet. Cada hop está mockado na ficha.
        </p>
        <div className="mt-4">
          <MermaidBlock chart={lumenCheckoutDiagram} />
        </div>
      </section>

      <section className="mt-8 card p-5">
        <p className="kicker">Malha no fim da trilha</p>
        <div className="mt-4">
          <MermaidBlock chart={lumenDiagram} />
        </div>
      </section>

      <section className="mt-8 card p-5">
        <p className="kicker">Contrato de casa</p>
        <ul className="mt-3 list-disc pl-5 text-sm leading-relaxed text-[var(--muted)]">
          {lumen.conventions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mono mt-4 text-xs text-[var(--muted)]">Erro padrão</p>
        <pre className="mt-2 overflow-x-auto rounded-xl bg-[var(--bg)] p-3 text-xs">
          {lumen.errorShape}
        </pre>
      </section>

      <section className="mt-12">
        <h2 className="display text-3xl">Faixas JR 1 → Staff</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          O que estudar e o que se espera. Cada faixa tem serviços da Lumen. Cada ficha sobe
          sozinha.
        </p>
        <ol className="mt-6 m-0 flex list-none flex-col gap-5 p-0">
          {bands.map((band) => (
            <li key={band.id} className="card p-5">
              <p className="kicker">
                {bandLabel(band.level, band.rung)} · {levelLabel[band.level]}
              </p>
              <h3 className="display mt-2 text-2xl">{band.title}</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="font-sans text-sm font-semibold">Estudar</p>
                  <ul className="mt-2 list-disc pl-4 text-sm text-[var(--muted)]">
                    {band.study.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-sans text-sm font-semibold">Esperado no fim da faixa</p>
                  <ul className="mt-2 list-disc pl-4 text-sm text-[var(--muted)]">
                    {band.expect.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {band.challengeIds.map((id) => (
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
