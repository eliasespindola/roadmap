import type { Topic } from "./types"

/** Buracos de emprego 2026 que a base + colunas ainda não cobriam com ficha própria. */
export const moreTopics: Topic[] = [
  {
    id: "jr-os",
    title: "Processo, thread, memória",
    level: "junior",
    pillar: "fundamentos",
    languages: "ambos",
    summary:
      "Processo vs thread vs goroutine vs virtual thread. Stack, heap, GC em Java, escape analysis em Go. CPU-bound vs I/O-bound. Sem isso “o container estourou memória” vira mistério.",
    why2026:
      "On-call JR começa no OOM e no throttle. Framework não ensina o que o kernel e o runtime estão fazendo.",
    resourceIds: ["linux-command", "java-25", "go-concurrency-faq"],
    challengeIds: ["ch-jr-os"],
  },
  {
    id: "jr-dns-tls",
    title: "DNS, TLS e o caminho do request",
    level: "junior",
    pillar: "fundamentos",
    languages: "ambos",
    summary:
      "Resolver nome → IP, TTL, CNAME. TLS handshake, certificado, SNI. O browser esconde; o curl -v e o dig não. HTTPS não é “cadeadinho”: é criptografia + identidade.",
    why2026:
      "Incidente clássico: certificado expirado, DNS errado, TLS 1.0 bloqueado. Junior que só testa no localhost descobre isso em sexta.",
    resourceIds: ["mdn-http", "rfc-9110", "dns-how"],
    challengeIds: ["ch-jr-http"],
  },
  {
    id: "jr-build",
    title: "Build: Maven, Gradle, go.mod",
    level: "junior",
    pillar: "engenharia",
    languages: "ambos",
    summary:
      "Dependência pinada, wrapper (mvnw/gradlew), go.mod + go.sum, reproduzir o build na CI. Sem isso o “funciona na minha máquina” é o produto.",
    why2026:
      "Supply chain (OWASP A03) começa no pom e no go.mod. Agente de IA inventa versão que não existe — você pinna.",
    resourceIds: ["maven-guide", "go-modules", "owasp-2025"],
    challengeIds: ["ch-jr-build"],
  },
  {
    id: "pl-openapi",
    title: "OpenAPI e contrato na borda",
    level: "pleno",
    pillar: "api",
    languages: "ambos",
    summary:
      "OpenAPI 3 descreve o HTTP público. Gere cliente/servidor ou escreva o spec primeiro. Breaking change é trabalho, não surpresa. JSON na borda; Protobuf no interno.",
    why2026:
      "Time de produto ainda entrega REST. Contrato versionado é o que evita o frontend adivinhar o payload.",
    resourceIds: ["openapi", "buf"],
    challengeIds: ["ch-pl-openapi"],
  },
  {
    id: "pl-idempotencia",
    title: "Idempotência e dinheiro",
    level: "pleno",
    pillar: "api",
    languages: "ambos",
    summary:
      "POST que cobra, reserva ou cria pedido precisa de chave de idempotência. Retry do cliente não pode duplicar efeito. Inteiro para centavos; nunca float. Relógio e fuso são parte do contrato.",
    why2026:
      "Pix, boleto e cartão no Brasil disparam retry. Pleno que “só faz o insert” gera estorno e ticket no Nubank da vida.",
    resourceIds: ["rfc-9110", "fowler-circuit-breaker", "lgpd-guia"],
    challengeIds: ["ch-pl-idempotency"],
  },
  {
    id: "pl-config",
    title: "Config, segredo e 12-factor",
    level: "pleno",
    pillar: "engenharia",
    languages: "ambos",
    summary:
      "Config por ambiente (env), segredo fora do git, build idêntico, logs em stdout. Feature flag não é if espalhado: tem dono, expiração e métrica.",
    why2026:
      "O 12-factor continua o checklist de serviço. Cloud só muda onde o segredo mora (SM, Vault), não a regra.",
    resourceIds: ["twelve-factor", "github-actions"],
    challengeIds: ["ch-pl-config"],
  },
  {
    id: "pl-grpc-pratica",
    title: "gRPC no interno",
    level: "pleno",
    pillar: "api",
    languages: "ambos",
    summary:
      "Protobuf + HTTP/2 entre serviços. Deadlines, metadata, codegen. Não exponha gRPC na internet pública sem gateway. Buf lint + breaking change no CI.",
    why2026:
      "Stack Go de emprego (TECH SCHOOL, times de plataforma) usa gRPC. Java fala via grpc-java. Contrato interno sem JSON a cada hop.",
    resourceIds: ["grpc", "buf", "udemy-backend-master"],
    challengeIds: ["ch-pl-grpc", "lum-jr2-orders", "lum-jr1-catalog"],
  },
  {
    id: "pl-entrevista",
    title: "Entrevista vs dia de trabalho",
    level: "pleno",
    pillar: "algoritmos",
    languages: "ambos",
    summary:
      "Entrevista pede medium em 45 min. O emprego pede JOIN, EXPLAIN, timeout e review. Treine os dois sem confundir: NeetCode não substitui o desafio de migration.",
    why2026:
      "Vaga 2026 ainda mistura LeetCode e system design. Quem só faz um dos lados trava na porta ou no on-call.",
    resourceIds: ["neetcode", "grokking-algorithms", "system-design-primer"],
    challengeIds: ["ch-pl-grafos", "ch-jr-bigo"],
  },
  {
    id: "sr-iac",
    title: "Nuvem o bastante: IAM e Terraform",
    level: "senior",
    pillar: "cloud",
    languages: "ambos",
    summary:
      "Uma cloud (AWS é a mais comum no BR). IAM least privilege, rede (VPC/SG), um banco gerenciado. Terraform (ou equivalente) versionado. Sem isso Kubernetes é slide.",
    why2026:
      "Senior desenha o caminho do request até o RDS. Certificação é opcional; IAM errado é incidente.",
    resourceIds: ["terraform", "twelve-factor"],
    challengeIds: ["ch-sr-iac"],
  },
  {
    id: "sr-profiling",
    title: "Profiling: pprof e async-profiler",
    level: "senior",
    pillar: "observabilidade",
    languages: "ambos",
    summary:
      "Trace mostra o hop lento. Profile mostra a função. Go: pprof. Java: async-profiler / JFR. Aloque menos, não “otimize o feeling”.",
    why2026:
      "Pergunta de Senior: “como você achou o n²?”. A resposta é o flamegraph, não a opinião.",
    resourceIds: ["pprof", "async-profiler", "otel"],
    challengeIds: ["ch-sr-pprof"],
  },
  {
    id: "pl-graphql",
    title: "GraphQL na borda (opcional)",
    level: "pleno",
    pillar: "api",
    languages: "ambos",
    optional: true,
    summary:
      "Schema, query, mutation, N+1 do resolver, DataLoader. Spring GraphQL ou gqlgen. Não substitua REST por moda: GraphQL ganha quando o cliente pede fatias diferentes do mesmo grafo. Auth e complexidade da query são o pescoço.",
    why2026:
      "Ainda aparece em produto com front pesado. Não é default de vaga Java/Go no Brasil — é diferencial. Sem DataLoader você recria o N+1 em outro lugar.",
    resourceIds: ["graphql-learn", "spring-graphql", "gqlgen"],
    challengeIds: ["ch-pl-graphql"],
  },
  {
    id: "sr-event-sourcing",
    title: "Event sourcing (opcional, caro)",
    level: "senior",
    pillar: "arquitetura",
    languages: "ambos",
    optional: true,
    summary:
      "O estado é o log de eventos. Replay gera a projeção. Não é o mesmo que “publicar evento no Kafka”. Versionar evento, snapshot, upcast e GDPR (apagar no log) são o custo. Fowler: escolha consciente, não default.",
    why2026:
      "Times ainda confundem notification, state transfer e sourcing na mesma reunião. Senior precisa separar — e recusar sourcing quando um outbox resolve.",
    resourceIds: ["fowler-es", "fowler-events"],
    challengeIds: ["ch-sr-sourcing"],
  },
  {
    id: "pl-uploads",
    title: "Arquivos, signed URL e object store",
    level: "pleno",
    pillar: "cloud",
    languages: "ambos",
    optional: true,
    summary:
      "Metadado no Postgres, bytes no S3/MinIO. Upload via URL assinada (o browser não passa pelo seu heap). Tipo, tamanho, vírus (pelo menos recusar executável). Sem isso o multipart no Spring vira disco cheio.",
    why2026:
      "Todo produto tem anexo. Pleno que faz `bytea` no banco ou sobe 200MB pelo pod descobre o custo no segundo mês.",
    resourceIds: ["minio-docs", "aws-presign"],
    challengeIds: ["ch-pl-uploads"],
  },
  {
    id: "pl-jobs",
    title: "Jobs, cron e o que não é request",
    level: "pleno",
    pillar: "engenharia",
    languages: "ambos",
    summary:
      "Trabalho fora do HTTP: @Scheduled / robfig/cron, lock para não rodar em 3 réplicas, idempotência, horário (UTC). Fila (Rabbit/Kafka) para o que pode esperar. Temporal/Quartz quando o fluxo tem estado — não no primeiro job.",
    why2026:
      "Reconciliação, boleto, relatório. Sem lock você processa o PIX duas vezes no deploy.",
    resourceIds: ["twelve-factor", "fowler-events"],
    challengeIds: ["ch-pl-jobs"],
  },
  {
    id: "pl-ratelimit",
    title: "Paginação, filtro e rate limit",
    level: "pleno",
    pillar: "api",
    languages: "ambos",
    summary:
      "Cursor > offset em lista grande. Filtro indexável. 429 + Retry-After. Token bucket por IP ou por API key. Sem isso o k6 e o crawler são o mesmo incidente.",
    why2026:
      "API pública sem limite é DDoS caseiro. Offset page=99999 é o full scan clássico.",
    resourceIds: ["rfc-9110", "k6-docs"],
    challengeIds: ["ch-pl-ratelimit"],
  },
  {
    id: "pl-nplus1",
    title: "N+1, batch e pool de conexão",
    level: "pleno",
    pillar: "dados",
    languages: "ambos",
    summary:
      "Um SELECT por item da lista é o bug Pleno mais caro. Join, IN, DataLoader, EntityGraph — o nome muda, o EXPLAIN não. Pool (Hikari / pgxpool) dimensionado; leak de conexão é o outro irmão.",
    why2026:
      "ORM e GraphQL escondem N+1. Quem não abre o log SQL não é Pleno de dados.",
    resourceIds: ["postgres-explain", "use-the-index-luke", "sqlc"],
    challengeIds: ["ch-pl-nplus1"],
  },
  {
    id: "jr-portfolio",
    title: "Como o GitHub conta a história",
    level: "junior",
    pillar: "engenharia",
    languages: "ambos",
    optional: true,
    summary:
      "Recruiter abre o perfil em 20s: README, 3 repos pinados, um README de projeto com como rodar, o que você fez, o que ficou de fora. Sem print de certificado. Sem 40 forks sem commit.",
    why2026:
      "A prova desta trilha é o repo. Perfil vazio + “fiz 50 desafios” no LinkedIn não abre a porta.",
    resourceIds: ["github-prs", "pro-git"],
    challengeIds: ["ch-jr-portfolio"],
  },
  {
    id: "jr-testes",
    title: "Testes: o que vale a pena quebrar",
    level: "junior",
    pillar: "engenharia",
    languages: "ambos",
    summary:
      "JUnit 5 e table tests em Go. Teste a regra (unique, 422, 409), não o framework. Um teste que só sobe o contexto Spring e dá assertNotNull não ensina nada. Distinga unitário (domínio), fatia (HTTP) e integração (Postgres).",
    why2026:
      "IA gera teste verde que não falha quando a regra some. Junior que sabe vermelhar a suíte entra no time; o outro vira gerador de cobertura.",
    resourceIds: ["junit5", "go-testing", "testcontainers", "google-eng-practices"],
    challengeIds: ["ch-jr-testes"],
  },
  {
    id: "jr-logs",
    title: "Log estruturado, sem PII",
    level: "junior",
    pillar: "observabilidade",
    languages: "ambos",
    summary:
      "JSON, níveis, requestId. INFO/WARN/ERROR com critério. Senha, token e e-mail cru não entram no log. O log é um banco — LGPD vale.",
    why2026:
      "On-call JR começa no grep. Log bagunçado ou vazando dado pessoal vira incidente, não “detalhe”.",
    resourceIds: ["lgpd-guia", "owasp-2025", "otel"],
    challengeIds: ["ch-jr-logs"],
  },
  {
    id: "jr-validacao",
    title: "Validação de input e 422 útil",
    level: "junior",
    pillar: "api",
    languages: "ambos",
    summary:
      "Bean Validation / validator em Go. 422 com code por campo. JSON quebrado é 400, não 500. Regras de negócio (cupom vencido) não se misturam com formato.",
    why2026:
      "API sem contrato de erro empurra o bug para o frontend. Junior dono do 422 reduz retrabalho do Pleno.",
    resourceIds: ["jakarta-validation", "fowler-richardson"],
    challengeIds: ["ch-jr-validacao"],
  },
  {
    id: "pl-hexagonal",
    title: "Hexagonal: domínio na ponta, framework na borda",
    level: "pleno",
    pillar: "arquitetura",
    languages: "ambos",
    summary:
      "Ports & adapters. A regra não importa Spring, chi, JPA. Teste de domínio sem subir HTTP. Não é pasta extra: é dependência apontando para dentro.",
    why2026:
      "Com Boot 4 e stdlib Go, o risco é o contrário: tudo no controller. Pleno que isola regra troca de adapter sem reescrever o negócio.",
    resourceIds: ["fowler-hexagonal", "awesome-patterns", "arch-premier"],
    challengeIds: ["ch-pl-hexagonal"],
  },
  {
    id: "pl-api-compat",
    title: "Versionar API sem quebrar o client velho",
    level: "pleno",
    pillar: "api",
    languages: "ambos",
    summary:
      "Expand, não big-bang. v1 continua; v2 nasce. Header Deprecation. JSON velho não muda de tipo no silêncio. OpenAPI dos dois contratos.",
    why2026:
      "Mobile e BFF não atualizam no mesmo dia. Pleno que “limpa o JSON” na sexta vira o incidente de sábado.",
    resourceIds: ["fowler-parallel", "openapi", "rfc-9110"],
    challengeIds: ["ch-pl-api-compat"],
  },
  {
    id: "pl-webhooks",
    title: "Webhooks: HMAC, replay e janela",
    level: "pleno",
    pillar: "api",
    languages: "ambos",
    summary:
      "Receber evento de terceiros: assinatura HMAC, timestamp, idempotência por eventId. At-least-once é o default — o efeito tem que ser uma vez.",
    why2026:
      "Todo gateway de pagamento e o public-apis de plantão batem na sua porta. Sem HMAC você aceita lixo. Sem idempotência você cobra duas vezes.",
    resourceIds: ["stripe-webhooks", "rfc-9110"],
    challengeIds: ["ch-pl-webhooks"],
  },
  {
    id: "sr-zero-downtime",
    title: "Expand/contract: schema sem downtime",
    level: "senior",
    pillar: "dados",
    languages: "ambos",
    summary:
      "Parallel Change: add nullable, backfill, dual-write, depois drop. App velho e novo no ar juntos. Lock longo e rewrite da tabela não passam de review.",
    why2026:
      "Migração “uma vez e reza” ainda derruba produto. Senior dono do banco é dono do expand — o contract pode esperar.",
    resourceIds: ["fowler-parallel", "flyway", "goose"],
    challengeIds: ["ch-sr-expand-contract"],
  },
]
