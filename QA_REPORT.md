# QA atual | Partículas e Instagram

Finalização: 2026-10-17, America/Sao_Paulo. Produção local em http://127.0.0.1:3000. Sem publicação. Relatório anterior preservado em qa/before-particles.

O efeito enviado foi adaptado somente ao nome Sued do retrato, sem moldura, fundo de cartão ou fonte Inter. Mantém Geist, cor do texto do tema e ponto laranja. Partículas reagem ao cursor/toque e voltam à palavra. RAF para em repouso e pausa fora da tela/aba. Observadores e listeners são removidos no cleanup. A geometria é revalidada ao retomar para lidar com resize. Evitada divisão por zero na repulsão.

Texto HTML semântico permanece presente e o canvas é aria-hidden. Movimento reduzido, ausência de JavaScript ou canvas deixam o texto estático. Instagram agora é link para https://www.instagram.com/sued.sites/ com target blank e noopener/noreferrer; não abre mais o diálogo de pendência.

| Verificação | Estado | Evidência |
| --- | --- | --- |
| Build e tipos | PASS | npm run build e npm run typecheck |
| Lint | PASS | npm run lint |
| Testes de links/mídia | PASS | npm test, 3 testes |
| Repulsão e retorno | PASS | npm run qa:particles, comparação real de pixels: diferença média durante hover 12,336; depois do retorno 0,235; RAF em repouso |
| Tema | PASS | 2118 pixels opacos correspondem à cor esperada no escuro; ponto mantém laranja |
| Movimento reduzido/fallback | PASS | texto HTML visível com reduce, sem JS e com getContext indisponível |
| Resize, toque e pausa | PASS | 320px sem overflow, toque em 375px e pausa fora da tela com retomada |
| Instagram | PASS para roteamento | Clique abre o endereço exato em nova aba; navegação interceptada no teste para não depender de login. Não foi verificada a disponibilidade pública do perfil |
| Fluxo da bio | PASS | check-browser.mjs: foto/fallback, WhatsApp, vídeo WebM real, diálogos, teclado e oito larguras |
| Claro/escuro e axe | PASS parcial | qa/themes/results.json, cinco larguras em ambos; zero violações detectadas. Arte/canvas e conteúdo audiovisual ainda dependem de revisão humana; não é certificação WCAG |
| Capturas | PASS | qa/particles: desktop claro/escuro, hover, mobile e 320/768/1024/1440. Captura de interação usa viewport para não reinicializar o canvas durante medição |
| Publicação e métricas de campo | NOT_RUN | não solicitadas |

O teste mede os pixels antes da captura, pois screenshots completos podem redimensionar a área de desenho. A leitura de retorno e repouso foi confirmada em produção. Capturas de apresentação aguardam o fim da abertura da página. Não houve novas dependências, instalação de código externo ou uso do objeto global FX do exemplo. Foto, mini VSL e copy foram preservadas.

Pendências de conteúdo: portfólio, domínio e legendas separadas quando aplicáveis. O aviso metadataBase no build permanece esperado enquanto siteUrl estiver vazio. Prévia de produção mantida ativa.
