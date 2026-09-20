# Handoff — Roadmap Backend JR → Staff (Java + Go, 2026)

Documento para o **próximo agente**. Leia isto antes de editar o repo. Foi escrito a partir da premissa original, de todas as decisões das conversas e do estado do código em setembro de 2026.

**Dono:** Elias  
**Workspace:** `C:\Users\Elias\Desktop\roadmap`  
**Idioma obrigatório com o usuário:** português  
**App:** SPA sem backend. Conteúdo em TypeScript tipado, não em CMS.

Conversas anteriores (Cursor):

- [Roadmap JR Staff](717e47df-aa2c-45f5-a64c-9c8288f50eb6) — implementação inicial, base, mapa mental, reviews de completeza
- Esta sessão continua o mesmo tópico: GraphQL, event sourcing, opcionais e redesign da UI

---

## 1. Premissa (não negociar sem o usuário)

O Elias pediu um **roadmap de carreira de backend**, não um curso, não um juiz de código, não um clone do roadmap.sh.

| Regra | Detalhe |
|---|---|
| Níveis | **Junior → Pleno → Senior → Staff** (Staff é 4º nível completo, não um apêndice) |
| Linguagens | **Só Java e Go**. Sem Kotlin, Rust, Node, Python de produto, WebFlux como default |
| Horizonte | Mercado **2026 / 2027** |
| Baseline técnica | **Java 25 LTS**, **Spring Boot 4.1 / Spring 7**, **Go 1.26** (`synctest.Test`, não `Run`; sqlc; chi/ServeMux; GOMAXPROCS consciente de cgroup) |
| Desafios | Fichas **ricas**: contexto, regras, request/response, mermaid, resultado esperado. **Cada uma sobe sozinha.** |
| Plataforma | **Lumen** (`lum-*`) — feira urbana Java+Go. Contratos batem. **Hops são mock.** Ligar no fim é extra. Labs `ch-*` isolados. |
| Independência | Comece em qualquer `lum-*`. Identity não é pré-requisito de Orders. |
| Progresso | **“Já vi” no browser** (localStorage `roadmap-seen-v1`: tópicos, desafios, lições de IA). Não é conta na nuvem. O GitHub continua a prova do código. Critérios de aceite da ficha continuam só da sessão. |
| Tom | Direto, mercado brasileiro, sem hype. IA é ferramenta de backend, não curso de prompt |

Ele escolheu explicitamente: briefs, não runner. Depois pediu Staff. Depois UI melhor, desafios do zero, livros/cursos 2026, seção IA/MCP para leigo. Depois completeza (algoritmos, SQL, GitHub, “a base”, mapa mental). Depois GraphQL, event sourcing, event-driven com ficha, tópicos opcionais e **redesign inteiro**.

### O que o produto É

Mapa + colunas + fichas + biblioteca + trilha de IA. Um **atlas de emprego**.

### O que o produto NÃO É

- Juiz / LeetCode runner / gabarito
- Trilha de certificação AWS/GCP/Azure
- Curso que substitui DDIA ou on-call
- App que salva progresso
- Enciclopédia de todas as linguagens

---

## 2. Como rodar

```bash
npm install
npm run dev
```

Vite em geral em `http://localhost:5173`.

```bash
npm run build    # tsc -b && vite build
npm run preview
npm run lint     # oxlint
```

**Windows / PowerShell:** não use `&&` em comandos encadeados; use `;`.  
**Sandbox Cursor neste Windows:** várias vezes o shell exigiu permissão `all` porque o sandbox de filesystem não existe.  
**Browser MCP (`cursor-ide-browser`):** frequentemente `Server not found`. Se falhar, não instale Playwright de novo sem necessidade — o usuário já passou por isso. Verifique com `Invoke-WebRequest` nas rotas e `npm run build`.

Regra do usuário: mudança de UI/fluxo deve ser verificada no browser (clicar, buscar, abrir ficha). Screenshot sozinho não basta.

---

## 3. Stack da interface

- Vite 8 + React 19 + TypeScript + Tailwind v4 (`@tailwindcss/vite`)
- `react-router-dom` v7 (`createBrowserRouter`)
- Sem backend, sem auth, sem analytics. Progresso “Já vi” só em localStorage.
- Fonte display: **Bricolage Grotesque**
- Corpo / mono: **IBM Plex Sans** / **IBM Plex Mono**
- Tokens em `src/index.css` (`--bg`, `--accent` lima `#c8f04d` no dark, floresta no light via `prefers-color-scheme`)
- Dark-first depois do redesign (set 2026). Light existe.

