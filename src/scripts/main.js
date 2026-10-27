// Meiuca — interações e animações ligadas ao scroll.
// Sem dependências externas. Tudo roda em um único loop de rAF.

const root = document.documentElement;
root.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

let vh = window.innerHeight;
const updaters = [];
const measurers = [];

/* ---------------------------------------------------------
   Trava da página (menu aberto): nada pode se mexer embaixo
   do vidro. Para o scroll suave na hora, bloqueia roda e toque
   (exceto dentro do menu, se ele tiver rolagem, no celular),
   desliga o "elástico" do trackpad e pausa o marquee (via CSS).
   A largura da barra de rolagem vira padding (--sbw): sem pulo lateral.
   --------------------------------------------------------- */
let stopSmooth = () => {};
// O menu conversa com o reel fixo (esconder ao abrir, abrir a partir do reel do menu)
let reelApi = null;
const canScrollInside = (target) => {
  const box = target instanceof Element ? target.closest('.menu__grid') : null;
  return !!box && box.scrollHeight > box.clientHeight;
};
const blockScroll = (e) => {
  if (!canScrollInside(e.target)) e.preventDefault();
};
const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);
const blockKeys = (e) => {
  if (scrollKeys.has(e.key) && !e.target.closest?.('input, textarea, button, [contenteditable]')) e.preventDefault();
};
const locks = new Set();
const noBlend = new Set();
// O mix-blend-mode do header quebra o desfoque de qualquer vidro (backdrop-filter)
// no Chrome (aparecem retângulos nítidos). Menu e reel abertos o desligam.
function setNoBlend(on, key) {
  if (on) noBlend.add(key);
  else noBlend.delete(key);
  root.classList.toggle('no-blend', noBlend.size > 0);
}
function lockPage(on, key = 'menu') {
  const was = locks.size > 0;
  if (on) locks.add(key);
  else locks.delete(key);
  on = locks.size > 0;
  if (on === was) return;
  if (on) {
    stopSmooth();
    root.style.setProperty('--sbw', `${window.innerWidth - root.clientWidth}px`);
    window.addEventListener('wheel', blockScroll, { passive: false });
    window.addEventListener('touchmove', blockScroll, { passive: false });
    window.addEventListener('keydown', blockKeys);
  } else {
    window.removeEventListener('wheel', blockScroll);
    window.removeEventListener('touchmove', blockScroll);
    window.removeEventListener('keydown', blockKeys);
  }
  root.classList.toggle('is-locked', on);
  document.body.classList.toggle('is-locked', on);
}

/* ---------------------------------------------------------
   Menu (estrutura do meiuca.design)
   --------------------------------------------------------- */
function initMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (!toggle || !menu) return;
  const preview = menu.querySelector('[data-reel-preview]');
  const glass = menu.querySelector('.menu__glass');
  const panel = menu.querySelector('.menu__panel');

  // Animação do painel: vidro (clip-path) e conteúdo (transform) no mesmo quadro
  const easeOut = (t) => 1 - Math.pow(1 - t, 3); // = cubic-bezier(0.33, 1, 0.68, 1)
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let progress = 0; // 0 = fechado, 1 = aberto
  let anim = 0;
  // O vidro cresce em altura (sem clip-path nem transform: os dois atrapalham o
  // backdrop-filter). Aberto por completo, os estilos inline saem e vale o CSS.
  let panelH = 0;
  const render = (e) => {
    const open = e >= 1;
    menu.classList.toggle('is-settled', open);
    if (open) {
      glass.style.height = '';
      panel.style.transform = '';
      return;
    }
    panelH ||= panel.offsetHeight;
    glass.style.height = `${(panelH * e).toFixed(2)}px`;
    panel.style.transform = `translate3d(0, ${((e - 1) * 100).toFixed(3)}%, 0)`;
  };
  const animateTo = (to, done) => {
    cancelAnimationFrame(anim);
    panelH = panel.offsetHeight;
    const from = progress;
    const duration = (to ? 600 : 450) * Math.abs(to - from);
    if (reducedMotion.matches || duration < 1) {
      progress = to;
      render(to);
      done?.();
      return;
    }
    const ease = to ? easeOut : easeInOut;
    let t0 = 0;
    const tick = (now) => {
      t0 ||= now;
      const t = Math.min(1, (now - t0) / duration);
      progress = from + (to - from) * ease(t);
      render(progress);
      if (t < 1) anim = requestAnimationFrame(tick);
      else {
        anim = 0;
        done?.();
      }
    };
    anim = requestAnimationFrame(tick);
  };

  // O vídeo do menu começa a carregar quando a pessoa demonstra intenção (hover/foco
  // no botão), para não disputar rede e decodificação com a animação de abertura.
  const loadPreview = () => {
    if (!preview || preview.dataset.loaded) return;
    preview.querySelectorAll('source[data-src]').forEach((s) => (s.src = s.dataset.src));
    preview.dataset.loaded = '1';
    preview.preload = 'auto';
    preview.load();
  };
  toggle.addEventListener('pointerenter', loadPreview, { once: true });
  toggle.addEventListener('focus', loadPreview, { once: true });

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('[data-label-open]')?.setAttribute('aria-hidden', String(!open));
    toggle.querySelector('[data-label-closed]')?.setAttribute('aria-hidden', String(open));
    lockPage(open, 'menu');
    if (open) {
      setNoBlend(true, 'menu');
      reelApi?.setAway(true); // o reel do canto desce e sai da tela
      menu.hidden = false;
      menu.classList.add('is-open');
      loadPreview();
      // O reel do menu só começa a tocar quando o painel termina de descer
      animateTo(1, () => {
        if (!reducedMotion.matches) preview?.play().catch(() => {});
      });
      menu.querySelector('.menu__link')?.focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      preview?.pause();
      animateTo(0, () => {
        menu.hidden = true;
        setNoBlend(false, 'menu');
        reelApi?.setAway(false); // e volta quando o menu termina de fechar
      });
    }
  };
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('[data-menu-link]') || e.target.closest('[data-menu-dismiss]')) setOpen(false);
    const media = e.target.closest('[data-menu-reel]');
    if (media) reelApi?.openFrom(media, preview);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || e.defaultPrevented) return;
    if (isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------------------------------------------------------
   Reel fixo no canto inferior direito (mouthwash.studio/studio)
   - pequeno, em loop e sem som; carrega depois da página
   - dá para arrastar e ele volta para o canto com uma mola
   - ao clicar, cresce até o centro (FLIP) com o fundo desfocado;
     em meiuca.design entra o vídeo completo do Vimeo, nos outros
     endereços a prévia em alta
   --------------------------------------------------------- */
function initReel() {
  const el = document.querySelector('[data-reel]');
  if (!el) return;
  const player = el.querySelector('[data-reel-player]');
  const frame = el.querySelector('[data-reel-frame]');
  const video = el.querySelector('[data-reel-video]');
  const hit = el.querySelector('[data-reel-open]');
  const dialog = el.querySelector('[data-reel-dialog]');
  const closeBtn = dialog.querySelector('[data-reel-close]');
  const largeTpl = el.querySelector('[data-reel-large]');
  const onMeiuca = /(^|\.)meiuca\.design$/.test(location.hostname);
  let full = false;
  let upgrade = null;
  let origin = null; // elemento de onde o reel abriu (o reel do menu), ou null (canto)

  // Prévia pequena: só carrega depois que a página terminou de carregar
  const play = () => {
    if (!reducedMotion.matches && !document.hidden) video.play().catch(() => {});
  };
  const loadMini = () => {
    if (video.dataset.loaded) return;
    video.dataset.loaded = '1';
    video.querySelectorAll('source[data-src]').forEach((s) => (s.src = s.dataset.src));
    video.preload = 'auto';
    video.load();
    play();
  };
  const later = () => setTimeout(loadMini, 1200);
  if (document.readyState === 'complete') later();
  else window.addEventListener('load', later, { once: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? video.pause() : !upgrade && play()));

  // Arrastar: segue o dedo/mouse e volta para o canto com uma mola (e o "arremesso")
  let dx = 0;
  let dy = 0;
  let vx = 0;
  let vy = 0;
  let spring = 0;
  let drag = null;
  const setOffset = () => (player.style.translate = dx || dy ? `${dx.toFixed(1)}px ${dy.toFixed(1)}px` : '');
  const springBack = () => {
    cancelAnimationFrame(spring);
    if (reducedMotion.matches) {
      dx = dy = vx = vy = 0;
      return setOffset();
    }
    let prev = 0;
    const W = 8; // rigidez
    const Z = 0.7; // amortecimento (um leve balanço)
    const step = (now) => {
      const dt = prev ? Math.min(0.032, (now - prev) / 1000) : 1 / 60;
      prev = now;
      vx += (-W * W * dx - 2 * Z * W * vx) * dt;
      vy += (-W * W * dy - 2 * Z * W * vy) * dt;
      dx += vx * dt;
      dy += vy * dt;
      if (Math.hypot(dx, dy) < 0.3 && Math.hypot(vx, vy) < 8) {
        dx = dy = vx = vy = 0;
        spring = 0;
        return setOffset();
      }
      setOffset();
      spring = requestAnimationFrame(step);
    };
    spring = requestAnimationFrame(step);
  };

  hit.addEventListener('pointerdown', (e) => {
    if (full || e.button !== 0) return;
    cancelAnimationFrame(spring);
    hit.setPointerCapture(e.pointerId);
    drag = { x: e.clientX - dx, y: e.clientY - dy, sx: e.clientX, sy: e.clientY, t: performance.now(), moved: false };
    vx = vy = 0;
  });
  hit.addEventListener('pointermove', (e) => {
    if (!drag) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 5) {
      drag.moved = true;
      player.classList.add('is-dragging');
    }
    if (!drag.moved) return;
    const now = performance.now();
    const ndx = e.clientX - drag.x;
    const ndy = e.clientY - drag.y;
    const dt = Math.max(1, now - drag.t) / 1000;
    // velocidade suavizada, para o arremesso ao soltar
    vx = vx * 0.6 + ((ndx - dx) / dt) * 0.4;
    vy = vy * 0.6 + ((ndy - dy) / dt) * 0.4;
    drag.t = now;
    dx = ndx;
    dy = ndy;
    setOffset();
  });
  const release = (e) => {
    if (!drag) return;
    const wasDrag = drag.moved;
    drag = null;
    player.classList.remove('is-dragging');
    if (hit.hasPointerCapture?.(e.pointerId)) hit.releasePointerCapture(e.pointerId);
    if (!wasDrag && e.type === 'pointerup') open();
    else {
      const max = 3000;
      vx = clamp(vx, -max, max);
      vy = clamp(vy, -max, max);
      springBack();
    }
  };
  hit.addEventListener('pointerup', release);
  hit.addEventListener('pointercancel', release);
  // Teclado (Enter/Espaço geram click sem ponteiro)
  hit.addEventListener('click', (e) => {
    if (e.detail === 0) open();
  });

  // FLIP: mede antes e depois de trocar o layout e anima a diferença.
  // A escala vem da largura; o centro do vídeo coincide com o centro de `rect`.
  const toRect = (rect, cur) => {
    const s = rect.width / cur.width;
    const x = rect.left + rect.width / 2 - (cur.left + (cur.width * s) / 2);
    const y = rect.top + rect.height / 2 - (cur.top + (cur.height * s) / 2);
    return `translate(${x}px, ${y}px) scale(${s})`;
  };
  const flip = (first, duration, easing) => {
    const last = player.getBoundingClientRect();
    if (reducedMotion.matches || !player.animate) return Promise.resolve();
    return player
      .animate([{ transform: toRect(first, last) }, { transform: 'none' }], { duration, easing })
      .finished.catch(() => {});
  };
  const shrinkTo = (rect, duration, easing) => {
    if (reducedMotion.matches || !player.animate) return Promise.resolve(null);
    const cur = player.getBoundingClientRect();
    const a = player.animate([{ transform: 'none' }, { transform: toRect(rect, cur) }], {
      duration,
      easing,
      fill: 'forwards',
    });
    return a.finished.then(() => a).catch(() => a);
  };

  const loadUpgrade = () => {
    if (upgrade || !full) return;
    if (onMeiuca) {
      upgrade = document.createElement('iframe');
      upgrade.src = `https://player.vimeo.com/video/${el.dataset.vimeoId}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`;
      upgrade.title = 'Reel da Meiuca';
      upgrade.allow = 'autoplay; fullscreen; picture-in-picture';
      upgrade.referrerPolicy = 'strict-origin-when-cross-origin';
      upgrade.className = 'reel__upgrade';
      upgrade.addEventListener('load', () => upgrade?.classList.add('is-ready'), { once: true });
    } else {
      upgrade = largeTpl.content.firstElementChild.cloneNode(true);
      upgrade.poster = el.dataset.posterLarge;
      upgrade.addEventListener(
        'canplay',
        () => {
          upgrade?.play().catch(() => {});
          upgrade?.classList.add('is-ready');
        },
        { once: true },
      );
    }
    frame.appendChild(upgrade);
  };

  let anim = Promise.resolve();
  const open = (from = null, src = null) => {
    if (full) return;
    full = true;
    origin = from;
    el.classList.remove('is-leaving');
    cancelAnimationFrame(spring);
    if (src && !src.paused) {
      // continua o vídeo do mesmo ponto em que estava no menu
      loadMini();
      try {
        video.currentTime = src.currentTime;
      } catch {}
    }
    const first = (from || player).getBoundingClientRect();
    dx = dy = vx = vy = 0;
    setOffset();
    lockPage(true, 'reel');
    setNoBlend(true, 'reel');
    // Sem as transições de "sair da frente": se o reel estava escondido (menu
    // aberto), ele aparece inteiro na hora e a animação vem só do FLIP
    el.classList.add('no-trans', 'is-full');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('no-trans')));
    hit.tabIndex = -1;
    dialog.hidden = false;
    closeBtn.focus({ preventScroll: true });
    anim = flip(first, 650, 'cubic-bezier(0.22, 1, 0.36, 1)').then(() => {
      if (!full) return;
      el.classList.add('is-settled');
      loadUpgrade();
    });
  };
  const close = () => {
    if (!full) return;
    full = false;
    upgrade?.remove(); // para o vídeo/áudio na hora
    upgrade = null;
    play();
    dialog.hidden = true;
    lockPage(false, 'reel');
    el.classList.remove('is-settled');
    const back = origin && origin.isConnected && origin.getClientRects().length ? origin : null;
    origin = null;
    hit.tabIndex = 0;
    if (back) {
      // Abriu pelo menu: volta para o reel do menu e só então some
      el.classList.add('is-leaving'); // o fundo desfocado já começa a sumir
      back.focus({ preventScroll: true });
      anim = shrinkTo(back.getBoundingClientRect(), 550, 'cubic-bezier(0.65, 0, 0.35, 1)').then((a) => {
        if (full) return;
        el.classList.add('no-trans');
        el.classList.remove('is-full', 'is-leaving');
        a?.cancel();
        requestAnimationFrame(() => el.classList.remove('no-trans'));
        setNoBlend(false, 'reel');
      });
      return;
    }
    const first = player.getBoundingClientRect();
    el.classList.remove('is-full');
    el.classList.add('is-closing');
    hit.focus({ preventScroll: true });
    anim = flip(first, 550, 'cubic-bezier(0.65, 0, 0.35, 1)').then(() => {
      if (full) return;
      el.classList.remove('is-closing');
      setNoBlend(false, 'reel');
    });
  };

  reelApi = {
    setAway: (on) => el.classList.toggle('is-away', on),
    openFrom: (from, src) => open(from, src),
  };

  el.addEventListener('click', (e) => {
    if (e.target.closest('[data-reel-close]')) close();
  });
  // Fica fixo durante todo o scroll e desce/some quando o footer chega
  // (mesmo ponto do header: topo do footer a 65% da tela)
  const footer = document.querySelector('.footer');
  if (footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => el.classList.toggle('is-tucked', e.isIntersecting), {
      rootMargin: '0px 0px -35% 0px',
    }).observe(footer);
  }
  // Esc fecha o reel antes do menu
  window.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && full) {
        e.preventDefault();
        close();
      }
    },
    true,
  );
}

