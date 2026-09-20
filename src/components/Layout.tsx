import { NavLink, Outlet } from "react-router-dom"
import { challenges } from "../data/challenges"
import { topics } from "../data/topics"
import { useProgress } from "../progress"

const links = [
  { to: "/", label: "Início", short: "Home", end: true, n: "00" },
  { to: "/plataforma", label: "Lumen", short: "Lumen", end: false, n: "01" },
  { to: "/mental", label: "Mapa", short: "Mapa", end: false, n: "02" },
  { to: "/roadmap", label: "Colunas", short: "Cols", end: false, n: "03" },
  { to: "/desafios", label: "Desafios", short: "Labs", end: false, n: "04" },
  { to: "/ia", label: "IA e MCP", short: "IA", end: false, n: "05" },
  { to: "/biblioteca", label: "Biblioteca", short: "Libs", end: false, n: "06" },
]

export function Layout() {
  const { topics: seenTopics, challenges: seenChallenges } = useProgress()
  const topicSeen = [...seenTopics].filter((id) => topics.some((topic) => topic.id === id)).length
  const challengeSeen = [...seenChallenges].filter((id) =>
    challenges.some((challenge) => challenge.id === id),
  ).length

  return (
    <div className="shell">
      <aside className="rail">
        <NavLink to="/" end className="no-underline">
          <p className="kicker">JR → Staff · 2026</p>
          <p className="display mt-2 text-2xl leading-none text-[var(--ink)]">Roadmap</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Java 25 · Go 1.26</p>
        </NavLink>
        <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-item ${isActive ? "is-active" : ""}`}
            >
              <span className="mono text-[10px] text-[var(--accent)]">{link.n}</span>
              <span className="text-sm">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <p className="mono text-[10px] leading-relaxed text-[var(--muted)]">
          Já vi: {topicSeen}/{topics.length} tópicos · {challengeSeen}/{challenges.length}{" "}
          desafios. Salvo neste browser.
        </p>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--line)] bg-[var(--bg)]/80 px-4 py-3 backdrop-blur-md lg:hidden">
          <NavLink to="/" end className="display text-lg text-[var(--ink)] no-underline">
            Roadmap
          </NavLink>
          <span className="mono text-[10px] text-[var(--muted)]">JR → STAFF</span>
        </header>
        <Outlet />
        <nav className="dock" aria-label="Atalhos">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `dock-item ${isActive ? "is-active" : ""}`}
            >
              <span className="mono text-[9px]">{link.n}</span>
              {link.short}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
