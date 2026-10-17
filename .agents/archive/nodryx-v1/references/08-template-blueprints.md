# 08 — Blueprint de templates reutilizáveis

Use como ponto de partida, não como modelo rígido. Toda estrutura deve responder a: quem visita, por que deve acreditar, qual objeção superar e qual ação completar. O bloco reutilizável deve ser autoral e compatível com o design system.

## A. Landing page de alta conversão (serviços)
**Navegação:** logo + 3 links âncora + botão principal; menu real no mobile.
**Hero:** eyebrow opcional, H1 com serviço/benefício, subtítulo com mecanismo claro, CTA primário + suporte visual/prova verdadeira, imagem do serviço/resultado permitido.
**Corpo:** problema → método → 3 benefícios principais → processo 3 etapas → escopo → prova verificável → FAQ → CTA de fechamento → footer.
**Variação visual:** editorial com foto ampla; split hero com ilustração; hero central com imagem abaixo. Trocar composição, não apenas cores.
**Medir:** clique CTA, início/submissão de formulário quando instrumentado de forma permitida.

## B. Site institucional multipágina
**Páginas base:** Home, Serviços, Sobre, Projetos/Resultados (se reais), FAQ, Contato.
**Estrutura comum:** Header, footer, breadcrumbs quando adequados, templates de página, CTAs contextuais.
**Diferencial:** página de serviço com H1 específico, descrição, público, processo, perguntas e conversão.
**Cuidados:** títulos e metas distintos, canonical real, links internos úteis, dados institucionais verdadeiros, NAP consistente se negócio local.

## C. SaaS / produto digital
**Home:** categoria/valor → interface real/demonstração → casos de uso → funcionalidades agrupadas por tarefa → comparação contextual → segurança/capacidades comprováveis → FAQ → CTA (teste/demo).
**App:** autenticação e permissão não podem ser fingidas por frontend, estados vazios e carregamento, paginação e filtros, feedback de ações, erros previsíveis.
**Pricing:** somente preços confirmados; comparações calculadas honestamente; período/cobrança transparente.
**Mockups:** screenshot do produto quando disponível; se conceito, rotular como ilustração.

## D. Portfólio / profissional
**Home:** área de atuação → seleção curada de projetos (reais) → expertise → processo → depoimentos autorizados → contato.
**Projetos:** objetivo, participação real, metodologia, imagens com direitos e resultados comprováveis.
**Visual:** tipografia editorial contida e fotos autorais; cuidado com site pesado e interações que atrapalham leitura.

## E. E-commerce/catálogo
**Home:** proposta/ofertas reais → categorias → seleção de produtos → prova verificável → políticas → contato.
**Categoria:** filtros, ordenação, navegação, skeleton/loading/empty states.
**Produto:** fotos fiéis ao item, preço/moeda, estoque/frete se confirmado, variações, CTA de compra com checkout real ou claramente não habilitado.
**Cuidados:** pagamento e logística são sistemas; protótipo visual não equivale a loja em produção.

## Biblioteca mínima de componentes reutilizáveis
- HeaderNav, MobileMenu, Container, Section, SectionHeading
- PrimaryButton, SecondaryButton, IconButton, Field, FormMessage
- HeroSplit, HeroCenter, FeatureGrid, BentoGrid, Steps
- FAQAccordion, TestimonialCard (apenas dados reais), PricingCard (preços reais), ContactCard
- Footer, ConsentUI apenas se requerida, ErrorState, EmptyState, LoadingState

Para cada componente registrar props/variantes, tokens aplicados, estados, semântica, breakpoints, e testes. Não importar biblioteca inteira se só 2 componentes forem úteis.

## Sprints sugeridos por modalidade
1. **Pesquisa** → `RESEARCH.md` + 3 direções (se solicitado).
2. **Wireframe** → sitemap + hierarquia do conteúdo + design tokens.
3. **Prototype** → 1 página e 1 componente de cada categoria essencial com dados demonstrativos identificados.
4. **Implementação** → páginas e funcionalidades + imagens licenciadas/autoriais + metas.
5. **Polimento** → screenshots por breakpoint + correções P0/P1 + relatório final.

## Definição de pronto para template reutilizável
A. Aparência consistente com 1–2 fontes e design tokens; B. Layout fluido com responsive real; C. Rotas e botões com destinos explícitos; D. Componentes editáveis e dados isolados quando apropriado; E. Direitos de assets verificados; F. Instruções de customização claras; G. QA reportando o que foi/ não foi testado.
