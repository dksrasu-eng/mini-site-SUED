# SUED | Mini site de bio

Mini site de bio com temas claro e escuro em português para SUED, com WhatsApp, portfólio configurável e apresentação em vídeo. Revisão V2 inspirada na concentração de identidade, links e vídeo da referência Luna. No mobile, uma coluna compacta; no desktop, introdução ao lado da bio. O retrato compartilha o fundo com os links, com formas orgânicas e detalhes de colagem, sem moldura ou setas. Projeto local em Next.js App Router, TypeScript, Tailwind CSS, Motion e Lucide. Geist Sans fica hospedada no próprio projeto.

## Rodar

Requer Node.js 20.9 ou superior e npm. Na pasta do projeto:

```powershell
npm install
npm run dev
```

Abra http://127.0.0.1:3000. Para rodar a versão de produção:

```powershell
npm run build
npm start
```

Encerre o servidor com Ctrl+C antes de trocar entre dev e produção.

## Publicação na Cloudflare Pages

O projeto usa `output: "export"`. O comando `npm run build` gera o site completo em `out/`; `npm start` serve essa pasta para conferência local.

Na integração com GitHub, use a branch `main`, o comando `npm run build`, a pasta de saída `out` e Node.js 24. Foto, vídeo e fontes são publicados junto com o site. Os temas e o efeito de partículas funcionam no navegador.

## Personalizar

Edite `src/config/site.ts`. Não é necessário alterar os componentes.

| Campo | Como usar |
| --- | --- |
| `brand`, `name`, `title`, `description`, `headline` | Identidade, textos e metadados |
| `theme.default` | Tema inicial: `light` ou `dark`. A escolha explícita do visitante prevalece e é salva no navegador |
| `available` | Atualiza o indicador e o texto de disponibilidade |
| `whatsapp.number` | DDI + DDD + número; atual: `5575981475240`, confirmado pelo usuário |
| `whatsapp.message` | Texto pré-preenchido, codificado automaticamente |
| `portfolioUrl` | Link completo do portfólio; vazio abre um aviso com opção de conversar |
| `instagramUrl` | Perfil confirmado: https://www.instagram.com/sued.sites/ |
| `siteUrl` | Domínio final com `https://`; ativa canonical e liberação no robots |
| `photo.src` | Arquivo em `public`, como `/images/sued.webp`, ou URL da foto |
| `photo.alt`, `photo.position` | Texto alternativo e ponto de recorte, como `center 35%` |
| `video.url` | YouTube, Vimeo ou arquivo MP4/WebM local/remoto |
| `video.poster` | Thumbnail opcional; vazio mantém a composição original |
| `video.captionsUrl` | Arquivo WebVTT real em português para legendas do vídeo local |

A foto real fornecida está em `public/images/sued.jpeg`, com recorte e bordas suaves por CSS. O original foi preservado. Foto que falha ao carregar retorna à composição da marca. A mini VSL está em `public/videos/mini-vsl.webm` (VP9/Opus, 1280×720, cerca de 48s e 7,5MB), convertida do MP4 fornecido. A capa é um quadro do próprio vídeo. O arquivo só é carregado após o visitante apertar play, quando a reprodução começa com controles nativos dentro do quadro arredondado. Não há reprodução ou download do vídeo ao abrir a página.

Exemplos de URLs suportadas: `https://www.youtube.com/watch?v=ID_DO_VIDEO`, `https://youtu.be/ID_DO_VIDEO`, `https://vimeo.com/123456789`, `https://player.vimeo.com/video/123456789?h=CODIGO` e `/videos/mini-vsl.webm` ou `/videos/apresentacao.mp4`. O identificador do YouTube deve ter os 11 caracteres reais. Use apenas mídias com autorização e legendas adequadas.

## Conferir

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

Com o servidor rodando, para repetir a auditoria:

```powershell
npx playwright install chromium
npm run qa
node scripts/check-browser.mjs
npm run qa:themes
npm run qa:particles
python .agents/skills/nodryx/scripts/validate_project.py PROJECT_MANIFEST.json REFERENCES.json
python -m unittest discover -s .agents/skills/nodryx/tests -v
```

