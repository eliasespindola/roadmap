import type { Topic } from "./types"

export const foundationTopics: Topic[] = [
  {
    id: "jr-github",
    title: "Git e GitHub de verdade",
    level: "junior",
    pillar: "fundamentos",
    languages: "ambos",
    summary:
      "clone, branch curta, commit atômico, push, pull request, review, squash, issues, .gitignore, README. GitHub não é só hospedar ZIP: é o lugar do trabalho. Distinga git (ferramenta) de GitHub (produto: PR, Actions, Packages).",
    why2026:
      "Toda vaga JR pede GitHub. IA aumenta o volume de PR — quem não sabe ler um diff e abrir um PR limpo não entra no time.",
    resourceIds: ["pro-git", "github-prs", "github-flow", "commits-iuricode"],
    challengeIds: ["ch-jr-github"],
  },
  {
    id: "jr-linux",
    title: "Linux na linha de comando",
    level: "junior",
    pillar: "fundamentos",
    languages: "ambos",
    summary:
      "Navegar filesystem, pipes, grep/rg, chmod, variáveis de ambiente, SSH, logs em /var/log, processar stdout/stderr, exit codes. O servidor de 2026 ainda é Linux (container inclusive).",
    why2026:
      "Docker não substitui saber o que o processo está fazendo. On-call JR começa com `logs` e `ps`.",
    resourceIds: ["linux-command", "explainshell"],
    challengeIds: ["ch-jr-linux"],
  },
  {
    id: "jr-http-tcp",
    title: "TCP, HTTP e o que o browser esconde",
    level: "junior",
    pillar: "fundamentos",
    languages: "ambos",
    summary:
      "TCP (conexão, timeout) vs HTTP (método, status, headers). Idempotência de GET/PUT. Content-Type, CORS na borda. HTTPS é TLS. Um curl -v ensina mais que três tutoriais de framework.",
    why2026:
      "Framework muda. O status 499, o keep-alive e o header errado continuam o incidente.",
    resourceIds: ["mdn-http", "rfc-9110"],
    challengeIds: ["ch-jr-http"],
  },
  {
    id: "jr-relacional",
    title: "Modelo relacional: chaves, normalização, NULL",
    level: "junior",
    pillar: "dados",
    languages: "ambos",
    summary:
      "Relação, PK, FK, unique, 1:N e N:N com tabela de junção. 3NF o bastante. NULL não é zero. Integridade no banco, não só no if do service. Sem isso o CRUD é teatro.",
    why2026:
      "Postgres é o default. Documento “NoSQL porque é moderno” perdeu a vaga.",
    resourceIds: ["postgres-tutorial", "use-the-index-luke"],
    challengeIds: ["ch-jr-sql-joins"],
  },
  {
    id: "jr-sql-joins",
    title: "SQL: SELECT, JOIN, GROUP BY, subconsulta",
    level: "junior",
    pillar: "dados",
    languages: "ambos",
    summary:
      "INNER/LEFT JOIN, agregação, HAVING vs WHERE, DISTINCT com cuidado, ORDER BY + LIMIT. Escreva a query antes do ORM. NULL em JOIN é a pegadinha nº 1.",
    why2026:
      "Entrevista JR/Pleno no Brasil ainda é SQL no quadro. Produção também.",
    resourceIds: ["sqlbolt", "postgres-tutorial", "use-the-index-luke"],
    challengeIds: ["ch-jr-sql-joins"],
  },
  {
    id: "jr-lgpd",
    title: "Dado pessoal e LGPD no backend",
    level: "junior",
    pillar: "seguranca",
    languages: "ambos",
    summary:
      "CPF, e-mail, log de request: o que é dado pessoal. Não logar payload. Retenção. Base legal não é papel do JR decidir sozinho — é o JR não vazar. Mascarar em staging.",
    why2026:
      "Backend brasileiro que ignora LGPD vira incidente jurídico, não só técnico.",
    resourceIds: ["lgpd-guia"],
    challengeIds: ["ch-jr-sql-joins"],
  },
  {
    id: "jr-bigo",
    title: "Complexidade: Big-O no backend",
    level: "junior",
    pillar: "algoritmos",
    languages: "ambos",
    summary:
      "O(1), O(log n), O(n), O(n log n), O(n²). Tempo e memória. Nested loop em lista de pedido é n² na cara. Hash map vs varrer array. Medir com n = 10, 1e3, 1e5 — não só recitar.",
    why2026:
      "IA escreve n² confiante. O JR que mede e explica o O entra. O que só cola LeetCode e não liga no SQL não.",
    resourceIds: ["grokking-algorithms", "big-o-cheat", "neetcode"],
    challengeIds: ["ch-jr-bigo"],
  },
  {
    id: "jr-estruturas",
    title: "Estruturas: array, hash, stack, fila, set",
    level: "junior",
    pillar: "algoritmos",
    languages: "ambos",
    summary:
      "Quando usar cada uma. Hash (Map) para lookup. Set para unicidade. Stack para undo/DFS. Fila para BFS e worker. Array para ordem. Em Java: List/HashMap. Em Go: slice/map.",
    why2026:
      "90% do código de serviço é essas cinco. Árvore vermelho-preta aparece no banco, não no seu controller.",
    resourceIds: ["grokking-algorithms", "java-collections", "go-slices"],
    challengeIds: ["ch-jr-estruturas"],
  },
  {
    id: "jr-busca-ordenacao",
    title: "Busca e ordenação (o suficiente)",
    level: "junior",
    pillar: "algoritmos",
    languages: "ambos",
    summary:
      "Busca linear vs binária (premissa: ordenado). sort da linguagem (timsort / introsort) em vez de inventar quicksort. Índice de banco é busca — ligue as duas cabeças.",
    why2026:
      "Você quase nunca implementa merge sort. Você escolhe sort vs índice vs heap. Entrevista ainda pede binária.",
    resourceIds: ["grokking-algorithms", "neetcode"],
    challengeIds: ["ch-jr-bigo"],
  },
  {
    id: "pl-grafos",
    title: "Árvores e grafos aplicados a sistemas",
    level: "pleno",
    pillar: "algoritmos",
    languages: "ambos",
    summary:
      "BFS/DFS: dependência de pacote, hierarquia, menor caminho em grafo pequeno. Árvore: organograma, comment thread, nested set vs closure table no SQL. Detectar ciclo (deploy, FK, DAG de jobs).",
    why2026:
      "Pleno que só fez two-sum não lê um grafo de microsserviços. O inverso também: grafo sem complexidade vira timeout.",
    resourceIds: ["grokking-algorithms", "neetcode", "ddia"],
    challengeIds: ["ch-pl-grafos"],
  },
  {
    id: "pl-sql-window",
    title: "SQL avançado: CTE, window, upsert",
    level: "pleno",
    pillar: "dados",
    languages: "ambos",
    summary:
      "WITH (CTE), ROW_NUMBER/RANK, SUM() OVER, INSERT ... ON CONFLICT (upsert), transação em volta. Isso substitui muita lógica no service.",
    why2026:
      "Window function é o corte Pleno/JR em entrevista SQL e em relatório real.",
    resourceIds: ["postgres-tutorial", "use-the-index-luke", "postgres-explain"],
    challengeIds: ["ch-pl-sql-window"],
  },
  {
    id: "pl-mvcc",
    title: "MVCC, locks e isolamento",
    level: "pleno",
    pillar: "dados",
    languages: "ambos",
    summary:
      "Postgres MVCC: versões de linha, vacuum, lost update, for update, serializable. Índice não é mágica se a transação segura a tabela. Deadlock.",
    why2026:
      "O Pleno que “aumentou o pool” sem entender lock vira o incidente de sexta.",
    resourceIds: ["postgres-mvcc", "ddia", "database-internals"],
    challengeIds: ["ch-pl-sql-window"],
  },
  {
    id: "pl-migrations",
    title: "Migrations: Flyway, Liquibase, goose",
    level: "pleno",
    pillar: "dados",
    languages: "ambos",
    summary:
      "Schema versionado no git. Expand/contract: adicionar coluna nullable, backfill, depois NOT NULL. Nunca editar migration já aplicada em prod. Rollback é expand/contract, não “down” cego.",
    why2026:
      "Time sem migration é time que altera prod no DBeaver. Isso ainda acontece — e é inaceitável em Pleno.",
    resourceIds: ["flyway", "goose"],
    challengeIds: ["ch-pl-migrations"],
  },
  {
    id: "pl-actions",
    title: "GitHub Actions: CI do serviço",
    level: "pleno",
    pillar: "engenharia",
    languages: "ambos",
    summary:
      "Workflow: checkout, setup Java/Go, test, lint, build imagem. Cache de dependências. Secrets no GitHub, não no YAML. PR quebra o merge se o teste quebra. Distinga CI (verificar) de CD (entregar).",
    why2026:
      "Actions é o CI default do mercado. “Na minha máquina passa” não é emprego.",
    resourceIds: ["github-actions", "github-prs"],
    challengeIds: ["ch-pl-actions"],
  },
  {
    id: "pl-testcontainers",
    title: "Testes de integração com Testcontainers",
    level: "pleno",
    pillar: "engenharia",
    languages: "ambos",
    summary:
      "Postgres/Redis reais no teste, não mock do repositório. Sobe container, roda migration, testa o SQL de verdade. Em Go: testcontainers-go. Em Java: módulo Testcontainers + Spring.",
    why2026:
      "Mock de repository testa o mock. Integração com container é o que pega o JOIN errado.",
    resourceIds: ["testcontainers", "testcontainers-go"],
    challengeIds: ["ch-pl-testcontainers"],
  },
  {
    id: "pl-sqlc-pratica",
    title: "sqlc de ponta a ponta",
    level: "pleno",
    pillar: "dados",
    languages: "go",
    summary:
      "SQL em arquivo, sqlc generate, tipos, transação. Sem ORM. A query é revisável no PR. Java equivalente: jOOQ ou JDBC + Flyway, não “sqlc em Java”.",
    why2026:
      "sqlc é o gosto de produção Go em 2026. Quem só conhece GORM genérico chega atrás.",
    resourceIds: ["sqlc", "goose"],
    challengeIds: ["ch-pl-sqlc"],
  },
  {
    id: "pl-oidc",
    title: "OIDC / OAuth2 com um IdP",
    level: "pleno",
    pillar: "seguranca",
    languages: "ambos",
    summary:
      "O mercado não quer que você assine JWT HS256 no service. Authorization Code + PKCE, IdP (Keycloak de lab, Cognito, Entra). Access token curto, resource server valida iss/aud. Spring Security / go-oidc.",
    why2026:
      "Open Finance, SSO corporativo e Keycloak são o dia a dia brasileiro. JWT caseiro fica no exercício JR.",
    resourceIds: ["oauth-oidc", "keycloak-docs", "rfc-8725"],
    challengeIds: ["ch-pl-oidc"],
  },
  {
    id: "pl-otel-pratica",
    title: "OpenTelemetry ponta a ponta",
    level: "pleno",
    pillar: "observabilidade",
    languages: "ambos",
    summary:
      "Instrumentar HTTP e SQL, exportar OTLP para um collector local (Jaeger/Grafana). TraceId no log. Um span que mostra a query lenta. Sem isso OTel é slide.",
    why2026:
      "Pergunta de Pleno: “como você acha o gargalo?”. A resposta é o trace, não o feeling.",
    resourceIds: ["otel", "otel-java", "otel-go"],
    challengeIds: ["ch-pl-otel"],
  },
  {
    id: "sr-hashing",
    title: "Algoritmos de sistema: hash consistente, bloom",
    level: "senior",
    pillar: "algoritmos",
    languages: "ambos",
    summary:
      "Consistent hashing (partição, cache distribuído). Bloom filter (existência provável). Merkle (replica). Você não inventa Raft no domingo — você sabe o problema que cada um resolve.",
    why2026:
      "System design Senior cobra o vocabulário. Implementar o anel uma vez grava na cabeça.",
    resourceIds: ["system-design-primer", "ddia", "sdi-xu"],
    challengeIds: ["ch-sr-hashing"],
  },
  {
    id: "sr-replicacao",
    title: "Replicação, failover e consenso (visão)",
    level: "senior",
    pillar: "dados",
    languages: "ambos",
    summary:
      "Leader/follower, lag, failover, split-brain. Raft/Paxos em dose conceitual. O que o Postgres e o Kafka já resolvem para você. DDIA caps. 5–9.",
    why2026:
      "Senior que trata o RDS como caixa preta absoluta não desenha o RPO.",
    resourceIds: ["ddia", "database-internals", "awesome-distributed", "postgres-replication"],
    challengeIds: ["ch-sr-hashing", "ch-sr-replicas"],
  },
  {
    id: "st-barra-base",
    title: "A barra de base no time (SQL, git, complexidade)",
    level: "staff",
    pillar: "lideranca",
    languages: "ambos",
    summary:
      "Staff define se o time entrevista LeetCode, SQL ou design. Contrata JR sem Big-O e paga o preço no n² de produção. Ou exige medium e perde gente boa de domínio. A base não some no Staff — ela vira padrão de contratação e de golden path.",
    why2026:
      "IA gera código. A barra de “sabe git, SQL e O(n)” ficou o mínimo para não afundar o sistema.",
    resourceIds: ["lalitm-find-problems", "grokking-algorithms", "pro-git"],
    challengeIds: ["ch-st-rfc"],
  },
]
