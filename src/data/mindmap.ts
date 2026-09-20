import type { Level } from "./types"

export interface MindNode {
  id: string
  title: string
  topicId?: string
  children?: MindNode[]
}

export const mindRoot: MindNode = {
  id: "root",
  title: "Backend JR → Staff",
  children: [
    {
      id: "base",
      title: "Base",
      children: [
        { id: "n-github", title: "Git e GitHub", topicId: "jr-github" },
        { id: "n-linux", title: "Linux / terminal", topicId: "jr-linux" },
        { id: "n-os", title: "Processo e memória", topicId: "jr-os" },
        { id: "n-http", title: "TCP e HTTP", topicId: "jr-http-tcp" },
        { id: "n-dns", title: "DNS e TLS", topicId: "jr-dns-tls" },
        { id: "n-lgpd", title: "LGPD / dado pessoal", topicId: "jr-lgpd" },
      ],
    },
    {
      id: "algo",
      title: "Algoritmos",
      children: [
        { id: "n-bigo", title: "Big-O", topicId: "jr-bigo" },
        { id: "n-est", title: "Array, hash, fila, stack", topicId: "jr-estruturas" },
        { id: "n-sort", title: "Busca e ordenação", topicId: "jr-busca-ordenacao" },
        { id: "n-grafos", title: "Árvores e grafos", topicId: "pl-grafos" },
        { id: "n-hashing", title: "Hash consistente", topicId: "sr-hashing" },
        { id: "n-ent", title: "Entrevista vs emprego", topicId: "pl-entrevista" },
        { id: "n-barra", title: "Barra no time", topicId: "st-barra-base" },
      ],
    },
    {
      id: "dados",
      title: "Banco e SQL",
      children: [
        { id: "n-rel", title: "Modelo relacional", topicId: "jr-relacional" },
        { id: "n-sql", title: "SELECT e JOIN", topicId: "jr-sql-joins" },
        { id: "n-pg", title: "Postgres + EXPLAIN", topicId: "jr-postgres" },
        { id: "n-tx", title: "Transações", topicId: "pl-transacoes" },
        { id: "n-win", title: "Window / CTE", topicId: "pl-sql-window" },
        { id: "n-mvcc", title: "MVCC e locks", topicId: "pl-mvcc" },
        { id: "n-mig", title: "Migrations", topicId: "pl-migrations" },
        { id: "n-zd", title: "Expand/contract", topicId: "sr-zero-downtime" },
        { id: "n-sqlc", title: "sqlc", topicId: "pl-sqlc-pratica" },
        { id: "n-n1", title: "N+1 e pool", topicId: "pl-nplus1" },
        { id: "n-repl", title: "Replicação", topicId: "sr-replicacao" },
        { id: "n-ddia", title: "DDIA", topicId: "sr-ddia" },
      ],
    },
    {
      id: "langs",
      title: "Java e Go",
      children: [
        { id: "n-java", title: "Java 25", topicId: "jr-java-25" },
        { id: "n-boot", title: "Spring Boot 4", topicId: "jr-spring-boot" },
        { id: "n-go", title: "Go 1.26", topicId: "jr-go-126" },
        { id: "n-gohttp", title: "HTTP em Go", topicId: "jr-go-http" },
        { id: "n-build", title: "Maven / go.mod", topicId: "jr-build" },
        { id: "n-conc", title: "Virtual threads / synctest", topicId: "pl-concorrencia" },
      ],
    },
    {
      id: "eng",
      title: "GitHub, CI, testes",
      children: [
        { id: "n-test", title: "Testes que falham", topicId: "jr-testes" },
        { id: "n-review", title: "Code review", topicId: "jr-git-review" },
        { id: "n-docker", title: "Docker", topicId: "jr-docker" },
        { id: "n-ci", title: "GitHub Actions", topicId: "pl-actions" },
        { id: "n-cfg", title: "12-factor / config", topicId: "pl-config" },
        { id: "n-jobs", title: "Jobs / cron", topicId: "pl-jobs" },
        { id: "n-port", title: "Portfólio GitHub", topicId: "jr-portfolio" },
        { id: "n-tc", title: "Testcontainers", topicId: "pl-testcontainers" },
      ],
    },
    {
      id: "api",
      title: "APIs e auth",
      children: [
        { id: "n-rest", title: "REST", topicId: "jr-rest" },
        { id: "n-val", title: "Validação / 422", topicId: "jr-validacao" },
        { id: "n-oa", title: "OpenAPI", topicId: "pl-openapi" },
        { id: "n-idemp", title: "Idempotência / dinheiro", topicId: "pl-idempotencia" },
        { id: "n-wh", title: "Webhooks HMAC", topicId: "pl-webhooks" },
        { id: "n-compat", title: "v1 / v2 compat", topicId: "pl-api-compat" },
        { id: "n-auth", title: "Sessão e JWT", topicId: "jr-auth" },
        { id: "n-jwt", title: "JWT RFC 8725", topicId: "pl-jwt" },
        { id: "n-oidc", title: "OIDC / IdP", topicId: "pl-oidc" },
        { id: "n-gql", title: "GraphQL", topicId: "pl-graphql" },
        { id: "n-page", title: "Paginação / 429", topicId: "pl-ratelimit" },
        { id: "n-up", title: "Upload / signed URL", topicId: "pl-uploads" },
        { id: "n-grpc", title: "gRPC", topicId: "pl-grpc-pratica" },
        { id: "n-buf", title: "Protobuf / Buf", topicId: "sr-buf" },
      ],
    },
    {
      id: "run",
      title: "Produção",
      children: [
        { id: "n-redis", title: "Redis / cache", topicId: "pl-redis" },
        { id: "n-rb", title: "RabbitMQ / DLX", topicId: "pl-rabbitmq" },
        { id: "n-kf", title: "Kafka", topicId: "pl-kafka-intro" },
        { id: "n-res", title: "Resiliência", topicId: "pl-resiliencia" },
        { id: "n-logs", title: "Logs / PII", topicId: "jr-logs" },
        { id: "n-otel", title: "OpenTelemetry", topicId: "pl-otel-pratica" },
        { id: "n-prof", title: "Profiling", topicId: "sr-profiling" },
        { id: "n-k6", title: "k6", topicId: "pl-k6" },
        { id: "n-iac", title: "IAM / Terraform", topicId: "sr-iac" },
        { id: "n-k8s", title: "Kubernetes", topicId: "sr-k8s" },
        { id: "n-sre", title: "SLOs / SRE", topicId: "sr-sre" },
      ],
    },
    {
      id: "arch",
      title: "Arquitetura",
      children: [
        { id: "n-hex", title: "Hexagonal", topicId: "pl-hexagonal" },
        { id: "n-ev", title: "Event-driven", topicId: "pl-events" },
        { id: "n-es", title: "Event sourcing", topicId: "sr-event-sourcing" },
        { id: "n-out", title: "Outbox / saga", topicId: "sr-outbox-saga" },
        { id: "n-str", title: "Strangler", topicId: "sr-strangler" },
        { id: "n-sd", title: "System design", topicId: "sr-system-design" },
      ],
    },
    {
      id: "ia",
      title: "IA",
      children: [
        { id: "n-iapar", title: "IA como par", topicId: "jr-ia" },
        { id: "n-mcp", title: "MCP e skills", topicId: "jr-mcp" },
        { id: "n-revia", title: "Review com skill", topicId: "pl-ia-review" },
        { id: "n-iaorg", title: "IA no time", topicId: "st-ia-org" },
      ],
    },
    {
      id: "staff",
      title: "Staff",
      children: [
        { id: "n-find", title: "Achar o problema", topicId: "st-find-problems" },
        { id: "n-rfc", title: "RFC / ADR", topicId: "st-rfc" },
        { id: "n-plat", title: "Golden path", topicId: "st-platform" },
        { id: "n-inc", title: "Incidente", topicId: "st-incident" },
      ],
    },
  ],
}

