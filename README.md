# Meiuca — Site 2026

Home do site da Meiuca, construída a partir do arquivo **Site 2026** no Figma (frame `Home`).
O site é estático e feito em [Astro](https://astro.build), sem frameworks de UI e sem bibliotecas de animação.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera a pasta dist/
npm run preview  # serve o build
```

Requer Node 22 ou mais recente.

## Estrutura

```
src/
  data/content.js        ← textos, links, serviços, posts (edite aqui)
  assets/images/         ← imagens originais (o build gera AVIF/WebP/JPG em 1x, 2x e 3x)
  assets/svg/            ← logos e ícones exportados do Figma
  components/            ← Header, Hero, TenYears, Services, Blog, Footer
  styles/global.css      ← tokens e estilos
  scripts/main.js        ← animações de scroll, menu, scroll suave, newsletter (~3 KB gzip)
public/
  fonts/                 ← Archivo (variável, hospedada no próprio site)
  _headers               ← headers de segurança (Netlify / Cloudflare Pages)
vercel.json              ← os mesmos headers para a Vercel
```

## Animações

As animações seguem o vocabulário das duas referências, estudadas quadro a quadro nos sites originais:

- **Prolab:** texto surgindo letra por letra (opacidade, blur de 10px e 20px de subida), elementos subindo com uma mola leve e o menu entrando com blur.
- **Aparelho:** imagens subindo de baixo com blur e em sequência, e o preloader com imagens espalhadas.

| Módulo | Comportamento |
|---|---|
| Intro | Cerca de 2,7s. Fundo preto, as 5 imagens do Hero surgem espalhadas (como no preloader do Aparelho), o logo MEIUCA sobe letra por letra e o contador vai de 0 a 100%. Depois as letras saem para cima e a cortina sobe. É 100% CSS e termina sozinha mesmo sem JavaScript. |
| Header | Fixo, com `mix-blend-mode: difference` para ficar legível sobre qualquer fundo. Some (sobe e apaga) quando o footer chega e volta ao subir; com foco do teclado nele ou com o menu aberto, aparece de novo. |
| Scroll | Suave na roda do mouse e no trackpad, como o do Prolab (intensidade em `LERP`, no `main.js`). No toque, no teclado e na barra de rolagem o scroll é nativo. |
| Entrada | Menu e logo entram com blur. A descrição do Hero surge letra por letra. As imagens do marquee sobem de baixo com blur, uma depois da outra. Tudo começa quando a intro sai (`--intro-offset`). |
| Menu | Estrutura e movimento do menu do meiuca.design: um painel de 672px desce do topo em 0,6s, com o reel em loop à esquerda ("Play reel - 1:32") e os links de 24px à direita (Home, About, Blog e Contato, os mesmos do footer, em `nav` no `content.js`). Ao abrir o menu, o reel fixo do canto desce e sai da tela; ao fechar, ele volta. Clicar no reel do menu abre o reel grande a partir dele. Fundo e hover do joaosena.com: vidro com 10% de branco e blur de 50px, e o link escurece para 40% no hover (150ms). O vidro cresce de cima para baixo enquanto o conteúdo desliza, os dois no mesmo quadro. Com o menu aberto, a página atrás fica parada (scroll, elástico do trackpad e marquee) e o header perde o `mix-blend-mode`, que no Chrome quebrava o desfoque do vidro em alguns pontos da página. O botão Menu ganha a pílula de vidro no hover; o Fechar fica sem caixa. |
| Reel | Como o do mouthwash.studio/studio: fixo no canto inferior direito, pequeno e em loop. Dá para arrastar (volta para o canto com uma mola) e, ao clicar, cresce até o centro da tela sobre um fundo desfocado. Em meiuca.design toca o vídeo completo do Vimeo (ID em `reel.vimeoId`, no `content.js`); nos outros endereços, a prévia em alta. Fica fixo durante todo o scroll e some quando o footer chega (volta ao subir). |
| Hero: imagens | Marquee contínuo da direita para a esquerda, independente do scroll, com as 9 imagens da seção conteudo do Figma no tamanho de lá (`heroImages`, no `content.js`; medidas em `.mq1`…`.mq9`). A 06, animada no Figma, é um vídeo leve em loop que só toca perto da tela. A velocidade fica em `.marquee__track` (`72s`). |
| Hero: descrição | Cada palavra acende conforme o scroll, num degradê de 3 palavras, e o texto inteiro termina de acender antes de sair da tela. A opacidade inicial fica em `MIN`, em `main.js`. |
| 10 Anos | Como no Figma (nó `809:493`): container azul com o texto no centro e um tracejado de fundo (2 linhas e 3 círculos). Quando o container entra na tela, o tracejado se desenha linha por linha (tampas da cor do fundo saem da frente de cada traço, só com `transform`) e o texto surge letra por letra. Repete a cada passagem. |
| Serviços | Como o iverson.inc (título no estilo do "Clientes", à esquerda, como o de Insights): lista em sanfona (Brand, Design System, Product Design, Inteligência artificial). Com o scroll, a lista fica presa e cada serviço abre na sua vez (clicar num nome rola até ele). Um item aberto por vez; o aberto (fundo preto 100%) mostra as imagens à direita (principal + 2 detalhes) e a descrição com as tags embaixo à esquerda. A troca anima as duas alturas juntas, sem mexer no resto da página. Nomes, textos e imagens do Figma (seção conteudo) em `services`, no `content.js`; as tags ainda são sugestões. |
| Insights (Blog) | O título surge letra por letra e os cards sobem com mola. No hover, uma pílula "Ler artigo" segue o cursor (como o "Explore" do Prolab), o fundo dá zoom e a miniatura sobe. O primeiro card usa fundo com desfoque de 80px, como no Figma (`bg: 'soft'` em `content.js`). O autor fica no pé do card: foto em cima, nome e cargo embaixo, centralizados. |
| Clientes | Como o work.co/clients: grade de 3 colunas com o título na primeira célula. Cada cliente tem nome e descrição. O link "Ver projeto" (alinhado na base da linha) está oculto até existirem as páginas dos projetos: para mostrar, `showCaseLinks = true` no `content.js`. Os itens sobem ao entrar na tela, coluna por coluna. Clientes e descrições do Figma (seção conteudo), em `clients`, no `content.js`; os links ainda são `#`. |
| Footer | Os blocos sobem ao entrar na tela e as letras do logo MEIUCA sobem em sequência. |

As revelações se repetem toda vez que o elemento entra na tela, descendo ou subindo, e a entrada do Hero também se repete quando ele volta à tela.

Quem ativa "reduzir movimento" no sistema não vê a intro e recebe uma versão sem movimento (inclusive sem o scroll suave).

**Performance das animações:** quando a entrada termina, as animações são desligadas (classe `is-entered`), e os estados escondidos usam `opacity: 0`. Assim o navegador não mantém uma camada de efeito por letra. No topo da página, o custo caiu de 113 camadas por quadro para 4. O blur das letras é curto (só no começo de cada letra) e não existe nas letras que saem; nenhum hover anima `filter`; e as imagens são carregadas e decodificadas com 1,5 tela de antecedência.

## Imagens em alta resolução

Todas as imagens vêm do Figma (seção **conteudo**, nó `1030:18`), exportadas em **4x**, já com o recorte do Figma:

- **Hero:** 4x do tamanho de cada imagem no Figma (ex.: 582×403 → 2328×1612). A 06, que é um GIF no Figma, virou vídeo (`public/media/hero-06.webm/.mp4`, 874×800, loop de 6s) com a imagem como capa.
- **Serviços:** principal em 3504×1944 e detalhes em 1704×1108.
- **Blog:** renderizadas em 3x.

O build gera versões AVIF, WebP e JPG em vários tamanhos com `srcset` (qualidade 85–88), e o navegador baixa só o que cada tela precisa: até 3x nos celulares e 2x ou mais em telas Retina, Studio Display e Pro Display (Serviços chega a 3504px).

## Segurança

- Não há scripts, estilos ou fontes de terceiros. Tudo é servido pelo próprio domínio.
- A Content Security Policy é estrita (`script-src 'self'`, `style-src 'self'`, sem `unsafe-inline`), com HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy` e `Permissions-Policy`.
- Os headers estão em `public/_headers` (Netlify/Cloudflare) e em `vercel.json`.
- `npm audit` sem vulnerabilidades na data do build (Astro 7.4).

## Pendências

- [ ] Tags definitivas dos serviços (`services`, em `src/data/content.js`). Hoje são sugestões.
- [ ] Links dos projetos dos clientes e do "Sobre nós" (`clients` e `tenYears`, em `src/data/content.js`). Hoje são `#`.
- [ ] Conectar a newsletter a um serviço. Hoje só valida o e-mail e mostra uma mensagem de sucesso, sem enviar nada (ver `TODO` em `main.js`). Depois, liberar o domínio do serviço em `connect-src` / `form-action` na CSP.
- [ ] URLs do LinkedIn e Instagram (`src/data/content.js`).
- [ ] Links do menu e dos posts do blog (hoje `#`).
- [ ] Confirmar que o vídeo do Vimeo (1059077959) permite incorporação no domínio final. Hoje ele só toca em meiuca.design.
- [ ] Imagem de compartilhamento (Open Graph) e domínio final em `astro.config.mjs`.
