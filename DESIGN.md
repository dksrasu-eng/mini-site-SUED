# Revisão atual: foto real e copy natural

Foto fornecida adicionada, com recorte CSS e bordas suaves. Linha pontilhada, separadores, órbitas, barras, contorno das letras e sublinhados decorativos retirados. Copy em primeira pessoa, sem travessões. Os temas e a arquitetura de mini bio permanecem. COPY_REVIEW.md e ASSET_PLAN.md descrevem a revisão; direções anteriores abaixo são histórico.

# Revisão atual

A direção atual é DESIGN_PLAYFUL.md: mini bio divertida, retrato integrado ao fundo, sem painel e sem setas. Os documentos abaixo são históricos.

# SUED | Direção V2 do mini site de bio

Revisão atual: temas claro e escuro conforme DESIGN_LIGHT_DARK.md, que prevalece sobre a paleta escura única descrita no registro abaixo. Claro inicial, escolha persistente e tratamento de todos os componentes nos dois modos. A arquitetura de mini bio permanece.

Atualização definida antes do refinamento, 2026-10-16. Público: visitante vindo do Instagram, em especial no celular. Objetivo: conhecer a Sued e conversar pelo WhatsApp.

## Direção atual

Pessoal, editorial, compacta. Anti-referência: landing page longa com seções de conversão repetidas.

Uma única experiência: header curto, perfil/retrato, proposta, dois links, apresentação em vídeo e assinatura. Em desktop, introdução ao lado do painel; em mobile, os mesmos elementos se integram em uma coluna. Não duplicar H1 para implementar os dois layouts. Retirar seção numerada, faixa divisória, fechamento repetido e rodapé largo.

Referência principal: Luna, vista em screenshot real. Complementares: 21st Editorial Collage e catálogo Aura. Análise/proveniência em REFERENCE_BOARD.md. Pinterest bloqueado por login.

## Tokens e componentes V2

- Fundo #0B0B0D; painel #151416; texto #FAFAF9; secundário #A2A2A9; marca #FF4B1F.
- Superfície clara #F3F0E9, texto #201C1B no botão de portfólio.
- Uma fonte: Geist Sans local. H1 clamp(30px, 4.5vw, 58px), tracking -0.055em, line-height 1.08. Corpo 14–16px, UI 13–15px.
- Container desktop 1000px; painel de ações 416px. Mobile: container até 460px, gutters 16px; espaço interno 20px.
- Grid/spacing: 4/8/12/16/20/24/32/48. Raio painel 24px, botões 12px, player 14px.
- Fundo com marca tipográfica grande e geometria discreta, ambos decorativos. Sem objetos 3D de terceiros ou gradientes animados.

Portrait em faixa editorial. ActionLink preserva destinos/diálogos; primary com texto branco 20px/700, secondary claro com texto escuro. VslPlayer preserva YouTube/Vimeo/MP4 e estado sem vídeo. Animações e foco existentes são reutilizados.

Meta: reduzir substancialmente a versão anterior de cerca de 2100px no mobile, concentrando o contato na primeira tela de um aparelho 375×900 quando possível. Medir a altura final antes de afirmar o resultado.

Um H1, landmarks, skip link, alvos >=44px, contraste AA conforme tamanho, diálogos com Tab/Escape e reduced motion. Foto, vídeo, Instagram, portfólio e domínio seguem pendentes. WhatsApp confirmado não muda. Sem publicação autorizada.

## Registro V1, superado pela direção acima

O texto abaixo registra a versão anterior. Os tokens e a arquitetura V2 acima prevalecem.

Documento definido antes da implementação. Direção: editorial, precisa, pessoal.

## Sistema

- Fonte única: Geist Sans variável, hospedada localmente pelo pacote `geist`. Usar 400, 500, 600 e 700; nenhuma fonte externa em runtime.
- Container máximo: 1080px; gutters 24px mobile, 40px tablet/desktop.
- Hero: duas colunas a partir de 768px; retrato à direita. No celular, identidade visual compacta antes do título e botões de largura total.
- H1: clamp(2.5rem, 5.4vw, 4.25rem), peso 500, tracking -0.055em, line-height 1.06.
- H2: clamp(1.8rem, 3.2vw, 2.5rem), peso 500. Corpo: 16–18px; metadados: 11–13px.
- Tokens: fundo #0B0B0D; superfície #141416; texto #FAFAF9; secundário #A2A2A9; cinza #8A8A91; marca #FF4B1F; bordas rgba(255,255,255,.12).
- Raio: 10px botões, 16px player, 14px foto. Espaçamento: 4/8/12/16/24/32/48/64/96px.
- Glow ambiental estático, grade e noise fracos; sem WebGL, vídeo de fundo ou animação pesada.

## Componentes e estados

Header com marca e disponibilidade; Hero com eyebrow/título/descrição; Portrait com imagem configurável e fallback autoral; ActionLink com variantes primary/secondary/text; VslPlayer com poster autoral e MP4/YouTube/Vimeo; Footer; PendingDialog para destinos ainda não fornecidos.

Hover move setas 3px e ajusta luz. Efeito magnético limitado a 3px, só mouse fino, sem reduced motion. Foco com outline laranja claro, alvos >=44px. Links de navegação são âncoras reais. Destino pendente abre diálogo explícito, com Escape e foco restaurado. Não haverá rota falsa de portfólio.

## Movimento

Assinatura de carregamento não bloqueia cliques; desaparece em até 650ms. Entrada escalonada com opacidade mínima positiva, 8–12px de deslocamento. Scroll reveal suave; conteúdo existe e fica visível sem JavaScript. MotionConfig respeita preferência do usuário; CSS desativa animações e scroll suave em reduced motion.

## Conteúdo e mídia

Preservar os textos pedidos. Aplicar Humanizer na documentação e textos auxiliares sem alterar as chamadas exatas do briefing. Foto e vídeo são placeholders explicitamente solicitados. Não representar pessoa fictícia como Sued. Não usar logos de clientes, métricas, estatísticas ou depoimentos.

## Contraste

Medições finais constarão no QA_REPORT.md. Branco sobre #FF4B1F requer texto grande para AA: CTA principal definido com 20px e peso 700. Texto auxiliar não ficará sobre o botão laranja. As bordas finas são decorativas; conteúdo e foco não dependem delas.

## Breakpoints de aceite

320, 375, 390, 430, 768, 1024 e 1440px. Nenhum scroll horizontal. Player 16:9. Foto com object-fit cover e posição ajustável, proporção preservada. Testar zoom 200%, teclado e mídia ausente.
