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
- **Performance:** JS ~5 KB e CSS ~7,5 KB (gzip). Imagens via `<Picture>` do Astro (AVIF/WebP/JPG com `srcset`). O reel do menu só carrega quando a pessoa passa o mouse no botão Menu (ou abre o menu).
  - Cada elemento com `filter` (blur) vira uma camada extra a cada quadro. Por isso: estados escondidos usam `opacity: 0` (nunca `0.001`, que obriga o navegador a desenhar a camada); as animações de entrada são desligadas quando terminam (classe `is-entered` no `<html>`, em `initEntryCleanup`); e nunca anime `transform` num elemento com `backdrop-filter`.
  - Medição de referência (Chromium, scroll no topo da página): 4 camadas de efeito por quadro. Antes da limpeza eram 113 a 166.
  - **Blur por letra é o efeito mais caro do site.** Regra: blur curto (8px por 0,35s; 3px por 0,3s nos títulos de Serviços), opacidade e subida mais longas (0,7–1s), e nada de blur nas letras que saem. Blur no bloco inteiro (um parágrafo grande) foi testado e é pior. Medido em Chromium (quadros na troca de frase do 10 Anos): blur 10px na entrada e saída = 76–94; só entrada e curto = 154–166; sem blur = 240.
  - **Nunca anime `filter` em imagens grandes** (hover do blog): o blur do fundo é fixo e o brilho muda por uma camada (`::after`) com opacidade. Ganho de ~70% de quadros no hover.
  - Imagens `loading="lazy"` carregam e decodificam com 1,5 tela de antecedência (`initWarmup`), para não aparecerem em branco.
  - O logo do footer é um `<svg>` por letra (`.fg0`…`.fg5`), para a subida das letras ser animada na GPU.
- **Imagens em alta resolução:** é um estúdio de design, a qualidade tem que ser excelente. Exporte do Figma em 3x, ou use os originais pelo `download_assets` do MCP do Figma. Os originais de Serviços chegam a 4080px. Nunca use capturas em 1x.
- **Fonte:** Archivo (variável, hospedada em `public/fonts`). O Figma usa Neue Haas em alguns textos, mas a decisão foi usar Archivo em tudo.
- **Acessibilidade:** `prefers-reduced-motion` desliga a intro e os movimentos. Texto partido em letras tem cópia `visually-hidden` para leitores de tela.

## Referências de animação (estudadas quadro a quadro nos sites)

