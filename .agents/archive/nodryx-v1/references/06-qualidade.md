# 06 — QA de interfaces e critérios de aceite

## Gate A — visual
- Identidade consistente (fontes <=2; cores, radius, sombras, ícones, grid).
- Sem sobreposição, corte de texto, CTA escondido, espaços vazios involuntários, elementos desalinhados e overflow horizontal.
- Título e proposta de valor imediatamente compreensíveis no viewport inicial; imagem contribui com mensagem.
- Efeito/gradiente sem excesso, motion não atrapalha e redução de movimento respeitada.

## Gate B — responsividade
Inspecionar pelo menos **320, 375, 768, 1024, 1440 px** e, idealmente, também 390 e 1920. Usar screenshot de cada, e reparar até passar. Testar smartphone real quando disponível. Checar:
- menu, CTA, hero, cards, tabelas, forms, tooltip, modal, accordion, footer;
- touch targets, zoom 200%, orientation e teclado virtual;
- crop de imagens e legibilidade sobre overlays;
- longas palavras, preços grandes, quebra de layout;
- `scrollWidth <= clientWidth` no root salvo design intencional de rolagem em componente isolado.

## Gate C — WCAG 2.2 AA (meta)
- Texto normal >= 4.5:1; texto grande >= 3:1.
- Componentes essenciais e indicadores de estado >= 3:1, conforme critério de contraste não textual.
- Navegação de teclado, foco visível, rótulo acessível, estrutura semântica, mensagem de erro, alt adequado, legendas quando necessário.
- Não confiar apenas em scores automáticos: testes manuais de teclado e leitura visual são necessários.

## Gate D — funcional
- Todos os links e CTAs essenciais navegam ou disparam ação real.
- Formulários só confirmam após sucesso verdadeiro; validações e erros exibidos.
- Mobile menu, modal, FAQ e scroll/navigation testados.
- Nenhum erro JS crítico, requests essenciais funcionando, imagens carregando.
- Se offline/error/loading fazem parte do escopo, estados implementados e testados.

## Gate E — desempenho e indexabilidade
- Build e lint (quando houver) verdes; recursos desnecessários removidos.
- LCP <= 2,5s, INP <= 200ms, CLS <= 0,1 como **objetivos de campo no P75**, não inferíveis automaticamente de screenshot local.
- Lighthouse/axe/PageSpeed quando disponíveis; anexar saída/timestamps e não inventar métricas.
- Assets otimizados (WebP/AVIF quando aplicável), width/height fixado, lazy fora da primeira dobra, fontes com preload estratégico se justificar.
- Page title, description, heading, OG, canonical conforme domínio real, links de navegação, schema válido se usado.

## Gate F — honestidade e licenças
- Referências com URLs verificadas (ou marcadas 'não verificadas').
- Todo recurso reutilizado tem fonte/licença checadas; attribution cumprida.
- Logo, imagem de pessoa, prova social e números são reais/autorizados ou claramente hipotéticos.
- Nenhuma chave ou token publicado.

## Testes concretos
- Auditoria estática: `python3 scripts/audit_static.py <site> --json audit.json`; triagem de HTML estático (não cobre DOM gerado por React).
- Contraste: `python3 scripts/contrast.py '#111111' '#FFFFFF'` (cores sólidas). Para imagem, exigir inspeção do pixel/overlay.
- Playwright: `node scripts/visual_qa.mjs http://localhost:3000 ./qa-images` no ambiente com dependência.
- Teste manual: Tab/Shift+Tab/Enter/Esc, 200% zoom, click CTA, submissão válida/inválida, rede lenta e mobile.

## Severity
- **P0 bloqueia entrega:** vazamento, compra/ação errada, ausência completa do objetivo, formulário enganoso, JS runtime crítico.
- **P1 corrigir antes de release:** overflow/mobile quebrado, CTA morto, contraste essencial insuficiente, asset hero quebrado, navegação inacessível.
- **P2 corrigir quando possível:** inconsistências de espaçamento, tipografia secundária, copy, SEO secundário, ruído visual.
- **P3 evolução:** animação refinada, transições não essenciais, microajustes estéticos sem impacto crítico.

## Relato de teste obrigatório
Para cada critério informar **PASSA / FALHA / NÃO TESTADO**, evidência e ação. `NÃO TESTADO` nunca é `PASSA`. Registro recomendado: arquivo, tela, breakpoint, descrição, severidade, mudança aplicada, re-teste.

## Fontes
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Contraste W3C: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- Core Web Vitals: https://web.dev/articles/vitals
- Google Search Essentials: https://developers.google.com/search/docs/essentials
