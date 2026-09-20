import type { Challenge } from "./types"

/** Buracos das colunas: cada um é repo isolado, com contrato e resultado esperado. */
export const extraChallenges: Challenge[] = [
  {
    id: "ch-jr-testes",
    title: "Testes que falham por motivo certo",
    level: "junior",
    rung: 1,
    kind: "laboratorio",
    complexity: 2,
    languages: ["java", "go"],
    estimatedHours: "6–10 h",
    domain: "Repo novo. Escolha Java OU Go. Catálogo de SKUs de uma loja de tinta.",
    problem:
      "A API tem POST /v1/skus e GET /v1/skus/{id}. O valor deste desafio não é o CRUD: é a suíte. Você entrega testes que quebram se a regra mudar — não testes que só repetem o mock.",
    rules: [
      "SKU code único, 3–16 chars [A-Z0-9-].",
      "priceCents > 0. Sem float.",
      "Não bate em API real fora do compose.",
    ],
    contracts: [
      {
        name: "Criar SKU",
        method: "POST",
        path: "/v1/skus",
        request: `{
  "code": "TINTA-AZUL-01",
  "priceCents": 4590
}`,
        response: `{
  "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "code": "TINTA-AZUL-01",
  "priceCents": 4590
}`,
        errors: ["409 CODE_TAKEN", "422 VALIDATION"],
      },
    ],
    expected: [
      "Repo isolado. Java: JUnit 5 + MockMvc ou WebTestClient. Go: table tests no handler e no store.",
      "Pelo menos: 1 feliz, 1 409, 1 422, 1 404 no GET.",
      "README: como rodar testes sem Docker e com Testcontainers/compose (um dos dois).",
    ],
    criteria: [
      "Suíte vermelha se você comentar a unique do code",
      "Sem teste que só faz assert true",
      "README com o comando único de teste",
    ],
    tips: [
      "Teste a regra, não o framework. Não mocke o banco se o Testcontainers cabe em 2 min.",
    ],
    topicIds: ["jr-testes", "jr-java-25", "jr-go-126"],
    resourceIds: ["junit5", "go-testing", "testcontainers"],
  },
  {
    id: "ch-jr-logs",
    title: "Log que dá para ler no incidente",
    level: "junior",
    rung: 1,
    kind: "laboratorio",
    complexity: 2,
    languages: ["java", "go"],
    estimatedHours: "4–8 h",
    domain: "Repo novo. API de abertura de tickets de suporte.",
    problem:
      "POST /v1/tickets cria um ticket. O desafio é o log: JSON, nível certo, requestId, sem senha, sem e-mail cru, sem body inteiro.",
    rules: [
      "Campo email no request é dado pessoal: no log vira ***@domínio ou hash.",
      "Cada request tem X-Request-Id (gera se faltar) e o mesmo id no log.",
      "INFO no feliz. WARN em 4xx. ERROR só em 5xx.",
    ],
    contracts: [
      {
        name: "Abrir ticket",
        method: "POST",
        path: "/v1/tickets",
        request: `{
  "email": "ana@feira.dev",
  "message": "Não consigo entrar"
}`,
        response: `{
  "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "status": "open"
}`,
        errors: ["422 VALIDATION"],
      },
    ],
    expected: [
      "Repo isolado. slog JSON (Go) ou Logback JSON (Java).",
      "Um teste que falha se o log contiver o e-mail em claro.",
      "README com um exemplo de linha de log feliz e uma de 422.",
    ],
    criteria: [
      "E-mail não aparece cru no log",
      "requestId no header e no JSON de log",
      "Sem stack no 4xx",
    ],
    tips: ["LGPD: o log é um banco. Trate como tal."],
    topicIds: ["jr-logs", "jr-lgpd"],
    resourceIds: ["lgpd-guia", "owasp-2025"],
  },
  {
    id: "ch-jr-validacao",
    title: "422 que o cliente consegue usar",
    level: "junior",
    rung: 2,
    kind: "laboratorio",
    complexity: 2,
    languages: ["java", "go"],
    estimatedHours: "5–8 h",
    domain: "Repo novo. Inscrição em oficina: nome, e-mail, idade, cupom opcional.",
    problem:
      "POST /v1/enrollments. Validação no servidor (nunca só no client). 422 com lista de campos. 200 só se tudo passa. Sem 500 por JSON malformado (é 400).",
    rules: [
      "name 2–80 chars. email RFC-ish. age 16–120.",
      "coupon se presente: 6 chars A-Z0-9. Cupom 'VENCIDO' → 422 COUPON_EXPIRED (regra de negócio, não formato).",
      "Vários campos errados = um 422 com todos. Não pare no primeiro.",
    ],
    contracts: [
      {
        name: "Inscrever",
        method: "POST",
        path: "/v1/enrollments",
        request: `{
  "name": "A",
  "email": "nao-e-email",
  "age": 12,
  "coupon": "VENCIDO"
}`,
        response: `{
  "error": {
    "code": "VALIDATION",
    "message": "Campos inválidos.",
    "fields": [
      {"name": "name", "code": "TOO_SHORT"},
      {"name": "email", "code": "INVALID"},
      {"name": "age", "code": "TOO_YOUNG"},
      {"name": "coupon", "code": "COUPON_EXPIRED"}
    ]
  }
}`,
        errors: ["400 JSON_INVALID", "422 VALIDATION"],
      },
    ],
    expected: [
      "Repo isolado. Bean Validation (Java) ou go-playground/validator — ou validação na mão, documentada.",
      "Teste do 422 com 4 fields. Teste do feliz (sem cupom).",
      "OpenAPI ou README listando cada code de campo.",
    ],
    criteria: [
      "422 agrupa todos os campos",
      "JSON quebrado → 400, não 500",
      "COUPON_EXPIRED distinto de formato",
    ],
    tips: ["Não devolva stack. Não traduza mensagem no client — o code é o contrato."],
    topicIds: ["jr-validacao", "jr-rest"],
    resourceIds: ["jakarta-validation", "fowler-richardson"],
  },
  {
    id: "ch-pl-hexagonal",
    title: "Domínio sem o framework no meio",
    level: "pleno",
    rung: 1,
    kind: "laboratorio",
    complexity: 4,
    languages: ["java", "go"],
    estimatedHours: "12–18 h",
    domain: "Repo novo. Caixa de uma padaria: abrir comanda, lançar item, fechar.",
    problem:
      "A regra (comanda só fecha se tem ≥1 item; totalCents é soma; não aceita item depois de fechada) vive num pacote/módulo sem Spring e sem net/http. Adapters: HTTP e Postgres. Teste de domínio sem Docker.",
    rules: [
      "status: open | closed.",
      "Fechar comanda vazia → 409 TAB_EMPTY.",
      "Item em comanda closed → 409 TAB_CLOSED.",
    ],
    contracts: [
      {
        name: "Abrir comanda",
        method: "POST",
        path: "/v1/tabs",
        response: `{
  "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
  "status": "open",
  "totalCents": 0
}`,
      },
      {
        name: "Lançar item",
        method: "POST",
        path: "/v1/tabs/{id}/items",
        request: `{
  "name": "Pão",
  "unitPriceCents": 450,
  "qty": 2
}`,
        response: `{
  "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
  "status": "open",
  "totalCents": 900
}`,
        errors: ["404 TAB_NOT_FOUND", "409 TAB_CLOSED"],
      },
    ],
    diagram: `flowchart LR
  HTTP[Adapter HTTP]
  DOM[Domínio padaria]
  PG[Adapter Postgres]
  HTTP --> DOM
  DOM --> PG
`,
    expected: [
      "Repo isolado. Pacote de domínio testável com `go test` / JUnit sem subir Tomcat.",
      "README: o que o domínio NÃO importa (zero spring, zero chi no core).",
      "Um teste de domínio: fechar vazio falha; dois pães somam 900.",
    ],
    criteria: [
      "Core sem import de web/ORM",
      "HTTP e SQL são borda",
      "Regra TAB_EMPTY coberta sem Docker",
    ],
    tips: [
      "Hexagonal não é pastinha extra. É: a regra não sabe que existe HTTP.",
    ],
    topicIds: ["pl-hexagonal"],
    resourceIds: ["fowler-hexagonal", "awesome-patterns", "arch-premier"],
  },
  {
    id: "ch-pl-api-compat",
    title: "v1 continua no ar quando nasce v2",
    level: "pleno",
    rung: 2,
    kind: "laboratorio",
    complexity: 3,
    languages: ["java", "go"],
    estimatedHours: "8–12 h",
    domain: "Repo novo. API de notas de um curso: title + score.",
    problem:
      "v1 devolve {score: 0-10}. v2 devolve {scoreCents: 0-1000} (mesmo número ×100) e depreca score. Clientes v1 não podem quebrar. Header Deprecation em v1.",
    rules: [
      "POST /v1/grades e POST /v2/grades escrevem a mesma tabela.",
      "GET /v1/grades/{id} ainda devolve score (número). GET /v2 devolve scoreCents (inteiro).",
      "v1: header Deprecation: true e Link para /v2/grades/{id}.",
    ],
    contracts: [
      {
        name: "v1 — ainda vivo",
        method: "GET",
        path: "/v1/grades/{id}",
        response: `{
  "id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
  "title": "Prova 1",
  "score": 8.5
}`,
      },
      {
        name: "v2 — fonte nova",
        method: "GET",
        path: "/v2/grades/{id}",
        response: `{
  "id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
  "title": "Prova 1",
  "scoreCents": 850
}`,
      },
    ],
    expected: [
      "Repo isolado. Teste: POST v2, GET v1 ainda responde score 8.5.",
      "README: o que você NÃO fez (não apagou v1, não mudou o JSON v1).",
      "Sunset opcional no header (RFC 8594) documentado.",
    ],
    criteria: [
      "v1 não muda o JSON",
      "v2 não quebra v1",
      "Deprecation no v1",
    ],
    tips: ["Fowler Parallel Change: expand, migrate, contract. Aqui você só faz o expand."],
    topicIds: ["pl-api-compat", "jr-rest"],
    resourceIds: ["fowler-parallel", "rfc-9110", "openapi"],
  },
  {
    id: "ch-pl-webhooks",
    title: "Webhook que não aceita lixo",
    level: "pleno",
    rung: 2,
    kind: "laboratorio",
    complexity: 4,
    languages: ["java", "go"],
    estimatedHours: "10–14 h",
    domain: "Repo novo. Você é o recebedor. Um gateway fake assina o body.",
    problem:
      "POST /v1/webhooks/payments. HMAC-SHA256 no header X-Signature. Idempotência por eventId. Replay fora da janela de 5 min recusa. Processar duas vezes o mesmo eventId não duplica efeito.",
    rules: [
      "Secret em env WEBHOOK_SECRET. Nunca no git.",
      "Assinatura inválida → 401. eventId repetido → 200 com o mesmo resultado (idempotente), sem segundo efeito.",
      "timestamp Unix no header X-Timestamp; |now - ts| > 300s → 401 STALE.",
    ],
    contracts: [
      {
        name: "Receber pagamento",
        method: "POST",
        path: "/v1/webhooks/payments",
        auth: "X-Signature + X-Timestamp",
        request: `{
  "eventId": "evt_123",
  "orderId": "ord_1",
  "amountCents": 1990
}`,
        response: `{
  "accepted": true,
  "eventId": "evt_123"
}`,
        errors: ["401 BAD_SIGNATURE", "401 STALE", "422 VALIDATION"],
      },
    ],
    diagram: `sequenceDiagram
  participant G as Gateway fake
  participant W as Seu serviço
  participant DB as Postgres
  G->>W: POST body + HMAC
  W->>W: verifica assinatura e janela
  alt novo
    W->>DB: INSERT event + efeito
    W-->>G: 200
  else replay
    W-->>G: 200 mesmo eventId
  end
`,
    expected: [
      "Repo isolado. Script que gera a assinatura (openssl / snippet no README).",
      "Testes: assinatura boa, assinatura ruim, replay, stale.",
      "Efeito (ex.: marcar order pago) acontece uma vez.",
    ],
    criteria: [
      "HMAC conferido",
      "Replay idempotente",
      "Secret fora do git",
    ],
    tips: ["Compare HMAC em tempo constante. Não logue o secret nem o header crú se ele vaza a chave."],
    topicIds: ["pl-webhooks", "pl-idempotencia"],
    resourceIds: ["stripe-webhooks", "rfc-9110"],
  },
  {
    id: "ch-sr-expand-contract",
    title: "Migração que não derruba o deploy",
    level: "senior",
    rung: 1,
    kind: "laboratorio",
    complexity: 4,
    languages: ["java", "go"],
    estimatedHours: "10–16 h",
    domain: "Repo novo. Tabela users tem name. Você precisa first_name + last_name.",
    problem:
      "Zero downtime. Expand: colunas novas nullable + backfill. App lê as duas formas. Contract: só depois (documentado, não obrigatório neste repo) você dropa name. Dois deploys simulados no README.",
    rules: [
      "Deploy A: colunas novas existem; escrita preenche name E first/last.",
      "Deploy B: leitura prefere first/last; se null, faz split de name.",
      "Nenhum passo exige lock longo nem rebuild da tabela em horário comercial.",
    ],
    contracts: [
      {
        name: "Criar usuário (depois do expand)",
        method: "POST",
        path: "/v1/users",
        request: `{
  "firstName": "Ana",
  "lastName": "Souza"
}`,
        response: `{
  "id": "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
  "firstName": "Ana",
  "lastName": "Souza",
  "displayName": "Ana Souza"
}`,
      },
    ],
    expected: [
      "Repo isolado. Migrations numeradas: (1) add columns, (2) backfill, (3) NOT NULL só se o backfill cobriu — ou deixa nullable e documenta o contract.",
      "README com a ordem de deploy e o que acontece se o app velho ainda está no ar.",
      "Teste: usuário criado só com name (seed da v1) ainda GET depois do expand.",
    ],
    criteria: [
      "App velho e novo coexistem num passo",
      "Sem DROP COLUMN neste desafio",
      "README honesto do passo contract (futuro)",
    ],
    tips: ["Parallel Change / expand-contract. Não é “uma migration e reza”."],
    topicIds: ["sr-zero-downtime", "pl-migrations"],
    resourceIds: ["fowler-parallel", "flyway", "goose"],
  },
  {
    id: "ch-sr-replicas",
    title: "Escrita no primary, leitura com lag",
    level: "senior",
    rung: 2,
    kind: "laboratorio",
    complexity: 4,
    languages: ["java", "go"],
    estimatedHours: "10–16 h",
    domain: "Repo novo. Feed de posts. Primary + replica (compose com dois Postgres ou replay atrasado).",
    problem:
      "POST /v1/posts vai no primary. GET lista pode ir na replica. Depois do POST, o GET /v1/posts/{id} do autor precisa ver o próprio post (read-your-writes). Lista pública pode estar atrasada.",
    rules: [
      "Dois datasources: write e read.",
      "GET by id do autor: primary ou sticky. Lista /v1/posts: replica.",
      "README: o que acontece se a replica atrasar 2s. Sem fingir que replica = primary.",
    ],
    contracts: [
      {
        name: "Criar post",
        method: "POST",
        path: "/v1/posts",
        request: `{"body": "olá"}`,
        response: `{
  "id": "ffffffff-ffff-ffff-ffff-ffffffffffff",
  "body": "olá"
}`,
      },
      {
        name: "Ler o próprio post",
        method: "GET",
        path: "/v1/posts/{id}",
        response: `{
  "id": "ffffffff-ffff-ffff-ffff-ffffffffffff",
  "body": "olá"
}`,
        errors: ["404 POST_NOT_FOUND"],
      },
    ],
    expected: [
      "Repo isolado. compose com primary+replica OU um fake de lag (fila de apply).",
      "Teste: POST + GET by id imediato = 200. Documente se a lista pode omitir o post.",
      "README: você NÃO resolveu multi-região.",
    ],
    criteria: [
      "Write path ≠ read path",
      "Read-your-writes no GET by id",
      "Lag explicado, não escondido",
    ],
    tips: ["DDIA cap. 5. Replica não é cache: é outro relógio."],
    topicIds: ["sr-replicacao", "sr-ddia"],
    resourceIds: ["ddia", "postgres-replication"],
  },
]
