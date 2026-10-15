# Contexto do projeto: site Meiuca 2026

Este arquivo carrega o histórico da conversa em que o site foi criado. Leia antes de mexer em qualquer coisa.
Responda sempre em português (pt-BR). O dono do projeto é o João Sena, designer da Meiuca.

## O que é

- Home do novo site da Meiuca (estúdio de design de São Paulo), em **Astro 7**, estática, sem frameworks de UI e sem bibliotecas de animação.
- Fonte da verdade do design: Figma, arquivo **Site 2026** (fileKey `dMEcV6ols6W4cubYojvgCW`), frame **Home** (nó `783:141`). Os frames dos módulos estão nomeados: Menu, Hero, 10 Anos, Serviços, Blog (título "Insights"), Clientes (`822:366`) e Footer.
- Quando o João pedir para "aplicar as atualizações do Figma", compare a estrutura atual do frame com o código e aplique só o que mudou.
- Conteúdo editável em `src/data/content.js`. Animações e scroll em `src/scripts/main.js`. Estilos em `src/styles/global.css`.

## Requisitos que não podem ser quebrados

- **Responsivo:** desktop (1440 é o tamanho do Figma) e celular (390), sem rolagem horizontal.
- **Seguro:** CSP estrita sem `unsafe-inline` (nada de `<script>`/`<style>` inline nem atributos `style=` no HTML; estilos dinâmicos só via `element.style` no JS). Headers em `public/_headers` (Netlify/Cloudflare) e `vercel.json`. A única origem externa liberada é `frame-src https://player.vimeo.com`, para o reel. Mantenha o `npm audit` zerado.
- **Performance:** JS ~2 KB e CSS ~7 KB (gzip). Imagens via `<Picture>` do Astro (AVIF/WebP/JPG com `srcset`). O reel do menu só carrega quando o menu abre.
- **Imagens em alta resolução:** é um estúdio de design, a qualidade tem que ser excelente. Exporte do Figma em 3x, ou use os originais pelo `download_assets` do MCP do Figma. Os originais de Serviços chegam a 4080px. Nunca use capturas em 1x.
- **Fonte:** Archivo (variável, hospedada em `public/fonts`). O Figma usa Neue Haas em alguns textos, mas a decisão foi usar Archivo em tudo.
- **Acessibilidade:** `prefers-reduced-motion` desliga a intro e os movimentos. Texto partido em letras tem cópia `visually-hidden` para leitores de tela.

## Referências de animação (estudadas quadro a quadro nos sites)

- **Prolab** (https://prolab.framer.website/): texto surge letra por letra (opacidade, blur de 10px e 20px de subida), mola leve nos elementos, pílula "Explore" que segue o cursor.
  - **Serviços** é uma cópia exata da seção Branding/Digital/Strategy/Art Direction do Prolab: 4 cards sticky de 100vh, 65px de intervalo, topo em 0/50/100/150px. Ao longo da seção, as escalas finais são 0,4/0,5/0,6/0,7 e há uma subida de 11vh (`-vh/9 * p`). O título aparece letra por letra com blur.
  - A pedido do João, Serviços **não** tem cantos arredondados, número nem linha: só o título, alinhado à direita, com 32px de margem.
- **Aparelho** (https://aparelho.studio/): marquee contínuo de imagens no Hero (sem interação com o scroll), imagens subindo com blur na entrada, preloader com imagens espalhadas.
- **meiuca.design**: estrutura e comportamento do **menu aberto**. Painel de 672px que desce do topo em 0,6s (`cubic-bezier(0.33,1,0.68,1)`), reel em loop à esquerda (326×270, "Play reel - 1:32") e links de 24px em linhas de 48px à direita. O reel completo é o Vimeo `1059077959`, que só pode ser incorporado em meiuca.design.
- **joaosena.com**: **fundo e hover** do menu. Vidro com `rgba(255,255,255,.10)` e `backdrop-filter: blur(50px)`. No hover, o link vai para `rgba(255,255,255,.4)` em 150ms. Pílula de vidro no botão Menu/Fechar.

## Comportamento atual por módulo

- **Intro** (~2,7s, CSS puro): imagens espalhadas, logo MEIUCA letra por letra, contador de 0 a 100% e a cortina sobe. `--intro-offset` sincroniza a entrada do resto do site.
- **Hero:** padding e gap de 256px (Figma). A descrição surge letra por letra e depois cada palavra acende com o scroll. O marquee é CSS puro (60s).
- **10 Anos:** sticky. As 7 frases trocam com o scroll (45svh por frase), letra por letra com blur, e há um contador de 01 a 07.
- **Insights:** o card 1 usa fundo com blur de 80px (`bg: 'soft'`). No hover, a pílula "Ler artigo" segue o cursor.
- **Clientes:** o nome acende no hover, um ponto azul `#1474FF` segue o cursor e a prévia do projeto (240×180) aparece se o cliente tiver `image`. Hoje só o Mude tem imagem.
- **Footer:** newsletter (só validação, sem envio), links e logo gigante com letras subindo.

## Pendências

- Imagem definitiva para **Branding** (hoje é a flor do Hero, provisória).
- Prévias dos outros clientes (só o Mude tem).
- Conectar a newsletter a um serviço e liberar o domínio dele na CSP (`connect-src`/`form-action`).
- URLs reais do LinkedIn e do Instagram, e links do menu e dos posts (hoje `#`).
- Imagem de Open Graph e domínio final em `astro.config.mjs`.
- Confirmar o embed do Vimeo no domínio final.

## Como trabalhar

- Comandos: `npm install`, `npm run dev`, `npm run build`.
- Depois de cada alteração: build, verificação com Playwright em 1440×900 e 390×844 (capturas, console sem erros, sem rolagem horizontal), depois commit e push na `main`. O João quer o repositório sempre atualizado.
- O Chromium headless em modo software não renderiza `backdrop-filter: blur(50px)` em áreas grandes. Para conferir o vidro, rode com `--use-angle=swiftshader --enable-unsafe-swiftshader`.
- Mensagens de commit em português.