### Rotas (`src/App.tsx`)

| Path | Página | Papel |
|---|---|---|
| `/` | `HomePage` | Premissa, números, fase 0, níveis, cobertura |
| `/mental` | `MindMapPage` | 10 ramos + busca + percurso em 5 fases |
| `/roadmap` | `RoadmapPage` | 4 colunas + drawer de tópico (`?topic=&level=&pillar=&lang=`) |
| `/desafios` | `ChallengesPage` | Catálogo com filtros + busca |
| `/desafios/:id` | `ChallengePage` | Ficha, checklist de sessão, rubrica |
| `/ia` | `AiPage` | 6 lições leigo |
| `/biblioteca` | `BibliotecaPage` | Mercado 2026 + catálogo |

Chrome: sidebar numerada (desktop, `lg+`) e dock inferior (mobile, 6 itens). `Layout.tsx`.

---

## 4. Onde está o conteúdo (fonte da verdade)

Tudo em `src/data/`. A UI **não** inventa tópico.

| Arquivo | O que é |
|---|---|
| `types.ts` | `Level`, `Pillar`, `Topic`, `Challenge`, `Resource`, `Recommendation`, `AiLesson` |
| `labels.ts` | labels, `pillarDot`, `matchesLang`, `defaultRubric` |
| `topicsFoundation.ts` | Base: GitHub, Linux, HTTP, SQL, Big-O, LGPD, CI, OTel… |
| `topicsMore.ts` | Completeness 2ª e 3ª onda (SO, build, OpenAPI, gRPC, GraphQL, ES, jobs…) |
| `topics.ts` | `coreTopics` + concat `foundationTopics` + `moreTopics` → `topics`, `topicById` |
| `challenges.ts` | Array + `challengeById` |
| `resources.ts` | Links curados + `getResources` |
| `recommendations.ts` | Livros/cursos “o mercado lê” |
| `aiLessons.ts` | 6 blocos IA |
| `mindmap.ts` | `mindRoot` + `studyPath` |
| `gaps.ts` | `coverage.inScope` / `outOfScope` (home) |
| `index.ts` | Re-exports |

**Regra de consistência:** todo `challengeId` em tópico/mapa/path tem de existir em `challenges.ts`. Todo `topicId` / `resourceId` idem. O build TypeScript **não** pega ID quebrado — é string. Se adicionar conteúdo, grep os IDs.

`Topic.optional?: true` → selo “Opcional” no mapa, colunas e drawer.

`Challenge.rubric?` → se vazio, a página usa `defaultRubric` (o suficiente / forte).

---

## 5. Inventário (quando este arquivo foi escrito)

Ordem de grandeza: **~81 tópicos**, **58 desafios**, **5 fases**, **10 ramos** no mapa, **6 lições** de IA. Conte pela UI na home se divergir.

### Níveis e pilares

Níveis: `junior` | `pleno` | `senior` | `staff`  
Pilares: fundamentos, algoritmos, linguagem, api, dados, mensageria, arquitetura, seguranca, observabilidade, cloud, engenharia, ia, lideranca

### Ramos do mapa mental (`mindRoot`)

`base` · `algo` · `dados` · `langs` · `eng` · `api` · `run` · `arch` · `ia` · `staff`

### Percurso sugerido (`studyPath`)

Não é ordem obrigatória dos desafios (eles são independentes). É ordem **se ele começa do zero**.

- **Fase 0 — Base:** github, linux, http, os, sql-joins, bigo, estruturas
- **Fase 1 — Primeiro serviço:** build, crud-java, crud-go, explain, jwt-bugs, dockerize, review, portfolio
- **Fase 2 — Produção:** actions, config, nplus1, events, jobs, ratelimit, openapi, idempotency, kafka, graphql, uploads, ai-pr-review
- **Fase 3 — Sistema:** outbox, sourcing, feed, search, iac, pprof, strangler, k8s, slo
- **Fase 4 — Organização:** rfc, incidente, postmortem, golden-path, glossário IA, skill, mcp

