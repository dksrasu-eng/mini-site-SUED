# 07 — Prompts reutilizáveis Aura, 21st, imagens e QA

## A. Prompt para Aura Builder
Cole no editor do Aura, adaptando campos e referências `@` aos itens **realmente disponíveis** na conta:

```text
Desenhe um website [TIPO] para [MARCA/SEGMENTO], em português brasileiro, orientado a [OBJETIVO PRINCIPAL].
Público: [PERSONA]; principal dúvida/objeção: [DOR]. CTA primário: [TEXTO] com destino [URL/AÇÃO REAL].
Direção de arte: [CONCEITO E REFERÊNCIAS]. Use [REFERÊNCIA @ VALIDADA] apenas como inspiração para [SEÇÃO], com composição autoral.
Design system: fonte UI [FONTE 1], fonte display [FONTE 2 OU A MESMA] — máximo duas famílias em TODO o projeto; cores [HEX], radius [VALOR], sombras [NÍVEL], grid [CONTAINER]. NÃO introduzir outras famílias ao misturar componentes.
Seções: [LISTA ORDENADA]; conteúdo real: [DADOS VERIFICADOS]; não inventar depoimentos, resultados nem marcas.
Hero: H1 com proposta de valor clara, texto complementar direto, CTA principal e composição [IMAGEM/CENÁRIO], espaço negativo para texto.
Mobile-first; testar 320px, 375px, 768px, 1024px, 1440px. Menu responsivo operacional, sem overflow horizontal.
Contraste WCAG AA: texto normal >=4.5:1; grande >=3:1; componentes essenciais >=3:1. Todos links/botões com estados e ação funcional; formulário somente se integrado, caso contrário marcar como pendente.
Acessibilidade: landmarks, hierarquia de headings, alt apropriado, focus-visible, navegação por teclado, redução de movimento.
Use animações sutis e consistentes, sem excesso. Otimize assets e preserve proporções.
Entregue layout de todas as páginas com navegação entre elas e código exportável quando a conta permitir. Indique qualquer recurso cuja conexão não foi implementada.
```

## B. Prompt para 21st.dev (busca de componente antes de gerar)
```text
Procure no catálogo 21st.dev componentes [HERO/NAV/CARDS/FORM/FAQ] adequados a [NEGÓCIO] e ao estilo [DIREÇÃO].
Priorize soluções acessíveis, responsivas e compatíveis com [STACK]. Retorne nome, URL, licença/preço, dependências, estrutura, razão da escolha e riscos.
Leia o código apenas se a licença permitir. Não cole código de componente pago sem direito de acesso.
Integre usando design tokens já existentes; preserve apenas [FONT 1] e [FONT 2] como famílias do site. Não crie sistema de estilos paralelo.
Se generation estiver habilitado na conta, ofereça até três variantes realmente distintas, sinalizando eventual uso de créditos antes de gerar. Caso contrário, escolha um componente livre e adapte no projeto com o agente de código.
```

## C. Prompt de direção de imagem (gerador habilitado)
```text
Crie uma imagem original para a seção [SEÇÃO] de um website de [SEGMENTO]. Objetivo visual: [EMOÇÃO / BENEFÍCIO].
Assunto: [SUJEITO]; cenário: [AMBIENTE, OBJETOS, PROFUNDIDADE]; materiais: [MATERIAIS].
Composição: [TIPO DE PLANO E ÂNGULO], ponto focal em [POSIÇÃO], espaço negativo [ESQUERDA/DIREITA] para CTA e headline. Proporção [16:9/4:5/1:1], com recorte adaptável para [MOBILE].
Iluminação [DETALHE], paleta [CORES], estilo [EDITORIAL/FOTO/3D/ILUSTRAÇÃO], fidelidade [PARÂMETROS].
Evite logos/marcas de terceiros, texto renderizado, watermark, mãos distorcidas, duplicações e elementos aleatórios. Não retrate cliente/funcionário real sem fonte autorizada.
```

## D. Prompt de revisão após implementação
```text
Revise o site implementado por evidência, usando build e browser quando disponíveis.
Compare visual e comportamento nos viewports 320, 375, 768, 1024 e 1440 px.
Encontre e corrija: overflow, sobreposição, contraste insuficiente, mais de 2 fontes, inconsistência de tokens, estados ausentes, imagens quebradas, menu mobile, CTA morto, formulário sem destino, acessibilidade básica, falta de metadados.
Execute auditoria estática + teste visual, revise resultados e corrija primeiro P0/P1, repetindo os testes. Documente PASSA/FALHA/NÃO TESTADO, sem inventar testes nem scores.
```
