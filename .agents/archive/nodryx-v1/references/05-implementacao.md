# 05 — Construção: frontend, templates e integrações

## Inspeção e stack
Antes de editar, leia `package.json`, rotas, CSS, componentes, docs, variáveis de ambiente (nomes, **não exibir segredos**), scripts e assets existentes. Não reescreva a aplicação inteira por estética. Se não houver app, escolha o stack mínimo suficiente:

- **HTML/CSS/JS**: landing simples e export estático, CMS opcional.
- **React + Vite**: interações/client-side e componentes sem exigência SEO avançada de múltiplas páginas.
- **Next.js (ou equivalente)**: quando SSR/SSG, rotas dinâmicas, dados e SEO exigirem.
- CMS/framework imposto pelo cliente: adaptar.

Mantenha imagens locais se possível, fallback quando CDN falhar; evitar múltiplas bibliotecas de animação. Usar tokens de design em vez de presets de componentes incompatíveis.

## Modelo de arquitetura frontend (adaptar, não criar sem necessidade)
```
src/
  components/
    ui/         # Button, Input, Dialog, Card
    layout/     # Header, Footer, Container
    sections/   # Hero, Benefits, Proof, FAQ, FinalCTA
  pages/        # rotas reais
  styles/       # tokens e estilos globais
  data/         # conteúdo por seção quando cabível
  assets/       # mídia otimizada
```

## Blueprint para landing page
1. Header sem excesso de links; CTA destacado (menu acessível em mobile).
2. Hero: H1 **o que oferece + para quem + resultado plausível**; supporting copy e um CTA principal; prova verdadeira ou demonstração.
3. Dor ou contexto → solução → benefícios concretos.
4. Serviços/features com agrupamento lógico (sem 9 cards iguais só para preencher).
5. Processo ou demonstração com capturas reais/ilustrativas rotuladas.
6. Prova social/cases apenas verificados; se inexistentes, substituir por metodologia, diferenciais comprováveis ou FAQ.
7. FAQ baseado em perguntas reais e objeções; sem promessas fabricadas.
8. CTA final com destino configurado; Footer com navegação, informações reais e privacidade quando aplicável.

## Template não é screenshot
Templates prontos devem conter componentes editáveis, estilos, layout adaptativo, conteúdo substituível e lógica de navegação real. Se exportar HTML do Aura, limpar dependências, garantir direitos de uso e adaptar ao framework quando necessário. Se importar do 21st, instalar apenas dependências usadas e verificar licenças; não copiar credenciais nem código arbitrário do catálogo.

## Acessibilidade e estados
- Elementos nativos corretos; heading de um nível coerente; landmarks; skip link; `html lang`; meta viewport.
- Rótulos explícitos de inputs; erros associados; estados de submissão (idle/loading/success/error) guiados por resposta real do backend.
- Modal/dialog: foco inicial, trap/restore focus, Escape quando apropriado, rotulagem.
- Menu mobile: abre/fecha, foco visível, labels acessíveis, Escape, links fecham menu quando necessário.
- Acordeão: elementos `<button>` com `aria-expanded` e controle do conteúdo.
- Interações táteis, não dependentes de hover, e tolerantes a zoom e redução de movimento.
- Layout responsivo para idioma com palavras grandes, zoom de texto e estados vazios.

## CTA e formulários
- WhatsApp: `https://wa.me/<DDI+DDD+numero>` **somente com número confirmado**; texto URL-encoded. Não deixar número fictício.
- E-mail `mailto:` válido só se for a ação escolhida. Rotas internas devem existir.
- Captura de leads: especificar destino (CRM, endpoint/backend, serviço de formulário), validação front+back, anti-spam, aviso de privacidade conforme contexto. Sem endpoint não chamar 'funcionando'.
- Link externo `target="_blank"` deve incluir `rel="noopener noreferrer"`.

## SEO/SXO básico
- Um título claro e metadescription por página, H1 descritivo, headings semânticos, meta viewport, OG e favicon.
- URLs legíveis, links internos, imagens com alt descritivo, conteúdo renderizável e crawlable quando visibilidade orgânica é objetivo.
- Canonical e sitemap coerentes com domínio final; não apontar URL hipotética como produção.
- Dados estruturados JSON-LD somente factuais e de tipo aplicável, aderindo ao Google Search Central.
- SEO não substitui proposta de valor, UX nem conversão; nenhuma garantia de aparecer em recomendações de IA.

## Segurança básica
- Segredos só em variáveis do servidor; revisar CSP/cookies quando pertinentes.
- Nenhuma API key em JS frontend, repositório ou bundle estático.
- Sanitizar conteúdo usuário e proteger backend contra abuso; não confiar em validação client-side.
- Dependências confiáveis, versões coerentes, nenhuma execução cega de código externo.

## Entregas por escopo
- **Só prompt:** brief + pesquisa + DESIGN.md + prompt Aura/21st/image.
- **Só layout/template:** componentes/arquivos de UI editáveis com interações locais; não prometer backend.
- **Site completo:** projeto executável, ativos e rotas, testes funcionais, instruções de execução, integrações pendentes explicitadas.
- **Revisão de site:** diagnóstico P0–P3, mudanças pontuais, antes/depois baseado em evidências.
