import type { FlowHop, NeighborMock } from "./types"

const ids = {
  buyer: "3f2a0c1e-6b1a-4d2e-9c11-0b8c1d2e3f40",
  seller: "11111111-1111-1111-1111-111111111111",
  product: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  order: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  payment: "cccccccc-cccc-cccc-cccc-cccccccccccc",
}

const jwtBuyer =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzZjJhMGMxZS02YjFhLTRkMmUtOWMxMS0wYjhjMWQyZTNmNDAiLCJyb2xlIjoiYnV5ZXIiLCJlbWFpbCI6ImFuYUBmZWlyYS5kZXYiLCJleHAiOjk5OTk5OTk5OTl9.mock"

const jwtSeller =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTExMTExMS0xMTExLTExMTEtMTExMS0xMTExMTExMTExMTEiLCJyb2xlIjoic2VsbGVyIiwiZXhwIjo5OTk5OTk5OTk5fQ.mock"

const err = (code: string, message: string) => `{
  "error": {
    "code": "${code}",
    "message": "${message}"
  }
}`

const grpcErr = (rpc: number, rpcName: string, appCode: string, message: string) => `{
  "code": ${rpc},
  "message": "${rpcName}",
  "details": [{
    "@type": "type.googleapis.com/lumen.v1.Error",
    "error": { "code": "${appCode}", "message": "${message}" }
  }]
}`

const productOk = `{
  "id": "${ids.product}",
  "sellerId": "${ids.seller}",
  "name": "Batata orgânica 1kg",
  "priceCents": 890,
  "active": true
}`

const orderPlaced = `{
  "id": "${ids.order}",
  "buyerId": "${ids.buyer}",
  "productId": "${ids.product}",
  "qty": 2,
  "unitPriceCents": 890,
  "totalCents": 1780,
  "status": "placed"
}`

const orderPaid = `{
  "id": "${ids.order}",
  "buyerId": "${ids.buyer}",
  "productId": "${ids.product}",
  "qty": 2,
  "unitPriceCents": 890,
  "totalCents": 1780,
  "status": "paid"
}`

const reserveOk = `{
  "productId": "${ids.product}",
  "available": 8,
  "reserved": 2,
  "orderId": "${ids.order}"
}`

export interface LumenSpec {
  trigger: string
  hops: FlowHop[]
  mocks: NeighborMock[]
}

