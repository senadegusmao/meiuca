// Conteúdo da home. Edite aqui sem mexer no layout.
// Imagens do Figma (seção "conteudo", nó 1030:18), exportadas em 4x (PNG).
// O build gera AVIF/WebP/JPG em vários tamanhos; o navegador baixa só o que
// cada tela precisa (até 3x nos celulares e ~2x em monitores 5K/6K).
import hero01 from '../assets/images/hero-01.png';
import hero02 from '../assets/images/hero-02.png';
import hero03 from '../assets/images/hero-03.png';
import hero04 from '../assets/images/hero-04.png';
import hero05 from '../assets/images/hero-05.png';
import hero06 from '../assets/images/hero-06.png';
import hero07 from '../assets/images/hero-07.png';
import hero08 from '../assets/images/hero-08.png';
import hero09 from '../assets/images/hero-09.png';
import servBrand from '../assets/images/servico-brand.png';
import servBrandD1 from '../assets/images/servico-brand-detalhe-1.png';
import servBrandD2 from '../assets/images/servico-brand-detalhe-2.png';
import servDS from '../assets/images/servico-design-system.png';
import servDSD1 from '../assets/images/servico-design-system-detalhe-1.png';
import servDSD2 from '../assets/images/servico-design-system-detalhe-2.png';
import servPD from '../assets/images/servico-product-design.png';
import servPDD1 from '../assets/images/servico-product-design-detalhe-1.png';
import servPDD2 from '../assets/images/servico-product-design-detalhe-2.png';
import servIA from '../assets/images/servico-ia.png';
import servIAD1 from '../assets/images/servico-ia-detalhe-1.png';
import servIAD2 from '../assets/images/servico-ia-detalhe-2.png';
import blog1 from '../assets/images/blog-1.png';
import blog2 from '../assets/images/blog-2.png';
import blog3 from '../assets/images/blog-3.png';
import avatar1 from '../assets/images/avatar-1.png';
import avatar2 from '../assets/images/avatar-2.png';
import avatar3 from '../assets/images/avatar-3.png';

export const heroText =
  'Somos um estúdio de design brasileiro para quem acredita que a inteligência artificial escala talento, mas não o substitui.';

// Marquee do Hero, na ordem do Figma. w/h = tamanho no Figma (px); as
// classes .mq1….mq9 do global.css repetem essas medidas (o HTML não pode ter
// style= por causa da CSP). O 06 é animado no Figma (GIF): no site vira um
// vídeo leve em loop (media/hero-06.*), com a imagem como capa.
export const heroImages = [
  { src: hero01, w: 250, h: 333, alt: 'Botton amarelo de carinha sorridente preso num tecido jeans' },
  { src: hero02, w: 582, h: 403, alt: 'Portal interno do Itaú com a foto de uma mulher sorrindo e a mensagem “Um ótimo dia de trabalho pra você :)”' },
  { src: hero03, w: 280, h: 373, alt: 'Barra de navegação flutuante azul de um app, com o botão Extrato' },
  { src: hero04, w: 437, h: 444, alt: 'Card verde de um app de saúde mostrando a glicose (122 mg/dL) sobre nuvens alaranjadas' },
  { src: hero05, w: 553, h: 347, alt: 'Ensaio fotográfico feito com IA: três retratos em tons de laranja' },
  {
    src: hero06,
    w: 437,
    h: 400,
    alt: 'Ilustrações animadas em traço preto sobre fundo laranja',
    video: { webm: '/media/hero-06.webm', mp4: '/media/hero-06.mp4' },
  },
  { src: hero07, w: 250, h: 250, alt: 'Selo Great Place To Work sobre fundo azul' },
  { src: hero08, w: 280, h: 373, alt: 'App da Mude sobre fundo amarelo, com a tela “Morning Rituals to Alleviate Anxiety”' },
  { src: hero09, w: 300, h: 400, alt: 'Sala com paredes de madeira, uma mesa baixa com revistas e uma pessoa passando' },
];
// Intro: 5 das imagens, espalhadas pela tela
export const introImages = [0, 3, 5, 7, 8].map((i) => heroImages[i]);

// 10 Anos (Figma, "Home (alterações Rafa 15.10)", nó 809:493): texto dentro
// do container azul, com o tracejado de fundo se desenhando
export const tenYears = {
  // texto da seção "conteudo" do Figma, em duas linhas (no celular quebra sozinho)
  lines: ['Há 10 anos ajudamos empresas a reimaginar', 'suas experiências digitais.'],
  cta: { label: 'Sobre nós', href: '/sobre/' },
};

