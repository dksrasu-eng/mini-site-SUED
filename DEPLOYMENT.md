# Publicação

- Site: https://mini-site-sued.pages.dev/
- GitHub: https://github.com/dksrasu-eng/mini-site-SUED
- Produção: branch `main`, deploy automático pela integração GitHub/Cloudflare Pages.
- Build: `npm run build`, saída `out`, variável `NODE_VERSION=24`.
- Código publicado e verificado: `60aae2085e41bd98415395b24853519987368d9e`.
- Deploy verificado: `9a89294f-0b2c-42cb-9ad1-66548c0d50f7`.

Verificações no endereço público em 17/10/2026: foto, WhatsApp, Instagram, diálogo de portfólio, responsividade em oito larguras, navegação por teclado, acessibilidade automatizada, imagens sociais PNG e VSL com reprodução, pausa e avanço. O teste de partículas também passou no endereço público, incluindo toque, temas e movimento reduzido. Evidências: `qa/functional-results.json` e `qa/particles/results.json`.

Somente `/videos/mini-vsl.webm` utiliza uma Pages Function para entregar HTTP 206, pois a entrega estática da Pages respondeu HTTP 200 e impediu o avanço do vídeo no teste. A Function lê o asset em streaming, respeita contrapressão, cancela a leitura ao fim do intervalo e não usa serviço externo ou segredo. `VIDEO_BYTES` deve acompanhar o tamanho do arquivo ao substituir o WebM; o teste verifica isso.

O restante do site é estático. A integração foi autorizada pelo usuário somente para este repositório. Nenhum domínio próprio foi modificado. O portfólio segue aguardando o link do usuário.