/* ---------------------------------------------------------
   Header some quando o footer chega e volta ao subir. Com o foco
   do teclado nele (ou com o menu aberto) ele reaparece (CSS).
   --------------------------------------------------------- */
function initHeaderHide() {
  const header = document.querySelector('[data-header]');
  const footer = document.querySelector('.footer');
  if (!header || !footer || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => header.classList.toggle('is-hidden', e.isIntersecting), {
    rootMargin: '0px 0px -35% 0px',
  }).observe(footer);
}

/* ---------------------------------------------------------
   Hero: palavras acendem conforme o scroll (efeito Prolab)
   --------------------------------------------------------- */
function initScrollWords() {
  const el = document.querySelector('[data-scroll-words]');
  if (!el) return;
  const words = [...el.querySelectorAll('.w')];
  const last = new Array(words.length).fill(-1);
  const MIN = 0.22;
  const WAVE = 3; // quantas palavras acendem ao mesmo tempo (degradê)
  let top = 0;
  let height = 0;
  let headerH = 0;

  measurers.push(() => {
    const r = el.getBoundingClientRect();
    top = r.top + window.scrollY;
    height = r.height;
    headerH = document.querySelector('[data-header]')?.offsetHeight || 0;
  });

  updaters.push((y) => {
    if (reducedMotion.matches) return;
    // Começa no primeiro movimento do scroll e termina antes de o texto sair da
    // tela: quando o fim dele chega à metade da tela ou, no máximo, quando o
    // topo dele encosta no header. Assim o texto inteiro acende ainda visível.
    const start = Math.max(0, top - vh * 0.9);
    const visibleUntil = Math.max(start + 80, top - headerH);
    const end = Math.max(top + height - vh * 0.5, Math.min(start + vh * 0.3, visibleUntil));
    const p = clamp((y - start) / (end - start));
    const n = words.length;
    for (let i = 0; i < n; i++) {
      const local = clamp((p * (n + WAVE) - i) / WAVE);
      const a = Math.round((MIN + (1 - MIN) * local) * 100);
      if (a !== last[i]) {
        last[i] = a;
        words[i].style.setProperty('--a', (a / 100).toFixed(2));
      }
    }
  });
}

