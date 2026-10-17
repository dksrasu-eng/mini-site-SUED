# Design System, tokens e identidade

## Antes do primeiro componente
Gerar `DESIGN.md` com:
- Posicionamento (3 adjetivos, um anti-adjetivo)
- Paleta com funções (`primary`, `surface`, `background`, `text`, `muted`, `accent`, `danger`, `success`)
- Tipografia no máximo **duas famílias** total, incluindo componentes externos; tokens `clamp()` para H1/H2/body
- Grid responsivo 4/8, container `min(1200px, 100%-gutter)`, gutters e breakpoints
- Radius, borders, shadows, blur, elevation
- Botões primary/secondary/ghost, estados hover/focus/disabled/loading
- Form validation/errors, nav responsive, empty/loading states
- Motion tokens (tempos, easings, reduced motion)
- Tratamento de imagens e alternate crops mobile.

## Exemplo mínimo de tokens, NÃO copiar identidade NODRYX automaticamente para clientes
```css
:root {
  --color-bg: #070709;
  --color-surface: #111116;
  --color-text: #f7f7fa;
  --color-muted: #a2a2ac;
  --color-primary: #7c3cff;
  --color-accent: #c7ff36;
  --radius-sm: 8px;
  --radius-md: 12px;
  --space-1: .25rem;
  --space-2: .5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --content-width: 1200px;
}
```

## Acessibilidade
Alvos mínimos de contraste AA 4.5:1 normal e 3:1 texto grande/componentes essenciais. Checar texto sobre imagens e gradientes em vários crops; borda brilhante não substitui contraste legível. Interação com teclado, focus-visible, link vs button, labels, alt, reduced-motion. Para lime contrastar sobre branco é inadequado; testar combinações reais.

## Compromissos da marca
Adaptação deve priorizar marca do cliente. NODRYX = ferramenta, não assinatura obrigatória nos sites clientes. Se o cliente pedir identidade NODRYX, usar tokens oficiais e assets autorizados, mas não violar limite de fontes. Código/microcopy próprio e consistente.
