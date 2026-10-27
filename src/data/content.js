// Conteúdo da home. Edite aqui sem mexer no layout.
import hero1 from '../assets/images/hero-1.png';
import hero2 from '../assets/images/hero-2.png';
import hero3 from '../assets/images/hero-3.png';
import hero4 from '../assets/images/hero-4.png';
import hero5 from '../assets/images/hero-5.png';
import servProduto from '../assets/images/servico-produto.png';
import servDS from '../assets/images/servico-design-system.png';
import servBranding from '../assets/images/servico-branding.png';
import servIA from '../assets/images/servico-ia.png';
// Detalhes de Serviços: recortes em alta das imagens principais (provisórios)
import servProdutoD1 from '../assets/images/servico-produto-detalhe-1.png';
import servProdutoD2 from '../assets/images/servico-produto-detalhe-2.png';
import servDSD1 from '../assets/images/servico-design-system-detalhe-1.png';
import servDSD2 from '../assets/images/servico-design-system-detalhe-2.png';
import servBrandingD1 from '../assets/images/servico-branding-detalhe-1.png';
import servBrandingD2 from '../assets/images/servico-branding-detalhe-2.png';
import servIAD1 from '../assets/images/servico-ia-detalhe-1.png';
import servIAD2 from '../assets/images/servico-ia-detalhe-2.png';
import blog1 from '../assets/images/blog-1.png';
import blog2 from '../assets/images/blog-2.png';
import blog3 from '../assets/images/blog-3.png';
import avatar1 from '../assets/images/avatar-1.png';
import avatar2 from '../assets/images/avatar-2.png';
import avatar3 from '../assets/images/avatar-3.png';

export const heroText =
  'Somos um estúdio de design e estratégia orgulhosamente brasileiro, um parceiro ideal para organizações que entendem a importância de acelerar sem abrir mão da autenticidade.';

// size: a = 300×400, b = 250×333, c = 280×373 (medidas do Figma em px)
export const heroImages = [
  { src: hero1, size: 'a', alt: 'Embalagem preta com a marca Fursys' },
  { src: hero2, size: 'b', alt: 'Flor com o texto “a living brand OS.”' },
  { src: hero3, size: 'c', alt: 'Ilustração de uma cabeça com vasos sanguíneos e o selo Cardiovascular Health' },
  { src: hero4, size: 'a', alt: 'Interface de agendamento “OEM Sound Bath” sobre um rosto' },
  { src: hero5, size: 'b', alt: 'Relógio inteligente exibindo saldo de investimentos' },
];

// 10 Anos (módulo Marques do esrbespoke.au): frase fixa em cima e, embaixo,
// as frases que completam a ideia; uma por vez acende e cresce com o scroll
export const tenYears = {
  // A frase fixa termina em "a:" e as frases de baixo completam a ideia
  // (por isso começam sem o "a").
  lead: 'Há mais de 10 anos ajudamos grandes empresas a:',
  phrases: [
    'lidar com desafios complexos de design',
    'reimaginar a experiência de um serviço',
    'evoluir seu design system',
    'repensar processos de design com IA',
    'sistematizar a governança da marca',
  ],
};

// Serviços (layout do iverson.inc): lista em sanfona. Cada serviço tem uma imagem
// principal (16:9), dois detalhes, uma descrição e as tags.
// - Descrições: texto provisório. Tags: sugestões tiradas do próprio site; revise.
// - Detalhes: por enquanto são recortes da imagem principal. Troque por imagens
//   próprias do projeto quando houver (2 por serviço, 16:9).
const svcText = (area) =>
  `Texto provisório. Aqui entra uma frase sobre como a Meiuca trabalha com ${area}: o problema que resolve e o que muda para o cliente.`;

export const services = [
  {
    name: 'Produto',
    image: servProduto,
    alt: 'Telas de um app de companhia aérea: novidades, login, busca de voos e check-in',
    details: [servProdutoD1, servProdutoD2],
    description: svcText('produto'),
    tags: ['Pesquisa', 'Estratégia', 'UX', 'UI', 'Prototipação', 'Desenvolvimento'],
  },
  {
    name: 'Design System',
    image: servDS,
    alt: 'Tela de bagagem de um app de viagem, construída com os componentes do design system',
    details: [servDSD1, servDSD2],
    description: svcText('design systems'),
    tags: ['Fundamentos', 'Tokens', 'Componentes', 'Documentação', 'Governança', 'IA'],
  },
  {
    // Imagem provisória: o Figma ainda não tem uma imagem para Branding
    name: 'Branding',
    image: servBranding,
    alt: 'Flor com o texto “a living brand OS.”',
    details: [servBrandingD1, servBrandingD2],
    description: svcText('marca'),
    tags: ['Estratégia', 'Identidade visual', 'Tom de voz', 'Sistema de marca', 'Governança'],
  },
  {
    name: 'Inteligência Artificial',
    image: servIA,
    alt: 'Anéis de luz abstratos sobre fundo preto',
    details: [servIAD1, servIAD2],
    description: svcText('inteligência artificial'),
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

// Menu aberto (mesmos itens do meiuca.design). Troque os "#" pelas páginas quando existirem.
export const menu = [
  { label: 'Início', href: '/' },
  { label: 'Sobre', href: '#' },
  { label: 'Design System', href: '#' },
  { label: 'Aplicativos', href: '#' },
  { label: 'Sistemas Web', href: '#' },
  { label: 'Agent Experience', href: '#' },
  { label: 'Ventures', href: '#' },
  { label: 'Novidades', href: '#blog' },
  { label: 'Contato', href: '#contato' },
];

// Reel: prévia em loop no canto da tela e vídeo completo no Vimeo (o mesmo do meiuca.design).
// O Vimeo só deixa tocar em meiuca.design; nos outros endereços aparece a prévia em alta.
export const reel = {
  title: 'Reel Meiuca',
  duration: '1:32',
  vimeoId: '1059077959',
};

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '#' },
  { label: 'Works', href: '#' },
  { label: 'Capabilities', href: '#servicos' },
  { label: 'Ventures', href: '#' },
  { label: 'Blog', href: '#blog' },
  { label: 'Shop', href: '#' },
];

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
// As descrições são provisórias; troque `description` e o `href` do link
// quando houver o texto e a página de cada projeto. Sem `link`, o link some.
const placeholder =
  'Texto provisório. Aqui entra um resumo do projeto: o desafio, o que fizemos juntos e o resultado.';
const caseLink = { label: 'Ver projeto', href: '#' };

export const clients = [
  { name: 'Estapar', description: placeholder, link: caseLink },
  { name: 'Mude', description: placeholder, link: caseLink },
  { name: 'Caju', description: placeholder, link: caseLink },
  { name: 'Unimed', description: placeholder, link: caseLink },
  { name: 'Rands', description: placeholder, link: caseLink },
  { name: 'Printi', description: placeholder, link: caseLink },
  { name: 'Iti', description: placeholder, link: caseLink },
  { name: 'Rede', description: placeholder, link: caseLink },
];
