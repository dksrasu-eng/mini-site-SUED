# 03 — Direção visual e design system sem poluição

## Identidade: menos, melhor
**Regra tipográfica rígida:** no máximo DUAS famílias no site inteiro, incluindo importações 21st/Aura, modais, cards e footer. O default é uma só família versátil (sans), com hierarquia por peso, tamanho, tracking e espaçamento. Usar a segunda família **apenas** quando justificar o contraste editorial entre display e corpo. Limitar pesos carregados para não degradar performance.

## Design tokens de partida (ajustar ao briefing; NÃO impor essas cores a todos)
```css
:root {
  --font-ui: "Inter", system-ui, sans-serif;
  --font-display: var(--font-ui);
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-text: #151515;
  --color-muted: #4b5563;
  --color-primary: #4338ca;
  --color-on-primary: #ffffff;
  --color-border: #e5e7eb;
  --radius-sm: 0.5rem;
  --radius-md: 0.875rem;
  --radius-lg: 1.5rem;
  --container: 1200px;
  --space-1: .25rem;
  --space-2: .5rem;
  --space-3: .75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --shadow-soft: 0 12px 40px rgba(0,0,0,.09);
}
```

Se CSS importado introduzir `font-family` hardcoded, trocar para token antes de concluir. Evitar mais de 1 cor primária dominante e 1 secundária (neutros e feedback semântico são complementares), exceto marcas que exijam outra lógica.

## Hierarquia recomendada
- H1: 1 por página, relevante à oferta; `font-size: clamp(2.25rem, 5vw, 4.75rem)` como ponto de partida, não regra fixa.
- H2: seção clara e escaneável; H3: subcomponentes; corpo 16–18 px; legendas legíveis e contraste.
- Comprimento de linha: corpo ~55–75 caracteres em desktop; títulos com limites intencionais, sem palavras quebradas.
- Grid fluido: container com padding móvel, 12 colunas em desktop quando fizer sentido; gaps consistentes 8/12/16/24/32/48/64.
- Navegação desktop + menu móvel reais, com foco e fechamento por teclado/esc.
- Background hero: direção visual selecionada, espaço negativo para conteúdo e fade/scrim quando necessário.
- CTA primário: hierarquia visual clara, textos específicos, ação configurada; estados hover/focus/disabled/loading/pressed quando pertinente.
- Animações: só com função de feedback/narrativa, 150–350ms em microinterações; evitar parallax pesado por padrão; respeitar `prefers-reduced-motion`.

## Três famílias de direção de arte (exemplos)
- **Editorial premium:** espaço negativo, tipografia display disciplinada, fotografia de alto nível, seções alternadas sem efeitos gratuitos.
- **SaaS técnico:** grid preciso, screenshot verdadeiro/mockup de interface, bordas suaves, código/diagramas como prova e interação funcional.
- **Brand expressivo:** cor de marca forte, composição assimétrica controlada, elementos gráficos autorais e conteúdo visual relevante.

## Teste de unidade visual
Pergunte antes de aceitar cada componente externo:
1. Fonte dele é a mesma de `--font-ui/--font-display`? Se não, substituir.
2. Radius, shadow, borda e cores usam tokens?
3. Espaçamento e ritmo batem com a seção anterior?
4. Estilo de ícones (peso, preenchimento) é consistente?
5. Estados hover/focus/loading/disabled existem quando aplicáveis?
6. Mobile preserva hierarquia, imagem e CTA?
7. Contraste está dentro dos limiares? Verificar com `scripts/contrast.py` quando as cores forem hex.

## Botões e UX
- Link `<a>` para navegação; `<button>` para ação no documento.
- CTA de conversão sempre descreve ação real: “Agendar demonstração”, “Falar no WhatsApp”, “Solicitar orçamento”, evitando “Saiba mais” genérico quando é ação principal.
- Estados e feedback visíveis; loading sem bloqueio eterno; erro útil em formulário; sucesso apenas após confirmação real.
- Não depender de hover para recursos fundamentais. Alvos interativos generosos, preferencialmente >= 44px nos caminhos críticos.

## Entrega DESIGN.md
Descrever tokens finais, escala, component inventory, breakpoints, motion, diretrizes de imagem, exemplos de contraste **medido** e exceções (se houver). Não basta declarar 'visual premium'.
