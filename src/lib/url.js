// Prefixa caminhos da raiz ("/fonts/…", "/") com o `base` do Astro, para o site
// funcionar tanto na raiz de um domínio quanto num subcaminho (GitHub Pages: /meiuca/).
// Âncoras (#), mailto: e URLs externas passam sem mudança.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(href) {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return href;
  return `${base}${href}`;
}
