# SUED | Bio mais livre e divertida

Pedido atual: visual divertido, nenhuma seta, foto superior integrada ao restante da bio. Esta direção prevalece sobre as anteriores. Mantém o mini site, os dois temas e as integrações confirmadas.

## Direção anterior ao código

A referência Luna já inspecionada contribui com o princípio de retrato e links próximos e detalhes de colagem. A nova composição é autoral: sem telefone inclinado, retângulo envolvendo o perfil, imagens ou código copiados. Pesquisa Pinterest permanece com o impedimento de login já registrado; esta revisão parte do feedback direto do usuário e do board existente, sem inventar nova coleta.

Alternativas: (A) retrato recortado sobre fundo compartilhado com elementos orgânicos, (B) foto dentro de um círculo, (C) moldura de polaroid. Escolhida A; círculo e polaroid continuariam isolando a foto visualmente.

## Sistema e arquitetura

- Remover painel externo e moldura do retrato; perfil, texto e links habitam o mesmo fundo.
- Nome em escala grande, formas coral/pêssego e pequenos adesivos verde claro; Geist permanece como única família.
- Foto real recebe área sem borda, máscara de encontro suave com o fundo e suporte a PNG/WebP transparente. Não fingir remoção automática de fundo. Enquanto não chega, monograma original e etiqueta honesta.
- Foto, nome e detalhes visuais podem transbordar a área nominal do perfil; as decorações não interceptam clique nem recebem foco.
- Botões arredondados e pequenas sombras deslocadas, estados hover curtos e reduced motion respeitado.
- Remover ícones, caracteres e cursores com seta da página, botões, diálogos e player. Manter play, fechar, câmera e ícones de contato sem setas.
- Mobile: perfil, proposta, links, vídeo. Desktop: apresentação à esquerda e fluxo de bio à direita, sem moldura de cartão.
- Manter o claro por padrão e a escolha persistente de escuro. Contrastes continuam com tokens medidos; novas etiquetas usam texto escuro sobre pastel.

## QA

Lint, tipos, build, links, diálogos, temas e cinco larguras. Inspecionar pixels do retrato integrado e do alinhamento dos componentes. Verificar ausência de setas em SVG/texto. Foto real ainda pendente; inspeção do recorte final depende do arquivo. Sem geração de pessoa fictícia.
