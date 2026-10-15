// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Troque pelo domínio final antes de publicar (usado em canonical e Open Graph).
  site: 'https://meiuca.design',
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
