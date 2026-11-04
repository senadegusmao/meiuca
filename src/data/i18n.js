// Línguas do site: português na raiz (/) e inglês em /en/.
// Cada componente pega os textos da língua da página:
//   const { heroText, ui } = getContent(Astro.currentLocale);
import * as pt from './content.js';
import * as en from './content.en.js';

export const locales = { pt, en };
export const homes = { pt: '/', en: '/en/' };

export function getContent(locale) {
  return locale === 'en' ? en : pt;
}
