# 04 — Geração de imagens, cenários e assets originais

## Primeiro: mapa de assets
Criar `ASSET_PLAN.md` com os campos: ID, seção, assunto, finalidade, proporção, plano de geração, ferramenta autorizada, fonte/licença, crop em mobile, alt, status (pendente / gerado / aprovado / otimizado), caminho final.

## Hierarquia de obtenção
1. Assets reais entregues pelo usuário (prioridade, verificar resolução/licença de uso).
2. Geração por IA **somente se** houver ferramenta de imagem efetivamente disponível e autorizada; prompts não equivalem a imagens.
3. Banco licenciado (regras comerciais, atribuição e direitos de pessoas/marcas observados).
4. Composição CSS/SVG autoral para padrões, elementos abstratos, gráficos e mockups simples.

Não reutilizar fotografias/logo de concorrente sem direitos. Não inventar logomarcas de clientes, certificações, selfies de funcionários ou depoimentos. Imagens sintéticas de pessoas devem evitar implicar endosso real. Em saúde/finanças/áreas reguladas, não usar resultado simulado como testemunho.

## Prompt universal de imagem
```
OBJETIVO: [qual seção e emoção; quem é o público]
SUJEITO: [objeto/pessoa/ambiente fictício ou aprovado]
CENÁRIO: [contexto, materiais, profundidade, objetos]
COMPOSIÇÃO: [plano, ângulo, regra dos terços, espaço negativo do texto]
ILUMINAÇÃO: [tipo, direção, temperatura, intensidade]
ESTÉTICA: [fotografia/editorial/3D/ilustração coerente com DESIGN.md]
CORES: [paleta da marca, sem contaminar tons de pele]
ENQUADRAMENTO: [16:9 hero / 4:5 card / 1:1 avatar etc.]
SAÍDA: [sem marca d'água, sem texto embutido, fundo limpo ou solicitado]
EVITAR: [artefatos, elementos aleatórios, marcas não autorizadas, pele plástica, dedos extras]
```

## Presets de cenários
- **Hero SaaS 16:9:** ambiente clean premium, interface do produto **real ou mockup explicitamente ilustrativo**, composição deslocada à direita, negativo à esquerda, iluminação sutil, sem textos renderizados.
- **Negócios físicos 4:5:** foto editorial de espaço e serviço reais se disponíveis, luz coerente, contexto do setor, sem fingir ser sede do cliente se imagem gerada.
- **Produto / e-commerce 1:1 / 4:5:** preservar fielmente proporções, embalagens e cores de imagens reais; se não houver imagem real, tratar render como conceitual, não catálogo fiel.
- **Background abstrato 16:9:** padrões/volume/gradiente/iluminação específicos da marca, contraste suficiente com heading/CTA e crop para 9:16.
- **OG 1.91:1:** composição compartilhável com branding, sem colocar todo conteúdo essencial em imagem.

## Pipeline de aprovação
A. Gerar/selecionar 1–4 candidatos quando as ferramentas permitirem.
B. Conferir pertinência do briefing, anatomia, marcas, tipografia indesejada, recorte e direito de uso.
C. Selecionar a melhor, ajustar ou regenerar **apenas se necessário**.
D. Criar variantes de proporção/crop por dispositivo; verificar pontos focais e sobreposição do texto.
E. Exportar em dimensão realista, preferir WebP/AVIF quando ambiente permitir, comprimir sem artefatos; definir `width`/`height`, srcset/sizes conforme implementação.
F. Documentar origem, prompt, licença e alt. Fazer load priority só da imagem de LCP; lazy para outras.

## Regra de contraste em imagens
Scrim/overlay/opacidade não substitui inspeção. Testar contraste do texto sobre **áreas mais claras e escuras do fundo** em desktop/mobile. Se inviável, texto em superfície opaca.

## Quando falta a ferramenta
Entregar plano de assets + prompts por imagem e marcar **PENDENTE: geração de imagem**, sem declarar que a página tem imagens finais se não tem. Se for protótipo, pode utilizar blocos/gradientes visivelmente demonstrativos com aprovação, jamais disfarçados de conteúdo real.