/* ---------------------------------------------------------
   10 Anos (módulo Marques do esrbespoke.au): a tela fica presa e a
   lista de frases sobe pela linha logo abaixo da frase fixa. A frase
   na linha acende e cresce; a que sai apaga subindo; as próximas ficam
   menores e apagadas. Tudo ligado ao scroll e só com transform/opacity.
   --------------------------------------------------------- */
function initPhrases() {
  const section = document.querySelector('[data-phrases]');
  if (!section) return;
  const list = section.querySelector('[data-phrase-list]');
  const items = [...section.querySelectorAll('[data-phrase]')];
  const n = items.length;
  if (n < 2) return;
  section.style.setProperty('--ten-n', n);
  const smooth = (e0, e1, x) => {
    const t = clamp((x - e0) / (e1 - e0));
    return t * t * (3 - 2 * t);
  };
  const MIN_OPACITY = 0.2;

  let pinned = false;
  let top = 0;
  let distance = 1;
  let hold = 0.3;
  let minScale = 0.5;
  let anchor = 0;
  let line = 80;
  let gap = 12;
  let heights = [];
  let lastP = -1;
  const last = items.map(() => ({ t: '', o: -1 }));

  measurers.push(() => {
    // Presa só com movimento liberado (o CSS decide; sem isso a lista fica parada)
    pinned = !reducedMotion.matches && getComputedStyle(list).position === 'absolute';
    lastP = -1;
    if (!pinned) {
      items.forEach((it, i) => {
        it.style.removeProperty('transform');
        it.style.removeProperty('opacity');
        last[i].t = '';
        last[i].o = -1;
      });
      return;
    }
    const cs = getComputedStyle(section);
    hold = parseFloat(cs.getPropertyValue('--ten-hold')) || 0;
    minScale = parseFloat(cs.getPropertyValue('--ten-min')) || 0.5;
    top = section.getBoundingClientRect().top + window.scrollY;
    distance = Math.max(1, section.offsetHeight - vh);
    anchor = list.clientHeight * (parseFloat(cs.getPropertyValue('--ten-anchor')) || 0.45);
    line = parseFloat(getComputedStyle(list).fontSize) || 80;
    gap = line * 0.3; // espaço depois de cada frase, proporcional ao tamanho dela
    heights = items.map((it) => it.offsetHeight);
  });

  updaters.push((y) => {
    if (!pinned) return;
    const p = clamp((y - top) / distance);
    if (p === lastP) return; // fora da seção: nada muda
    lastP = p;
    // posição contínua na lista (0 = primeira frase na linha), com uma pausa
    // na primeira e na última
    const pos = clamp(p * (n - 1 + 2 * hold) - hold, 0, n - 1);
    // Cada troca acontece no meio do caminho entre duas frases (de 25% a 75%):
    // antes e depois disso a frase acesa fica parada logo abaixo da frase fixa.
    // "lit" diz quanto cada frase está acesa (1 = na linha).
    const lit = items.map((_, i) => 1 - smooth(0.25, 0.75, Math.abs(pos - i)));
    const scale = lit.map((v) => minScale + (1 - minScale) * v);
    // empilha as frases já no tamanho atual (sem buracos entre elas)
    let acc = 0;
    const ys = heights.map((h, i) => {
      const y0 = acc;
      acc += (h + gap) * scale[i];
      return y0;
    });
    // a primeira linha da frase acesa fica centrada na linha; a lista anda
    // junto com a troca (mesma curva), então tudo se move como uma coisa só
    const mid = (i) => ys[i] + (line * scale[i]) / 2;
    const k = Math.min(n - 2, Math.floor(pos));
    const e = smooth(0.25, 0.75, pos - k);
    const off = anchor - (mid(k) + (mid(k + 1) - mid(k)) * e);
    items.forEach((it, i) => {
      const t = `translate(0, ${(ys[i] + off).toFixed(1)}px) scale(${scale[i].toFixed(3)})`;
      // a que sai apaga subindo, antes de chegar à frase fixa
      const fade = i < pos ? 1 - smooth(0, 0.6, 1 - lit[i]) : 1;
      const o = Math.round((MIN_OPACITY + (1 - MIN_OPACITY) * lit[i]) * fade * 100) / 100;
      if (t !== last[i].t) {
        it.style.transform = t;
        last[i].t = t;
      }
      if (o !== last[i].o) {
        it.style.opacity = o;
        last[i].o = o;
      }
    });
  });
}

