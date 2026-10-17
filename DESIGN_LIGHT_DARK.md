# SUED | Claro e escuro

Direção definida antes da implementação. Pedido: percorrer o fluxo Nodryx, tornar o mini site mais claro e oferecer os dois temas. A arquitetura compacta e os links confirmados permanecem.

## Pesquisa e síntese

Nicho: mini bio de designer/desenvolvedora, entrada Instagram e conversa WhatsApp. Persona é hipótese do briefing, não entrevista: pessoa que precisa entender a oferta rapidamente no celular.

Pinterest reaberto com a query `minimal light link in bio website design`; modal obrigatório de login novamente observado no CUA. O usuário foi consultado enquanto a implementação continua. Não houve abertura de Pins nem contorno de autenticação. Query pack em qa/theme-query-pack.json.

Revisão do preview Editorial Collage Hero da 21st pela UI, incluindo o controle real de tema. Luna e os previews Aura já vistos permanecem no board. A busca no catálogo de plugins não retornou conector dedicado apropriado para Pinterest/21st/Aura. Não instalar integração de analytics irrelevante.

Alternativas: A, claro editorial com fundo de papel e painel branco; B, branco puro neutro; C, laranja dominante. Escolhida A, pois melhora leitura sem perder a identidade. O escuro permanece como opção equivalente, não um filtro aplicado ao claro.

## Sistema

- Claro inicial: fundo #F6F4EE, painel #FFFDFA, texto #201C1B, secundário #625D58, bordas marrom translúcido.
- Escuro: fundo #0B0B0D, painel #151416, texto #FAFAF9, secundário #A2A2A9.
- Marca/CTA: #FF4B1F. Texto branco do CTA grande em 20px/700. Acento de texto pequeno no claro usa laranja mais escuro para contraste.
- Uma família, Geist Sans; tamanhos e grid responsivo mantidos.
- Alternância segmentada no header com sol/lua, rótulos acessíveis e aria-pressed. Alvos de 44px. Não criar menu ou novo fluxo de navegação.
- Claro por padrão no primeiro acesso, mesmo em sistema escuro, conforme a preferência expressa do usuário. Depois, persistir a escolha explícita no localStorage `sued-theme-v1`.
- Script mínimo antes da hidratação restaura o tema salvo e theme-color; sem flash de fundo contrário. Se storage falhar, a escolha funciona na sessão. Abas recebem mudanças pelo evento storage.
- Retrato sem foto, player, estados pendentes e diálogos recebem tratamento próprio em cada tema. Quando a foto real entrar, preservar scrim escuro e legenda branca para leitura.
- Reduced motion mantido; transição curta e sem animação de layout.

## Transformações autorais

1. Papel quente, painel branco e texto escuro com contraste medido, sem importar paleta da referência.
2. Arte de navegador da SUED em variante clara, sem gerar pessoa fictícia ou copiar fotografias.
3. Seletor de tema persistente integrado ao header; mesmo conteúdo e hierarquia nos dois modos.

## QA previsto

Build, tipos, lint, testes offline, manifesto e contraste. Capturas 320/375/768/1024/1440 em ambos os temas; axe, botões, diálogos, vídeo ausente, persistência após reload, preferência do sistema, storage bloqueado e funcionamento sem JavaScript. Não declarar Pinterest completo ou publicar sem autorização.
