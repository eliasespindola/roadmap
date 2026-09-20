export type Level = "junior" | "pleno" | "senior" | "staff"

export type Pillar =
  | "fundamentos"
  | "algoritmos"
  | "linguagem"
  | "api"
  | "dados"
  | "mensageria"
  | "arquitetura"
  | "seguranca"
  | "observabilidade"
  | "cloud"
  | "engenharia"
  | "ia"
  | "lideranca"

export type Lang = "java" | "go" | "ambos"

export type Rung = 1 | 2 | 3

export type ChallengeKind = "plataforma" | "laboratorio"

export type HopProtocol =
  | "http"
  | "grpc"
  | "graphql"
  | "kafka"
  | "rabbit"
  | "redis"
  | "postgres"
  | "interno"

export interface FlowHop {
  step: number
  who: string
  does: string
  protocol: HopProtocol
  target: string
}

export interface MockCase {
  name: string
  when: string
  status?: number
  headers?: string
  body: string
  youDo: string
}

export interface NeighborMock {
  neighbor: string
  protocol: HopProtocol
  direction: "você chama" | "você publica" | "você consome" | "eles chamam você"
  endpoint: string
  timeout?: string
  request?: string
  cases: MockCase[]
}

export interface HttpContract {
  name: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  auth?: string
  request?: string
  response?: string
  errors?: string[]
}

export type ResourceType =
  | "doc"
  | "artigo"
  | "livro"
  | "curso"
  | "repo"
  | "rfc"
  | "video"

export type Relevance = "essencial" | "complementar" | "historico"

export interface Resource {
  id: string
  title: string
  url?: string
  type: ResourceType
  relevance: Relevance
  note?: string
}

export interface Topic {
  id: string
  title: string
  level: Level
  pillar: Pillar
  languages: Lang
  summary: string
  why2026: string
  resourceIds: string[]
  challengeIds: string[]
  optional?: boolean
  rung?: Rung
}

export interface Challenge {
  id: string
  title: string
  level: Level
  complexity: 1 | 2 | 3 | 4 | 5
  languages: ("java" | "go")[]
  estimatedHours: string
  domain: string
  problem: string
  criteria: string[]
  tips: string[]
  topicIds: string[]
  resourceIds: string[]
  rubric?: {
    enough: string[]
    strong: string[]
  }
  kind?: ChallengeKind
  rung?: Rung
  /** Domínio compartilhado opcional. dependsOn = contratos para mockar, nunca pré-requisito. */
  platform?: {
    product: string
    service: string
    stack: string
    dependsOn: string[]
    consumedBy: string[]
  }
  rules?: string[]
  contracts?: HttpContract[]
  diagram?: string
  expected?: string[]
  trigger?: string
  hops?: FlowHop[]
  mocks?: NeighborMock[]
}

export interface Recommendation {
  id: string
  resourceId: string
  kind: "livro" | "curso"
  audience: Level[]
  whyMarket: string
  howToUse: string
}

export interface AiLesson {
  id: string
  order: number
  title: string
  summary: string
  paragraphs: string[]
  remember: string[]
  resourceIds: string[]
  challengeIds: string[]
}

export type LangFilter = "all" | "java" | "go"
export type LevelFilter = "all" | Level
export type PillarFilter = "all" | Pillar
export type ComplexityFilter = "all" | Challenge["complexity"]
