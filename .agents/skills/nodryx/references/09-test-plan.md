# Plano de testes da NODRYX V2 — TEST

## Nível A — local e offline (automatizável)
1. `SKILL.md`: YAML name/description válidos; referências locais resolvem.
2. `pinterest_query_pack.py`: gera URLs reais de busca (não afirma que encontrou Pins), variações PT/EN, encoding correto.
3. `contrast.py`: razão WCAG calculada corretamente e erros para hex inválido.
4. `validate_project.py`: arquivos JSON estruturados, fontes <= 2, pelo menos um CTA indicado, referências com provenance.
5. `unittest`: suíte de regressão, status PASS/FAIL.

## Nível B — navegação Pinterest (manual/assistida por agente conectado)
Pré-condições: browser disponível, acesso permitido e sessão válida se necessária.
1. Query exemplo: `clinica estetica premium website design`.
2. Abrir Pinterest; capturar URL da pesquisa e hora.
3. Ver ao menos 3 Pins efetivamente; abrir itens; coletar URL e screenshot (se permitido).
4. Analisar imagens visualmente: 10 dimensões do visual forensics.
5. Selecionar referências diversas, registrar direitos como desconhecidos quando não confirmados.
6. Saída de `PINTEREST_RESEARCH.md` com URLs evidenciadas.
7. Bloqueio/login/captcha: parar e `BLOCKED`, sem contorno.

## Nível C — geração e QA de site (integração)
1. Criar landing de exemplo com assets originais.
2. Capturar screenshots 320/375/768/1024/1440.
3. Testar menu, CTA e formulários.
4. Confirmar design tokens, contraste, fontes <=2, build e console.
5. Conferir distanciamento criativo das referências.
6. Se houver MCP, validar `tools/list`, permissões, projeto de teste e logs de execução (sem segredo em texto).

## Critérios de aceite
- [ ] Agente explica estado de ferramentas sem alegar acesso falso.
- [ ] Pesquisa entrega URLs reais quando browser conectado; URLs geradas sem acesso são classificadas como buscas.
- [ ] Referências visualmente analisadas possuem evidência de imagem realmente vista.
- [ ] 3–5 referências diversas quando houver disponibilidade.
- [ ] Transformações originais documentadas.
- [ ] Brand design + assets finais com direitos claros.
- [ ] Site QA e build com evidência.
- [ ] Testes não executados são marcados NOT_RUN, nunca PASS.

## Exemplo de log correto
```
Pinterest direct browser: NOT_RUN (browser não conectado)
Pinterest search URLs: PASS (geradas localmente)
Visual screenshot analysis: NOT_RUN (sem imagens observadas)
MCP 21st.dev: NOT_RUN (sem credenciais/sessão)
Skill structural validation: PASS (teste local)
```
