// Línguas do site: português na raiz (/) e inglês em /en/.
// Cada componente pega os textos da língua da página:
//   const { heroText, ui } = getContent(Astro.currentLocale);
import * as pt from './content.js';
import * as en from './content.en.js';

export const locales = { pt, en };
// Páginas e o caminho de cada uma nas duas línguas (a troca PT / EN do menu
// leva para a mesma página na outra língua)
export const routes = {
  home: { pt: '/', en: '/en/' },
  about: { pt: '/sobre/', en: '/en/about/' },
};
export const homes = routes.home;
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export function pageKey(pathname) {
  let p = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  if (!p.endsWith('/')) p += '/';
  return Object.keys(routes).find((k) => routes[k].pt === p || routes[k].en === p) || 'home';
}

export function getContent(locale) {
  return locale === 'en' ? en : pt;
}
