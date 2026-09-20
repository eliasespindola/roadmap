/** Convenções da plataforma Lumen — todos os serviços obedecem. */
export const lumen = {
  name: "Lumen",
  blurb:
    "Feira urbana: produtores vendem, compradores pedem. Java e Go no mesmo produto. Cada serviço é um desafio independente — mock dos hops. Se no fim você ligar os repos, vira a plataforma completa.",
  rule:
    "Comece em qualquer serviço. Nenhum lum-* exige ter feito outro. Mock: JSON na borda (HTTP) e protobuf-JSON no interno (grpcurl / buf mock). Ligar os binários é o extra do fim, não a entrada.",
  errorShape: `{
  "error": {
    "code": "STOCK_INSUFFICIENT",
    "message": "Não há 3 unidades de batata.",
    "traceId": "opcional"
  }
}`,
  conventions: [
    "Borda (browser, mobile, e2e, seller): HTTP/JSON ou GraphQL. Nunca gRPC na internet pública.",
    "Serviço→serviço síncrono: gRPC + Protobuf (Buf). Catalog :9082, Inventory :9083, Orders :9084.",
    "Assíncrono: Kafka = eventos de domínio (PedidoCriado, PaymentCaptured). Rabbit = comando SendMail + DLX. Notify NÃO consome Kafka.",
    "Identity não é hop a cada request: JWT local. HS256 + secret lumen-dev no README, ou RS256 + GET /v1/.well-known/jwks.json. Login continua HTTP.",
    "JSON UTF-8 na borda. Datas RFC3339 UTC. IDs UUID. Dinheiro só em centavos (int64).",
    "Erro HTTP: error.code + error.message. Erro gRPC: google.rpc.Status + o mesmo code no details.",
    "Auth na borda: Authorization: Bearer <jwt>. Roles: buyer | seller | admin.",
    "POST que muda dinheiro ou estoque: Idempotency-Key (HTTP) ou idempotency_key no metadata gRPC.",
    "Health: GET /health → 200 {\"status\":\"ok\"} em todo processo (também o que só fala gRPC).",
    "Portas HTTP: Identity 8081, Catalog 8082, Inventory 8083, Orders 8084, Payments 8085, Notify 8086, BFF 8080.",
    "Portas gRPC: Catalog 9082, Inventory 9083, Orders 9084. Sem gRPC em Identity, Payments (servidor), Notify, BFF.",
  ],
  ports: {
    identity: 8081,
    catalog: 8082,
    inventory: 8083,
    orders: 8084,
    payments: 8085,
    notify: 8086,
    bff: 8080,
    catalogGrpc: 9082,
    inventoryGrpc: 9083,
    ordersGrpc: 9084,
  },
}

export const lumenDiagram = `flowchart TB
  Buyer[Buyer / Seller]
  BFF[BFF GraphQL :8080]
  Id[Identity Java :8081 HTTP]
  Cat[Catalog Go :8082 HTTP / :9082 gRPC]
  Inv[Inventory Java :8083 HTTP / :9083 gRPC]
  Ord[Orders Go :8084 HTTP / :9084 gRPC]
  Pay[Payments Java :8085 HTTP]
  Ntf[Notify Go :8086]
  PG[(Postgres)]
  RD[(Redis)]
  RQ[RabbitMQ comando e-mail]
  KF[Kafka eventos]
  Ext[API pública clima HTTP]

  Buyer -->|HTTP login| Id
  Buyer -->|HTTP REST ou GraphQL| BFF
  Buyer -->|HTTP REST| Ord
  Buyer -->|HTTP REST| Pay
  BFF -->|gRPC| Ord
  BFF -->|gRPC GetProduct batch| Cat
  Ord -->|gRPC GetProduct| Cat
  Ord -->|gRPC Reserve| Inv
  Pay -->|gRPC GetOrder / MarkPaid| Ord
  Ord -->|PedidoCriado| KF
  Pay -->|SendMail| RQ
  Pay -.->|outbox SR1 PaymentCaptured| KF
  RQ --> Ntf
  Ord -->|HTTP nice-to-have| Ext
  Cat --> PG
  Cat --> RD
  Id --> PG
  Inv --> PG
  Ord --> PG
  Pay --> PG
`

export const lumenCheckoutDiagram = `sequenceDiagram
  autonumber
  actor Buyer
  participant BFF as BFF :8080 GraphQL
  participant Ord as Orders :8084/:9084
  participant Cat as Catalog :9082 gRPC
  participant Inv as Inventory :9083 gRPC
  participant Pay as Payments :8085
  participant K as Kafka
  participant Q as Rabbit mail
  participant N as Notify worker
  Buyer->>BFF: mutation createOrder (HTTP)
  Note over BFF: JWT local — sem hop Identity
  BFF->>Ord: gRPC CreateOrder
  Ord->>Cat: gRPC GetProduct deadline 2s
  Cat-->>Ord: Product price_cents
  Ord->>Inv: gRPC Reserve deadline 2s
  Inv-->>Ord: Stock
  Ord->>K: PedidoCriado key=sellerId
  Ord-->>BFF: Order placed
  BFF-->>Buyer: 200 GraphQL
  Buyer->>Pay: POST /v1/payments HTTP + Idempotency-Key
  Pay->>Ord: gRPC GetOrder
  Pay->>Ord: gRPC MarkPaid
  Pay->>Q: comando SendMail
  Pay-->>Buyer: 201 captured
  Q->>N: consume / DLX se falhar
`