Vários desafios existem no catálogo e **não** estão no path (ex.: cache, dlx, synctest, k6, jwt pleno, grafos, postgis, hashing). Isso é consciente: o path não pode listar 58 fichas.

### Desafios (IDs)

Junior: `ch-jr-crud-java`, `ch-jr-crud-go`, `ch-jr-explain`, `ch-jr-jwt-bugs`, `ch-jr-review`, `ch-jr-dockerize`, `ch-jr-github`, `ch-jr-linux`, `ch-jr-http`, `ch-jr-sql-joins`, `ch-jr-bigo`, `ch-jr-estruturas`, `ch-jr-os`, `ch-jr-build`, `ch-jr-portfolio`

Pleno: `ch-pl-cache`, `ch-pl-dlx`, `ch-pl-jwt`, `ch-pl-synctest`, `ch-pl-k6`, `ch-pl-grafos`, `ch-pl-sql-window`, `ch-pl-migrations`, `ch-pl-actions`, `ch-pl-testcontainers`, `ch-pl-sqlc`, `ch-pl-oidc`, `ch-pl-otel`, `ch-pl-openapi`, `ch-pl-idempotency`, `ch-pl-grpc`, `ch-pl-kafka`, `ch-pl-config`, `ch-pl-graphql`, `ch-pl-events`, `ch-pl-uploads`, `ch-pl-jobs`, `ch-pl-ratelimit`, `ch-pl-nplus1`

Senior: `ch-sr-outbox`, `ch-sr-feed`, `ch-sr-strangler`, `ch-sr-slo`, `ch-sr-k8s`, `ch-sr-hashing`, `ch-sr-iac`, `ch-sr-pprof`, `ch-sr-search`, `ch-sr-postgis`, `ch-sr-sourcing`

Staff: `ch-st-rfc`, `ch-st-incidente`, `ch-st-golden-path`, `ch-st-postmortem`

IA: `ch-ai-glossario`, `ch-ai-skill`, `ch-ai-mcp`, `ch-ai-pr-review`

### Tópicos opcionais (`optional: true`)

- `pl-graphql` — GraphQL + DataLoader; não substitui REST no emprego BR médio
- `sr-event-sourcing` — o log É o estado; caro; GDPR/versão de evento
- `pl-uploads` — metadado no Postgres, bytes no MinIO/S3, signed URL
- `sr-postgis` — nicho logística
- `jr-portfolio` — README de perfil + pins

### Distinções que o conteúdo insiste (não misturar)

1. **Event-driven ≠ event sourcing.** Fowler: notification / state transfer / sourcing / CQRS. A ficha `ch-pl-events` publica `PedidoCriado` e outro processo reage; o estado do pedido **continua em tabela**. `ch-sr-sourcing` reconstrói saldo pelo log. Outbox (`ch-sr-outbox`) é dual-write certo, **não** é sourcing.
2. **GraphQL ≠ REST default.** Sem DataLoader é N+1 com outro nome.
3. **Elastic Definitive Guide é histórico.** API viva é Elastic 8/9; Postgres FTS muitas vezes basta (`ch-sr-search` pede a escolha honesta).
4. **JWT:** RFC 8725; `alg none` é defeito plantado no review de agente.
5. **Go 1.26:** `synctest.Test`, não a API antiga `Run`.
6. **Dinheiro:** centavos inteiros, nunca float. Idempotency-Key.
7. **Upload:** sem `bytea`, sem binário enorme no controller.

---

## 6. IA / MCP (pedido explícito)

Página `/ia`, leigo de verdade:

1. LLM não “sabe” o sistema  
2. Agente = modelo + loop + ferramentas  
3. MCP = tomada padrão  
4. Skill = receita no git  
5. Quando MCP vs skill  
6. Como backend usa sem se queimar  

Desafios: glossário, skill de review, MCP só leitura, **review de PR escrito por agente** (SQL concatenado, JWT none, dep inventada, CPF no log).

Spring AI está só como recurso **complementar**. Não virar curso de agente.

---

## 7. Biblioteca e links que o usuário trouxe

Ele colou uma lista longa (Google Eng Practices, roadmap.sh backend/spring/golang/redis/system-design, Fowler, Richardson, OWASP, JWT RFCs, Go tour/docs, JetBrains Go, livros DDIA / Database Internals / Kafka / Redis / ES / PostGIS / Learning Go / Concurrency in Go / SDI / SRE / Specifying Systems, cursos Udemy por **nome**).

