# NODRYX Skill V2.0.0-TEST

Skill para Claude Code, Codex e agentes compatíveis com o padrão Agent Skills. **Expande a V1** com Pinterest Visual Research Engine, análise visual por screenshots e referências rastreáveis, transformação original de layout, fluxos MCP e testes.

## Instalar
Descompacte o ZIP e copie a **pasta inteira** `nodryx/` para uma destas localizações:

- Claude Code, pessoal: `~/.claude/skills/nodryx/`
- Claude Code, projeto: `<projeto>/.claude/skills/nodryx/`
- Codex, pessoal: `~/.agents/skills/nodryx/`
- Codex, projeto: `<projeto>/.agents/skills/nodryx/`

O nome foi mantido `nodryx` para substituir a V1; faça backup da versão anterior antes de sobrescrever. Acione `/nodryx` (Claude) ou `$nodryx` (Codex). Nos ambientes com importação de skills, adicione a pasta completa.

## Como usar

> /nodryx criar site de escritório de arquitetura premium em São Paulo. Pesquise Pinterest por `architecture studio website design`, analise 5 referências e crie uma landing original com formulário funcional. Não publique sem minha autorização.

> $nodryx modo teste: verifique suas ferramentas, monte as queries Pinterest para `cafeteria artesanal premium`, prepare moodboard, implemente apenas depois de confirmar referências visuais acessíveis.

> Use NODRYX em modo `refinar`: analise o site local atual e 3 referências que anexo; preserve a marca e melhore a hero e o menu mobile.

## Acesso real ao Pinterest
A skill **não injeta acesso à Internet, autenticação ou navegador**. Para pesquisar e visualizar imagens de Pins de forma automática, o agente precisa de navegador/computer-use autorizado. Em modo não conectado, o script `pinterest_query_pack.py` cria links de busca; o usuário pode enviar links/screenshots para análise. Acesso via API oficial não implica acesso de busca universal a todos os Pins.

Não copie fotos ou layouts protegidos. A inspiração deve resultar em design próprio, com origem registrada.

## Estrutura
```
nodryx/
  SKILL.md
  README.md
  CHANGELOG.md
  references/  # 9 protocolos operacionais
  assets/      # templates de entregáveis e exemplos
  scripts/     # gerador de pesquisa, contraste, auditoria e QA de navegador
  tests/       # smoke tests offline
```

## Teste local (não abre Pinterest)
```bash
python3 scripts/pinterest_query_pack.py --niche "clínica estética premium" --style "minimalista editorial" --json
python3 scripts/contrast.py '#111116' '#F7F7FA'
python3 scripts/validate_project.py assets/PROJECT_MANIFEST.example.json assets/REFERENCES.example.json
python3 -m unittest discover -s tests -v
```

## QA visual (requer app rodando e pacote Playwright instalado no projeto)
```bash
npm install -D playwright
npx playwright install chromium
node scripts/visual_qa.mjs http://localhost:3000 ./qa-screenshots
```
A instalação do navegador pode consumir espaço e depende das permissões/ambiente. Não rodar por padrão em máquinas de terceiros.

## Integrações opcionais
- **Pinterest:** navegador autorizado e, quando houver, credenciais/escopos oficiais apropriados. Pesquisa visual depende de UI acessível.
- **21st.dev:** https://21st.dev/mcp — configurar MCP do fornecedor no cliente; validar comandos atuais na documentação do 21st.dev.
- **Aura:** https://www.aura.build/ — usar browser quando disponível; sem alegar que há MCP público para o serviço.
- **NODRYX BRIDGE:** gateway MCP proprietário quando implementado/configurado pelo operador; skill apenas descreve protocolo e nomes sugeridos.

## Status de validação
- Teste offline dos scripts e estrutura: executar no ambiente local (ver arquivos `tests/`).
- Teste ao vivo de navegação Pinterest: **não realizado automaticamente por esta entrega**.
- Teste de integração Aura, 21st.dev, NODRYX MCP e publicação: **não realizado automaticamente**.

## Fontes públicas consultadas na elaboração
- Agent Skills: https://agentskills.io/specification
- Copyright Pinterest: https://help.pinterest.com/pt-br/article/copyright
- API Pinterest: https://developers.pinterest.com/docs/api/v5/pins-list/
- 21st.dev: https://21st.dev/mcp
- WCAG 2.2: https://www.w3.org/TR/WCAG22/

> V2 Test é um **pacote de instruções e utilitários**, não um SaaS pronto, nem navegação executada no Pinterest.
