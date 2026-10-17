# Prompts prontos — NODRYX V2

## Criar por nicho
> `/nodryx` Use modo CRIAR. Nicho: [nicho]. Público: [ICP]. CTA: [conversão]. Pesquise Pinterest com browser autorizado usando PT/EN, analise 3–5 imagens de referência e registre URLs/capturas reais. Combine princípios de estilo em direção original; crie assets próprios, design system consistente e site responsivo. Use Aura/21st se estiverem conectados. Faça build/QA antes de entregar. Não publique.

## Só referências
> `Use NODRYX modo PESQUISAR. Nicho [nicho], estilo [estilo], foco [hero/form/mobile]. Abra Pinterest se tiver browser autorizado, selecione 5 Pins visualmente complementares, anexando screenshots internos apenas se permitidos. Entregue REFERENCE_BOARD com análise de cada referência e 3 oportunidades de design original. Não codifique.`

## Recebi um Pin como anexo
> `Analise esta imagem anexada. Faça visual forensics: proporções, grid, hierarquia, tipo de asset, cores aproximadas, tipografia provável sem inventar família exata. Construa 2 direções novas não idênticas para meu projeto [nome]. Gere assets originais e código só após eu pedir.`

## Refatorar
> `Use NODRYX modo REFINAR no projeto local: mantenha branding, arquitetura e funcionalidades; pesquise referências por nicho, proponha transformações e ajuste apenas [seção]. Teste telas 320–1440px.`

## Testar V2
> `Use NODRYX modo TESTE. Faça diagnóstico de ferramentas, execute scripts offline, prepare consultas para Pinterest em [nicho] e, somente se houver browser autorizado, abra e inspecione 3 Pins com URLs reais e screenshots. Entregue uma tabela PASS/FAIL/NOT_RUN com evidência.`

## Prompt de análise de imagem
```
Você é pesquisador UI/UX. Analise SOMENTE o que está visível na imagem:
- composição, hierarquia, geometria, espaçamento, contraste, grid,
- estética e linguagem de imagem, componentes e interação inferível.
Distinga observação direta de hipótese. Aponte a fonte/URL se conhecida.
Liste elementos que NÃO podemos copiar sem direitos. Transforme os padrões
úteis em um design novo para [nicho], com conteúdo e assets originais.
```

## Prompt de composição para Aura
```
Crie uma landing [nicho] para [ICP], objetivo [CTA], seguindo esta direção
original: [direção criada]. Use a referência anexada APENAS para princípios
abstratos de hierarquia/ritmo visual. Não reproduza fotos, logos, copy,
identidade, disposição exata ou elementos únicos da fonte. Reforce mobile,
contraste, semântica e CTAs reais. Tokens: [tokens aprovados].
```
