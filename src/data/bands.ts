import type { Level, Rung } from "./types"

export interface Band {
  id: string
  level: Level
  rung: Rung
  title: string
  study: string[]
  expect: string[]
  challengeIds: string[]
}

/** Faixas da plataforma Lumen. Cada desafio da faixa sobe sozinho (mock dos hops). */
export const bands: Band[] = [
  {
    id: "jr1",
    level: "junior",
    rung: 1,
    title: "Junior 1 — um serviço sozinho, contrato certo",
    study: [
      "HTTP, JSON, status, Postgres, SQL, GitHub, Java 25 ou Go 1.26",
      "Testes que falham. Google Eng Practices + review",
    ],
    expect: [
      "Identity (Java) e Catalog (Go) sobem cada um no seu repo.",
      "Mock: nenhum dos dois chama o outro neste nível.",
      "Dinheiro em centavos. UUID. Erro no formato Lumen.",
    ],
    challengeIds: ["lum-jr1-identity", "lum-jr1-catalog"],
  },
  {
    id: "jr2",
    level: "junior",
    rung: 2,
    title: "Junior 2 — o pedido fala com os outros",
    study: [
      "gRPC interno (deadline, status codes). REST só na borda.",
      "Idempotência, FK, transação, EXPLAIN básico.",
    ],
    expect: [
      "Orders chama Catalog.GetProduct e Inventory.Reserve por gRPC (mocks no teste).",
      "Se o estoque recusa, o pedido não fica ‘placed’.",
      "Buyer continua falando HTTP. gRPC não vaza para a internet.",
    ],
    challengeIds: ["lum-jr2-inventory", "lum-jr2-orders"],
  },
  {
    id: "jr3",
    level: "junior",
    rung: 3,
    title: "Junior 3 — a malha local",
    study: [
      "Docker Compose, health, logs, resiliência contra API pública",
      "public-apis + circuit breaker. Code review de verdade.",
    ],
    expect: [
      "Este repo sobe sozinho: compose do que ESTE desafio precisa (pode ser stubs).",
      "Se você já tiver os outros serviços, o mesmo compose encaixa — extra, não entrada.",
      "Uma dependência externa (clima) falha sem derrubar o pedido.",
    ],
    challengeIds: ["lum-jr3-mesh"],
  },
  {
    id: "pl1",
    level: "pleno",
    rung: 1,
    title: "Pleno 1 — dinheiro e cache",
    study: [
      "Idempotency-Key, Redis cache-aside, RFC 8725",
      "Redis in Action caps. 1–2. roadmap.sh/redis",
    ],
    expect: [
      "Payments: gateway fake + mock do Orders. Cache: mesmo contrato GET produto.",
      "Retry do client não cria dois débitos.",
    ],
    challengeIds: ["lum-pl1-payments", "lum-pl1-cache"],
  },
  {
    id: "pl2",
    level: "pleno",
    rung: 2,
    title: "Pleno 2 — filas e eventos",
    study: [
      "RabbitMQ DLX, Kafka producer/consumer, Fowler event-driven",
      "Maarek + Kafka Definitive Guide. Notification ≠ sourcing.",
    ],
    expect: [
      "Notify consome comando SendMail no Rabbit — injete na fila no teste, sem o Payments real.",
      "PedidoCriado no Kafka com chave = sellerId (publisher no seu repo).",
    ],
    challengeIds: ["lum-pl2-notify", "lum-pl2-kafka"],
  },
  {
    id: "pl3",
    level: "pleno",
    rung: 3,
    title: "Pleno 3 — borda e operação",
    study: [
      "GraphQL + DataLoader, OpenTelemetry, OIDC",
      "Observability Engineering. Spring GraphQL / gqlgen.",
    ],
    expect: [
      "BFF GraphQL com DataLoader; Catalog/Orders/Identity mockados.",
      "Trace do GET lento com 3 spans — hops podem ser stubs instrumentados.",
    ],
    challengeIds: ["lum-pl3-bff", "lum-pl3-otel"],
  },
  {
    id: "sr1",
    level: "senior",
    rung: 1,
    title: "Senior 1 — consistência e busca",
    study: [
      "Outbox, saga, DDIA 7–9, Richardson cap. 4, Elastic 8/9 ou FTS",
      "system-design-primer + Xu vol. 1 (feed/search).",
    ],
    expect: [
      "Outbox no Payments deste repo: INSERT payment + outbox na mesma tx.",
      "Busca no catálogo deste repo. Catalog real não é pré-requisito.",
    ],
    challengeIds: ["lum-sr1-outbox", "lum-sr1-search"],
  },
  {
    id: "sr2",
    level: "senior",
    rung: 2,
    title: "Senior 2 — runtime e barra",
    study: [
      "K8s limits, SLO, SRE book, Terraform o bastante",
      "Newman strangler se extrair um módulo.",
    ],
    expect: [
      "Dois deploys (um Java, um Go) — podem ser os serviços DESTE desafio, não a malha inteira.",
      "SLO escrito do checkout + o que NÃO está no desenho.",
    ],
    challengeIds: ["lum-sr2-runtime"],
  },
  {
    id: "st1",
    level: "staff",
    rung: 1,
    title: "Staff — o problema certo",
    study: [
      "lalitm find-problems, Larson Staff Engineer, laws of SE, post-mortems",
    ],
    expect: [
      "RFC de dono do preço. Só documento — não precisa da malha no ar.",
      "Não escreve mais um CRUD — move o sistema.",
    ],
    challengeIds: ["lum-st-rfc"],
  },
]