// Serviços (layout do iverson.inc): lista em sanfona. Nomes, textos e
// imagens da seção "conteudo" do Figma: uma imagem principal (876×486) e
// dois detalhes (426×277). As tags ainda são sugestões (não estão no Figma).
export const services = [
  {
    name: 'Brand',
    image: servBrand,
    alt: 'Marca Raio em vermelho sobre uma foto desfocada',
    details: [
      { src: servBrandD1, alt: 'Ilustrações coloridas de pessoas, comida e plantas' },
      { src: servBrandD2, alt: 'Ilustração de uma pimenta laranja pendurada sobre fundo vermelho' },
    ],
    description:
      'Podemos ajudar tanto com o desafio de levar mais marca para as suas interfaces quanto a evoluir assets como Ilustrações, ensaios fotográficos feito com IA, vídeos promocionais e sistematização de layouts.',
    tags: ['Estratégia', 'Identidade visual', 'Tom de voz', 'Sistema de marca', 'Governança'],
  },
  {
    name: 'Design System',
    image: servDS,
    alt: 'Telas de um app de companhia aérea construídas com o design system: novidades, login, busca de voos e check-in',
    details: [
      { src: servDSD1, alt: 'App do jornal O Globo' },
      { src: servDSD2, alt: 'As siglas DS e AI ligadas por uma esfera de linhas' },
    ],
    description:
      'Somos referência nacional no assunto. Não só estabelecemos os padrões de interação para o seu ecossistema quanto o conectamos com inteligência artificial para evoluir seus produtos de um jeito mais inteligente.',
    tags: ['Fundamentos', 'Tokens', 'Componentes', 'Documentação', 'Governança', 'IA'],
  },
  {
    name: 'Product Design',
    image: servPD,
    alt: 'Telas do app da Matrix Care, de cuidado para idosos',
    details: [
      { src: servPDD1, alt: 'App da Mude sobre fundo amarelo' },
      { src: servPDD2, alt: 'Telas de um internet banking B2B' },
    ],
    description:
      'Projetamos aplicativos, sistemas web, e-commerces, portais e sites institucionais. Nossa busca é sempre por interfaces que entregam expressão de marca e, obviamente, convertam.',
    tags: ['Pesquisa', 'Estratégia', 'UX', 'UI', 'Prototipação', 'Desenvolvimento'],
  },
  {
    name: 'Inteligência artificial',
    image: servIA,
    alt: 'Forma 3D de vidro listrado sobre fundo preto',
    details: [
      { src: servIAD1, alt: 'Ensaio fotográfico feito com IA: três retratos em tons de laranja' },
      { src: servIAD2, alt: 'Agente de IA respondendo “Só um minutinho! Pensando…”' },
    ],
    description:
      'Não só usamos IA para evoluir nossa entrega, mas também projetamos experiências onde ela é protagonista. Também criamos identidade e toda a expressão de agentes proprietários que chegam ao usuário final.',
    tags: ['Agent Experience', 'Interfaces conversacionais', 'Processos com IA', 'Assets de marca com IA'],
  },
];

export const posts = [
  {
    href: '#',
    category: 'Impacto Social',
    title: 'Design System, inteligência artificial e o futuro da interação',
    description:
      'Com a chegada de uma experiência conversacional mais natural, continua fazendo sentido uma interface com “tantos botões”?',
    image: blog1,
    imageAlt: 'Ilustração com janelas de interface rotuladas Design System e Artificial Intelligence',
    // Fundo com desfoque forte (80px) e sem escurecimento, como no Figma
    bg: 'soft',
    author: { name: 'João Sena', role: 'Designer', avatar: avatar1 },
  },
  {
    href: '#',
    category: 'Talk',
    title: 'Yedo Han to speak at the University of Seoul',
    description:
      "Senior designer Yedo Han will give a lecture as part of the University of Seoul's Graduate integrative design workshop.",
    image: blog2,
    imageAlt: 'Retrato de Yedo Han',
    author: { name: 'Rafael Bittencourt', role: 'Designer', avatar: avatar2 },
  },
  {
    href: '#',
    category: 'Showcase',
    title: 'Bonnie Clyde featured on Visual Journal',
    description:
      'Visual Journal showcases the new identity we developed for Bonnie Clyde, spanning typography, color and imagery.',
    image: blog3,
    imageAlt: 'Pintura clássica com o logotipo Bonnie Clyde',
    author: { name: 'Julian Vilela', role: 'Designer', avatar: avatar3 },
  },
];

// Links do menu aberto e do footer (os mesmos nos dois, pedido do João).
// Troque o "#" do Sobre pela página quando ela existir.
export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Sobre', href: '/sobre/' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Contato', href: '#contato' },
];
export const menu = nav;

