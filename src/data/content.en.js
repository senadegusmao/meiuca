// Versão em inglês da home (/en/). Mesmas imagens e links de content.js;
// aqui ficam só os textos. Edite junto com content.js para as duas línguas
// ficarem iguais.
import * as pt from './content.js';

export const heroText =
  'We are a Brazilian design studio for those who believe artificial intelligence scales talent, but doesn’t replace it.';

const heroAlts = [
  'Yellow smiley-face pin on denim fabric',
  'Itaú internal portal with a photo of a smiling woman and the message “Have a great workday :)”',
  'Floating blue app navigation bar with the Statement button',
  'Green health app card showing glucose (122 mg/dL) over orange clouds',
  'AI-made photo shoot: three portraits in orange tones',
  'Animated black line illustrations on an orange background',
  'Great Place To Work seal on a blue background',
  'Mude app on a yellow background, showing the “Morning Rituals to Alleviate Anxiety” screen',
  'Room with wooden walls, a low table with magazines and a person walking by',
];
export const heroImages = pt.heroImages.map((img, i) => ({ ...img, alt: heroAlts[i] }));
export const introImages = [0, 3, 5, 7, 8].map((i) => heroImages[i]);

export const tenYears = {
  lines: ['For 10 years we have helped companies reimagine', 'their digital experiences.'],
  cta: { label: 'About us', href: '/en/about/' },
};

const servicesText = [
  {
    name: 'Brand',
    alt: 'Raio logo in red over a blurred photo',
    details: ['Colorful illustrations of people, food and plants', 'Illustration of an orange pepper hanging over a red background'],
    description:
      'We can help both with the challenge of bringing more brand into your interfaces and with evolving assets such as illustrations, AI-made photo shoots, promotional videos and layout systems.',
    tags: ['Strategy', 'Visual identity', 'Tone of voice', 'Brand system', 'Governance'],
  },
  {
    name: 'Design System',
    alt: 'Airline app screens built with the design system: news, login, flight search and check-in',
    details: ['O Globo newspaper app', 'The letters DS and AI linked by a sphere of lines'],
    description:
      'We are a national reference on the subject. We not only set the interaction standards for your ecosystem, but also connect it to artificial intelligence to evolve your products in a smarter way.',
    tags: ['Foundations', 'Tokens', 'Components', 'Documentation', 'Governance', 'AI'],
  },
  {
    name: 'Product Design',
    alt: 'Screens of the Matrix Care elderly care app',
    details: ['Mude app on a yellow background', 'B2B internet banking screens'],
    description:
      'We design apps, web systems, e-commerce, portals and corporate websites. We always aim for interfaces that deliver brand expression and, of course, convert.',
    tags: ['Research', 'Strategy', 'UX', 'UI', 'Prototyping', 'Development'],
  },
  {
    name: 'Artificial intelligence',
    alt: 'Striped glass 3D shape on a black background',
    details: ['AI-made photo shoot: three portraits in orange tones', 'AI agent replying “Just a moment! Thinking…”'],
    description:
      'We not only use AI to evolve our work, we also design experiences where it takes center stage. We also create the identity and the whole expression of proprietary agents that reach the end user.',
    tags: ['Agent Experience', 'Conversational interfaces', 'AI-powered processes', 'AI brand assets'],
  },
];
export const services = pt.services.map((s, i) => ({
  ...s,
  ...servicesText[i],
  details: s.details.map((d, j) => ({ ...d, alt: servicesText[i].details[j] })),
}));

const postsText = [
  {
    category: 'Social Impact',
    title: 'Design System, artificial intelligence and the future of interaction',
    description: 'With a more natural conversational experience on the way, does an interface with “so many buttons” still make sense?',
    imageAlt: 'Illustration with interface windows labeled Design System and Artificial Intelligence',
  },
  { imageAlt: 'Portrait of Yedo Han' },
  { imageAlt: 'Classical painting with the Bonnie Clyde logo' },
];
export const posts = pt.posts.map((p, i) => ({ ...p, ...postsText[i] }));

export const nav = [
  { label: 'Home', href: '/en/' },
  { label: 'About', href: '/en/about/' },
  { label: 'Blog', href: '/en/#blog' },
  { label: 'Contact', href: '#contato' },
];
export const menu = nav;

export const reel = { ...pt.reel, title: 'Meiuca reel' };

export const contact = {
  ...pt.contact,
  address: ['Brazil — São Paulo', 'Rua Aspicuelta, 422 Vila Madalena'],
};

export const showCaseLinks = pt.showCaseLinks;
const clientsText = [
  'We designed, developed and implemented the Tangerina Design System for Gol and Smiles.',
  'We designed the web and app Design System that supports Editora Globo’s more than 20 brands.',
  'We supported the evolution of Itaú’s Design System and the building of its internal portal.',
  'We designed and developed the app for Mude, a European lifestyle-change startup.',
  'We designed and developed Caju’s Design System, and visually evolved its products.',
  'We created Jeitto’s Design System and an AI photo shoot, and evolved its illustrations and app.',
  'We designed the app and Design System for Matrix Care, an American elderly care startup.',
  'We designed and developed Sicredi’s Design System and B2B internet banking (web + app).',
];
export const clients = pt.clients.map((c, i) => ({
  ...c,
  description: clientsText[i],
  link: c.link && { ...c.link, label: 'View project' },
}));

