import { Link } from "react-router-dom"
import { ChallengeCard } from "../components/ChallengeCard"
import { PageHeader } from "../components/PageHeader"
import { ResourceList } from "../components/ResourceList"
import { aiLessons } from "../data/aiLessons"
import { SeenToggle } from "../components/SeenToggle"

export function AiPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-24 lg:px-8">
      <PageHeader kicker="04 · IA" title="IA, agentes e MCP">
        Seis blocos, na ordem. Sem pressa de “construir um agente”. O objetivo é você conversar
        com o time em 2026 sem confundir modelo, ferramenta e receita.
      </PageHeader>

      <ol className="mt-8 m-0 flex list-none flex-col gap-10 p-0">
        {aiLessons.map((lesson) => (
          <li key={lesson.id} id={lesson.id} className="scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="kicker">
                {String(lesson.order).padStart(2, "0")} / {String(aiLessons.length).padStart(2, "0")}
              </p>
              <SeenToggle bucket="lessons" id={lesson.id} />
            </div>
            <h2 className="display mt-2 text-2xl">{lesson.title}</h2>
            <p className="mt-2 text-sm font-medium text-[var(--ink)]">{lesson.summary}</p>
            <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-[var(--muted)]">
              {lesson.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-4 border-l-[3px] border-[var(--accent)] bg-[var(--accent-soft)]/40 px-4 py-3">
              <p className="mono text-[10px] uppercase tracking-wide text-[var(--accent)]">
                Leve daqui
              </p>
              <ul className="mt-2 list-disc pl-4 text-sm leading-relaxed text-[var(--ink)]">
                {lesson.remember.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {lesson.resourceIds.length > 0 ? (
              <div className="mt-4">
                <ResourceList ids={lesson.resourceIds} />
              </div>
            ) : null}
            {lesson.challengeIds.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {lesson.challengeIds.map((id) => (
                  <ChallengeCard key={id} id={id} compact />
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      <section className="mt-12 card p-5">
        <h2 className="font-sans text-sm font-semibold">Ordem sugerida</h2>
        <ol className="mt-3 list-decimal pl-5 text-sm leading-relaxed text-[var(--muted)]">
          <li>Leia os seis blocos (uma sentada).</li>
          <li>
            Faça o desafio{" "}
            <Link to="/desafios/ch-ai-glossario">Explicar LLM, agente, MCP e skill</Link>.
          </li>
          <li>
            Escreva uma{" "}
            <Link to="/desafios/ch-ai-skill">skill de review</Link> no git.
          </li>
          <li>
            Ligue um{" "}
            <Link to="/desafios/ch-ai-mcp">MCP só de leitura</Link> e descreva o que aconteceu.
          </li>
          <li>
            Faça o{" "}
            <Link to="/desafios/ch-ai-pr-review">review de um PR escrito por agente</Link>.
          </li>
        </ol>
      </section>
    </main>
  )
}
