/** O que este site cobre de propósito — e o que fica de fora. */
export const coverage = {
  inScope: [
    "Base: GitHub, Linux, HTTP, DNS/TLS, SQL, algoritmos, testes, logs, validação",
    "Java 25 LTS + Spring Boot 4 e Go 1.26 no mesmo mapa",
    "Lumen: plataforma Java+Go; cada serviço é um desafio independente (hops = mock)",
    "Emprego: OpenAPI, gRPC, Kafka, Redis, CI, OTel, OIDC, IaC, webhooks, hexagonal",
    "Senior: outbox, expand/contract, réplica com lag, SLO",
    "Opcionais: GraphQL, event sourcing, S3/MinIO, PostGIS, portfólio",
    "Event-driven (notificação/state) separado de event sourcing",
    "Staff: RFC, incidente, golden path, barra do time",
    "IA/MCP no nível de backend, sem virar curso de prompt",
  ],
  outOfScope: [
    {
      title: "Juiz de código",
      why: "As fichas são enunciado + rubrica. Você implementa no seu GitHub.",
    },
    {
      title: "Trilha de certificação cloud",
      why: "Tem IAM + Terraform o bastante para o cargo. Não é curso AWS/GCP/Azure.",
    },
    {
      title: "WebFlux, Kotlin, Rust, Node",
      why: "Premissa: Java e Go. Reativo não é o default de vaga 2026.",
    },
    {
      title: "Conta na nuvem",
      why: "“Já vi” fica só neste browser (localStorage). Trocar de PC zera. O repo continua a prova do código.",
    },
    {
      title: "Curso completo / gabarito",
      why: "É mapa + fichas + links. Não substitui DDIA nem o on-call.",
    },
  ],
}
