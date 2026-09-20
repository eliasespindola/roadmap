import type { Challenge, Lang, Level, Pillar, Relevance, ResourceType } from "./types"

export const LEVELS: Level[] = ["junior", "pleno", "senior", "staff"]

export const PILLARS: Pillar[] = [
  "fundamentos",
  "algoritmos",
  "linguagem",
  "api",
  "dados",
  "mensageria",
  "arquitetura",
  "seguranca",
  "observabilidade",
  "cloud",
  "engenharia",
  "ia",
  "lideranca",
]

export const levelLabel: Record<Level, string> = {
  junior: "Junior",
  pleno: "Pleno",
  senior: "Senior",
  staff: "Staff",
}

export const levelBlurb: Record<Level, string> = {
  junior: "Base + um serviço pequeno: GitHub, SQL, algoritmos, testes e revisão.",
  pleno: "O serviço sobrevive a carga, falha parcial, CI e o passar do tempo.",
  senior: "Desenhar o sistema — consistência, evolução e operação.",
  staff: "Achar o problema certo e mover a organização.",
}

export const pillarLabel: Record<Pillar, string> = {
  fundamentos: "Fundamentos",
  algoritmos: "Algoritmos",
  linguagem: "Linguagem",
  api: "APIs",
  dados: "Dados",
  mensageria: "Mensageria",
  arquitetura: "Arquitetura",
  seguranca: "Segurança",
  observabilidade: "Observabilidade",
  cloud: "Cloud & runtime",
  engenharia: "Engenharia",
  ia: "IA",
  lideranca: "Liderança",
}

export const langLabel: Record<Lang, string> = {
  java: "Java",
  go: "Go",
  ambos: "Java + Go",
}

export const relevanceLabel: Record<Relevance, string> = {
  essencial: "Essencial 2026",
  complementar: "Complementar",
  historico: "Histórico",
}

export const typeLabel: Record<ResourceType, string> = {
  doc: "Doc",
  artigo: "Artigo",
  livro: "Livro",
  curso: "Curso",
  repo: "Repo",
  rfc: "RFC",
  video: "Vídeo",
}

export const complexityLabel: Record<Challenge["complexity"], string> = {
  1: "Introdução",
  2: "Fundação",
  3: "Produção",
  4: "Sistema",
  5: "Organização",
}

export const pillarDot: Record<Pillar, string> = {
  fundamentos: "#57534e",
  algoritmos: "#c2410c",
  linguagem: "#b45309",
  api: "#0f4c5c",
  dados: "#1d4ed8",
  mensageria: "#7c3aed",
  arquitetura: "#0f766e",
  seguranca: "#9a3412",
  observabilidade: "#a16207",
  cloud: "#334155",
  engenharia: "#44403c",
  ia: "#be185d",
  lideranca: "#0e7490",
}

export function matchesLang(topicLang: Lang, filter: "all" | "java" | "go"): boolean {
  if (filter === "all") return true
  if (topicLang === "ambos") return true
  return topicLang === filter
}

export const protocolLabel: Record<
  import("./types").HopProtocol,
  string
> = {
  http: "HTTP",
  grpc: "gRPC",
  graphql: "GraphQL",
  kafka: "Kafka",
  rabbit: "RabbitMQ",
  redis: "Redis",
  postgres: "Postgres",
  interno: "In-process",
}

export const kindLabel: Record<NonNullable<Challenge["kind"]>, string> = {
  plataforma: "Plataforma Lumen",
  laboratorio: "Laboratório",
}

export function bandLabel(level: Level, rung?: Challenge["rung"]): string {
  if (!rung) return levelLabel[level]
  const prefix: Record<Level, string> = {
    junior: "JR",
    pleno: "PL",
    senior: "SR",
    staff: "ST",
  }
  return `${prefix[level]} ${rung}`
}

export const defaultRubric = {
  enough: [
    "Critérios de aceite cobertos",
    "README com como rodar do zero",
    "Repo isolado: sobe do zero (hops mockados se for Lumen)",
  ],
  strong: [
    "Testes no caminho feliz e no erro",
    "Commits atômicos, sem segredo no git",
    "Você explica o diff sem olhar o chat da IA",
  ],
}
