# Efeito no nome

Canvas original adaptado do exemplo fornecido pelo usuário, sem novas imagens ou fontes. Usa Geist local e tokens do tema. O texto Sued permanece no HTML; canvas decorativo com fallback estático. Instagram configurado com link confirmado @sued.sites. Foto e vídeo preservados.

# Mini VSL adicionada

Vídeo fornecido pelo usuário: bio site mini vsl teste1.mp4. Original preservado fora do public. Conversão local com FFmpeg 7.1, via pacote imageio-ffmpeg isolado em qa/tools (sem dependência nova no site). Saída public/videos/mini-vsl.webm: VP9/Opus, 1280×720, 30fps, ~47,7s, 7466337 bytes. Sem cortes e com áudio preservado. Decodificação integral validada. Configuração e resultado em qa/video-conversion.json.

Capa public/images/vsl-poster.jpg extraída em 12s do vídeo, 1280×720. Nenhuma imagem de banco ou geração. O player mantém border-radius 24px e overflow hidden; vídeo usa object-fit contain para não cortar conteúdo. Play carrega o arquivo e inicia reprodução por ação do visitante. Controles nativos com pausa, seek e fullscreen; sem carregamento da mídia no acesso inicial. WebVTT separado ainda não fornecido; não foram criadas legendas fictícias.

Os registros anteriores abaixo são histórico.

---

# Foto real adicionada

A foto fornecida pelo usuário está em public/images/sued.jpeg, 179851 bytes, sem alteração dos pixels ou da expressão. Origem e hash registrados em qa/photo-source.json. O retrato usa recorte CSS com foco no rosto e máscara suave nas bordas/base; não houve remoção automática do fundo nem geração de imagem. Alt: “Sued sorrindo”. A composição foi conferida nos dois temas. O fallback continua disponível se o carregamento falhar, inclusive quando o erro acontece antes da hidratação.

Removidos linha pontilhada, separadores, órbitas e barras decorativas. Permanecem formas preenchidas e os ícones funcionais existentes. Vídeo, portfólio, Instagram e domínio ainda aguardam dados reais. Os planos anteriores abaixo são histórico.

---

# Assets da revisão atual

O retrato perdeu a faixa retangular e a janela de navegador. Usa uma flor/monograma SVG original como placeholder explícito, com etiqueta “sua foto aqui”. Halo orgânico, linha pontilhada, estrela e adesivo de coração são SVG/CSS originais e decorativos. Lucide fornece Camera/Heart/MessageCircle/LayoutTemplate/Sun/Moon/Play/X conforme a licença do pacote. Nenhum novo asset remoto, fonte, biblioteca ou imagem de pessoa.

A foto real entra em src/config/site.ts, photo.src. PNG/WebP com fundo transparente permite um recorte mais definido; fotos comuns recebem uma máscara suave nas bordas e na base. Não há remoção automática do fundo. A legenda fica fora da área de imagem e acompanha os tokens do tema. Revisar o enquadramento com a foto final em todos os breakpoints; foto real ainda não fornecida, portanto esse teste depende do arquivo.

O restante do plano anterior permanece como histórico abaixo; referências à moldura antiga não descrevem esta revisão.

---

# Assets SUED

Atualização V2: retrato agora em faixa editorial dentro do painel. Placeholder original em CSS/SVG com marca tipográfica e janela de navegador abstrata. A referência Luna serviu à composição; nenhuma foto, cereja, imagem 3D ou código de lá foi reutilizado. Não houve geração paga.

| ID | Uso | Origem / ferramenta | Proporção | Caminho | Estado / acessibilidade |
| --- | --- | --- | --- | --- | --- |
| portrait | Foto pessoal | Será fornecida pela Sued | Faixa horizontal responsiva, ~190–224px de altura | siteConfig.photo.src | Pendente; fallback tipográfico autoral, sem pessoa sintética |
| portrait-placeholder | Composição temporária | CSS e SVG originais | Responsivo | Portrait | Implementado; identificação acessível como espaço reservado |
| vsl-poster | Thumbnail abstrata da marca | CSS original, sem banco/IA | 16:9 | VslPlayer | Arte local; sem alegação de vídeo real |
| vsl | Apresentação | URL futura MP4, YouTube ou Vimeo | 16:9 | siteConfig.video.url | Pendente; sem autoplay com som; legendas VTT configuráveis para MP4 |
| favicon | Assinatura S. | SVG original | 1:1 | public/icon.svg | Local |
| og | Card social | Next ImageResponse original | 1200×630 | src/app/opengraph-image.tsx | Local; sem domínio hipotético |
| noise/grid | Atmosfera | SVG/CSS original | Repetição | globals.css | Decorativo, pointer-events none |

Não é necessária geração de bitmap: foto real não foi fornecida, e o briefing pede placeholder. Não houve consumo de créditos nem uso de bancos de imagens.

Quando a foto chegar: salvar em public/images, preferir WebP até ~200KB, ajustar `photo.position`, preencher alt e revisar recorte em todos os breakpoints. O componente declara dimensões. Vídeo carrega apenas por ação do visitante; embeds usam host permitido e URL normalizada. Acrescentar legendas reais antes da publicação.

## Revisão claro/escuro

Retrato temporário, player, superfícies, bordas, estados de pendência e foco possuem variantes por tokens CSS. Não há novas imagens ou fontes remotas. O seletor usa Sun/Moon do Lucide instalado, sem nova dependência. Foto real futura mantém scrim e legenda branca, independentemente do tema.