// Reel: prévia em loop no canto da tela e vídeo completo no Vimeo (o mesmo do meiuca.design).
// O Vimeo só deixa tocar em meiuca.design; nos outros endereços aparece a prévia em alta.
export const reel = {
  title: 'Reel Meiuca',
  duration: '1:32',
  vimeoId: '1059077959',
};

export const contact = {
  email: 'oi@meiuca.design',
  social: [
    // TODO: confirmar URLs oficiais
    { label: 'IN', name: 'LinkedIn', href: '#' },
    { label: 'IG', name: 'Instagram', href: '#' },
  ],
  address: ['Brasil — São Paulo', 'Rua Aspicuelta, 422 Vila Madalena'],
};

// Clientes (layout do work.co/clients): nome, descrição e link de cada um.
// Textos da seção "conteudo" do Figma ("cases text").
// Os links "Ver projeto" estão ocultos até existirem as páginas dos projetos
// (pedido do João): para mostrar, troque `showCaseLinks` para `true` e o
// `href` de cada um. Sem `link`, o link de um cliente some.
export const showCaseLinks = false;
const caseLink = { label: 'Ver projeto', href: '#' };

export const clients = [
  {
    name: 'Gol + Smiles',
    description: 'Projetamos, desenvolvemos e implementamos o Tangerina Design System para Gol e Smiles.',
    link: caseLink,
  },
  {
    name: 'Editora Globo',
    description: 'Projetamos o Design System web e app para suportar as mais de 20 marcas da Editora Globo.',
    link: caseLink,
  },
  {
    name: 'Itaú',
    description: 'Apoiamos na evolução do seu Design System e na construção do portal interno do Itaú.',
    link: caseLink,
  },
  {
    name: 'Mude',
    description: 'Projetamos e desenvolvemos o app da Mude, startup européia de mudança de lifestyle.',
    link: caseLink,
  },
  {
    name: 'Caju',
    description: 'Projetamos e desenvolvemos o Design System da Caju, além de evoluir visualmente seus produtos.',
    link: caseLink,
  },
  {
    name: 'Jeitto',
    description: 'Criamos seu Design System, um ensaio fotográfico com IA, evoluímos suas ilustrações e seu app.',
    link: caseLink,
  },
  {
    name: 'Matrix Care',
    description: 'Projetamos o app e o Design System da Matrix Care, startup americana de cuidado para idosos.',
    link: caseLink,
  },
  {
    name: 'Sicredi',
    description: 'Projetamos e desenvolvemos o Design System e o internet banking B2B (web + app) da Sicredi.',
    link: caseLink,
  },
];

// Página Sobre (/sobre/), do Figma (nó 921:2667). O título é o mesmo texto do
// Hero da home. "Vamos conversar" abre o formulário de contato.
export const about = {
  title: 'Sobre — Meiuca',
  description:
    'Começamos em 2017 com a vontade de criar um estúdio que misturasse design e impacto social. Hoje ajudamos empresas com marca, Design System, produtos e inteligência artificial.',
  heading: heroText,
  paragraphs: [
    'Começamos em 2017 com a vontade de criar um estúdio que misturasse design e impacto social. A ideia era simples: fazer entregas que nos orgulhassem e reservar tempo para projetos pro bono alinhados com a nossa visão de mundo. O primeiro foi um app para lideranças indígenas reportarem mudanças climáticas.',
    'No nosso primeiro cliente comercial descobrimos o Design System. Testamos, erramos, aprendemos. Vimos que o tema vinha forte do Vale do Silício e decidimos nos especializar. Não demorou para chegarmos às grandes empresas: primeiro a Claro, depois a XP Inc. e dezenas de outras. No caminho, entendemos a importância de formar o mercado. Formamos mais de 3.500 profissionais.',
    'Depois de nos consolidar no assunto Design System, passamos a ajudar essas mesmas empresas com projetos de produto, Design Ops e com a estruturação de seus chapters. Crescemos.',
    'O mercado mudou muito nesses anos: a explosão da área no pós-pandemia, os layoffs e, agora, o cenário confuso, incerto e empolgante da inteligência artificial. Nesse contexto, a sistematização do design ganha ainda mais relevância. Antes era sobre consistência e eficiência. Agora é a base para unir padrões de interface, automação e IA.',
    'Numa corrida para resolver tudo com um prompt, vale lembrar da diferenciação: escalar sem qualidade traz efeitos colaterais. Por isso aproveitamos o melhor da IA, sem esquecer o que só pessoas de talento são capazes de fazer.',
    'Podemos ajudar a evoluir a sua marca, seu Design System ou seu ecossistema de produtos. Também podemos fazer tudo isso junto e ainda conectar seu time a com inteligência artificial em fluxos de trabalho realmente capazes de trazer velocidade e ganhos ao dia a dia.',
  ],
  cta: { label: 'Vamos conversar', href: '#contato' },
  // Números: contam de 0 até o valor quando entram na tela
  numbers: [
    { prefix: '', value: 10, label: 'anos' },
    { prefix: '+', value: 35, label: 'clientes' },
    { prefix: '+', value: 60, label: 'projetos' },
  ],
  // Empresas do grupo. Com `href`, a linha vira link e o cursor "ver site"
  // aparece no hover; sem `href`, fica só o texto (a Meiuca, por pedido do
  // João, e a Raio, até o site dela estar definido).
  group: [
    {
      logo: 'meiuca',
      name: 'Meiuca',
      text: 'Pra interfaces que precisam crescer sem perder a originalidade: Design Systems, apps, portais, e-commerces e sistemas complexos, feitos com cuidado do início ao fim.',
      href: '', // sem link nem o cursor "ver site" (pedido do João)
    },
    {
      logo: 'raio',
      name: 'Raio',
      text: 'Pra quem quer acelerar a transformação digital com times de produto e tecnologia montados sob medida e prontos pra rodar desde o primeiro dia.',
      href: '',
    },
  ],
  visit: 'ver site',
  groupLabel: 'Empresas do grupo',
};

