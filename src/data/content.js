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
import blog1 from '../assets/images/blog-1.png';
import blog2 from '../assets/images/blog-2.png';
import blog3 from '../assets/images/blog-3.png';
import avatar1 from '../assets/images/avatar-1.png';
import avatar2 from '../assets/images/avatar-2.png';
import avatar3 from '../assets/images/avatar-3.png';
import clienteMude from '../assets/images/cliente-mude.png';

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

// 10 Anos: a parte fixa fica parada e o complemento troca com o scroll
export const tenYears = {
  lead: 'Há 10 anos ajudamos grandes empresas',
  phrases: [
    'com desafios complexos de design',
    'a reimaginar a experiência de um serviço',
    'a evoluir seu design system',
    'a repensar processos de design com IA',
    'a sistematizar a governança da marca',
  ],
};

export const services = [
  { name: 'Produto', image: servProduto },
  { name: 'Design System', image: servDS },
  // Imagem provisória: o Figma ainda não tem uma imagem para Branding
  { name: 'Branding', image: servBranding, position: '50% 0%' },
  { name: 'Inteligência Artificial', image: servIA },
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

// Clientes: ao passar o mouse, o nome acende e aparece uma prévia do projeto.
// Adicione `image` (e `imageAlt`) aos demais clientes quando houver imagem.
export const clients = [
  { name: 'Estapar' },
  { name: 'Mude', image: clienteMude, imageAlt: 'Tela de app de meditação sobre foto de montanhas ao pôr do sol' },
  { name: 'Caju' },
  { name: 'Unimed' },
  { name: 'Rands' },
  { name: 'Printi' },
  { name: 'Iti' },
  { name: 'Rede' },
  { name: 'Eve' },
];
