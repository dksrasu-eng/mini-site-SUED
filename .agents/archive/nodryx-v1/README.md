# Nodryx (v1.0)

Skill reutilizável para Claude Code, Codex e agentes que implementem o padrão Agent Skills. Instruções em português brasileiro.

## Faz o quê?
Entrevista o cliente, pesquisa referências com fontes, utiliza Aura Builder e 21st.dev quando acessíveis, desenha design system coerente (máximo 2 famílias tipográficas), planeja/gera imagens usando a ferramenta conectada, constrói páginas e templates, faz QA responsivo, contraste, acessibilidade, SEO técnico e entrega com evidências.

## Instalação manual
1. Descompacte `nodryx.zip`.
2. Copie a pasta **inteira** `nodryx` para um dos diretórios abaixo:
   - **Claude Code (pessoal):** `~/.claude/skills/nodryx/`
   - **Claude Code (projeto):** `<projeto>/.claude/skills/nodryx/`
   - **Codex (pessoal):** `~/.agents/skills/nodryx/`
   - **Codex (projeto):** `<projeto>/.agents/skills/nodryx/`
3. Abra/reinicie o agente se necessário; invoque no Claude Code com `/nodryx`, ou no Codex com `$nodryx`.

## 21st.dev (opcional, recomendado)
MCP oficial: https://21st.dev/mcp . Configure uma conta/chave compatível e, quando for conveniente, execute em terminal no seu ambiente:
```bash
npx @21st-dev/cli@latest init --client claude
# OU
npx @21st-dev/cli@latest init --client codex
```
A conta e os recursos da 21st determinam limites de instalação e créditos de geração. O 21st.dev substituiu o MCP Magic antigo; não use o pacote legado em uma instalação nova.

## Aura Builder
Site: https://www.aura.build/ · Docs: https://www.aura.build/learn. O Aura funciona na web, suporta referências `@`, editor, geração de imagens e exportação HTML, conforme o plano. **Esta skill não inclui um MCP público do Aura nem acesso autenticado**. Se o agente tiver browser/computer-use autorizado, poderá interagir com interface; caso contrário, trabalhará com referências públicas e prompts preparados para colar no Aura.

## Exemplos de uso
- `Use nodryx. Quero uma landing page para uma clínica de estética com CTA WhatsApp. Faça 5 perguntas e pesquise referências antes de construir.`
- `Use nodryx. Refaça a seção hero existente: pesquise referências no Aura/21st e mantenha as fontes da marca.`
- `Use nodryx. Gere 3 direções de template SaaS premium e depois implemente a escolhida.`
- `Use nodryx. Audite responsividade, contraste e CTAs deste projeto. Não altere código antes de mostrar diagnóstico.`

## Arquivos
- `SKILL.md`: regras, ativação e orquestração.
- `references/`: guias detalhados, estratégias e prompts.
- `assets/`: modelos de briefing, pesquisa, identidade visual, plano de imagens e QA.
- `scripts/`: auditoria estática, contraste e testes em browser com Playwright.
- `agents/openai.yaml`: metadados da interface de Skills do ecossistema OpenAI.

## Scripts opcionais
```bash
python3 scripts/contrast.py '#222222' '#FFFFFF'
python3 scripts/audit_static.py /caminho/projeto --json /tmp/relatorio.json
```
Para QA com navegador, tenha Playwright instalado no **projeto em que vai executar o script**, por exemplo `npm install -D playwright` e `npx playwright install chromium`. Depois execute:
```bash
node /caminho/nodryx/scripts/visual_qa.mjs http://localhost:3000 ./qa-screenshots
```
Estes scripts fornecem testes parciais: não substituem inspeção visual, testes funcionais reais e auditoria de acessibilidade.

## Referências oficiais (verificadas em 13/10/2026)
- Agent Skills: https://learn.chatgpt.com/docs/build-skills
- Claude Code Skills: https://code.claude.com/docs/en/skills
- Aura: https://www.aura.build/learn
- 21st MCP: https://21st.dev/mcp e https://github.com/21st-dev/magic-mcp
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Web Vitals: https://web.dev/articles/vitals

Esta pasta é uma **skill pronta para instalação**, não um serviço de geração de imagens nem uma conexão MCP já ativada.