// Formulário de contato: cópia do drawer de contato do meiuca.design (o
// componente ContactDrawer do Framer). Abre pelos links "Contato" (#contato).
// O envio vai para o mesmo webhook do Make do meiuca.design, que encaminha
// para o mesmo e-mail. Os campos enviados têm os mesmos nomes de lá (nome,
// telefone, email, motivo, mensagem, pagina, idioma, enviadoEm).
export const contactForm = {
  webhook: 'https://hook.us2.make.com/4kdmt7z256qn1qrg0ik3xs2qyk0t58j0',
  title: 'Contato',
  close: 'Fechar',
  labels: { nome: 'Nome', telefone: 'Telefone', email: 'E-mail', motivo: 'Motivo', mensagem: 'Mensagem', optional: '(opcional)' },
  // value = o que vai no envio (igual ao meiuca.design); label = o que aparece
  reasons: ['Design System', 'Aplicativos', 'Sistemas Web', 'Agent Experience', 'Ventures', 'Outro assunto'].map((v) => ({ value: v, label: v })),
  privacy: {
    text: 'Nunca vamos compartilhar suas informações. Ao enviar, você concorda com a nossa',
    linkLabel: 'política de privacidade',
    linkUrl: 'https://lgpd.meiuca.co/',
  },
  sideLines: ['São Paulo / Brasil', 'Somos uma empresa remota', 'oi@meiuca.design'],
  submit: 'Enviar',
  sending: 'Enviando…',
  success: { title: 'Mensagem enviada!', text: 'Obrigado pelo contato. Vamos responder no e-mail que você informou.' },
  messages: {
    required: 'Preencha este campo.',
    invalidEmail: 'Digite um e-mail válido, como nome@empresa.com.',
    invalidPhone: 'Digite um telefone com DDD, como (11) 99999-9999.',
    sendError: 'Não foi possível enviar agora. Tente de novo ou escreva para oi@meiuca.design.',
  },
  honeypot: 'Não preencha',
};

// Textos fixos da interface (rótulos, botões, mensagens). A versão em inglês
// fica em content.en.js (página /en/).
export const ui = {
  lang: 'pt-BR',
  ogLocale: 'pt_BR',
  title: 'Meiuca — Estúdio de design',
  description:
    'Somos um estúdio de design orgulhosamente brasileiro. Trabalhamos na intersecção de marca, experiência e interfaces.',
  skip: 'Pular para o conteúdo',
  home: 'Meiuca — página inicial',
  menu: 'Menu',
  close: 'Fechar',
  watchReel: (d) => `Assistir ao reel da Meiuca (${d})`,
  playReel: 'Play reel',
  reelDialog: 'Reel da Meiuca',
  mainNav: 'Principal',
  langNav: 'Idioma',
  intro: 'Estúdio de design — São Paulo',
  heroLabel: 'Apresentação',
  services: 'Serviços',
  insights: 'Insights',
  readArticle: 'Ler artigo',
  seeMore: 'Ver mais',
  clients: 'Clientes',
  newsletter: 'Inscreva-se na news',
  emailPlaceholder: 'exemplo@email.com',
  subscribe: 'Inscrever',
  newsletterError: 'Confere o e-mail? Parece que faltou alguma coisa.',
  newsletterOk: 'Pronto! Você vai receber nossas próximas anotações.',
  rights: 'Todos os direitos © Meiuca',
  footerNav: 'Rodapé',
};
