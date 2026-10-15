// @ts-check
import { defineConfig } from 'astro/config';

// Domínio e subcaminho vêm do ambiente, para o mesmo código servir em qualquer hospedagem:
// - padrão: domínio final na raiz (Vercel, Netlify, Cloudflare);
// - GitHub Pages: o workflow em .github/workflows/deploy.yml define
//   SITE_URL=https://senadegusmao.github.io e BASE_PATH=/meiuca.
// O site é usado em canonical e Open Graph.
const site = process.env.SITE_URL || 'https://meiuca.design';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  compressHTML: true,
  build: {
    // CSS sempre em arquivo externo: permite uma Content Security Policy sem 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Nada de assets/scripts embutidos como data: ou inline.
      assetsInlineLimit: 0,
    },
  },
  image: {
    // Imagens são processadas no build (sharp). Nenhum serviço externo.
    responsiveStyles: false,
  },
});
