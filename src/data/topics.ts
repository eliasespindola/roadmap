import type { Topic } from "./types"
import { moreTopics } from "./topicsMore"
import { foundationTopics } from "./topicsFoundation"

const coreTopics: Topic[] = [
  {
    id: "jr-git-review",
    title: "Git, commits e code review",
    level: "junior",
    pillar: "engenharia",
    languages: "ambos",
    summary:
      "O trabalho de backend começa no histórico: PRs pequenas, mensagem que explica o porquê, e review que protege o sistema em vez de o estilo pessoal. Conventional Commits ajudam o changelog; o handbook do Google define o que é bloqueante.",
    why2026:
      "IA acelera o volume de diff. Review humana e commits auditáveis importam mais, não menos. Sem isso, você não sobrevive a um on-call.",
    resourceIds: ["google-eng-practices", "google-code-review", "commits-iuricode", "pro-git"],
    challengeIds: ["ch-jr-review", "ch-jr-github"],
  },
  {
    id: "jr-java-25",
    title: "Java 25 LTS — linguagem e runtime",
    level: "junior",
    pillar: "linguagem",
    languages: "java",
    summary:
      "Trabalhe em Java 25 (LTS, set/2025): records, sealed types, pattern matching, text blocks, virtual threads. Maven ou Gradle com toolchain. JUnit 5. Java 21 ainda é comum em produção — saiba ler os dois.",
    why2026:
      "Virtual threads com a correção de pinning (JEP 491) tornaram o modelo imperativo o default de novo. WebFlux deixou de ser o caminho obrigatório para I/O. Head First Java vira consulta, não trilha.",
    resourceIds: ["java-25", "head-first-java", "jspecify", "udemy-spring-3"],
    challengeIds: ["ch-jr-crud-java"],
  },
  {
    id: "jr-go-126",
    title: "Go 1.26 — linguagem, módulos, erros",
    level: "junior",
    pillar: "linguagem",
    languages: "go",
    summary:
      "Módulos, slices, maps, ponteiros, embedding, errors.Is/As, wrapping com %w, table tests. A stdlib resolve HTTP, JSON, SQL driver e testes — bibliotecas entram depois, com justificativa.",
    why2026:
      "Go 1.26 (fev/2026) consolida synctest e GOMAXPROCS ciente de cgroup. encoding/json/v2 ainda é experimental: aprenda json v1 bem e acompanhe a flag, não dependa dela em produção.",
    resourceIds: ["go-tour", "go-maps", "go-errors", "go-testing", "learning-go", "jetbrains-go-guidelines", "udemy-go-grider"],
    challengeIds: ["ch-jr-crud-go"],
  },
  {
    id: "jr-rest",
    title: "HTTP e REST até Richardson 2",
    level: "junior",
    pillar: "api",
    languages: "ambos",
    summary:
      "Recursos, verbos, status corretos, idempotência de GET/PUT/DELETE, pagination cursor ou offset com honestidade. JSON como contrato. HATEOAS (nível 3) é opcional — quase ninguém exige em 2026.",
    why2026:
      "O maturity model continua sendo o vocabulário certo. APIs novas às vezes usam versionamento explícito (Spring 7) e OpenAPI; o básico HTTP não mudou.",
    resourceIds: ["fowler-richardson", "roadmap-sh-backend"],
    challengeIds: ["ch-jr-crud-java", "ch-jr-crud-go"],
  },
  {
    id: "jr-postgres",
    title: "PostgreSQL: CRUD, chaves e EXPLAIN",
    level: "junior",
    pillar: "dados",
    languages: "ambos",
    summary:
      "Modelagem 3NF o bastante, PK/FK, unique, índices btree no que você filtra de verdade. INSERT/UPDATE/DELETE em transação. EXPLAIN e EXPLAIN ANALYZE para ver seq scan versus index scan.",
    why2026:
      "Postgres é o banco default de backend sério. Mongo como default “porque JSON” saiu de moda. EXPLAIN continua sendo a ferramenta nº 1 antes de “vamos cachear”.",
    resourceIds: ["postgres-explain"],
    challengeIds: ["ch-jr-explain"],
  },
  {
    id: "jr-spring-boot",
    title: "Spring Boot 4 — primeira API",
    level: "junior",
    pillar: "api",
    languages: "java",
    summary:
      "Uma API REST com Spring Boot 4.1 / Spring Framework 7: controllers, validação, exception handler, testes de slice. JSpecify para null-safety. HTTP Service Clients quando for o cliente, não só o servidor.",
    why2026:
      "Boot 3.5 saiu de OSS em junho de 2026. Cursos de Boot 3 ainda ensinam o modelo mental; produção nova deveria nascer em 4.x. Não comece por WebFlux.",
    resourceIds: ["spring-boot-4", "jspecify", "roadmap-sh-spring", "udemy-spring-3"],
    challengeIds: ["lum-jr1-identity", "ch-jr-crud-java", "ch-jr-dockerize"],
  },
  {
    id: "jr-go-http",
    title: "HTTP em Go: stdlib e chi",
    level: "junior",
    pillar: "api",
    languages: "go",
    summary:
      "net/http, ServeMux com métodos e wildcards (1.22+), middleware de log e recover. chi continua idiomático se o time já o usa. context.Context em toda borda. slog, não log.Printf solto.",
    why2026:
      "A stdlib fechou boa parte da lacuna de routers. chi segue padrão de produção. Frameworks pesados estilo Spring são a exceção em Go, não a regra.",
    resourceIds: ["go-chi", "go-context", "jetbrains-go-guidelines", "udemy-backend-master"],
    challengeIds: ["lum-jr1-catalog", "lum-jr2-orders", "ch-jr-crud-go"],
  },
  {
    id: "jr-auth",
    title: "Sessão, cookies e JWT sem magia",
    level: "junior",
    pillar: "seguranca",
    languages: "ambos",
    summary:
      "Sessão server-side com cookie HttpOnly/Secure/SameSite resolve a maior parte dos apps. JWT não é sessão. Se usar JWT, assine com algoritmo explícito, expire curto, nunca confie no payload sem verificar.",
    why2026:
      "O artigo de Fowler sobre session secret e as RFC 7519/8725 continuam o chão. O erro Junior clássico — JWT eterno no localStorage — segue rendendo incidente.",
    resourceIds: ["fowler-session", "rfc-7519", "rfc-8725", "jwt-java-cheatsheet"],
    challengeIds: ["lum-jr1-identity", "ch-jr-jwt-bugs"],
  },
  {
    id: "jr-docker",
    title: "Docker: empacotar o serviço",
    level: "junior",
    pillar: "cloud",
    languages: "ambos",
    summary:
      "Dockerfile multi-stage, usuário não-root, .dockerignore, healthcheck, compose com Postgres. Imagem pequena em Go; JRE distroless ou Temurin em Java. Não “dockerize o mundo” no primeiro PR.",
    why2026:
      "Container é o artefato default. Kubernetes vem depois. Saber o que entra na imagem evita 80% das surpresas de “na minha máquina”.",
    resourceIds: ["roadmap-sh-backend"],
    challengeIds: ["ch-jr-dockerize"],
  },
  {
    id: "jr-owasp",
    title: "OWASP Top 10:2025 — consciência",
    level: "junior",
    pillar: "seguranca",
    languages: "ambos",
    summary:
      "A01 Broken Access Control, A05 Injection, A07 Authentication Failures: IDOR, SQL injection, senha fraca, sessão que não invalida. Parametrize queries. Autorize no servidor, não no front.",
    why2026:
      "A edição 2025 é a vigente. A03 virou supply chain — você ainda não precisa gerir SBOM no Junior, mas já não instala dependência de gist anônimo.",
    resourceIds: ["owasp-2025"],
    challengeIds: ["ch-jr-jwt-bugs"],
  },
  {
    id: "jr-ia",
    title: "IA como par, não como autor",
    level: "junior",
    pillar: "ia",
    languages: "ambos",
    summary:
      "Use o agente para boilerplate, testes e leitura de docs. Você explica cada linha que commita. Segredos não vão para o prompt. Diff gerado passa pelo mesmo review que o resto.",
    why2026:
      "Em 2026 o mercado assume que você usa IA. O diferencial Junior é detectar alucinação em código de concorrência, SQL e auth — exatamente onde o modelo erra com confiança.",
    resourceIds: ["agentskills", "skills-sh", "mcp-home", "spring-ai"],
    challengeIds: ["ch-jr-review", "ch-ai-glossario"],
  },
  {
    id: "jr-mcp",
    title: "MCP e skills — vocabulário de leigo",
    level: "junior",
    pillar: "ia",
    languages: "ambos",
    summary:
      "MCP é a tomada: o agente chama ferramentas ao vivo (banco, git, files). Skill é a receita versionada (SKILL.md). Não são a mesma coisa. Comece só com leitura e sem secret de produção.",
    why2026:
      "Em 2026 host de IA (Cursor, Claude, etc.) fala MCP. Time sem skill padronizada vira cada um com um prompt diferente. A seção /ia desta app existe para isso.",
    resourceIds: ["mcp-home", "mcp-architecture", "mcp-servers", "agentskills", "skills-sh"],
    challengeIds: ["ch-ai-glossario", "ch-ai-mcp", "ch-ai-skill"],
  },
  {
    id: "pl-transacoes",
    title: "Transações, isolamento e N+1",
    level: "pleno",
    pillar: "dados",
    languages: "ambos",
    summary:
      "ACID na prática: read committed vs repeatable read, lost update, índices compostos, covering. Evite N+1 (join fetch / dataloader / query explícita). Transação curta; I/O externo fica fora.",
    why2026:
      "A maior parte da “lenta a API” ainda é query. Cache sem entender o plano do Postgres só esconde o problema até o stampede.",
    resourceIds: ["postgres-explain", "ddia"],
    challengeIds: ["ch-pl-cache"],
  },
  {
    id: "pl-redis",
    title: "Cache com Redis 7/8",
    level: "pleno",
    pillar: "dados",
    languages: "ambos",
    summary:
      "Cache-aside, TTL, invalidação por evento ou chave versionada, stampede (lock ou singleflight). Redis também é lock e stream — não só GET/SET. Trate Redis como volátil: o Postgres continua a fonte da verdade.",
    why2026:
      "A seção de cache do primer e o produto Redis 7/8 são o material atual. Redis in Action ensina o espírito e está datado na API — selo histórico.",
    resourceIds: ["system-design-primer-cache", "roadmap-sh-redis", "redis-in-action"],
    challengeIds: ["ch-pl-cache"],
  },
  {
    id: "pl-rabbitmq",
    title: "RabbitMQ: filas, retry e DLX",
    level: "pleno",
    pillar: "mensageria",
    languages: "ambos",
    summary:
      "Work queues, ack manual, prefetch, retry com TTL/parking, dead-letter exchange. Mensagem idempotente (chave de dedup). Rabbit é ferramenta de trabalho e buffer, não event log eterno.",
    why2026:
      "Kafka não matou RabbitMQ. Times em 2026 ainda usam DLX para jobs, e-mail, webhooks e o que precisa de retry sem replay de tópico.",
    resourceIds: ["rabbitmq-dlx", "udemy-rabbitmq"],
    challengeIds: ["ch-pl-dlx"],
  },
  {
    id: "pl-kafka-intro",
    title: "Kafka — o suficiente para produzir",
    level: "pleno",
    pillar: "mensageria",
    languages: "ambos",
    summary:
      "Tópico, partição, offset, consumer group, at-least-once, chave de partição, schema. Não invente exactly-once no app no primeiro mês. Produza eventos de fato acontecidos, não “vai acontecer”.",
    why2026:
      "Kafka segue o backbone de eventos em empresas médias/grandes. Pleno precisa publicar e consumir sem perder offset; o desenho do log vem no Senior.",
    resourceIds: ["kafka-guide", "udemy-kafka", "fowler-events"],
    challengeIds: ["ch-pl-kafka"],
  },
  {
    id: "pl-resiliencia",
    title: "Timeout, retry, idempotência, circuit breaker",
    level: "pleno",
    pillar: "arquitetura",
    languages: "ambos",
    summary:
      "Todo I/O tem timeout. Retry só em falha transiente com jitter. Idempotency-Key em POST que cobra ou cria pedido. Circuit breaker isola dependência doente em vez de amplificar.",
    why2026:
      "O bliki do Circuit Breaker continua correto. Bibliotecas mudam (Resilience4j, gobreaker); o padrão não. Sem isso, um timeout de 30s vira incidente de thread/goroutine.",
    resourceIds: ["fowler-circuit-breaker", "awesome-patterns"],
    challengeIds: ["ch-pl-dlx", "ch-pl-k6", "ch-pl-idempotency"],
  },
  {
    id: "pl-events",
    title: "O que é event-driven de verdade",
    level: "pleno",
    pillar: "arquitetura",
    languages: "ambos",
    summary:
      "Fowler separa event notification, event-carried state transfer, event sourcing e CQRS. A maioria dos times precisa só do primeiro ou segundo. Event sourcing é escolha cara, não default.",
    why2026:
      "O artigo de 2017 ainda evita a conversa em que “vamos ficar event-driven” significa quatro coisas diferentes na mesma reunião.",
    resourceIds: ["fowler-events", "fowler-home"],
    challengeIds: ["lum-pl2-kafka", "ch-pl-events"],
  },
  {
    id: "pl-otel",
    title: "Observabilidade com OpenTelemetry",
    level: "pleno",
    pillar: "observabilidade",
    languages: "ambos",
    summary:
      "Trace, métrica e log correlacionados. Spans nas bordas HTTP e nas queries. RED/USE. Não logar PII. Propagação de context/traceparent. O backend (Grafana, Elastic, Datadog) é plugável.",
    why2026:
      "OpenTelemetry venceu a guerra de instrumentação. “ELK porque sempre foi” sem traces é 2018. O livro Observability Engineering descreve o porquê.",
    resourceIds: ["otel", "observability-eng"],
    challengeIds: ["ch-pl-k6", "ch-pl-otel"],
  },
  {
    id: "pl-persistencia",
    title: "sqlc, JDBC consciente, JPA sem magia",
    level: "pleno",
    pillar: "dados",
    languages: "ambos",
    summary:
      "Em Go, sqlc (ou jOOQ/JDBC no Java) deixa o SQL no repositório, revisável. JPA/Hibernate é aceitável se você enxerga o SQL gerado. Migrations versionadas (Flyway/Liquibase/goose).",
    why2026:
      "sqlc é o gosto moderno de produção Go. No Java, Spring Data JDBC e jOOQ ganharam espaço contra JPA “mágico”. O critério é o mesmo: você consegue EXPLAIN a query?",
    resourceIds: ["sqlc", "postgres-explain", "udemy-backend-master"],
    challengeIds: ["ch-pl-cache", "ch-pl-sqlc", "ch-pl-nplus1"],
  },
  {
    id: "pl-jwt",
    title: "JWT e OAuth feitos certo",
    level: "pleno",
    pillar: "seguranca",
    languages: "ambos",
    summary:
      "Allowlist de alg, um algoritmo por chave, validar iss/aud/exp/nbf, rejeitar alg=none e header kid/jku não confiáveis. Access token curto; refresh rotacionado. Prefira um IdP a assinar JWT na mão.",
    why2026:
      "RFC 8725 é BCP vigente. O cheat sheet Java continua aplicável. Pleno que “rola JWT simétrico HS256 compartilhado em quatro serviços” está um incidente à frente.",
    resourceIds: ["rfc-8725", "rfc-7519", "jwt-java-cheatsheet"],
    challengeIds: ["ch-pl-jwt"],
  },
  {
    id: "pl-concorrencia",
    title: "Virtual threads, goroutines e synctest",
    level: "pleno",
    pillar: "linguagem",
    languages: "ambos",
    summary:
      "Java: virtual threads para I/O; não pinne em synchronized antigo. Go: goroutine + channel + context cancel; race detector ligado. Teste tempo e deadlock com synctest.Test (não Run).",
    why2026:
      "Go 1.25 promoveu synctest; 1.26 removeu Run. No Java, a correção de pinning no 25 reduziu a pressão por reactive. Os dois runtimes ficaram mais honestos com o programador.",
    resourceIds: [
      "go-concurrency-faq",
      "go-synctest",
      "go-synctest-blog",
      "go-context",
      "concurrency-in-go",
      "concorrencia-go",
      "java-25",
      "jetbrains-go-features",
    ],
    challengeIds: ["ch-pl-synctest"],
  },
  {
    id: "pl-k6",
    title: "Performance com k6",
    level: "pleno",
    pillar: "observabilidade",
    languages: "ambos",
    summary:
      "Defina SLO de palpite (p95, taxa de erro), escreva um script k6, rode contra staging, leia o gargalo (CPU, query, lock). Otimize com evidência, não com feeling.",
    why2026:
      "k6 é o default leve de load test em times de produto. JMeter ainda existe; raramente é a primeira escolha em 2026.",
    resourceIds: ["k6-docs", "udemy-k6"],
    challengeIds: ["ch-pl-k6"],
  },
  {
    id: "pl-ia-review",
    title: "Review assistido por skills",
    level: "pleno",
    pillar: "ia",
    languages: "ambos",
    summary:
      "Skills de agente (agentskills.io / skills.sh) carregam o checklist do time: race, SQL, JWT, logs. O review de Go do samber é um exemplo concreto. O humano ainda dá o LGTM.",
    why2026:
      "Times sérios padronizam o prompt/skill em vez de cada um colar um texto diferente. Isso é engenharia de processo, não “vibe coding”.",
    resourceIds: ["agentskills", "skills-sh", "golang-ai-review", "cc-skills-golang"],
    challengeIds: ["ch-pl-synctest", "ch-ai-skill", "ch-ai-pr-review"],
  },
  {
    id: "sr-ddia",
    title: "DDIA e o vocabulário de dados",
    level: "senior",
    pillar: "arquitetura",
    languages: "ambos",
    summary:
      "Reliability, replication, partitioning, transactions, stream vs batch. Caps. 1–3, 7–9, 11. Você precisa nomear o trade-off (latência vs consistência, fan-out on write vs read) antes de desenhar o serviço.",
    why2026:
      "Nenhum framework de 2026 substituiu Kleppmann. Database Internals entra quando você precisa descer um nível no motor.",
    resourceIds: ["ddia", "database-internals", "system-design-primer"],
    challengeIds: ["ch-sr-feed"],
  },
  {
    id: "sr-outbox-saga",
    title: "Outbox, saga e CDC",
    level: "senior",
    pillar: "mensageria",
    languages: "ambos",
    summary:
      "Grave o estado e o evento na mesma transação (outbox); um publisher relê e manda ao broker. Saga orquestra passos com compensação — choreography ou orchestration. CDC (Debezium) quando você não controla o writer.",
    why2026:
      "Dual write (DB + Kafka no mesmo request sem outbox) continua a falha Senior mais cara. Richardson cap. 4 e os padrões microservices.io são o texto canônico.",
    resourceIds: ["outbox", "saga", "microservices-patterns", "debezium"],
    challengeIds: ["lum-sr1-outbox", "ch-sr-outbox"],
  },
  {
    id: "sr-strangler",
    title: "Strangler fig e monólito modular",
    level: "senior",
    pillar: "arquitetura",
    languages: "ambos",
    summary:
      "Não reescreva o legado. Intercepte bordas, extraia um módulo por vez, mantenha o resto. Microsserviço é uma opção de deploy, não de desenho. Monólito modular com módulos e donos claros é o default saudável.",
    why2026:
      "A moda de “tudo microsserviço” esfriou. Newman e Fowler descrevem o caminho que times maduros realmente usam em 2026: estrangular com evidência.",
    resourceIds: ["fowler-strangler", "building-microservices", "udemy-spring-micro"],
    challengeIds: ["ch-sr-strangler"],
  },
  {
    id: "sr-kafka",
    title: "Kafka a sério",
    level: "senior",
    pillar: "mensageria",
    languages: "ambos",
    summary:
      "Compacted topics, retention, rebalance, poison pill, exactly-once nas bordas que importam, schema registry, ordering por chave. Consumer lag como SLO. Não use Kafka como fila de RPC.",
    why2026:
      "O Definitive Guide e a série Maarek ainda formam a base. O erro atual é tratar Kafka como Rabbit com offset — modelos diferentes.",
    resourceIds: ["kafka-guide", "udemy-kafka"],
    challengeIds: ["ch-sr-outbox"],
  },
  {
    id: "sr-search",
    title: "Busca: Elastic 8/9, não o livro de 2015",
    level: "senior",
    pillar: "dados",
    languages: "ambos",
    summary:
      "Indexação, mapping, relevance, ingest pipeline. Postgres FTS resolve muita coisa antes de um cluster Elastic. Se for Elastic, use a doc 8/9. O Definitive Guide é histórico.",
    why2026:
      "O livro clássico descreve ES 2. APIs, segurança e o stack mudaram. Cursos de Elastic 8 + docs oficiais são a trilha correta.",
    resourceIds: ["elastic-docs", "es-definitive", "udemy-elastic"],
    challengeIds: ["ch-sr-search"],
  },
  {
    id: "sr-postgis",
    title: "PostGIS — trilha espacial opcional",
    level: "senior",
    pillar: "dados",
    languages: "ambos",
    optional: true,
    summary:
      "Geometrias, GIST, ST_DWithin, SRID. Útil em logística, mapas, IoT. Não é requisito de Senior genérico — é um diferencial quando o domínio pede.",
    why2026:
      "PostGIS segue o padrão espacial em cima de Postgres. PostGIS in Action e cursos de Spatial SQL continuam válidos como nicho.",
    resourceIds: ["postgis-in-action", "udemy-postgis"],
    challengeIds: ["ch-sr-postgis"],
  },
  {
    id: "sr-k8s",
    title: "Kubernetes: limites, JVM e GOMAXPROCS",
    level: "senior",
    pillar: "cloud",
    languages: "ambos",
    summary:
      "requests/limits, probes, PDB, HPA. Go 1.25+ lê o CPU limit do cgroup. JVM precisa de flags alinhadas à memória do container (MaxRAMPercentage, ZGC). Sem isso, throttle e OOM matam o p99.",
    why2026:
      "Container-aware GOMAXPROCS fechou um péssimo default de anos. Java 25 + ZGC estreitaram o gap operacional com Go — meça RSS e p99, não migre por blog.",
    resourceIds: ["go-gomaxprocs", "java-25"],
    challengeIds: ["ch-sr-k8s"],
  },
  {
    id: "sr-buf",
    title: "Contratos: Protobuf e Buf",
    level: "senior",
    pillar: "api",
    languages: "ambos",
    summary:
      "Protobuf para RPC interno; Buf para lint, breaking change e generate. JSON/OpenAPI na borda pública. Versionar contrato é trabalho de Senior, não de “o front que se vire”.",
    why2026:
      "Buf é o tooling de facto. gRPC não é obrigatório em todo serviço; contrato versionado sim.",
    resourceIds: ["buf", "udemy-backend-master", "grpc"],
    challengeIds: ["ch-pl-grpc", "lum-jr1-catalog", "lum-jr2-inventory"],
  },
  {
    id: "sr-sre",
    title: "SLOs, error budget e post-mortem",
    level: "senior",
    pillar: "observabilidade",
    languages: "ambos",
    summary:
      "SLI mensurável, SLO negociado, error budget que autoriza (ou congela) feature. Incidente vira post-mortem sem culpa, com timeline e ação. Leia post-mortems reais, não só o template.",
    why2026:
      "O livro SRE da Google e o recorte de danluu continuam o material que Staff/Senior usam para discutir risco. Observability Engineering liga o sinal ao SLO.",
    resourceIds: ["sre-book", "danluu-postmortems", "observability-eng"],
    challengeIds: ["ch-sr-slo"],
  },
  {
    id: "sr-system-design",
    title: "System design: desenhar o sistema",
    level: "senior",
    pillar: "arquitetura",
    languages: "ambos",
    summary:
      "Requisitos, capacidade, API, dados, falhas, evolução. Primer + Xu para entrevista e vocabulário; DDIA e Newman para a decisão real. Documente o que você recusou, não só o que escolheu.",
    why2026:
      "As perguntas de entrevista mudaram pouco. O que mudou é a resposta madura: IA/RAG, edge e “mais um microsserviço” só entram com carga e ameaça claras.",
    resourceIds: [
      "system-design-primer",
      "sdi-xu",
      "roadmap-sh-system-design",
      "awesome-architecture",
      "awesome-distributed",
      "udemy-system-design",
    ],
    challengeIds: ["ch-sr-feed"],
  },
  {
    id: "sr-supply-chain",
    title: "Supply chain, integridade e alerta",
    level: "senior",
    pillar: "seguranca",
    languages: "ambos",
    summary:
      "OWASP 2025 A03 (supply chain), A08 (integridade), A09 (logging/alerting). Pin de deps, lockfile, assinatura, SBOM, CI que falha em CVE alta. Logs que acordam alguém — não um buraco negro.",
    why2026:
      "A03 subiu no ranking 2025 porque o vetor virou dependência e pipeline, não só o seu controller. Senior dono de serviço é dono do build.",
    resourceIds: ["owasp-2025"],
    challengeIds: ["ch-sr-slo"],
  },
  {
    id: "st-find-problems",
    title: "Achar o problema certo",
    level: "staff",
    pillar: "lideranca",
    languages: "ambos",
    summary:
      "Staff não é Senior mais rápido. O trabalho é localizar o problema que, resolvido, destrava vários times — e recusar o que só parece urgente. Lalit escreve o teste: você está achando problemas ou só executando tickets?",
    why2026:
      "Com IA aumentando throughput individual, o gargalo volta a ser problema mal escolhido, alinhamento e carga cognitiva do sistema.",
    resourceIds: ["lalitm-find-problems"],
    challengeIds: ["ch-st-rfc"],
  },
  {
    id: "st-specifying",
    title: "Especificar: invariantes, não só tickets",
    level: "staff",
    pillar: "arquitetura",
    languages: "ambos",
    summary:
      "Specifying Systems ensina a escrever o que deve permanecer verdadeiro. Você não precisa de TLA+ no dia a dia; precisa de invariantes, estados proibidos e o que acontece na falha parcial.",
    why2026:
      "Sistemas event-driven e sagas explodem sem spec. Formalismo leve (invariantes no RFC) é o hábito Staff; model checker é ferramenta pontual.",
    resourceIds: ["specifying-systems"],
    challengeIds: ["ch-st-rfc"],
  },
  {
    id: "st-rfc",
    title: "RFC, ADR e fronteiras entre times",
    level: "staff",
    pillar: "lideranca",
    languages: "ambos",
    summary:
      "Documento curto: contexto, opções, decisão, consequências. Fronteira de time = fronteira de módulo. Conway não é desculpa; é restrição de desenho. Revise ADRs quando a realidade mudar.",
    why2026:
      "Platform e multi-serviço só escalam com decisão escrita. Slack não é arquivo de arquitetura.",
    resourceIds: ["google-eng-practices", "building-microservices"],
    challengeIds: ["ch-st-rfc", "ch-st-golden-path"],
  },
  {
    id: "st-laws",
    title: "Leis que não cabem em framework",
    level: "staff",
    pillar: "engenharia",
    languages: "ambos",
    summary:
      "Leis de software (Hyrum, Conway, Gall, Goodhart) explicam por que o atalho de ontem virou a API de amanhã. Staff usa isso para prever custo, não para citar em thread.",
    why2026:
      "lawsofsoftwareengineering.com concentra o vocabulário. Continua atual porque não depende de versão de Spring.",
    resourceIds: ["laws-se"],
    challengeIds: ["ch-st-golden-path"],
  },
  {
    id: "st-incident",
    title: "Cultura de incidente",
    level: "staff",
    pillar: "observabilidade",
    languages: "ambos",
    summary:
      "Papéis no incidente, comunicação, freeze de deploy, blameless, ação com dono e prazo. Ler post-mortems externos calibra o que “nunca vai acontecer aqui” — até acontecer.",
    why2026:
      "A coleção do danluu segue o melhor antídoto contra confiança ingênua. Staff desenha o processo; Senior executa o runbook.",
    resourceIds: ["danluu-postmortems", "sre-book"],
    challengeIds: ["ch-st-incidente", "ch-st-postmortem"],
  },
  {
    id: "st-ia-org",
    title: "IA como padrão de time",
    level: "staff",
    pillar: "ia",
    languages: "ambos",
    summary:
      "Skills versionadas no repo, o que pode e não pode ir a modelo, revisão humana em auth/pagamentos, métrica de qualidade (retrabalho, incidentes gerados por diff de agente). Não é “liberar Copilot e rezar”.",
    why2026:
      "agentskills.io e hubs como skills.sh são a camada de processo de 2026/2027. Staff que ignora isso deixa cada pessoa com um assistente diferente e nenhum padrão.",
    resourceIds: ["agentskills", "skills-sh", "golang-ai-review"],
    challengeIds: ["ch-st-golden-path", "ch-ai-mcp"],
  },
  {
    id: "st-platform",
    title: "Platform engineering e golden path",
    level: "staff",
    pillar: "cloud",
    languages: "ambos",
    summary:
      "O caminho feliz: template de serviço Java/Go, CI, telemetria, Postgres, filas, secrets. Self-service com opinião. Menos “qualquer um monta um cluster” e mais “o default é seguro e observável”.",
    why2026:
      "Platform engineering substituiu boa parte do teatro DevOps de slide. O golden path é o produto interno do Staff.",
    resourceIds: ["sre-book", "google-eng-practices"],
    challengeIds: ["ch-st-golden-path"],
  },
  {
    id: "st-impacto",
    title: "Influência sem autoridade",
    level: "staff",
    pillar: "lideranca",
    languages: "ambos",
    summary:
      "Medir impacto em risco reduzido, tempo de entrega do sistema, carga cognitiva — não em tickets fechados. Ensinar Seniors a achar problemas. Dizer não com alternativa.",
    why2026:
      "O mercado 2026 paga Staff por alavancagem. Código próprio ainda existe; o multiplicador é o sistema e as pessoas.",
    resourceIds: ["lalitm-find-problems", "laws-se"],
    challengeIds: ["ch-st-rfc"],
  },
]

export const topics: Topic[] = [...foundationTopics, ...moreTopics, ...coreTopics]

export const topicById: Record<string, Topic> = Object.fromEntries(
  topics.map((topic) => [topic.id, topic]),
)