O diretório `qa/rendered` é capturado pelo teste funcional. As capturas finais ficam em `qa/screenshots/bio-*.png`; o script de QA fornecido pela skill gera `viewport-*.png`. São verificações de laboratório, não certificação WCAG nem métricas de usuários reais. O número e a mensagem do WhatsApp são verificados sem enviar mensagens. O teste também exige altura mobile abaixo de 1250px e contato dentro da primeira tela CSS de 900px.

O teste de temas verifica os dois modos em cinco larguras, teclado, persistência, sincronização entre abas, restauração antes da hidratação, storage bloqueado, estados pendentes e conteúdo sem JavaScript. Resultados em `qa/themes/results.json`; capturas em `qa/themes/{light,dark}-{largura}.png`. Contrastes medidos em `qa/theme-contrast.json`.

## Estrutura

- `src/app`: página, estilos, metadados, ícones e imagem Open Graph.
- `src/components`: marca, botões, diálogo, retrato, player e animações.
- `src/config/site.ts`: conteúdo e integrações editáveis.
- `src/lib/theme.ts`: tema inicial, restauração antes da hidratação, armazenamento e sincronização entre abas.
- `src/lib/links.ts`: validação de destinos e normalização dos vídeos.
- `tests`: testes de contato e formatos de vídeo.
- `scripts/check-browser.mjs`: fluxo de teclado, estados pendentes, acessibilidade e responsividade.
- `.agents/skills/nodryx`: skill V2 completa, incluindo nove referências, modelos, scripts e testes. O script visual foi ajustado para aguardar a rede/fontes, usar reduced motion e calcular PASS/FAIL pelos resultados reais.
- `.agents/archive/nodryx-v1`: cópia integral da primeira skill; `qa/before-v2` guarda o código e documentação anteriores ao refinamento.
- `.agents/skills/humanizer`: skill fornecida, README e licença MIT preservados.

## Antes de publicar

Configure as legendas do vídeo quando houver fala, portfólio e `siteUrl`; faça um novo build. Enquanto `siteUrl` estiver vazio, robots bloqueia indexação e o Next usa localhost nas URLs das imagens sociais. Isso é uma pendência de configuração, não um domínio público.

As dependências de runtime não apresentaram vulnerabilidades no `npm audit --omit=dev` executado durante a entrega. A árvore de lint tem um aviso de segurança transitivo em `braces` sem correção publicada na data; detalhes no QA_REPORT.md. Não aplique `npm audit fix --force`, pois a proposta automática rebaixa o pacote de lint para uma versão incompatível com a stack escolhida.

Não há analytics, rastreadores, formulário, backend de leads ou integração paga. A publicação usa Cloudflare Pages; nenhum domínio próprio foi alterado.

## Documentação e direitos

Veja BRIEFING.md, CAPABILITIES.md, PINTEREST_RESEARCH.md, REFERENCE_BOARD.md, DESIGN.md, DESIGN_LIGHT_DARK.md, DESIGN_PLAYFUL.md, ASSET_PLAN.md, COPY_REVIEW.md e QA_REPORT.md. O Pinterest foi aberto e apresentou login; não houve inspeção de Pins. Luna, 21st e Aura foram efetivamente vistos em screenshots CUA. Nenhum template pago ou fotografia de terceiros foi importado. A foto veio do usuário; formas, thumbnail e favicon foram criados em CSS/SVG. As bibliotecas mantêm suas licenças distribuídas pelo npm. A licença MIT da Humanizer permanece junto da skill.

## Nome em partículas

O nome Sued no retrato reage ao cursor e se reorganiza. Mantém Geist e as cores de cada tema, sem moldura. Canvas decorativo e texto semântico permanecem separados. O efeito respeita movimento reduzido e pausa quando fora da tela/aba; sem JavaScript ou canvas, o nome normal continua visível. Código em src/components/particle-name.tsx, teste em scripts/check-particles.mjs e evidências em qa/particles.
