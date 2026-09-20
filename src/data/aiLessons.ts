import type { AiLesson } from "./types"

export const aiLessons: AiLesson[] = [
  {
    id: "llm",
    order: 1,
    title: "O modelo (LLM) não “sabe” o seu sistema",
    summary:
      "Um LLM prevê o próximo token. Ele não consulta seu Postgres a menos que alguém dê essa ferramenta.",
    paragraphs: [
      "LLM (Large Language Model) é um modelo treinado em texto. Ele responde com o que parece plausível, não com o que está no seu banco agora. Por isso alucina APIs, flags e “essa tabela tem a coluna X”.",
      "Prompt é o texto que você manda. Token é um pedaço de texto que o modelo conta (e cobra). Contexto é a janela: o que cabe na conversa. Quando a janela enche, o modelo “esquece” o começo.",
      "Para backend isso importa: colar um dump de produção no chat é vazamento. Colar um JWT é vazamento. Colar um EXPLAIN anonimizado costuma ser ok.",
    ],
    remember: [
      "O modelo não tem memória do seu cluster — só do que está neste contexto.",
      "Texto plausível ≠ fato. Você verifica SQL, auth e concorrência.",
    ],
    resourceIds: ["agentskills"],
    challengeIds: ["ch-ai-glossario"],
  },
  {
    id: "agente",
    order: 2,
    title: "Agente = modelo + loop + ferramentas",
    summary:
      "O agente lê a tarefa, escolhe uma ferramenta, vê o resultado, decide o próximo passo. Você ainda é o responsável.",
    paragraphs: [
      "Chat simples: você pergunta, o modelo responde. Agente: o modelo pode chamar ferramentas (ler arquivo, rodar teste, consultar um MCP) em um loop até achar que terminou.",
      "No Cursor, Claude Code, Codex e similares, o “agente” é esse loop. Ele não é um funcionário. Ele não tem accountability. O commit é seu.",
      "Em 2026 o mercado assume que você usa agente. O diferencial é recusar output perigoso e padronizar o que o time deixa o agente fazer.",
    ],
    remember: [
      "Ferramenta sem permissão é incidente. Write em produção via agente é a receita clássica.",
      "Peça diff pequeno. Revise como se fosse de um estagiário rápido e confiante.",
    ],
    resourceIds: ["agentskills", "skills-sh"],
    challengeIds: ["ch-jr-review"],
  },
  {
    id: "mcp",
    order: 3,
    title: "MCP: a tomada padrão das ferramentas",
    summary:
      "Model Context Protocol é um protocolo aberto. O host (Cursor, Claude…) fala com servidores que expõem tools, resources e prompts.",
    paragraphs: [
      "MCP nasceu para o agente não ter um conector diferente por app. O servidor MCP expõe ferramentas com schema (JSON Schema), recursos (dados para ler) e às vezes prompts prontos.",
      "Há um host (o app de IA), um client dentro dele, e um ou mais servers (Postgres, GitHub, filesystem, o seu serviço). Em 2026 o protocolo segue evoluindo (docs em modelcontextprotocol.io, revisão 2026-07-28).",
      "Analogia: MCP é a tomada. A ferramenta é o que se pluga (listar tabelas, abrir issue). O modelo só vê o que o host deixou passar depois das permissões.",
      "Risco: um MCP com write no banco é um agente com acesso a dados. Trate como credencial. Primeiro uso: só leitura, ambiente local.",
    ],
    remember: [
      "tools/list = o que existe. tools/call = executar. Você autoriza.",
      "Não aponte MCP de produção com secret no chat no primeiro dia.",
    ],
    resourceIds: ["mcp-home", "mcp-architecture", "mcp-servers"],
    challengeIds: ["ch-ai-mcp"],
  },
  {
    id: "skill",
    order: 4,
    title: "Skill: a receita versionada do time",
    summary:
      "Uma Agent Skill é uma pasta com SKILL.md: instruções que o agente carrega quando a tarefa combina. Não é um servidor ao vivo.",
    paragraphs: [
      "Skill resolve o problema “cada um cola um prompt diferente”. O time versiona no git: como revisar API Go, como escrever RFC, como não logar PII.",
      "O agente no arranque só lê nome e descrição. Se a tarefa casar, carrega o SKILL.md inteiro (progressive disclosure). Por isso você pode ter muitas skills sem estourar o contexto.",
      "agentskills.io é o formato aberto (começou na Anthropic). skills.sh é um hub. O review de Go do samber é um exemplo concreto de skill de engenharia.",
    ],
    remember: [
      "Skill = como fazer. MCP = com o que falar agora.",
      "Skill no repo > prompt solto no Notion.",
    ],
    resourceIds: ["agentskills", "skills-sh", "golang-ai-review"],
    challengeIds: ["ch-ai-skill"],
  },
  {
    id: "mcp-vs-skill",
    order: 5,
    title: "Quando usar MCP e quando usar skill",
    summary: "Os dois se complementam. Quase nunca um substitui o outro.",
    paragraphs: [
      "Use MCP se o agente precisa de dado ao vivo ou de uma ação (query, issue, métrica). O servidor cuida de auth e da borda do sistema.",
      "Use skill se o agente precisa de um procedimento repetível (review, RFC, checklist OWASP, gerar sqlc).",
      "Juntos: a skill diz “para revisar a migration, liste as tabelas via MCP de Postgres e procure FKs faltando”. O MCP executa a listagem. A skill julga o resultado.",
    ],
    remember: [
      "Dado ao vivo / ação → MCP. Política / receita → skill.",
      "Não faça um MCP só para guardar um texto. Isso é skill.",
    ],
    resourceIds: ["mcp-home", "agentskills"],
    challengeIds: ["ch-ai-glossario"],
  },
  {
    id: "backend-seguro",
    order: 6,
    title: "Como um backend usa isso sem se queimar",
    summary: "IA acelera. Auth, dinheiro e SQL continuam sendo o seu pescoço.",
    paragraphs: [
      "Pode: boilerplate, testes, ler docs, rascunho de EXPLAIN, rascunho de RFC, review com skill do time.",
      "Não pode (sem outro humano): mudar regra de saldo, JWT, IAM, job que apaga dado, “aplicar essa migration em prod”.",
      "Regra prática 2026: o mesmo review de PR vale para diff de agente. Supply chain (OWASP A03) inclui pacote que o agente inventou. Você pinna dependência; o modelo não.",
    ],
    remember: [
      "Segredo não vai ao prompt. PII também não.",
      "Se você não explica o diff, o diff não entra.",
    ],
    resourceIds: ["owasp-2025", "google-code-review"],
    challengeIds: ["ch-jr-review", "ch-ai-skill", "ch-ai-pr-review"],
  },
]