/* ---------------------------------------------------------
   Serviços: sanfona (iverson.inc). Um aberto por vez. A altura do
   item que fecha e a do que abre mudam juntas no mesmo quadro; o
   conteúdo de cada item é uma camada própria (.svc__inner), então
   só o recorte muda e nada é redesenhado durante a animação.
   --------------------------------------------------------- */
function initServices() {
  const list = document.querySelector('[data-svc]');
  if (!list) return;
  const items = [...list.querySelectorAll('[data-svc-item]')];
  // Altura aberta igual para todos (a do maior): ao trocar de item, o total da
  // lista não muda e o que está abaixo fica parado
  measurers.push(() => {
    list.style.removeProperty('--svc-open');
    const was = items.map((it) => it.classList.contains('is-expanded'));
    items.forEach((it) => it.classList.add('is-expanded'));
    const max = Math.max(...items.map((it) => it.offsetHeight));
    items.forEach((it, i) => it.classList.toggle('is-expanded', was[i]));
    list.style.setProperty('--svc-open', `${max}px`);
  });
  const ease = (t) => 1 - Math.pow(1 - t, 5); // ≈ cubic-bezier(0.22, 1, 0.36, 1)
  const DURATION = 700;
  let finish = null;

  const setAria = (item, open) => item.querySelector('[data-svc-btn]').setAttribute('aria-expanded', String(open));

  const toggle = (target) => {
    finish?.(); // termina na hora uma animação em andamento
    const closing = items.find((it) => it.classList.contains('is-open')) || null;
    const opening = target === closing ? null : target;
    // alturas de partida (como estão na tela agora)
    const c0 = closing?.offsetHeight ?? 0;
    const o0 = opening?.offsetHeight ?? 0;
    if (closing) {
      closing.classList.remove('is-open', 'is-expanded');
      setAria(closing, false);
    }
    if (opening) {
      opening.classList.add('is-open', 'is-expanded');
      setAria(opening, true);
    }
    if (reducedMotion.matches) return;
    // alturas de chegada (pelo CSS)
    const c1 = closing?.offsetHeight ?? 0;
    const o1 = opening?.offsetHeight ?? 0;
    root.classList.add('svc-anim');
    if (opening) opening.style.minHeight = '0px'; // a altura mínima de aberto só vale no fim
    const render = (e) => {
      if (closing) closing.style.height = `${(c0 + (c1 - c0) * e).toFixed(2)}px`;
      if (opening) opening.style.height = `${(o0 + (o1 - o0) * e).toFixed(2)}px`;
    };
    const cleanup = () => {
      cancelAnimationFrame(raf);
      finish = null;
      if (closing) closing.style.height = '';
      if (opening) opening.style.height = opening.style.minHeight = '';
      root.classList.remove('svc-anim');
      measure(); // as seções abaixo podem ter mudado de lugar
    };
    render(0);
    let t0 = 0;
    let raf = requestAnimationFrame(function tick(now) {
      t0 ||= now;
      const t = Math.min(1, (now - t0) / DURATION);
      render(ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
      else cleanup();
    });
    finish = cleanup;
  };

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-svc-btn]');
    if (btn) toggle(btn.closest('[data-svc-item]'));
  });

  // As imagens dos itens fechados ficam escondidas (o "warm-up" geral não as vê).
  // Quando a lista se aproxima, todas carregam e decodificam: abrir um item
  // não precisa decodificar nada no meio da animação.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        list.querySelectorAll('img').forEach((img) => {
          img.loading = 'eager';
          const decode = () => img.decode?.().catch(() => {});
          if (img.complete) decode();
          else img.addEventListener('load', decode, { once: true });
        });
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(list);
  }
}

