import type { Challenge } from "./types"

const lumenRes = [
  "handbook-academy",
  "google-eng-practices",
  "rfc-9110",
  "owasp-2025",
]

export const lumenChallenges: Challenge[] = [
  {
    id: "lum-jr1-identity",
    title: "Lumen Identity — quem entra",
    level: "junior",
    rung: 1,
    kind: "plataforma",
    complexity: 3,
    languages: ["java"],
    estimatedHours: "14–20 h",
    domain: "Serviço Identity (Spring Boot 4, Java 25, Postgres). Porta 8081.",
    problem:
      "Este é o primeiro tijolo da Lumen. Sem Identity os outros serviços não autenticam. Você entrega um serviço que registra buyer/seller, faz login e emite JWT (RFC 8725). Não chama Catalog. Os outros desafios validam este JWT localmente — não fazem HTTP de login a cada request.",
    platform: {
      product: "Lumen",
      service: "identity",
      stack: "Java 25 · Spring Boot 4 · Postgres · Flyway",
      dependsOn: [],
      consumedBy: ["lum-jr2-orders", "lum-jr3-mesh", "lum-pl1-payments", "lum-pl3-bff"],
    },
    rules: [
      "E-mail único. Senha com hash (BCrypt). Nunca logar senha.",
      "Roles: buyer ou seller no registro. admin só por seed.",
      "JWT: HS256 + secret lumen-dev (README) OU RS256 + GET /v1/.well-known/jwks.json. exp 1h; sub = userId; role.",
      "Sem alg none. Sem JWT na query string.",
      "GET /v1/me exige Bearer válido. Outros serviços NÃO chamam /login — copiam secret ou JWKS.",
    ],
    contracts: [
      {
        name: "Registrar",
        method: "POST",
        path: "/v1/users",
        request: `{
  "email": "ana@feira.dev",
  "password": "uma-senha-longa",
  "role": "buyer"
}`,
        response: `{
  "id": "3f2a0c1e-6b1a-4d2e-9c11-0b8c1d2e3f40",
  "email": "ana@feira.dev",
  "role": "buyer",
  "createdAt": "2026-09-20T12:00:00Z"
}`,
        errors: ["409 EMAIL_TAKEN", "422 VALIDATION"],
      },
      {
        name: "Login",
        method: "POST",
        path: "/v1/auth/login",
        request: `{
  "email": "ana@feira.dev",
  "password": "uma-senha-longa"
}`,
        response: `{
  "accessToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}`,
        errors: ["401 BAD_CREDENTIALS"],
      },
      {
        name: "Eu",
        method: "GET",
        path: "/v1/me",
        auth: "Bearer do login",
        response: `{
  "id": "3f2a0c1e-6b1a-4d2e-9c11-0b8c1d2e3f40",
  "email": "ana@feira.dev",
  "role": "buyer"
}`,
        errors: ["401 UNAUTHORIZED"],
      },
    ],
    diagram: `sequenceDiagram
  participant C as Cliente
  participant I as Identity :8081
  participant P as Postgres
  C->>I: POST /v1/users
  I->>P: INSERT users
  I-->>C: 201 user
  C->>I: POST /v1/auth/login
  I-->>C: 200 accessToken
  C->>I: GET /v1/me (Bearer)
  I-->>C: 200 perfil
`,
    expected: [
      "Repo com ./mvnw test e docker compose só do Postgres (ou Testcontainers).",
      "OpenAPI ou README com os 3 contratos acima, byte-a-byte no feliz.",
      "Seed: seller joao@feira.dev / buyer ana@feira.dev.",
      "README: secret lumen-dev (HS256) ou JWKS. Orders/Payments/BFF usam isso, não um hop HTTP.",
      "Coleção HTTP (httpie ou .http) no repo.",
    ],
    criteria: [
      "Os 3 contratos passam (feliz + erros listados)",
      "Senha hasheada; JWT sem alg none",
      "README: como emitir token para os serviços seguintes",
    ],
    tips: [
      "OWASP JWT cheat sheet + RFC 8725. Este token será validado em Orders e Payments — não mude o claim sem versionar.",
    ],
    topicIds: ["jr-auth", "jr-spring-boot", "jr-java-25", "pl-jwt"],
    resourceIds: [...lumenRes, "jwt-java-cheatsheet", "rfc-8725", "spring-boot-4"],
  },
  {
    id: "lum-jr1-catalog",
    title: "Lumen Catalog — o que se vende",
    level: "junior",
    rung: 1,
    kind: "plataforma",
    complexity: 3,
    languages: ["go"],
    estimatedHours: "14–20 h",
    domain: "Serviço Catalog (Go 1.26, chi ou ServeMux, sqlc, Postgres). Porta 8082.",
    problem:
      "Segundo tijolo. REST na borda (seller CRUD). gRPC GetProduct em :9082 para Orders/BFF. Price só em centavos. Proto Buf no repo — se o JSON REST divergir do proto, a malha quebra.",
    platform: {
      product: "Lumen",
      service: "catalog",
      stack: "Go 1.26 · chi/ServeMux · sqlc · Postgres",
      dependsOn: [],
      consumedBy: ["lum-jr2-orders", "lum-jr3-mesh", "lum-pl1-cache", "lum-pl3-bff", "lum-sr1-search"],
    },
    rules: [
      "priceCents ≥ 1. name 3–80 chars. active default true.",
      "DELETE é soft (active=false) ou 404 se já inativo.",
      "Listagem: cursor, não offset. page size default 20, max 50.",
      "Não aceita float.",
    ],
    contracts: [
      {
        name: "Criar produto",
        method: "POST",
        path: "/v1/products",
        request: `{
  "sellerId": "11111111-1111-1111-1111-111111111111",
  "name": "Batata orgânica 1kg",
  "priceCents": 890
}`,
        response: `{
  "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "sellerId": "11111111-1111-1111-1111-111111111111",
  "name": "Batata orgânica 1kg",
  "priceCents": 890,
  "active": true
}`,
        errors: ["422 VALIDATION"],
      },
      {
        name: "Obter produto",
        method: "GET",
        path: "/v1/products/{id}",
        response: `{
  "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "sellerId": "11111111-1111-1111-1111-111111111111",
  "name": "Batata orgânica 1kg",
  "priceCents": 890,
  "active": true
}`,
        errors: ["404 PRODUCT_NOT_FOUND"],
      },
      {
        name: "Listar",
        method: "GET",
        path: "/v1/products?cursor=&limit=20",
        response: `{
  "items": [],
  "nextCursor": null
}`,
      },
    ],
    diagram: `flowchart LR
  Seller -->|HTTP REST| Catalog
  Catalog --> PG[(Postgres)]
  OrdersJR2[Orders JR2] -->|gRPC GetProduct :9082| Catalog
`,
    expected: [
      "sqlc gerado no CI local. go test ./...",
      "proto catalog.v1 + buf.yaml. GetProduct :9082. REST :8082 não diverge do proto.",
      "Seed: 1 produto da batata com o UUID do contrato (ou documentado no README).",
      "README: CATALOG_GRPC_ADDR para o Orders.",
    ],
    criteria: [
      "Contratos de criar/obter/listar",
      "Centavos inteiros; cursor na lista",
      "404 no id inexistente",
    ],
    tips: ["Learning Go + sqlc. Este GET é a API mais chamada da Lumen."],
    topicIds: ["jr-go-126", "jr-go-http", "jr-rest", "jr-postgres", "sr-buf"],
    resourceIds: ["go-chi", "sqlc", "learning-go", "rfc-9110", "grpc", "buf"],
  },
  {
    id: "lum-jr2-inventory",
    title: "Lumen Inventory — reserva de estoque",
    level: "junior",
    rung: 2,
    kind: "plataforma",
    complexity: 4,
    languages: ["java"],
    estimatedHours: "16–22 h",
    domain: "Serviço Inventory (Java, Postgres). Porta 8083.",
    problem:
      "Orders pede reserva por gRPC (Reserve). REST PUT é só seed/admin. Se você só faz UPDATE available = available - n sem checar, dois pedidos furam o estoque. Reserva atômica: available ≥ qty. SELECT FOR UPDATE.",
    platform: {
      product: "Lumen",
      service: "inventory",
      stack: "Java 25 · Spring Boot 4 · Postgres",
      dependsOn: ["lum-jr1-catalog"],
      consumedBy: ["lum-jr2-orders", "lum-jr3-mesh"],
    },
    rules: [
      "productId existe neste serviço (você seeda; não precisa chamar Catalog ainda).",
      "reserve é transação única. 409 se insuficiente.",
      "release devolve reserved → available (cancelamento).",
      "Nunca available negativo.",
    ],
    contracts: [
      {
        name: "Definir estoque",
        method: "PUT",
        path: "/v1/stock/{productId}",
        request: `{ "available": 10 }`,
        response: `{
  "productId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "available": 10,
  "reserved": 0
}`,
      },
      {
        name: "Reservar (lab HTTP — hop real é gRPC Reserve :9083)",
        method: "POST",
        path: "/v1/stock/{productId}/reserve",
        request: `{
  "qty": 2,
  "orderId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
}`,
        response: `{
  "productId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "available": 8,
  "reserved": 2,
  "orderId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
}`,
        errors: ["409 STOCK_INSUFFICIENT", "404 STOCK_NOT_FOUND"],
      },
      {
        name: "Liberar",
        method: "POST",
        path: "/v1/stock/{productId}/release",
        request: `{ "qty": 2, "orderId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" }`,
        response: `{ "available": 10, "reserved": 0 }`,
      },
    ],
    diagram: `sequenceDiagram
  participant O as Orders
  participant I as Inventory :9083
  participant P as Postgres
  O->>I: gRPC Reserve qty=2
  I->>P: BEGIN; SELECT FOR UPDATE
  alt suficiente
    I->>P: available-=2 reserved+=2
    I-->>O: OK Stock
  else insuficiente
    I-->>O: FAILED_PRECONDITION STOCK_INSUFFICIENT
  end
`,
    expected: [
      "Teste concorrente: 10 reservas de 1 em estoque 5 → no máximo 5 sucessos.",
      "proto inventory.v1 + buf.yaml: Reserve e Release em :9083.",
      "README: INVENTORY_GRPC_ADDR (:9083) para o Orders. PUT HTTP só para seed.",
    ],
    criteria: [
      "Reserva atômica",
      "409 quando falta",
      "Teste de corrida documentado ou automatizado",
    ],
    tips: ["Transações + EXPLAIN. Este serviço é o pescoço do checkout."],
    topicIds: ["pl-transacoes", "jr-postgres", "jr-spring-boot", "pl-grpc-pratica"],
    resourceIds: ["postgres-explain", "spring-boot-4", "use-the-index-luke", "grpc", "buf"],
  },
  {
    id: "lum-jr2-orders",
    title: "Lumen Orders — o pedido fala com os outros",
    level: "junior",
    rung: 2,
    kind: "plataforma",
    complexity: 4,
    languages: ["go"],
    estimatedHours: "18–26 h",
    domain: "Serviço Orders (Go). HTTP :8084 · gRPC :9084. Cliente gRPC de Catalog/Inventory.",
    problem:
      "Primeira conversa de verdade. Borda: HTTP POST /v1/orders. Interno: gRPC GetProduct + gRPC Reserve. Se Inventory FAILED_PRECONDITION, você HTTP 409 e não deixa placed. Deadline 2s. JWT local. Sem pagamento ainda. Sem Kafka neste nível.",
    platform: {
      product: "Lumen",
      service: "orders",
      stack: "Go 1.26 · Postgres · gRPC (Buf) · HTTP na borda",
      dependsOn: ["lum-jr1-identity", "lum-jr1-catalog", "lum-jr2-inventory"],
      consumedBy: ["lum-jr3-mesh", "lum-pl1-payments", "lum-pl2-kafka", "lum-pl3-bff"],
    },
    rules: [
      "Bearer do Identity. Só role buyer cria pedido.",
      "qty ≥ 1. Um item por pedido neste nível (simplifica; Pleno pode expandir).",
      "totalCents = priceCents * qty (do Catalog, não do client).",
      "status: placed | cancelled. cancel chama Inventory release.",
      "Catalog NOT_FOUND → HTTP 422 PRODUCT_NOT_FOUND. Deadline 2s → 503 UPSTREAM_TIMEOUT.",
    ],
    contracts: [
      {
        name: "Criar pedido",
        method: "POST",
        path: "/v1/orders",
        auth: "Bearer buyer",
        request: `{
  "productId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "qty": 2
}`,
        response: `{
  "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "buyerId": "3f2a0c1e-6b1a-4d2e-9c11-0b8c1d2e3f40",
  "productId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "qty": 2,
  "unitPriceCents": 890,
  "totalCents": 1780,
  "status": "placed"
}`,
        errors: [
          "401",
          "403 se seller",
          "409 STOCK_INSUFFICIENT",
          "422 PRODUCT_NOT_FOUND",
          "503 UPSTREAM_TIMEOUT",
        ],
      },
      {
        name: "Obter pedido",
        method: "GET",
        path: "/v1/orders/{id}",
        auth: "Bearer do buyer dono",
        response: `{
  "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "status": "placed",
  "totalCents": 1780
}`,
        errors: ["404 ORDER_NOT_FOUND", "403 se outro buyer"],
      },
    ],
    diagram: `sequenceDiagram
  participant B as Buyer
  participant O as Orders :8084
  participant C as Catalog :9082
  participant I as Inventory :9083
  B->>O: POST /v1/orders HTTP Bearer
  Note over O: JWT local
  O->>C: gRPC GetProduct deadline 2s
  C-->>O: OK priceCents
  O->>I: gRPC Reserve
  alt ok
    I-->>O: OK
    O-->>B: 201 placed
  else sem estoque
    I-->>O: FAILED_PRECONDITION
    O-->>B: 409 STOCK_INSUFFICIENT
  end
`,
    expected: [
      "Env: IDENTITY_JWT_SECRET=lumen-dev (ou IDENTITY_JWKS), CATALOG_GRPC_ADDR, INVENTORY_GRPC_ADDR.",
      "proto orders.v1 :9084 com CreateOrder, GetOrder, MarkPaid — BFF/Payments reusam, não reinventam.",
      "Testes com buf mock / grpcurl. Binários vizinhos não são pré-requisito.",
      "README do fluxo com curl na ordem: login → create product → put stock → create order.",
    ],
    criteria: [
      "Chama Catalog e Inventory por gRPC",
      "Preço vem do Catalog",
      "409/503 mapeados como na ficha",
      "Timeout 2s",
    ],
    tips: [
      "Você pode rodar os três serviços locais. Mock no teste unitário; malha no JR3.",
    ],
    topicIds: ["jr-go-http", "pl-resiliencia", "jr-rest", "jr-auth", "pl-grpc-pratica"],
    resourceIds: ["fowler-circuit-breaker", "go-context", "rfc-9110", "grpc", "buf"],
  },
  {
    id: "lum-jr3-mesh",
    title: "Lumen Mesh — compose e resiliência",
    level: "junior",
    rung: 3,
    kind: "plataforma",
    complexity: 4,
    languages: ["java", "go"],
    estimatedHours: "12–18 h",
    domain: "Repo de malha (compose) + um hop extra no Orders contra API pública.",
    problem:
      "Agora a plataforma existe. Um compose sobe Identity, Catalog, Inventory, Orders e Postgres. Script e2e: registra, loga, cria produto, estoque, pedido. Orders consulta uma API de clima (public-apis) com timeout 1s e circuit breaker: se o clima cair, o pedido AINDA é placed — clima é nice-to-have, não o checkout.",
    platform: {
      product: "Lumen",
      service: "mesh",
      stack: "Compose · k6 opcional · public-apis",
      dependsOn: ["lum-jr1-identity", "lum-jr1-catalog", "lum-jr2-inventory", "lum-jr2-orders"],
      consumedBy: ["lum-pl1-payments"],
    },
    rules: [
      "Clima não bloqueia o pedido.",
      "Health de cada serviço no compose.",
      "Sem senha no git.",
    ],
    contracts: [
      {
        name: "Pedido com clima opcional",
        method: "GET",
        path: "/v1/orders/{id}",
        auth: "Bearer buyer",
        response: `{
  "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "status": "placed",
  "weatherHint": "ok | unavailable"
}`,
      },
    ],
    diagram: `flowchart TB
  Script[e2e.sh]
  Script --> Id[Identity]
  Script --> Cat[Catalog]
  Script --> Inv[Inventory]
  Script --> Ord[Orders]
  Ord --> Ext[api pública clima]
  Ext -.->|falha| CB[circuit breaker]
  CB --> Ord
`,
    expected: [
      "docker compose up --build e um script que termina 0 no feliz.",
      "README: diagrama da malha (pode ser o mermaid desta ficha).",
      "Parágrafo: o que acontece se o clima 500.",
    ],
    criteria: [
      "Compose dos 4 serviços",
      "e2e feliz",
      "Clima falha e pedido permanece placed",
    ],
    tips: [
      "public-apis.github.io — escolha um endpoint GET simples. Fowler Circuit Breaker.",
    ],
    topicIds: ["jr-docker", "pl-resiliencia", "pl-k6"],
    resourceIds: ["public-apis", "fowler-circuit-breaker", "k6-docs"],
  },
  {
    id: "lum-pl1-payments",
    title: "Lumen Payments — cobra uma vez",
    level: "pleno",
    rung: 1,
    kind: "plataforma",
    complexity: 4,
    languages: ["java"],
    estimatedHours: "16–24 h",
    domain: "Payments :8085. Gateway fake. Idempotency-Key.",
    problem:
      "POST /v1/payments HTTP na borda. Cobra totalCents via gRPC GetOrder. Idempotency-Key. gRPC MarkPaid. Sem Kafka neste desafio (PL2 Rabbit; SR1 outbox Kafka).",
    platform: {
      product: "Lumen",
      service: "payments",
      stack: "Java · Postgres · cliente gRPC Orders :9084",
      dependsOn: ["lum-jr2-orders"],
      consumedBy: ["lum-pl2-notify", "lum-pl2-kafka", "lum-sr1-outbox"],
    },
    rules: [
      "Só buyer dono do pedido.",
      "Pedido já paid → 200 o pagamento existente, não 409.",
      "Pedido cancelled → 409 ORDER_NOT_PAYABLE.",
      "Port de gateway: interface + fake que pode falhar 20% no teste de retry.",
    ],
    contracts: [
      {
        name: "Pagar",
        method: "POST",
        path: "/v1/payments",
        auth: "Bearer buyer + Idempotency-Key",
        request: `{ "orderId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" }`,
        response: `{
  "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
  "orderId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "amountCents": 1780,
  "status": "captured"
}`,
        errors: ["409 IDEMPOTENCY_CONFLICT", "409 ORDER_NOT_PAYABLE", "401"],
      },
    ],
    diagram: `sequenceDiagram
  participant B as Buyer
  participant P as Payments :8085
  participant O as Orders :9084
  B->>P: POST /payments HTTP Idempotency-Key
  P->>O: gRPC GetOrder
  P->>P: insert payment unique key
  P->>O: gRPC MarkPaid
  P-->>B: 201 captured
  B->>P: retry mesma key
  P-->>B: 200 mesmo paymentId
`,
    expected: [
      "Tabela (idempotency_key, body_hash, payment_id).",
      "Teste de retry sem segundo capture.",
      "README: PAYMENTS_URL e o PATCH que o Orders precisa expor (documente o contrato do PATCH).",
    ],
    criteria: [
      "Idempotência",
      "Centavos",
      "Orders marcado paid",
      "Conflito de body",
    ],
    tips: ["Mesma regra do checkout antigo, agora no produto Lumen."],
    topicIds: ["pl-idempotencia", "pl-resiliencia", "pl-transacoes"],
    resourceIds: ["rfc-9110", "fowler-circuit-breaker"],
  },
  {
    id: "lum-pl1-cache",
    title: "Lumen Cache — catálogo no Redis",
    level: "pleno",
    rung: 1,
    kind: "plataforma",
    complexity: 3,
    languages: ["go"],
    estimatedHours: "10–14 h",
    domain: "O Catalog ganha Redis. Mesmo contrato GET /v1/products/{id}.",
    problem:
      "Cache-aside no GET produto. TTL 60s. POST/PUT invalida a key. Hit/miss em header X-Cache: HIT|MISS. Sem mudar o JSON do produto — Orders não pode quebrar.",
    platform: {
      product: "Lumen",
      service: "catalog",
      stack: "Go · Redis · Postgres",
      dependsOn: ["lum-jr1-catalog"],
      consumedBy: ["lum-pl3-bff"],
    },
    rules: ["Key product:{id}. Invalidação no write. Sem cache de 404 por mais de 5s."],
    contracts: [
      {
        name: "GET com cache",
        method: "GET",
        path: "/v1/products/{id}",
        response: `{ "id": "...", "priceCents": 890, "active": true }`,
      },
    ],
    diagram: `flowchart LR
  GET --> Redis
  Redis -->|miss| PG[(Postgres)]
  PG --> Redis
  Write --> Redis
`,
    expected: ["Compose com Redis. Dois GETs: MISS depois HIT. Write → próximo GET MISS."],
    criteria: ["HIT/MISS visível", "Invalidação no write", "JSON inalterado"],
    tips: ["roadmap.sh/redis + primer cache."],
    topicIds: ["pl-redis", "jr-postgres"],
    resourceIds: ["roadmap-sh-redis", "system-design-primer-cache", "redis-in-action"],
  },
  {
    id: "lum-pl2-notify",
    title: "Lumen Notify — e-mail com DLX",
    level: "pleno",
    rung: 2,
    kind: "plataforma",
    complexity: 4,
    languages: ["go"],
    estimatedHours: "12–16 h",
    domain: "Notify :8086 + RabbitMQ. Payments publica comando SendMail — não o evento Kafka.",
    problem:
      "Quando o pagamento captura, Payments publica SendMail em lumen.notify.mail. Worker envia (log basta). Falha 3x → DLX. Payments já respondeu 201. Isto não é PaymentCaptured do Kafka (esse evento só no outbox SR1).",
    platform: {
      product: "Lumen",
      service: "notify",
      stack: "Go · RabbitMQ",
      dependsOn: ["lum-pl1-payments"],
      consumedBy: [],
    },
    rules: [
      "Payload: {type: SendMail, paymentId, orderId, buyerEmail, amountCents}. Não use PaymentCaptured aqui.",
      "E-mail real opcional. Log estruturado conta.",
      "DLX obrigatória. Mensagem na DLQ inspecionável.",
    ],
    contracts: [
      {
        name: "Comando SendMail (fila, não HTTP, não Kafka)",
        method: "POST",
        path: "rabbit://lumen.notify.mail",
        request: `{
  "type": "SendMail",
  "paymentId": "cccccccc-cccc-cccc-cccc-cccccccccccc",
  "orderId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "buyerEmail": "ana@feira.dev",
  "amountCents": 1780
}`,
      },
    ],
    diagram: `flowchart LR
  Pay[Payments] --> Q[lumen.notify.mail]
  Q --> W[Worker]
  W -->|ok| Done[ack]
  W -->|3 falhas| DLX[lumen.notify.mail.dlq]
`,
    expected: ["Compose Rabbit. README: como forçar DLQ. Payments 201 mesmo com worker down."],
    criteria: ["Fila + DLX", "Payments não bloqueia no mail", "Payload versionado no README"],
    tips: ["RabbitMQ DLX docs + curso Java/Spring Rabbit se vier do Java."],
    topicIds: ["pl-rabbitmq", "pl-events"],
    resourceIds: ["rabbitmq-dlx", "udemy-rabbitmq", "fowler-events"],
  },
  {
    id: "lum-pl2-kafka",
    title: "Lumen Events — PedidoCriado no Kafka",
    level: "pleno",
    rung: 2,
    kind: "plataforma",
    complexity: 4,
    languages: ["go", "java"],
    estimatedHours: "12–16 h",
    domain: "Tópico lumen.orders.placed. Chave = sellerId.",
    problem:
      "Quando o pedido fica placed, Orders publica PedidoCriado (notificação + estado mínimo). Consumer no mesmo repo (analytics fake) grava em tabela. At-least-once + unique orderId. Não é event sourcing. Não é outbox ainda (Senior).",
    platform: {
      product: "Lumen",
      service: "orders-events",
      stack: "Kafka · Postgres",
      dependsOn: ["lum-jr2-orders"],
      consumedBy: ["lum-sr1-outbox"],
    },
    rules: [
      "Nome no passado: PedidoCriado.",
      "Se Kafka cair, documente o que acontece (perda possível — Senior resolve com outbox).",
      "Consumer idempotente.",
    ],
    contracts: [
      {
        name: "PedidoCriado",
        method: "POST",
        path: "kafka://lumen.orders.placed",
        request: `{
  "type": "PedidoCriado",
  "orderId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "sellerId": "11111111-1111-1111-1111-111111111111",
  "totalCents": 1780,
  "occurredAt": "2026-09-20T12:05:00Z"
}`,
      },
    ],
    diagram: `flowchart LR
  Ord[Orders] -->|key sellerId| T[lumen.orders.placed]
  T --> An[consumer analytics]
  An --> PG[(Postgres unique orderId)]
`,
    expected: ["Compose Kafka. README: notification vs sourcing. Consumer lag como ver."],
    criteria: ["Tópico + chave", "Consumer idempotente", "README Fowler (qual dos quatro)"],
    tips: ["fowler.com/articles/201701-event-driven.html"],
    topicIds: ["pl-kafka-intro", "pl-events"],
    resourceIds: ["fowler-events", "kafka-guide", "udemy-kafka"],
  },
  {
    id: "lum-pl3-bff",
    title: "Lumen BFF — GraphQL na borda",
    level: "pleno",
    rung: 3,
    kind: "plataforma",
    complexity: 4,
    languages: ["java", "go"],
    estimatedHours: "16–22 h",
    domain: "BFF :8080. GraphQL. DataLoader. Não substitui os REST internos.",
    problem:
      "Query GraphQL na borda. Interno: gRPC GetOrder + gRPC GetProduct (DataLoader). JWT local. Mutation createOrder → gRPC CreateOrder. REST interno continua para e2e/curl.",
    platform: {
      product: "Lumen",
      service: "bff",
      stack: "Spring GraphQL ou gqlgen",
      dependsOn: ["lum-jr1-identity", "lum-jr1-catalog", "lum-jr2-orders"],
      consumedBy: [],
    },
    rules: [
      "REST interno intacto. BFF é borda.",
      "Limite de profundidade ou complexidade documentado.",
      "README: quando NÃO usar GraphQL na Lumen.",
    ],
    contracts: [
      {
        name: "Query pedido",
        method: "POST",
        path: "/graphql",
        auth: "Bearer",
        request: `{ "query": "{ order(id:\\"bbbb...\\") { totalCents product { name } } }" }`,
        response: `{ "data": { "order": { "totalCents": 1780, "product": { "name": "Batata orgânica 1kg" } } } }`,
      },
    ],
    diagram: `flowchart TB
  Client -->|HTTP GraphQL| BFF
  BFF -->|JWT local| JWT[claims]
  BFF -->|gRPC GetOrder / CreateOrder| Ord
  BFF -->|gRPC GetProduct DataLoader| Cat
`,
    expected: ["Log SQL/HTTP: 1 batch de products, não N. Schema no repo."],
    criteria: ["DataLoader", "JWT", "REST interno não quebrado"],
    tips: ["Opcional na carreira genérica; aqui é a borda da Lumen."],
    topicIds: ["pl-graphql", "pl-nplus1", "pl-openapi"],
    resourceIds: ["graphql-learn", "spring-graphql", "gqlgen"],
  },
  {
    id: "lum-pl3-otel",
    title: "Lumen Trace — o GET lento do pedido",
    level: "pleno",
    rung: 3,
    kind: "plataforma",
    complexity: 3,
    languages: ["java", "go"],
    estimatedHours: "10–14 h",
    domain: "OTel nos hops Orders → Catalog → Inventory.",
    problem:
      "Um GET /v1/orders/{id} que hidrata produto via gRPC. Trace com 3 spans (HTTP + 2 gRPC). TraceId no log. Collector local (Jaeger). Sem vendor pago.",
    platform: {
      product: "Lumen",
      service: "orders",
      stack: "OTel OTLP",
      dependsOn: ["lum-jr2-orders"],
      consumedBy: ["lum-sr2-runtime"],
    },
    rules: ["Propagação traceparent. PII fora do span."],
    contracts: [],
    diagram: `flowchart LR
  GET -->|HTTP| S1[span orders]
  S1 -->|gRPC| S2[span catalog.GetProduct]
  S1 -->|gRPC| S3[span inventory]
`,
    expected: ["Screenshot ou export do trace no repo. README: como subir collector."],
    criteria: ["3 spans", "TraceId no log", "OTLP local"],
    tips: ["otel-java / otel-go."],
    topicIds: ["pl-otel-pratica", "pl-otel"],
    resourceIds: ["otel", "otel-java", "otel-go", "observability-eng"],
  },
  {
    id: "lum-sr1-outbox",
    title: "Lumen Outbox — paid e evento na mesma transação",
    level: "senior",
    rung: 1,
    kind: "plataforma",
    complexity: 5,
    languages: ["java", "go"],
    estimatedHours: "18–28 h",
    domain: "Payments deixa de dual-write. Outbox + publisher.",
    problem:
      "Hoje PL2 publica no Kafka no request. Senior: INSERT payment + INSERT outbox NA MESMA transação. Publisher relê e manda PaymentCaptured. Sem isso um 500 depois do Kafka e antes do commit mente. Não é sourcing: o estado continua nas tabelas.",
    platform: {
      product: "Lumen",
      service: "payments",
      stack: "Postgres outbox · Kafka",
      dependsOn: ["lum-pl1-payments", "lum-pl2-kafka"],
      consumedBy: [],
    },
    rules: [
      "Nada de produce-then-commit.",
      "Publisher com at-least-once; consumer já é idempotente.",
      "README: saga se o PATCH do Orders falhar (compensação ou retry).",
    ],
    contracts: [
      {
        name: "Outbox row",
        method: "POST",
        path: "db://outbox",
        request: `{
  "id": "uuid",
  "topic": "lumen.payments.captured",
  "payload": { "type": "PaymentCaptured", "paymentId": "...", "orderId": "..." },
  "publishedAt": null
}`,
      },
    ],
    diagram: `sequenceDiagram
  participant P as Payments
  participant DB as Postgres
  participant Pub as Publisher
  participant K as Kafka
  P->>DB: BEGIN payment + outbox
  P->>DB: COMMIT
  Pub->>DB: SELECT unpublished
  Pub->>K: PaymentCaptured
  Pub->>DB: publishedAt=now
`,
    expected: ["Teste: Kafka down no request → payment committed, evento sai depois."],
    criteria: ["Mesma transação", "Publisher separado", "README saga/compensação"],
    tips: ["microservices.io outbox + Richardson cap. 4. DDIA 7–9."],
    topicIds: ["sr-outbox-saga", "sr-kafka", "sr-ddia"],
    resourceIds: ["outbox", "saga", "microservices-patterns", "ddia"],
  },
  {
    id: "lum-sr1-search",
    title: "Lumen Search — achar a batata",
    level: "senior",
    rung: 1,
    kind: "plataforma",
    complexity: 4,
    languages: ["java", "go"],
    estimatedHours: "12–18 h",
    domain: "Busca no catálogo. FTS ou Elastic 8/9.",
    problem:
      "GET /v1/search?q=bata. Ranking. Seed com 200 produtos. README: por que FTS ou Elastic (não o livro de 2015). O Catalog continua a fonte de verdade.",
    platform: {
      product: "Lumen",
      service: "search",
      stack: "Postgres FTS ou Elastic 8/9",
      dependsOn: ["lum-jr1-catalog"],
      consumedBy: ["lum-pl3-bff"],
    },
    rules: ["Indexação a partir do Catalog (batch ou evento). Sem dual write sem explicar."],
    contracts: [
      {
        name: "Buscar",
        method: "GET",
        path: "/v1/search?q=bata",
        response: `{ "items": [{ "productId": "aaaa...", "name": "Batata orgânica 1kg", "score": 0.92 }] }`,
      },
    ],
    diagram: `flowchart LR
  Cat[Catalog] --> Idx[index]
  Q[GET /search] --> Idx
`,
    expected: ["200 docs. Caso em que a outra ferramenta ganharia."],
    criteria: ["Busca ranqueada", "README da escolha", "Catalog é source of truth"],
    tips: ["Elastic docs 8/9. Primer search."],
    topicIds: ["sr-search", "sr-system-design"],
    resourceIds: ["elastic-docs", "system-design-primer", "sdi-xu"],
  },
  {
    id: "lum-sr2-runtime",
    title: "Lumen Runtime — K8s, SLO, o que ficou de fora",
    level: "senior",
    rung: 2,
    kind: "plataforma",
    complexity: 5,
    languages: ["java", "go"],
    estimatedHours: "16–24 h",
    domain: "Manifests + SLO do checkout. Dois deploys: um Java, um Go.",
    problem:
      "Identity (Java) e Catalog (Go) no Kubernetes (kind/k3d). requests/limits, probes. GOMAXPROCS/cgroup e JVM MaxRAMPercentage no README. SLO: 99% dos POST /v1/orders em 300ms no lab; error budget. Parágrafo do que NÃO está (multi-região, DR, service mesh).",
    platform: {
      product: "Lumen",
      service: "runtime",
      stack: "K8s · SLO",
      dependsOn: ["lum-jr3-mesh", "lum-pl3-otel"],
      consumedBy: ["lum-st-rfc"],
    },
    rules: ["Sem * no IAM imaginário se houver Terraform anexo. State sem segredo."],
    contracts: [],
    diagram: `flowchart TB
  Ing[Ingress] --> Id[Identity deploy]
  Ing --> Cat[Catalog deploy]
  Id --> PG[(Postgres)]
  Cat --> PG
`,
    expected: ["YAML no repo. README SLO + error budget + exclusões. k6 opcional contra o kind."],
    criteria: ["Dois deploys com probes", "SLO escrito", "O que ficou de fora"],
    tips: ["SRE book. go-gomaxprocs. Newman se for estrangular."],
    topicIds: ["sr-k8s", "sr-sre", "sr-iac"],
    resourceIds: ["sre-book", "go-gomaxprocs", "terraform", "udemy-system-design"],
  },
  {
    id: "lum-st-rfc",
    title: "Lumen RFC — quem dona o preço",
    level: "staff",
    rung: 1,
    kind: "plataforma",
    complexity: 5,
    languages: ["java", "go"],
    estimatedHours: "12–20 h",
    domain: "Só documento. Times: Catalog (Go) e Checkout/Payments (Java).",
    problem:
      "Promoção de 10% no fim de semana. Quem é a fonte do preço? Catalog? Orders? Payments? Escreva a RFC: opções, trade-off, rollout, rollback, o que a IA do time não pode mergear sozinha. Golden path: cookiecutter/copier de um serviço Lumen Java e um Go.",
    platform: {
      product: "Lumen",
      service: "org",
      stack: "RFC + templates",
      dependsOn: ["lum-sr2-runtime"],
      consumedBy: [],
    },
    rules: ["Sem código obrigatório além dos templates. Clareza > volume."],
    contracts: [],
    diagram: `flowchart LR
  RFC[RFC preço] --> Cat[Catalog Go]
  RFC --> Pay[Payments Java]
  GP[Golden path] --> NewSvc[novo serviço Lumen]
`,
    expected: ["RFC.md com decisão. templates/java e templates/go. Critérios de promoção do time."],
    criteria: ["Decisão explícita", "Rollout/rollback", "Dois templates", "Barra de review"],
    tips: ["lalitm find-problems. Larson. laws.of.se."],
    topicIds: ["st-rfc", "st-find-problems", "st-platform", "st-impacto"],
    resourceIds: ["lalitm-find-problems", "staff-engineer", "laws-se", "handbook-academy"],
  },
]
