# Visual Forensics — transformar pixels em princípios de design

## Pré-condição
A imagem precisa ter sido realmente disponibilizada ao modelo como imagem visual, screenshot/browser visual ou anexo do usuário. Nunca inferir alinhamentos exatos a partir de snippet de texto.

## Matriz de observação
Para cada referência observada, descreva:
1. **Composição:** orientação, proporção hero, peso visual esquerda/direita, profundidade, foco, whitespace.
2. **Hierarquia:** ordem de leitura headline/subheadline/CTA/prova visual; escala relativa H1/H2/body.
3. **Grid:** estimativa colunas, max-width, gutters, alinhamentos; sempre rotular estimativas.
4. **Cores:** base, superfícies, contraste e papel do accent; cores aproximadas não reivindicar HEX exatos sem análise de pixel.
5. **Tipografia:** serif/sans/display, compressão, peso, contraste de tamanhos; não presumir nome de fonte só pela aparência.
6. **Assets:** foto editorial, 3D, CGI, ilustração, interface, montagem; crop, iluminação, sujeito, posição de espaço negativo.
7. **Componentes:** navbar, header, cards, bento, CTA, prova social, tabs, tabelas e funcionalidades efetivas.
8. **Motion:** só descrever movimento se vídeo/motion foi realmente observado; imagem estática NÃO prova GSAP ou Three.js.
9. **Mobile:** não inferir estrutura mobile a partir do desktop sem prova; planejar adaptativamente.
10. **Direitos/proveniência:** restrições sobre ativos; nenhum conteúdo final não autorizado.

## Síntese original
Crie o `DESIGN_FINGERPRINT` (não é clone):
```
sector:
brand_traits: [..]
composition_principles: [..]
content_strategy: [..]
motion_principles: [..]
visual_patterns_retained: [..]
original_transformations: [..]
forbidden_to_reuse: [..]
```

Se referências divergem, priorize experiência do público, acessibilidade e objetivo; nunca forçar colagem de todos os estilos.

### Teste de originalidade visual
O resultado final deve poder ser distinguido visualmente da fonte sem depender apenas de trocar cor/nome. Rever posicionamento da hero, organização de módulos, fontes, arte final, ilustrações, textos, botões e sequência de seção. Documentar pelo menos 3 transformações materiais (por exemplo: outro grid, ilustração exclusiva, narrativa/reordenação própria).

### Clonagem autorizada
Para cliente proprietário de site ou detentor de direito de reprodução, documentar escopo de autorização, fontes e permissões. Se for referência externa sem autorização, implementar **interpretação original de estilo/princípio**, não cópia pixel-perfect, preservação integral de marca ou assets.