/* ---------------------------------------------------------
   Revelação ao entrar na tela (repete a cada passagem)
   --------------------------------------------------------- */
function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-chars, [data-logo-reveal]');
  // Hero (descrição e marquee): a entrada da abertura se repete quando voltam à tela
  const replays = document.querySelectorAll('[data-replay]');
  if (!('IntersectionObserver' in window) || reducedMotion.matches) {
    targets.forEach((t) => t.classList.add('is-in'));
    return;
  }
  // As animações se repetem a cada passagem: entram quando o elemento está 12%
  // dentro da tela e são rearmadas quando ele sai por completo (por cima ou por baixo).
  const enter = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        e.target.classList.remove('is-out');
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
  );
  const leave = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) return;
      e.target.classList.remove('is-in');
      e.target.classList.add('is-out');
    });
  });
  targets.forEach((t) => {
    enter.observe(t);
    leave.observe(t);
  });
  // Hero: volta a animar assim que qualquer parte aparece (o marquee pode
  // estar só com a pontinha visível no topo da página)
  const replay = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-out', !e.isIntersecting));
  });
  replays.forEach((t) => replay.observe(t));
}

/* ---------------------------------------------------------
   Pílula que segue o cursor (como o "Explore" do Prolab)
   --------------------------------------------------------- */