export const lumenSpecs: Record<string, LumenSpec> = {
  "lum-jr1-identity": {
    trigger:
      "Você (ou o .http). Ninguém da malha chama Identity neste desafio. Depois, Orders/Payments/BFF só validam o JWT — não fazem HTTP de login.",
    hops: [
      { step: 1, who: "Cliente", does: "POST /v1/users", protocol: "http", target: "Identity :8081" },
      { step: 2, who: "Identity", does: "INSERT users (hash da senha)", protocol: "postgres", target: "tabela users" },
      { step: 3, who: "Cliente", does: "POST /v1/auth/login", protocol: "http", target: "Identity :8081" },
      { step: 4, who: "Identity", does: "emite JWT (sem chamada a outro serviço)", protocol: "interno", target: "memória / JWKS" },
      { step: 5, who: "Cliente", does: "GET /v1/me", protocol: "http", target: "Identity :8081" },
      { step: 6, who: "Outros serviços", does: "não chamam Identity. Copiam o secret/JWKS do README.", protocol: "interno", target: "JWT local" },
    ],
    mocks: [
      {
        neighbor: "Quem for usar este JWT depois (Orders, Payments, BFF)",
        protocol: "http",
        direction: "eles chamam você",
        endpoint: "não chamam HTTP — copiam o token. Mock local: o JWT abaixo.",
        cases: [
          {
            name: "Buyer válido",
            when: "login de ana@feira.dev",
            status: 200,
            body: `{
  "accessToken": "${jwtBuyer}",
  "tokenType": "Bearer",
  "expiresIn": 3600
}`,
            youDo: "Claims: sub=" + ids.buyer + ", role=buyer. Sem alg none. Secret HS256: lumen-dev (README). JWKS só se escolher RS256.",
          },
          {
            name: "Seller válido",
            when: "login de joao@feira.dev",
            status: 200,
            body: `{
  "accessToken": "${jwtSeller}",
  "tokenType": "Bearer",
  "expiresIn": 3600
}`,
            youDo: "role=seller. Orders deve recusar create order (403).",
          },
          {
            name: "Credencial errada",
            when: "senha inválida",
            status: 401,
            body: err("BAD_CREDENTIALS", "E-mail ou senha inválidos."),
            youDo: "Não emite token.",
          },
        ],
      },
    ],
  },

  "lum-jr1-catalog": {
    trigger:
      "Seller cria produto via HTTP. O contrato interno GetProduct (gRPC :9082) já nasce aqui — Orders vai chamar isso, não o REST. REST é borda de seller; gRPC é o hop de serviço.",
    hops: [
      { step: 1, who: "Seller/você", does: "POST /v1/products", protocol: "http", target: "Catalog :8082" },
      { step: 2, who: "Catalog", does: "INSERT products", protocol: "postgres", target: "tabela products" },
      { step: 3, who: "Catalog", does: "expõe catalog.v1.CatalogService/GetProduct", protocol: "grpc", target: ":9082 — Buf proto no repo" },
      { step: 4, who: "Orders (JR2)", does: "GetProduct — mock neste desafio; cliente real no Orders", protocol: "grpc", target: "Catalog :9082" },
    ],
    mocks: [
      {
        neighbor: "Orders (cliente gRPC)",
        protocol: "grpc",
        direction: "eles chamam você",
        endpoint: "catalog.v1.CatalogService/GetProduct  :9082",
        timeout: "2s (deadline do Orders)",
        request: `{ "id": "${ids.product}" }`,
        cases: [
          {
            name: "Feliz",
            when: "id da batata, active=true",
            headers: "gRPC OK (0)",
            body: productOk,
            youDo: "priceCents int64. Mesmos campos do REST GET. Proto + REST não divergem.",
          },
          {
            name: "Não existe",
            when: "UUID desconhecido",
            headers: "gRPC NOT_FOUND (5)",
            body: grpcErr(5, "NOT_FOUND", "PRODUCT_NOT_FOUND", "Produto não encontrado."),
            youDo: "Orders mapeia para HTTP 422.",
          },
          {
            name: "Inativo",
            when: "active=false",
            headers: "gRPC NOT_FOUND (5)",
            body: grpcErr(5, "NOT_FOUND", "PRODUCT_NOT_FOUND", "Produto não encontrado."),
            youDo: "Inativo = NOT_FOUND. Não venda.",
          },
        ],
      },
    ],
  },

  "lum-jr2-inventory": {
    trigger:
      "Seed/admin: HTTP PUT estoque. Gatilho real: Orders chama gRPC Reserve. HTTP /reserve não é o hop interno — existe só para você testar no .http se quiser.",
    hops: [
      { step: 1, who: "Você/admin", does: "PUT /v1/stock/{productId} available=10", protocol: "http", target: "Inventory :8083 (borda)" },
      { step: 2, who: "Inventory", does: "UPSERT stock", protocol: "postgres", target: "tabela stock" },
      { step: 3, who: "Orders", does: "inventory.v1.InventoryService/Reserve", protocol: "grpc", target: ":9083 deadline 2s" },
      { step: 4, who: "Inventory", does: "SELECT FOR UPDATE + UPDATE", protocol: "postgres", target: "tabela stock" },
      { step: 5, who: "Orders (cancel)", does: "Release", protocol: "grpc", target: ":9083" },
    ],
    mocks: [
      {
        neighbor: "Catalog",
        protocol: "grpc",
        direction: "você chama",
        endpoint: "não chama. productId é seed. Sem hop Catalog.",
        cases: [
          {
            name: "Seed",
            when: "subir o serviço",
            body: `{ "productId": "${ids.product}", "available": 10 }`,
            youDo: "Seede este UUID. Inventory não consulta Catalog.",
          },
        ],
      },
      {
        neighbor: "Orders (cliente gRPC)",
        protocol: "grpc",
        direction: "eles chamam você",
        endpoint: "inventory.v1.InventoryService/Reserve  :9083",
        timeout: "2s",
        request: `{ "productId": "${ids.product}", "qty": 2, "orderId": "${ids.order}" }`,
        cases: [
          {
            name: "Feliz",
            when: "available ≥ qty",
            headers: "gRPC OK (0)",
            body: reserveOk,
            youDo: "Transação única. available -= qty, reserved += qty.",
          },
          {
            name: "Sem estoque",
            when: "available < qty",
            headers: "gRPC FAILED_PRECONDITION (9)",
            body: grpcErr(9, "FAILED_PRECONDITION", "STOCK_INSUFFICIENT", "Não há 2 unidades de batata."),
            youDo: "Rollback. Orders devolve HTTP 409. Sem placed.",
          },
          {
            name: "Produto sem linha",
            when: "productId inexistente",
            headers: "gRPC NOT_FOUND (5)",
            body: grpcErr(5, "NOT_FOUND", "STOCK_NOT_FOUND", "Sem estoque para este produto."),
            youDo: "Orders trata como HTTP 422.",
          },
        ],
      },
      {
        neighbor: "Orders (cancel → Release)",
        protocol: "grpc",
        direction: "eles chamam você",
        endpoint: "inventory.v1.InventoryService/Release  :9083",
        request: `{ "productId": "${ids.product}", "qty": 2, "orderId": "${ids.order}" }`,
        cases: [
          {
            name: "Feliz",
            when: "havia reserva deste orderId",
            headers: "gRPC OK (0)",
            body: `{ "productId": "${ids.product}", "available": 10, "reserved": 0 }`,
            youDo: "reserved -= qty, available += qty. Idempotente se já liberado.",
          },
        ],
      },
    ],
  },

  "lum-jr2-orders": {
    trigger:
      "Buyer com JWT. HTTP POST /v1/orders na borda. Interno: só gRPC Catalog + gRPC Inventory. Este desafio JÁ expõe orders.v1 :9084 (CreateOrder, GetOrder, MarkPaid) — BFF e Payments não pedem outro contrato depois. JWT local. Sem Kafka (PL2). Sem fila.",
    hops: [
      { step: 1, who: "Buyer", does: "POST /v1/orders {productId, qty}", protocol: "http", target: "Orders :8084 + Bearer" },
      { step: 2, who: "Orders", does: "valida JWT (secret lumen-dev ou JWKS estático). Zero hop Identity.", protocol: "interno", target: "claim sub + role" },
      { step: 3, who: "Orders", does: "GetProduct. Deadline 2s.", protocol: "grpc", target: "catalog.v1.CatalogService/GetProduct :9082" },
      { step: 4, who: "Orders", does: "Reserve. Deadline 2s.", protocol: "grpc", target: "inventory.v1.InventoryService/Reserve :9083" },
      { step: 5, who: "Orders", does: "INSERT pedido status=placed", protocol: "postgres", target: "tabela orders" },
      { step: 6, who: "Orders", does: "201 ao buyer (mesmo handler do gRPC CreateOrder)", protocol: "http", target: "cliente" },
      { step: 7, who: "Orders", does: "expõe CreateOrder, GetOrder, MarkPaid", protocol: "grpc", target: "orders.v1.OrdersService :9084" },
      { step: 8, who: "Buyer (cancel)", does: "POST /v1/orders/{id}/cancel", protocol: "http", target: "Orders → gRPC Release" },
    ],
    mocks: [
      {
        neighbor: "Identity",
        protocol: "interno",
        direction: "você chama",
        endpoint: "não há hop HTTP. Mock: injete o JWT buyer no header.",
        cases: [
          {
            name: "Buyer",
            when: "Authorization: Bearer <jwtBuyer>",
            headers: "Authorization: Bearer " + jwtBuyer,
            body: `{ "sub": "${ids.buyer}", "role": "buyer" }`,
            youDo: "Aceita. buyerId = sub.",
          },
          {
            name: "Seller",
            when: "JWT seller",
            headers: "Authorization: Bearer " + jwtSeller,
            body: `{ "role": "seller" }`,
            youDo: "403. Seller não cria pedido.",
          },
          {
            name: "Sem token / expirado",
            when: "header ausente ou exp no passado",
            status: 401,
            body: err("UNAUTHORIZED", "Token ausente ou inválido."),
            youDo: "Nem chama Catalog.",
          },
        ],
      },
      {
        neighbor: "Catalog",
        protocol: "grpc",
        direction: "você chama",
        endpoint: "catalog.v1.CatalogService/GetProduct  :9082",
        timeout: "deadline 2s",
        request: `{ "id": "${ids.product}" }`,
        cases: [
          {
            name: "Feliz",
            when: "produto ativo",
            headers: "gRPC OK (0)",
            body: productOk,
            youDo: "unitPriceCents=890. totalCents=890*qty. Nunca use preço do client.",
          },
          {
            name: "NOT_FOUND",
            when: "id desconhecido ou inativo",
            headers: "gRPC NOT_FOUND (5)",
            body: grpcErr(5, "NOT_FOUND", "PRODUCT_NOT_FOUND", "Produto não encontrado."),
            youDo: "HTTP 422 PRODUCT_NOT_FOUND. Não chame Inventory.",
          },
          {
            name: "Deadline",
            when: "Catalog não responde em 2s",
            headers: "gRPC DEADLINE_EXCEEDED (4)",
            body: grpcErr(4, "DEADLINE_EXCEEDED", "UPSTREAM_TIMEOUT", "Catalog não respondeu em 2s."),
            youDo: "HTTP 503 UPSTREAM_TIMEOUT. Sem placed. Sem Reserve.",
          },
          {
            name: "Unavailable",
            when: "Catalog down",
            headers: "gRPC UNAVAILABLE (14)",
            body: grpcErr(14, "UNAVAILABLE", "UPSTREAM_ERROR", "Catalog indisponível."),
            youDo: "HTTP 503 UPSTREAM_ERROR. Sem placed.",
          },
        ],
      },
      {
        neighbor: "Inventory",
        protocol: "grpc",
        direction: "você chama",
        endpoint: "inventory.v1.InventoryService/Reserve  :9083",
        timeout: "deadline 2s",
        request: `{ "productId": "${ids.product}", "qty": 2, "orderId": "${ids.order}" }`,
        cases: [
          {
            name: "Feliz",
            when: "estoque ok",
            headers: "gRPC OK (0)",
            body: reserveOk,
            youDo: "INSERT placed. 201.",
          },
          {
            name: "Sem estoque",
            when: "FAILED_PRECONDITION",
            headers: "gRPC FAILED_PRECONDITION (9)",
            body: grpcErr(9, "FAILED_PRECONDITION", "STOCK_INSUFFICIENT", "Não há 2 unidades de batata."),
            youDo: "HTTP 409. Sem INSERT placed.",
          },
          {
            name: "Deadline",
            when: "Inventory >2s",
            headers: "gRPC DEADLINE_EXCEEDED (4)",
            body: grpcErr(4, "DEADLINE_EXCEEDED", "UPSTREAM_TIMEOUT", "Inventory não respondeu em 2s."),
            youDo: "HTTP 503. Sem placed. Não invente reserva.",
          },
        ],
      },
      {
        neighbor: "BFF / Payments (eles chamam você em :9084)",
        protocol: "grpc",
        direction: "eles chamam você",
        endpoint: "orders.v1.OrdersService  CreateOrder | GetOrder | MarkPaid  :9084",
        cases: [
          {
            name: "CreateOrder",
            when: "BFF mutation — mesmo body do POST HTTP",
            headers: "gRPC OK (0)",
            body: orderPlaced,
            youDo: "Mesma lógica do POST /v1/orders. Não duplique regra.",
          },
          {
            name: "GetOrder",
            when: "Payments/BFF",
            headers: "gRPC OK (0)",
            body: orderPlaced,
            youDo: "Mesmo JSON do GET HTTP. status placed|paid|cancelled.",
          },
          {
            name: "MarkPaid",
            when: "Payments depois do capture. Request: { id, paymentId }",
            headers: "gRPC OK (0)",
            body: orderPaid,
            youDo: "placed→paid. Idempotente se já paid do mesmo paymentId. Não implemente o Payments aqui — só o RPC.",
          },
        ],
      },
    ],
  },

  "lum-jr3-mesh": {
    trigger:
      "e2e.sh na borda HTTP (como um buyer). Interno, o POST /orders dispara gRPC GetProduct + gRPC Reserve. Clima continua HTTP pública e NÃO bloqueia.",
    hops: [
      { step: 1, who: "e2e.sh", does: "POST /v1/users + login", protocol: "http", target: "Identity :8081" },
      { step: 2, who: "e2e.sh", does: "POST /v1/products", protocol: "http", target: "Catalog :8082 (REST seller)" },
      { step: 3, who: "e2e.sh", does: "PUT /v1/stock/{id}", protocol: "http", target: "Inventory :8083 (REST admin)" },
      { step: 4, who: "e2e.sh", does: "POST /v1/orders", protocol: "http", target: "Orders :8084" },
      { step: 5, who: "Orders", does: "GetProduct", protocol: "grpc", target: "Catalog :9082" },
      { step: 6, who: "Orders", does: "Reserve", protocol: "grpc", target: "Inventory :9083" },
      { step: 7, who: "Orders", does: "GET clima nice-to-have. Timeout 1s. Circuit breaker.", protocol: "http", target: "API pública (public-apis)" },
      { step: 8, who: "Orders", does: "201 placed mesmo se clima falhar", protocol: "http", target: "e2e.sh" },
    ],
    mocks: [
      {
        neighbor: "API pública de clima",
        protocol: "http",
        direction: "você chama",
        endpoint: "GET (escolha um de public-apis; documente a URL)",
        timeout: "1s",
        cases: [
          {
            name: "Feliz",
            when: "200",
            status: 200,
            body: `{ "tempC": 22, "summary": "céu limpo" }`,
            youDo: "weatherHint=ok no GET do pedido. Pedido placed.",
          },
          {
            name: "Timeout / 5xx / CB aberto",
            when: "1s estoura ou 3 falhas seguidas",
            status: 503,
            body: "(indisponível)",
            youDo: "weatherHint=unavailable. Pedido AINDA placed. Não 5xx no checkout.",
          },
        ],
      },
      {
        neighbor: "Identity / Catalog / Inventory / Orders",
        protocol: "http",
        direction: "você chama",
        endpoint: "compose — ou stubs se este repo não tiver os binários",
        cases: [
          {
            name: "Stubs aceitos",
            when: "você ainda não ligou os 4 serviços reais",
            body: "Use jwtBuyer + mocks gRPC GetProduct/Reserve das fichas JR1/JR2.",
            youDo: "O e2e pode bater em WireMock. Compose real é extra.",
          },
        ],
      },
    ],
  },

  "lum-pl1-payments": {
    trigger:
      "Buyer. HTTP POST /v1/payments (borda). Interno: gRPC GetOrder + gRPC MarkPaid. Sem Kafka/Rabbit neste desafio (PL2). Payments não é servidor gRPC — só cliente.",
    hops: [
      { step: 1, who: "Buyer", does: "POST /v1/payments + Idempotency-Key", protocol: "http", target: "Payments :8085" },
      { step: 2, who: "Payments", does: "valida JWT buyer", protocol: "interno", target: "mesmo JWT do Identity" },
      { step: 3, who: "Payments", does: "GetOrder", protocol: "grpc", target: "orders.v1.OrdersService/GetOrder :9084" },
      { step: 4, who: "Payments", does: "cobra no gateway fake", protocol: "interno", target: "interface Gateway" },
      { step: 5, who: "Payments", does: "INSERT payment unique(idempotency_key)", protocol: "postgres", target: "tabela payments" },
      { step: 6, who: "Payments", does: "MarkPaid", protocol: "grpc", target: "orders.v1.OrdersService/MarkPaid :9084" },
      { step: 7, who: "Payments", does: "201 captured", protocol: "http", target: "Buyer" },
    ],
    mocks: [
      {
        neighbor: "Identity",
        protocol: "interno",
        direction: "você chama",
        endpoint: "JWT local (mesmo mock buyer)",
        cases: [
          {
            name: "Buyer dono",
            when: "sub = buyerId do pedido",
            headers: "Authorization: Bearer " + jwtBuyer,
            body: `{ "sub": "${ids.buyer}", "role": "buyer" }`,
            youDo: "Segue.",
          },
          {
            name: "Outro buyer",
            when: "sub diferente",
            status: 403,
            body: err("FORBIDDEN", "Pedido de outro comprador."),
            youDo: "Nem chama Orders.",
          },
        ],
      },
      {
        neighbor: "Orders GetOrder",
        protocol: "grpc",
        direction: "você chama",
        endpoint: "orders.v1.OrdersService/GetOrder  :9084",
        timeout: "deadline 2s",
        request: `{ "id": "${ids.order}" }`,
        cases: [
          {
            name: "Placed, dono certo",
            when: "ainda não pago",
            headers: "gRPC OK (0)",
            body: orderPlaced,
            youDo: "amountCents = totalCents (1780). Nunca aceite amount do client.",
          },
          {
            name: "Já paid",
            when: "status=paid",
            headers: "gRPC OK (0)",
            body: orderPaid,
            youDo: "HTTP 200 o payment existente. Não captura de novo.",
          },
          {
            name: "Cancelled",
            when: "status=cancelled",
            headers: "gRPC OK (0)",
            body: `{ "id": "${ids.order}", "status": "cancelled", "totalCents": 1780 }`,
            youDo: "HTTP 409 ORDER_NOT_PAYABLE.",
          },
          {
            name: "NOT_FOUND",
            when: "orderId inventado",
            headers: "gRPC NOT_FOUND (5)",
            body: grpcErr(5, "NOT_FOUND", "ORDER_NOT_FOUND", "Pedido não encontrado."),
            youDo: "HTTP 404.",
          },
        ],
      },
      {
        neighbor: "Orders MarkPaid",
        protocol: "grpc",
        direction: "você chama",
        endpoint: "orders.v1.OrdersService/MarkPaid  :9084",
        timeout: "deadline 2s",
        request: `{ "id": "${ids.order}", "paymentId": "${ids.payment}" }`,
        cases: [
          {
            name: "Feliz",
            when: "Orders aceita",
            headers: "gRPC OK (0)",
            body: orderPaid,
            youDo: "HTTP 201 captured.",
          },
          {
            name: "Deadline depois do capture",
            when: "Orders caiu",
            headers: "gRPC DEADLINE_EXCEEDED (4)",
            body: grpcErr(4, "DEADLINE_EXCEEDED", "UPSTREAM_TIMEOUT", "MarkPaid não confirmou."),
            youDo: "Payment já existe. Retry MarkPaid. Não capture duas vezes. Outbox (SR1) cobre o evento.",
          },
        ],
      },
      {
        neighbor: "Gateway fake",
        protocol: "interno",
        direction: "você chama",
        endpoint: "Charge(amountCents) — in-process, não HTTP obrigatório",
        cases: [
          {
            name: "Captured",
            when: "80% dos testes",
            body: `{ "gatewayChargeId": "ch_fake_1", "status": "captured" }`,
            youDo: "Grava payment captured.",
          },
          {
            name: "Falha transiente",
            when: "você força no teste",
            body: `{ "status": "failed", "code": "GATEWAY_TIMEOUT" }`,
            youDo: "Retry limitado. Sem segundo débito se a key for a mesma.",
          },
        ],
      },
    ],
  },

  "lum-pl1-cache": {
    trigger: "GET HTTP /v1/products/{id} (seller/e2e) OU gRPC GetProduct (Orders/BFF). Write HTTP invalida a key. Os dois caminhos de leitura batem no mesmo Redis.",
    hops: [
      { step: 1, who: "Caller", does: "HTTP GET /v1/products/{id} (seller) ou gRPC GetProduct (Orders/BFF) — mesmo cache", protocol: "http", target: "Catalog :8082 e :9082" },
      { step: 2, who: "Catalog", does: "GET product:{id}", protocol: "redis", target: "key product:" + ids.product },
      { step: 3, who: "Catalog", does: "MISS → SELECT products", protocol: "postgres", target: "tabela products" },
      { step: 4, who: "Catalog", does: "SET key TTL 60s", protocol: "redis", target: "product:{id}" },
      { step: 5, who: "Seller", does: "PUT produto → DEL key", protocol: "redis", target: "invalidação" },
    ],
    mocks: [
      {
        neighbor: "Redis",
        protocol: "redis",
        direction: "você chama",
        endpoint: "GET/SET/DEL product:{id}",
        cases: [
          {
            name: "MISS",
            when: "primeira leitura",
            body: "(nil)",
            youDo: "Header X-Cache: MISS. Lê Postgres. SET TTL 60s. JSON = productOk.",
          },
          {
            name: "HIT",
            when: "segunda leitura <60s",
            body: productOk,
            youDo: "X-Cache: HIT. Não vai no Postgres. Mesmo JSON.",
          },
          {
            name: "Redis down",
            when: "conexão recusada",
            body: "(connection refused)",
            youDo: "Degrada para Postgres. X-Cache: BYPASS. 200 mesmo assim.",
          },
        ],
      },
    ],
  },

  "lum-pl2-notify": {
    trigger:
      "Não é HTTP de entrada no feliz. Gatilho: Payments (ou seu teste) PUBLICA na fila depois de captured. Worker Notify CONSOME. Payments já respondeu 201 — assíncrono.",
    hops: [
      { step: 1, who: "Buyer", does: "POST /v1/payments (já existente)", protocol: "http", target: "Payments" },
      { step: 2, who: "Payments", does: "201 captured ao buyer (não espera e-mail)", protocol: "http", target: "Buyer" },
      { step: 3, who: "Payments", does: "publish comando SendMail (não é o evento Kafka)", protocol: "rabbit", target: "exchange lumen.notify → fila lumen.notify.mail" },
      { step: 4, who: "Notify worker", does: "consume 1 mensagem", protocol: "rabbit", target: "lumen.notify.mail" },
      { step: 5, who: "Notify", does: "log/e-mail. ack", protocol: "interno", target: "stdout / SMTP fake" },
      { step: 6, who: "Notify", does: "3 nacks → DLX", protocol: "rabbit", target: "lumen.notify.mail.dlq" },
    ],
    mocks: [
      {
        neighbor: "Payments (publisher)",
        protocol: "rabbit",
        direction: "você consome",
        endpoint: "fila lumen.notify.mail  (routing key mail)",
        request: `{
  "type": "SendMail",
  "paymentId": "${ids.payment}",
  "orderId": "${ids.order}",
  "buyerEmail": "ana@feira.dev",
  "amountCents": 1780,
  "occurredAt": "2026-09-20T12:10:00Z"
}`,
        cases: [
          {
            name: "Feliz",
            when: "mensagem válida",
            body: `{ "type": "SendMail", "paymentId": "${ids.payment}", "orderId": "${ids.order}", "buyerEmail": "ana@feira.dev", "amountCents": 1780 }`,
            youDo: "Log JSON com paymentId. ack. Sem HTTP de volta ao Payments. Isto NÃO é o tópico Kafka.",
          },
          {
            name: "Payload quebrado",
            when: "sem email",
            body: `{ "type": "SendMail", "paymentId": "${ids.payment}" }`,
            youDo: "Não retry infinito. 3 falhas → DLQ. Mensagem inspecionável.",
          },
          {
            name: "SMTP/log explode",
            when: "você força erro no worker",
            body: "(mesmo payload feliz)",
            youDo: "nack/requeue até 3. Depois lumen.notify.mail.dlq.",
          },
          {
            name: "Replay",
            when: "mesma paymentId duas vezes",
            body: "(mesmo payload)",
            youDo: "Idempotente: segundo ack sem segundo e-mail (ou log 'already sent').",
          },
        ],
      },
      {
        neighbor: "Como publicar no teste sem Payments real",
        protocol: "rabbit",
        direction: "você publica",
        endpoint: "rabbitmqadmin / cliente no teste: basicPublish no mesmo exchange",
        cases: [
          {
            name: "Gatilho de lab",
            when: "go test / JUnit",
            body: "publique o JSON feliz acima. Não suba Payments.",
            youDo: "README: comando que injeta a mensagem.",
          },
        ],
      },
    ],
  },

  "lum-pl2-kafka": {
    trigger:
      "Orders, no mesmo request que grava placed (ainda dual-write — Senior troca por outbox). Depois o consumer analytics lê o tópico. Gatilho = POST /v1/orders feliz (ou um produce no teste).",
    hops: [
      { step: 1, who: "Buyer", does: "POST /v1/orders", protocol: "http", target: "Orders :8084" },
      { step: 2, who: "Orders", does: "gRPC GetProduct + gRPC Reserve (JR2)", protocol: "grpc", target: "Catalog :9082, Inventory :9083" },
      { step: 3, who: "Orders", does: "INSERT placed", protocol: "postgres", target: "orders" },
      { step: 4, who: "Orders", does: "produce PedidoCriado, key=sellerId", protocol: "kafka", target: "tópico lumen.orders.placed" },
      { step: 5, who: "Consumer analytics (este repo)", does: "consume", protocol: "kafka", target: "mesmo tópico, group lumen.analytics" },
      { step: 6, who: "Consumer", does: "INSERT analytics_orders ON CONFLICT DO NOTHING", protocol: "postgres", target: "unique(orderId)" },
    ],
    mocks: [
      {
        neighbor: "Kafka (produce) — o que Orders publica",
        protocol: "kafka",
        direction: "você publica",
        endpoint: "lumen.orders.placed  key=" + ids.seller,
        request: `{
  "type": "PedidoCriado",
  "orderId": "${ids.order}",
  "sellerId": "${ids.seller}",
  "buyerId": "${ids.buyer}",
  "productId": "${ids.product}",
  "totalCents": 1780,
  "occurredAt": "2026-09-20T12:05:00Z"
}`,
        cases: [
          {
            name: "Feliz",
            when: "pedido placed",
            body: `{ "type": "PedidoCriado", "orderId": "${ids.order}", "sellerId": "${ids.seller}", "totalCents": 1780, "occurredAt": "2026-09-20T12:05:00Z" }`,
            youDo: "Key = sellerId (particiona por vendedor). Nome no passado.",
          },
          {
            name: "Kafka down no request",
            when: "broker indisponível",
            body: "(produce error)",
            youDo: "Documente: pedido pode ficar placed sem evento (dual-write). Outbox (SR1) corrige. Não finja 2PC.",
          },
        ],
      },
      {
        neighbor: "Consumer analytics",
        protocol: "kafka",
        direction: "você consome",
        endpoint: "group.id=lumen.analytics",
        cases: [
          {
            name: "Primeira entrega",
            when: "offset novo",
            body: `{ "type": "PedidoCriado", "orderId": "${ids.order}", "sellerId": "${ids.seller}", "totalCents": 1780 }`,
            youDo: "INSERT. Sem HTTP de volta ao Orders.",
          },
          {
            name: "At-least-once (replay)",
            when: "mesmo orderId de novo",
            body: "(mesmo evento)",
            youDo: "unique(orderId) → ignora. Sem duplicar métrica.",
          },
          {
            name: "Evento de outro tipo",
            when: "type desconhecido",
            body: `{ "type": "Foo", "orderId": "${ids.order}" }`,
            youDo: "Log + skip. Não derruba o consumer.",
          },
        ],
      },
      {
        neighbor: "Gatilho de lab sem Orders real",
        protocol: "kafka",
        direction: "você publica",
        endpoint: "kcat / kafka-console-producer no teste",
        cases: [
          {
            name: "Injete PedidoCriado",
            when: "ci",
            body: "JSON feliz, key=" + ids.seller,
            youDo: "Consumer sozinho prova idempotência. Não precisa do binário Orders.",
          },
        ],
      },
    ],
  },

  "lum-pl3-bff": {
    trigger:
      "Client GraphQL HTTP POST /graphql. Interno: gRPC CreateOrder / GetOrder / GetProduct. JWT local — sem hop Identity. Sem Kafka no BFF.",
    hops: [
      { step: 1, who: "Client", does: "POST /graphql query order + me", protocol: "graphql", target: "BFF :8080" },
      { step: 2, who: "BFF", does: "valida JWT (claims: sub, role, email)", protocol: "interno", target: "sem GET /me" },
      { step: 3, who: "BFF", does: "GetOrder", protocol: "grpc", target: "orders.v1.OrdersService/GetOrder :9084" },
      { step: 4, who: "BFF", does: "GetProduct via DataLoader (1 RPC por id único)", protocol: "grpc", target: "catalog.v1.CatalogService/GetProduct :9082" },
      { step: 5, who: "Client", does: "mutation createOrder", protocol: "graphql", target: "BFF → gRPC CreateOrder :9084" },
    ],
    mocks: [
      {
        neighbor: "Identity",
        protocol: "interno",
        direction: "você chama",
        endpoint: "JWT local — BFF não chama GET /me no checkout",
        cases: [
          {
            name: "Claims no token",
            when: "Bearer buyer",
            headers: "Authorization: Bearer " + jwtBuyer,
            body: `{ "sub": "${ids.buyer}", "email": "ana@feira.dev", "role": "buyer" }`,
            youDo: "me { email } sai do JWT. Sem hop Identity.",
          },
          {
            name: "Token lixo",
            when: "assinatura inválida",
            body: err("UNAUTHORIZED", "Token inválido."),
            youDo: "GraphQL errors[]. Sem data.",
          },
        ],
      },
      {
        neighbor: "Orders GetOrder",
        protocol: "grpc",
        direction: "você chama",
        endpoint: "orders.v1.OrdersService/GetOrder  :9084",
        timeout: "deadline 2s",
        request: `{ "id": "${ids.order}" }`,
        cases: [
          {
            name: "Feliz",
            when: "dono",
            headers: "gRPC OK (0)",
            body: orderPlaced,
            youDo: "order.totalCents=1780. productId para o DataLoader.",
          },
          {
            name: "NOT_FOUND",
            when: "id errado",
            headers: "gRPC NOT_FOUND (5)",
            body: grpcErr(5, "NOT_FOUND", "ORDER_NOT_FOUND", "Pedido não encontrado."),
            youDo: "errors[] ORDER_NOT_FOUND.",
          },
        ],
      },
      {
        neighbor: "Catalog (DataLoader)",
        protocol: "grpc",
        direction: "você chama",
        endpoint: "catalog.v1.CatalogService/GetProduct  :9082  (uma RPC por id único no tick)",
        timeout: "deadline 2s",
        request: `{ "id": "${ids.product}" }`,
        cases: [
          {
            name: "Feliz",
            when: "produto existe",
            headers: "gRPC OK (0)",
            body: productOk,
            youDo: "product.name, priceCents. 2 orders do mesmo produto = 1 RPC.",
          },
          {
            name: "NOT_FOUND",
            when: "deletado depois",
            headers: "gRPC NOT_FOUND (5)",
            body: grpcErr(5, "NOT_FOUND", "PRODUCT_NOT_FOUND", "Produto não encontrado."),
            youDo: "product = null. Pedido ainda devolve totalCents.",
          },
        ],
      },
      {
        neighbor: "Orders CreateOrder",
        protocol: "grpc",
        direction: "você chama",
        endpoint: "orders.v1.OrdersService/CreateOrder  :9084",
        timeout: "deadline 2s",
        request: `{ "productId": "${ids.product}", "qty": 2 }`,
        cases: [
          {
            name: "Feliz",
            when: "mutation createOrder",
            headers: "gRPC OK (0)",
            body: orderPlaced,
            youDo: "Devolve o mesmo shape do POST HTTP. Sem Kafka no BFF.",
          },
          {
            name: "Sem estoque",
            when: "Inventory recusou",
            headers: "gRPC FAILED_PRECONDITION (9)",
            body: grpcErr(9, "FAILED_PRECONDITION", "STOCK_INSUFFICIENT", "Não há 2 unidades de batata."),
            youDo: "errors[] STOCK_INSUFFICIENT. Sem placed.",
          },
        ],
      },
    ],
  },

  "lum-pl3-otel": {
    trigger: "GET /v1/orders/{id}?hydrate=1 (ou o GET que já hidrata produto). Você dispara; o trace nasce neste request.",
    hops: [
      { step: 1, who: "Você/k6", does: "GET /v1/orders/{id}?hydrate=1", protocol: "http", target: "Orders :8084  header traceparent" },
      { step: 2, who: "Orders", does: "span orders.handle", protocol: "interno", target: "OTel SDK" },
      { step: 3, who: "Orders", does: "GetProduct — metadata grpc-trace-bin / traceparent", protocol: "grpc", target: "Catalog span catalog.GetProduct" },
      { step: 4, who: "Orders", does: "Reserve/GetStock opcional", protocol: "grpc", target: "Inventory span inventory.Reserve" },
      { step: 5, who: "SDKs", does: "export OTLP", protocol: "http", target: "collector/Jaeger local :4318" },
    ],
    mocks: [
      {
        neighbor: "Catalog / Inventory",
        protocol: "grpc",
        direction: "você chama",
        endpoint: "gRPC GetProduct / Reserve — stubs instrumentados (buf mock + sleep)",
        cases: [
          {
            name: "Feliz lento",
            when: "você injeta sleep 200ms no stub Catalog.GetProduct",
            headers: "gRPC OK (0)",
            body: productOk,
            youDo: "O span catalog.GetProduct aparece >200ms. TraceId no log JSON.",
          },
          {
            name: "Sem PII no span",
            when: "atributos",
            body: "order.id, http.status — nunca email/token",
            youDo: "Review do export: zero e-mail.",
          },
        ],
      },
    ],
  },

  "lum-sr1-outbox": {
    trigger:
      "Mesmo POST /v1/payments. Diferença: o Kafka NÃO é hop do request. Gatilho do evento = publisher (poll/CDC) depois do COMMIT.",
    hops: [
      { step: 1, who: "Buyer", does: "POST /v1/payments", protocol: "http", target: "Payments" },
      { step: 2, who: "Payments", does: "GetOrder", protocol: "grpc", target: "Orders :9084" },
      { step: 3, who: "Payments", does: "BEGIN INSERT payment + INSERT outbox; COMMIT", protocol: "postgres", target: "mesma transação" },
      { step: 4, who: "Payments", does: "201 (evento ainda pode estar unpublished)", protocol: "http", target: "Buyer" },
      { step: 5, who: "Publisher (loop)", does: "SELECT unpublished FOR UPDATE SKIP LOCKED", protocol: "postgres", target: "tabela outbox" },
      { step: 6, who: "Publisher", does: "produce PaymentCaptured", protocol: "kafka", target: "lumen.payments.captured  key=orderId" },
      { step: 7, who: "Publisher", does: "published_at=now()", protocol: "postgres", target: "outbox" },
      { step: 8, who: "Analytics", does: "consome PaymentCaptured (idempotente). Notify continua no Rabbit SendMail.", protocol: "kafka", target: "group lumen.analytics" },
    ],
    mocks: [
      {
        neighbor: "Orders GetOrder",
        protocol: "grpc",
        direction: "você chama",
        endpoint: "orders.v1.OrdersService/GetOrder  :9084",
        request: `{ "id": "${ids.order}" }`,
        cases: [
          {
            name: "Placed",
            when: "checkout",
            headers: "gRPC OK (0)",
            body: orderPlaced,
            youDo: "Igual PL1 Payments.",
          },
        ],
      },
      {
        neighbor: "Kafka (o publisher, não o request)",
        protocol: "kafka",
        direction: "você publica",
        endpoint: "lumen.payments.captured  key=" + ids.order,
        request: `{
  "type": "PaymentCaptured",
  "paymentId": "${ids.payment}",
  "orderId": "${ids.order}",
  "amountCents": 1780,
  "occurredAt": "2026-09-20T12:10:00Z"
}`,
        cases: [
          {
            name: "Broker ok",
            when: "produce 200",
            body: `{ "type": "PaymentCaptured", "paymentId": "${ids.payment}", "orderId": "${ids.order}", "amountCents": 1780 }`,
            youDo: "Marca outbox published.",
          },
          {
            name: "Broker down no request HTTP",
            when: "você derruba Kafka antes do POST",
            body: "(sem produce)",
            youDo: "POST ainda 201. Linha outbox unpublished. Publisher entrega depois. Este é o teste do desafio.",
          },
          {
            name: "Produce ok, crash antes de published_at",
            when: "at-least-once",
            body: "(mesmo evento duas vezes)",
            youDo: "Consumer idempotente em paymentId. Sem segundo efeito.",
          },
        ],
      },
    ],
  },

  "lum-sr1-search": {
    trigger: "GET /v1/search?q=bata. Indexação: batch (cron/job) lendo Catalog OU consome PedidoCriado/ProductUpdated. Escolha uma e documente. Catalog é fonte de verdade.",
    hops: [
      { step: 1, who: "Job/evento", does: "lê produtos", protocol: "http", target: "Catalog GET /v1/products?cursor (batch) — mockável" },
      { step: 2, who: "Search", does: "indexa", protocol: "interno", target: "Postgres FTS ou Elastic :9200" },
      { step: 3, who: "Buyer", does: "GET /v1/search?q=bata", protocol: "http", target: "Search (pode viver no Catalog)" },
      { step: 4, who: "Search", does: "query ranqueada", protocol: "interno", target: "FTS/Elastic — não o Postgres OLTP cru" },
    ],
    mocks: [
      {
        neighbor: "Catalog (fonte)",
        protocol: "http",
        direction: "você chama",
        endpoint: "GET /v1/products?limit=50&cursor=",
        cases: [
          {
            name: "Página",
            when: "indexação",
            status: 200,
            body: `{ "items": [${productOk}], "nextCursor": null }`,
            youDo: "Indexa 200 docs (seed). Sem dual-write silencioso.",
          },
        ],
      },
      {
        neighbor: "Elastic (se escolher)",
        protocol: "http",
        direction: "você chama",
        endpoint: "PUT /lumen-products/_doc/" + ids.product,
        cases: [
          {
            name: "Index ok",
            when: "Elastic 8/9 no compose",
            status: 201,
            body: `{ "result": "created" }`,
            youDo: "Busca em GET /v1/search usa o índice, não o Catalog a cada tecla.",
          },
        ],
      },
    ],
  },

  "lum-sr2-runtime": {
    trigger: "Você aplica manifests (kubectl). Tráfego: Ingress → HTTP Identity e Catalog. Sem exigir a malha inteira no cluster.",
    hops: [
      { step: 1, who: "Você", does: "kubectl apply Identity (Java) + Catalog (Go)", protocol: "interno", target: "kind/k3d" },
      { step: 2, who: "Probe", does: "GET /health", protocol: "http", target: "cada pod" },
      { step: 3, who: "k6 opcional", does: "POST /v1/orders contra o lab (pode ser stub)", protocol: "http", target: "Ingress" },
    ],
    mocks: [
      {
        neighbor: "Postgres / Redis do cluster",
        protocol: "postgres",
        direction: "você chama",
        endpoint: "StatefulSet ou compose ao lado do kind",
        cases: [
          {
            name: "Health 200",
            when: "pod ready",
            status: 200,
            body: `{ "status": "ok" }`,
            youDo: "readiness + liveness. limits CPU/mem no YAML.",
          },
        ],
      },
    ],
  },

  "lum-st-rfc": {
    trigger: "Você escreve. Nenhum hop de runtime. O fluxo é político: quem dona o preço no fim de semana de promoção.",
    hops: [
      { step: 1, who: "Staff", does: "RFC: opções Catalog vs Orders vs Payments", protocol: "interno", target: "RFC.md" },
      { step: 2, who: "Times", does: "review (não merge de IA sozinha em preço)", protocol: "interno", target: "PR da RFC" },
    ],
    mocks: [
      {
        neighbor: "Contratos atuais (para argumentar)",
        protocol: "http",
        direction: "eles chamam você",
        endpoint: "GET Catalog produto.priceCents · Orders totalCents · Payments amountCents",
        cases: [
          {
            name: "Hoje o preço nasce no Catalog",
            when: "JR2",
            body: productOk,
            youDo: "RFC explica o que quebra se a promoção viver só no Payments.",
          },
        ],
      },
    ],
  },
}