// About page (/en/about/)
export const about = {
  ...pt.about,
  title: 'About — Meiuca',
  description:
    'We started in 2017 wanting to build a studio that combined design and social impact. Today we help companies with brand, Design Systems, products and artificial intelligence.',
  heading: heroText,
  paragraphs: [
    'We started in 2017 wanting to build a studio that combined design and social impact. The idea was simple: deliver work we were proud of and set aside time for pro bono projects aligned with our worldview. The first one was an app for Indigenous leaders to report climate change.',
    'With our first commercial client we discovered Design Systems. We tested, made mistakes, learned. We saw the topic coming in strong from Silicon Valley and decided to specialize. It didn’t take long to reach large companies: first Claro, then XP Inc. and dozens of others. Along the way, we understood how important it was to train the market. We have trained more than 3,500 professionals.',
    'After establishing ourselves in Design Systems, we started helping those same companies with product projects, Design Ops and structuring their chapters. We grew.',
    'The market has changed a lot over these years: the boom of the field after the pandemic, the layoffs and now the confusing, uncertain and exciting landscape of artificial intelligence. In this context, systematizing design becomes even more relevant. It used to be about consistency and efficiency. Now it is the foundation for bringing together interface standards, automation and AI.',
    'In a race to solve everything with a prompt, it’s worth remembering differentiation: scaling without quality has side effects. That’s why we make the most of AI without forgetting what only talented people can do.',
    'We can help evolve your brand, your Design System or your product ecosystem. We can also do it all together and connect your team with artificial intelligence in workflows that truly bring speed and gains to everyday work.',
  ],
  cta: { label: 'Let’s talk', href: '#contato' },
  numbers: [
    { prefix: '', value: 10, label: 'years' },
    { prefix: '+', value: 35, label: 'clients' },
    { prefix: '+', value: 60, label: 'projects' },
  ],
  group: [
    {
      ...pt.about.group[0],
      text: 'For interfaces that need to grow without losing their originality: Design Systems, apps, portals, e-commerce and complex systems, crafted with care from start to finish.',
    },
    {
      ...pt.about.group[1],
      text: 'For those who want to speed up digital transformation with product and technology teams built to measure and ready to run from day one.',
    },
  ],
  visit: 'visit site',
  groupLabel: 'Group companies',
};

// Formulário de contato em inglês. O envio vai para o mesmo webhook e com os
// mesmos valores de "motivo" do português (a automação do Make não muda).
const reasonLabels = ['Design System', 'Apps', 'Web Systems', 'Agent Experience', 'Ventures', 'Something else'];
export const contactForm = {
  ...pt.contactForm,
  title: 'Contact',
  close: 'Close',
  labels: { nome: 'Name', telefone: 'Phone', email: 'Email', motivo: 'Reason', mensagem: 'Message', optional: '(optional)' },
  reasons: pt.contactForm.reasons.map((r, i) => ({ value: r.value, label: reasonLabels[i] })),
  privacy: {
    ...pt.contactForm.privacy,
    text: 'We will never share your information. By sending, you agree to our',
    linkLabel: 'privacy policy',
  },
  sideLines: ['São Paulo / Brazil', 'We are a remote company', 'oi@meiuca.design'],
  submit: 'Send',
  sending: 'Sending…',
  success: { title: 'Message sent!', text: 'Thanks for reaching out. We’ll reply to the email you provided.' },
  messages: {
    required: 'Please fill in this field.',
    invalidEmail: 'Enter a valid email, like name@company.com.',
    invalidPhone: 'Enter a phone number with area code, like (11) 99999-9999.',
    sendError: 'We couldn’t send it right now. Try again or write to oi@meiuca.design.',
  },
  honeypot: 'Do not fill in',
};

// Textos fixos da interface (rótulos, botões, mensagens)
export const ui = {
  lang: 'en',
  ogLocale: 'en_US',
  title: 'Meiuca — Design studio',
  description:
    'We are a proudly Brazilian design studio. We work at the intersection of brand, experience and interfaces.',
  skip: 'Skip to content',
  home: 'Meiuca — home page',
  menu: 'Menu',
  close: 'Close',
  watchReel: (d) => `Watch the Meiuca reel (${d})`,
  playReel: 'Play reel',
  reelDialog: 'Meiuca reel',
  mainNav: 'Main',
  langNav: 'Language',
  intro: 'Design studio — São Paulo',
  heroLabel: 'Introduction',
  services: 'Services',
  insights: 'Insights',
  readArticle: 'Read article',
  seeMore: 'See more',
  clients: 'Clients',
  newsletter: 'Subscribe to our newsletter',
  emailPlaceholder: 'example@email.com',
  subscribe: 'Subscribe',
  newsletterError: 'Could you check the email? Something seems to be missing.',
  newsletterOk: 'Done! You’ll get our next notes.',
  rights: 'All rights reserved © Meiuca',
  footerNav: 'Footer',
};