function initCursorPill() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const targets = document.querySelectorAll('[data-cursor]');
  if (!targets.length) return;
  const pill = document.createElement('div');
  pill.className = 'cursor-pill';
  pill.setAttribute('aria-hidden', 'true');
  document.body.appendChild(pill);

  let x = 0;
  let y = 0;
  let cx = 0;
  let cy = 0;
  let raf = 0;
  const follow = () => {
    const k = reducedMotion.matches ? 1 : 0.22;
    cx += (x - cx) * k;
    cy += (y - cy) * k;
    pill.style.transform = `translate3d(${(cx + 14).toFixed(1)}px, ${(cy + 14).toFixed(1)}px, 0)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(follow) : 0;
  };
  window.addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(follow);
    },
    { passive: true },
  );
  targets.forEach((t) => {
    t.addEventListener('pointerenter', (e) => {
      pill.textContent = t.dataset.cursor;
      cx = x = e.clientX;
      cy = y = e.clientY;
      follow();
      pill.classList.add('is-on');
    });
    t.addEventListener('pointerleave', () => pill.classList.remove('is-on'));
  });
}

/* ---------------------------------------------------------
   Imagens: carregam e decodificam bem antes de entrar na tela
   (1,5 tela de antecedência), para nunca aparecerem em branco
   nem travarem o scroll quando surgem (as de Serviços chegam a 4K)
   --------------------------------------------------------- */
function initWarmup() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const img = e.target;
        io.unobserve(img);
        img.loading = 'eager';
        const decode = () => img.decode?.().catch(() => {});
        if (img.complete) decode();
        else img.addEventListener('load', decode, { once: true });
      });
    },
    { rootMargin: '150% 0px' },
  );
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => io.observe(img));
}

/* ---------------------------------------------------------
   Marquee do Hero: pausa quando sai da tela
   --------------------------------------------------------- */
function initMarquee() {
  const marquee = document.querySelector('[data-marquee]');
  if (!marquee || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => marquee.classList.toggle('is-paused', !e.isIntersecting)).observe(marquee);
}

/* ---------------------------------------------------------
   Scroll suave na roda do mouse (como o Lenis do Prolab,
   intensidade 10). Só em mouse/trackpad: no toque, teclado
   e barra de rolagem o scroll continua nativo.
   --------------------------------------------------------- */
let smoothing = false;
function initSmoothScroll() {
  const LERP = 0.1; // fração do caminho percorrida a cada quadro de 60 Hz
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  let target = window.scrollY;
  let current = target;
  let raf = 0;
  let lastT = 0;
  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

  const step = (now) => {
    const dt = lastT ? Math.min(64, now - lastT) : 16.7;
    lastT = now;
    current += (target - current) * (1 - Math.pow(1 - LERP, dt / 16.667));
    if (Math.abs(target - current) < 0.5) current = target;
    window.scrollTo(0, current);
    update(); // efeitos ligados ao scroll no mesmo quadro
    if (current === target) {
      raf = 0;
      lastT = 0;
      smoothing = false;
    } else {
      raf = requestAnimationFrame(step);
    }
  };
  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    lastT = 0;
    smoothing = false;
    current = target = window.scrollY;
  };

  window.addEventListener(
    'wheel',
    (e) => {
      if (reducedMotion.matches || e.ctrlKey || e.defaultPrevented) return;
      if (document.body.classList.contains('is-locked')) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (!raf) current = target = window.scrollY;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      target = clamp(target + e.deltaY * unit, 0, maxScroll());
      if (!raf) {
        smoothing = true;
        raf = requestAnimationFrame(step);
      }
    },
    { passive: false },
  );
  // Teclado, clique (barra de rolagem, âncoras) e redimensionamento interrompem e sincronizam
  window.addEventListener('keydown', stop);
  window.addEventListener('pointerdown', stop);
  window.addEventListener('resize', stop);
  stopSmooth = stop;
}

/* ---------------------------------------------------------
   Newsletter (validação no navegador; conectar ao serviço depois)
   --------------------------------------------------------- */
function initNewsletter() {
  const form = document.querySelector('[data-newsletter]');
  if (!form) return;
  const input = form.querySelector('input[type="email"]');
  const msg = form.querySelector('[data-newsletter-msg]');
  const original = '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msg.classList.remove('is-error', 'is-success');
    const value = input.value.trim();
    if (!input.checkValidity() || !value) {
      msg.textContent = 'Confere o e-mail? Parece que faltou alguma coisa.';
      msg.classList.add('is-error');
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    // TODO: enviar para o serviço de newsletter escolhido (ex.: fetch para o endpoint do provedor)
    // e liberar o domínio dele em connect-src / form-action na CSP (public/_headers e vercel.json).
    msg.textContent = 'Pronto! Você vai receber nossas próximas anotações.';
    msg.classList.add('is-success');
    form.reset();
    setTimeout(() => {
      msg.textContent = original;
      msg.classList.remove('is-success');
    }, 6000);
  });
}

/* ---------------------------------------------------------
   Fim da entrada: quando todas as animações de entrada (e a intro)
   terminam, elas são desligadas. Uma animação "parada no fim"
   (fill-mode) continua custando: o navegador mantém uma camada de
   efeito por letra/imagem. Visualmente nada muda.
   --------------------------------------------------------- */
function initEntryCleanup() {
  if (!document.getAnimations) return;
  requestAnimationFrame(() => {
    const entering = document
      .getAnimations()
      .filter((a) => a.effect?.target?.closest?.('.enter, .enter-char, .enter-rise, .intro'));
    Promise.allSettled(entering.map((a) => a.finished)).then(() => root.classList.add('is-entered'));
  });
}

/* ---------------------------------------------------------
   Loop
   --------------------------------------------------------- */
let ticking = false;
const measure = () => {
  vh = window.innerHeight;
  measurers.forEach((m) => m());
};
const update = () => {
  ticking = false;
  const y = window.scrollY;
  updaters.forEach((u) => u(y));
};
const requestUpdate = () => {
  if (smoothing) return; // o scroll suave já atualiza a cada quadro
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
};

initMenu();
initHeaderHide();
initReel();
initScrollWords();
initPhrases();
initServices();
initReveal();
initCursorPill();
initMarquee();
initWarmup();
initNewsletter();
initSmoothScroll();
initEntryCleanup();

measure();
update();

window.addEventListener('scroll', requestUpdate, { passive: true });
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    measure();
    update();
  }, 120);
});
// Remede quando fontes/imagens terminarem de carregar (alturas mudam)
document.fonts?.ready.then(() => {
  measure();
  update();
});
window.addEventListener('load', () => {
  measure();
  update();
});
reducedMotion.addEventListener?.('change', () => {
  measure();
  update();
});