- **Prolab** (https://prolab.framer.website/): texto surge letra por letra (opacidade, blur de 10px e 20px de subida), mola leve nos elementos, pílula "Explore" que segue o cursor.
  - **Serviços** é uma cópia exata da seção Branding/Digital/Strategy/Art Direction do Prolab: 4 cards sticky de 100vh, 65px de intervalo, topo em 0/50/100/150px. Ao longo da seção, as escalas finais são 0,4/0,5/0,6/0,7 e há uma subida de 11vh (`-vh/9 * p`). O título aparece letra por letra com blur.
  - A pedido do João, Serviços **não** tem cantos arredondados, número nem linha: só o título, alinhado à direita, com 32px de margem.
- **Aparelho** (https://aparelho.studio/): marquee contínuo de imagens no Hero (sem interação com o scroll), imagens subindo com blur na entrada, preloader com imagens espalhadas.
- **meiuca.design**: estrutura e comportamento do **menu aberto**. Painel de 672px que desce do topo em 0,6s (`cubic-bezier(0.33,1,0.68,1)`), reel em loop à esquerda (326×270, "Play reel - 1:32") e links de 24px em linhas de 48px à direita. O reel completo é o Vimeo `1059077959`, que só pode ser incorporado em meiuca.design.
- **mouthwash.studio/studio**: comportamento do **reel** (medido no site). Fixo no canto inferior direito, 200×113 (150×84 no celular), 20px do rodapé da tela, cantos de 4px e brilho branco (`0 0 80px rgba(255,255,255,.2)`). Dá para arrastar e ele volta para o canto com uma mola. Ao clicar, cresce até o centro (640×360; no celular, a largura da tela menos as margens) sobre um fundo `rgba(0,0,0,.5)` com blur de 30px. Esc, "Fechar" ou clique fora fecham.
- **joaosena.com**: **fundo e hover** do menu. Vidro com `rgba(255,255,255,.10)` e `backdrop-filter: blur(50px)`. No hover, o link vai para `rgba(255,255,255,.4)` em 150ms. Pílula de vidro no hover do botão Menu. O "Fechar" fica **sem caixa** (pedido do João); no hover, só o texto escurece.

## Comportamento atual por módulo

- **Intro** (~2,7s, CSS puro): imagens espalhadas, logo MEIUCA letra por letra, contador de 0 a 100% e a cortina sobe. `--intro-offset` sincroniza a entrada do resto do site.
- **Header:** fixo, sempre visível (pedido do João). Usa `mix-blend-mode: difference` para ficar legível sobre qualquer fundo.
- **Scroll suave:** na roda do mouse/trackpad, como o Lenis do Prolab (`LERP = 0.1` em `initSmoothScroll`). Toque, teclado e barra de rolagem continuam nativos; `prefers-reduced-motion` desliga.
- **Hero:** padding e gap de 256px (Figma). A descrição (texto do Figma) surge letra por letra em ~1,2s e depois cada palavra acende com o scroll, num degradê de 3 palavras. O texto inteiro termina de acender antes de sair da tela: quando o fim dele chega à metade da tela ou, no máximo, quando o topo encosta no header (desktop: ~256px de scroll; celular: ~120px). O marquee é CSS puro (60s) e pausa fora da tela.
- **Menu:** o vidro cresce de cima para baixo (altura) e o conteúdo desliza com `transform`. Os dois são animados no mesmo loop de JS (`animateTo` em `initMenu`), então nunca se descolam. Abrir: 0,6s (`easeOutCubic`, a curva do meiuca.design). Fechar: 0,45s. O reel começa a tocar quando o painel termina de descer.
  - **Glitch do vidro (resolvido):** no Chrome, o `mix-blend-mode: difference` do header por cima de um `backdrop-filter` faz o desfoque mostrar retângulos nítidos das imagens que estão atrás. Por isso aparecia só em alguns pontos da página (ex.: com o marquee do Hero meio coberto pelo vidro). Com o menu aberto, o header fica com `mix-blend-mode: normal` (classe `has-menu` no `<html>`, removida no fim do fechamento). Nunca ponha `transform` nem `clip-path` no elemento com `backdrop-filter`.
  - **Página travada (`lockPage`):** com o menu aberto nada se mexe atrás do vidro: o scroll suave para na hora, roda/toque/teclas de rolagem são bloqueados (menos dentro do menu, se ele rolar no celular), o elástico do trackpad é desligado (`overscroll-behavior`) e o marquee pausa. A largura da barra de rolagem vira `padding` (`--sbw`) para a página não pular.
- **Animações repetidas:** as revelações (`.reveal`, `.reveal-chars`, logo do footer) acontecem toda vez que o elemento entra na tela, descendo ou subindo (pedido do João). Elas entram com o elemento 12% dentro da tela e são rearmadas (`.is-out`, sem transição) quando ele sai por completo. A entrada do Hero (descrição letra por letra e imagens do marquee subindo) também se repete quando eles voltam à tela (`[data-replay]`).
- **10 Anos:** texto único do Figma (Archivo Light 80px, entrelinha 1, 840px). A parte fixa "Há 10 anos ajudamos grandes empresas" fica parada (sticky) e só o complemento troca com o scroll: 5 frases, 45svh por frase, letras saindo para cima e entrando de baixo com blur. As camadas ficam empilhadas e cada uma repete a parte fixa invisível, para o complemento começar exatamente depois de "empresas". Frases em `tenYears` no `content.js`. O Figma diz "ajudando"; o João passou as frases com "ajudamos".
- **Reel** (`Reel.astro`, `initReel`): existe em dois lugares. No **menu**, como antes (326×270, "Play reel - 1:32", carrega no hover do botão Menu). Na **página**, como o player fixo do mouthwash (ver referências). Quando o menu abre, o reel do canto desce e sai da tela; quando o menu termina de fechar, ele volta (`reelApi.setAway`). Clicar no reel do menu abre o mesmo player grande a partir do reel do menu (continua do mesmo ponto do vídeo) e, ao fechar, ele volta para o menu (`reelApi.openFrom`). A prévia pequena (`media/reel-mini.*`, 480px, ~200 KB) carrega só depois da página. Ao abrir, em meiuca.design entra o Vimeo completo; nos outros endereços (GitHub Pages, prévia) entra a prévia em alta (`media/reel-preview.*`, 5,7s sem som). Em Serviços o reel desce e sai da frente, porque o título dos cards fica nesse canto.
- **Insights:** o card 1 usa fundo com blur de 80px (`bg: 'soft'`). No hover, a pílula "Ler artigo" segue o cursor.
- **Clientes:** o nome acende no hover e a prévia do projeto (240×180) segue o cursor se o cliente tiver `image`. Hoje só o Mude tem imagem. O ponto azul do Figma foi removido a pedido do João.
- **Footer:** newsletter (só validação, sem envio), links e logo gigante com letras subindo.

## Pendências

- Imagem definitiva para **Branding** (hoje é a flor do Hero, provisória).
- Prévias dos outros clientes (só o Mude tem).
- Conectar a newsletter a um serviço e liberar o domínio dele na CSP (`connect-src`/`form-action`).
- URLs reais do LinkedIn e do Instagram, e links do menu e dos posts (hoje `#`).
- Imagem de Open Graph e domínio final em `astro.config.mjs`.
- Confirmar o embed do Vimeo no domínio final (o reel completo só toca em meiuca.design).

## Como trabalhar

- Comandos: `npm install`, `npm run dev`, `npm run build`.
- Depois de cada alteração: build, verificação com Playwright em 1440×900 e 390×844 (capturas, console sem erros, sem rolagem horizontal), depois commit e push na `main`. O João quer o repositório sempre atualizado.
- O Chromium headless em modo software não renderiza `backdrop-filter: blur(50px)` em áreas grandes. Para conferir o vidro, rode com `--use-angle=swiftshader --enable-unsafe-swiftshader`.
- Mensagens de commit em português.
- **Arquivo para subir no GitHub à mão:** quando não der para enviar direto (sessão sem acesso ao repositório), mande um zip só com os arquivos alterados, nas pastas certas, com o nome `Meiuca-V[00].zip`, em sequência e com dois dígitos: `Meiuca-V01.zip` foi o primeiro envio do site, `Meiuca-V02.zip` o segundo, e assim por diante.
- **Publicação:** o GitHub Pages publica a cada push na `main` (`.github/workflows/deploy.yml`) em https://senadegusmao.github.io/meiuca/. O subcaminho vem de `BASE_PATH` no workflow, então caminhos da raiz (`/fonts/…`, `/media/…`, `/`) passam sempre por `withBase()` de `src/lib/url.js`. O Pages não envia headers: a CSP também está num `<meta>` em `Base.astro` (mantenha igual à dos headers).