Política:

- Recurso tem `relevance`: `essencial` | `complementar` | `historico`
- Udemy **não tem URL estável** — guardar o nome, dizer “busque”
- Não tratar ES Definitive Guide como API atual
- Livros de mercado na aba “Mercado 2026” (`recommendations.ts`): DDIA, Effective Java, Learning Go, Kafka, SRE, Grokking, Staff Engineer (Larson), Release It!, Pro Git, cursos Maarek/Grider/TECH SCHOOL etc.

---

## 8. Decisões rejeitadas (não reabrir sem ele pedir)

- WebFlux / reativo como caminho default  
- Reescrever o mesmo domínio Java → Go  
- Encadear desafios (monorepo progressivo, “use o serviço do lab 2”)  
- Code runner no browser  
- Salvar checklist / XP / gamificação  
- Blockchain  
- Cert track cloud  
- Kotlin, Nest, FastAPI, Rust como trilhas irmãs  
- Service mesh como tronco  
- Event sourcing como default de Pleno  
- GraphQL no lugar de REST no Junior  

---

## 9. O que ainda se poderia acrescentar (eu não meteria no tronco)

O Elias perguntou se faltava algo. Resposta: **para a premissa, o mapa está completo**. O resto é especialização. Só entre se a vaga dele pedir ou ele mandar:

| Ideia | Por quê não está |
|---|---|
| Problem+JSON / log estruturado | Higiene de API, não pilar |
| Feature flags de produto (LaunchDarkly) | 12-factor já cobre config/env |
| Temporal / workflow engine | Tópico de jobs já avisa que cron ≠ orquestração |
| Soft delete + auditoria | Comum em fintech; não é JR→Staff genérico |
| mTLS serviço-a-serviço | Plataforma, não produto |
| Inglês para RFC | Skill de Staff, sem ficha |
| Chaos engineering | Além de k6 + incidente |
| DDD / hexagonal como disciplina | Strangler + módulos já empurram o desenho |
| RAG de produto | Fora do recorte backend Java/Go emprego |

Se for expandir de novo: **pergunte**. O risco agora é virar enciclopédia e ele nunca abrir um repo.

---

## 10. Interface — o que o usuário viu evoluir

1. Primeira versão: papel creme, Fraunces, nav no topo, colunas  
2. Pedido: melhorar UI, desafios independentes, livros 2026, IA  
3. Pedido: base (algo, SQL, GitHub) + mapa mental  
4. Pedido: completeza + outra melhoria de UI (busca, nav mobile, rubrica, mapa em cartões)  
5. Pedido: **redesign inteiro** — sidebar, dock, dark lima, Bricolage, home em hero, selo opcional  

Não volte ao tema creme/Fraunces sem ele pedir.  
Classe `.btn` define `display: inline-flex` e **ganha** de `md:hidden` do Tailwind — por isso o toggle mobile usa `.nav-toggle` com `!important` no breakpoint. Não reintroduza `md:hidden` em cima de `.btn` sem o mesmo truque.

“Já vi” persiste em `localStorage` (`src/progress.tsx`). Critérios de aceite da ficha continuam só da sessão.

---

## 11. Como adicionar um tópico / desafio (receita)

1. Recurso novo em `resources.ts` (id estável, URL se existir).  
2. Tópico em `topicsMore.ts` (ou foundation se for base JR). `challengeIds` já com o id da ficha. `optional: true` se for nicho.  
3. Ficha em `challenges.ts`: domínio próprio, enunciado do zero, critérios, tips, `topicIds`, `resourceIds`. Complexidade 1–5 alinhada a `complexityLabel`.  
4. Ligar tópicos velhos se fizer sentido (não quebrar independência).  
5. Nó no `mindRoot` no ramo certo.  
6. Só coloque no `studyPath` se for tronco; senão fica só no catálogo.  
7. Se for livro/curso de mercado, `recommendations.ts`.  
8. `npm run build`. Abrir `/mental`, buscar o nome, clicar o nó, abrir a ficha.

Enunciado: um domínio concreto (lanchonete, adesivos, cofrinho). Sem “implemente um microserviço genérico”. Sem depender de outro desafio.

