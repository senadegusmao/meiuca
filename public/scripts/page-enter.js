// Transição entre páginas (parte que roda antes da página aparecer).
// Quando a página anterior fez a saída da transição (o painel cobriu a tela),
// ela deixa um aviso em window.name, que passa de uma página para a outra na
// mesma aba (também dentro de iframes e sem depender de cookies, storage ou
// referrer). Aqui a página nova abre coberta pelo painel (html.is-arriving),
// que sai pela direita. Na home, a intro não roda nesse caso.
// Arquivo externo e síncrono no <head> (a CSP não permite script inline).
(function () {
  try {
    if (window.name !== 'meiuca:transition') return;
    window.name = '';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('is-arriving');
  } catch (e) {}
})();