export interface PathStep {
  id: string
  phase: string
  level: Level
  title: string
  weeks: string
  blurb: string
  challengeIds: string[]
}

export const studyPath: PathStep[] = [
  {
    id: "p0",
    phase: "0",
    level: "junior",
    title: "Base",
    weeks: "semanas 1–4",
    blurb: "GitHub, terminal, HTTP, SQL, testes. Labs isolados. Depois a Lumen, serviço a serviço.",
    challengeIds: [
      "ch-jr-github",
      "ch-jr-linux",
      "ch-jr-http",
      "ch-jr-sql-joins",
      "ch-jr-testes",
    ],
  },
  {
    id: "p1",
    phase: "1",
    level: "junior",
    title: "Lumen — primeiros serviços",
    weeks: "semanas 5–12",
    blurb: "Identity, Catalog, Inventory, Orders. Cada um num repo. Hops = mock.",
    challengeIds: [
      "lum-jr1-identity",
      "lum-jr1-catalog",
      "lum-jr2-inventory",
      "lum-jr2-orders",
      "lum-jr3-mesh",
    ],
  },
  {
    id: "p2",
    phase: "2",
    level: "pleno",
    title: "Lumen — produção",
    weeks: "meses 3–8",
    blurb: "Payments, cache, fila, Kafka, BFF, trace. Independentes; contratos da plataforma.",
    challengeIds: [
      "lum-pl1-payments",
      "lum-pl1-cache",
      "lum-pl2-notify",
      "lum-pl2-kafka",
      "lum-pl3-bff",
      "lum-pl3-otel",
    ],
  },
  {
    id: "p3",
    phase: "3",
    level: "senior",
    title: "Lumen — sistema",
    weeks: "meses 8–18",
    blurb: "Outbox, busca, runtime. Ainda um repo por ficha.",
    challengeIds: [
      "lum-sr1-outbox",
      "lum-sr1-search",
      "lum-sr2-runtime",
    ],
  },
  {
    id: "p4",
    phase: "4",
    level: "staff",
    title: "Organização",
    weeks: "depois",
    blurb: "RFC do preço na Lumen (só documento) + golden path. IA no catálogo.",
    challengeIds: [
      "lum-st-rfc",
      "ch-st-golden-path",
      "ch-ai-glossario",
    ],
  },
]
