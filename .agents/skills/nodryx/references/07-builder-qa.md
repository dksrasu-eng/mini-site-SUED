# Build, visual QA e critérios de pronto

## Build
- Inspecione stack, rotas, estado, estilos e dependências antes da edição.
- Primeiro planeje estrutura de seções, tokens e origem dos assets; depois componha a interface.
- CTA sempre leva a URL real, rota implementada, número de WhatsApp confirmado, formulário conectado, ou estado honesto de pendência.
- Priorize semântica HTML e imagens originais com direitos claros; microcopy adequada ao público.
- Valide navegação por teclado, menu responsivo, tipografia/tamanhos/crops e alt.
- Nunca inventar SEO performance, depoimentos, licença ou métricas.

## Scripts e evidências
```
python3 scripts/contrast.py '#111116' '#F7F7FA'
python3 scripts/validate_project.py assets/PROJECT_MANIFEST.example.json assets/REFERENCES.example.json
node scripts/visual_qa.mjs http://localhost:3000 ./qa-screenshots
```
`visual_qa.mjs` é opcional e depende de Playwright. Gera screenshots e report com checks básicos em 320/375/768/1024/1440. Revisar manualmente screenshots e elementos funcionais; testes estáticos não substituem auditoria de acessibilidade.

## Classificação
`PASS`: teste executado com critérios satisfeitos e evidência.
`FAIL`: teste executado e falhou.
`NOT_RUN`: ambiente/credencial/permissão não disponível ou não executado.
`BLOCKED`: impeditivo requer intervenção/autorização.

## Checklist objetivo
- Build, lint, typecheck se existentes.
- Zero overflow horizontal inesperado em todos os breakpoints.
- Visual consistente vs. `DESIGN.md`.
- No máximo 2 fontes.
- Contraste/semântica/teclado/aria/alt.
- CTA/nav/form operacionais e destino correto.
- Assets sem referências protegidas usadas sem permissão.
- Sem console error crítico.
- Segredos protegidos.
- Nenhum deploy não autorizado.
- Arquivos e instruções de execução documentados.