---

## 12. Arquivos de UI (se for mexer no visual)

```
src/index.css          tokens, .btn .card .shell .rail .dock
src/components/Layout.tsx
src/components/PageHeader.tsx
src/components/Badges.tsx          Lang, Pill, Standalone, Optional
src/components/ChallengeCard.tsx   card inteiro é Link
src/components/FilterBar.tsx       + SearchField opcional
src/components/SearchField.tsx
src/components/TopicDrawer.tsx
src/components/ComplexityBar.tsx
src/components/ResourceList.tsx
src/pages/*.tsx
index.html                         fonts
public/favicon.svg                 R lima em fundo preto
```

Home lê `topics.length`, `challenges.length`, `studyPath`, `coverage`, recomendações featured (`rec-ddia`, `rec-grokking`, `rec-learning-go`, `rec-sre`).

---

## 13. Preferências do Elias (regras de trabalho)

- Sempre responder em **português**  
- **Não commitar** a menos que ele peça  
- **Não push** a menos que ele peça  
- Não editar git config; sem `--no-verify`; sem force push em main  
- Em app web: verificar fluxo de verdade, não só screenshot  
- Não expandir escopo sozinho depois que ele disse que o mapa está completo o bastante — este handoff existe para **continuar com contexto**, não para despejar mais 20 tópicos  
- Código focado; sem markdown extra que ele não pediu (este arquivo ele pediu)

Windows: paths com `C:\Users\Elias\...`. Shell PowerShell.

---

## 14. Baseline 2026 (não “atualizar” para Java 21 / Go 1.20)

O mercado ainda **roda** Java 21 em produção; o mapa ensina **25 LTS**. Spring Boot 4.x / Spring 7. Go 1.26: synctest, módulos, sqlc, cgroup GOMAXPROCS. OTel, não “ELK porque sempre foi”. Kafka como log, não como RPC. Rabbit+DLX ainda existe em banco/varejo Java. OIDC/IdP (Keycloak de lab). Terraform o bastante, sem cert. LGPD e Pix aparecem (SLO de gateway fictício, checkout idempotente).

IA 2026: o mercado assume que ele usa agente. A barra é **explicar o diff**. Skill no git. MCP de leitura. Segredo e PII fora do prompt.

---

## 15. Tomo de completeza (o que eu disse a ele)

1. Primeiro review: faltava CI, migrations, OIDC, algoritmos, GitHub, SQL de verdade, mapa, path.  
2. Depois disso: faltava emprego (gRPC, OpenAPI, Kafka hands-on, IaC, SO, build).  
3. Depois: para a premissa estava completo; opcionais eram S3, cron, rate limit, N+1, portfólio.  
4. Ele mandou colocar GraphQL, event sourcing, event-driven com ficha, os opcionais, e redesenhar.  
5. Ainda **não** colocaria Problem+JSON, Temporal, feature-flag SaaS, mTLS, chaos, DDD-livro no tronco.

O próximo passo útil para **ele** (humano) é **fazer a fase 0 num repo**, não pedir mais tópicos. O próximo passo útil para **você** (agente) é só o que ele pedir: bug de UI, um tópico específico, deploy, etc.

---

## 16. Checklist rápido se for “só continuar”

- [ ] Li a premissa (Java+Go, 4 níveis, fichas independentes, sem runner)  
- [ ] Lumen é plataforma; **cada** desafio sobe sozinho com mock — não volte a exigir a malha no ar  
- [ ] “Já vi” já existe — não troque por conta/servidor sem o Elias pedir  
- [ ] IDs novos batem em topics / challenges / resources / mindmap  
- [ ] Opcional leva `optional: true`  
- [ ] Event-driven e event sourcing continuam separados  
- [ ] Build passa; abri a rota que mudei  
- [ ] Resposta em português  

---

## 17. Frases úteis do produto (manter o tom)

- “Cada desafio é um repo novo.”  
- “Sem isso o Spring e o chi não seguram.”  
- “Event-driven não é event sourcing.”  
- “Float em dinheiro é critério de reprovação.”  
- “Se você não explica o diff, o diff não entra.”  
- “O livro de 2015 do Elastic é histórico.”  
- “Certificação é opcional; IAM errado é incidente.”
