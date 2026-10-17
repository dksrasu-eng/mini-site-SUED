# Asset Engine, 21st.dev, Aura e animação

## Plano obrigatório de assets
`ASSET_PLAN.md`: ID, seção, função, aspecto (16:9/4:5/1:1), sujeito, luz/ambiente, espaço para copy, arquivo final, direitos, alt, lazy/preload e tamanho. Imagens de Pins só para **referência**, nunca embutidas diretamente por padrão.

## Prompt de imagem original
```
Create an original web hero visual for [sector/audience/product].
Visual references suggest [abstract compositional patterns], but do not
reproduce any referenced artwork, exact composition, brand, people or text.
Subject: ... | Location/setting: ... | Lighting: ...
Camera/angle: ... | Brand palette: ... | Aspect: ...
Leave negative space at ... for HTML text. No baked text/logos/watermarks.
Photography/CGI/style: ... | Exclusions: ...
```

## Component Library
1. Buscar no projeto existente primeiro.
2. Verificar 21st.dev quando MCP conectado e permitido; ferramenta real descoberta por `tools/list`, sem supor comandos. Respeitar dependências, licenças e stack.
3. Aura (https://www.aura.build/) pode oferecer referências/fluxo visual via browser autorizado; se não, redigir um prompt de referência importável, não dizer que o Aura foi operado.
4. Normalizar componentes aos tokens do cliente, max. 2 famílias de fontes e estados acessíveis.
5. Evitar bibliotecas pesadas para páginas simples. Framer Motion/GSAP/Three.js somente se realmente agrega valor.

## Motion
Preferir transições de opacity/transform, animações discretas, ScrollTrigger só para seções que precisam, limpar listeners/raf e testar em mobile/reduced-motion. Animação decorativa não pode bloquear formulário ou CTA. Para background WebGL, manter centro legível e fallback estático.
