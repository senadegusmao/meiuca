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
   Menu (estrutura do meiuca.design) + reel
   --------------------------------------------------------- */
function initMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (!toggle || !menu) return;
  const preview = menu.querySelector('[data-reel-preview]');
  const modal = document.querySelector('[data-reel-modal]');
  const frame = modal?.querySelector('[data-reel-frame]');
  const glass = menu.querySelector('.menu__glass');
  const panel = menu.querySelector('.menu__panel');

  // Animação do painel: vidro (clip-path) e conteúdo (transform) no mesmo quadro
  const easeOut = (t) => 1 - Math.pow(1 - t, 3); // = cubic-bezier(0.33, 1, 0.68, 1)
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let progress = 0; // 0 = fechado, 1 = aberto
  let anim = 0;
  const render = (e) => {
    glass.style.clipPath = `inset(0 0 ${((1 - e) * 100).toFixed(3)}% 0)`;
    panel.style.transform = `translate3d(0, ${((e - 1) * 100).toFixed(3)}%, 0)`;
  };
  const animateTo = (to, done) => {
    cancelAnimationFrame(anim);
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

  // O vídeo começa a carregar quando a pessoa demonstra intenção (hover/foco no
  // botão), para não disputar rede e decodificação com a animação de abertura.
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
    // Largura da barra de rolagem medida antes de travar (vira padding, sem pulo lateral)
    if (open) root.style.setProperty('--sbw', `${window.innerWidth - root.clientWidth}px`);
    document.body.classList.toggle('is-locked', open);
    if (open) {
      menu.hidden = false;
      menu.classList.add('is-open');
      loadPreview();
      // O reel só começa a tocar quando o painel termina de descer
      animateTo(1, () => {
        if (!reducedMotion.matches) preview?.play().catch(() => {});
      });
      menu.querySelector('.menu__link')?.focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      preview?.pause();
      animateTo(0, () => (menu.hidden = true));
    }
  };
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const openReel = () => {
    if (!modal || !frame) return;
    const id = frame.dataset.vimeoId;
    const iframe = document.createElement('iframe');
    iframe.src = `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`;
    iframe.title = 'Reel da Meiuca';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.replaceChildren(iframe);
    modal.hidden = false;
    preview?.pause();
    modal.querySelector('.reel-modal__close')?.focus();
  };
  const closeReel = () => {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    frame.replaceChildren(); // remove o player e para o áudio
    if (isOpen() && !reducedMotion.matches) preview?.play().catch(() => {});
    menu.querySelector('[data-reel-open]')?.focus();
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('[data-menu-link]') || e.target.closest('[data-menu-dismiss]')) setOpen(false);
    if (e.target.closest('[data-reel-open]')) openReel();
  });
  modal?.addEventListener('click', (e) => {
    if (e.target.closest('[data-reel-close]')) closeReel();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modal && !modal.hidden) return closeReel();
    if (isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
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
   10 Anos: scroll "travado" enquanto as frases trocam
   --------------------------------------------------------- */
function initPhrases() {
  const section = document.querySelector('[data-phrases]');
  if (!section) return;
  const phrases = [...section.querySelectorAll('[data-phrase]')];
  const count = section.querySelector('[data-phrase-count]');
  const bar = section.querySelector('[data-phrase-bar]');

  let top = 0;
  let distance = 1;
  let current = 0;

  measurers.push(() => {
    const r = section.getBoundingClientRect();
    top = r.top + window.scrollY;
    distance = Math.max(1, section.offsetHeight - vh);
  });

  const show = (next) => {
    if (next === current) return;
    const prev = phrases[current];
    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');
    const target = phrases[next];
    target.classList.remove('is-leaving');
    // força o estado inicial (abaixo) antes de animar a entrada
    void target.offsetWidth;
    target.classList.add('is-active');
    setTimeout(() => prev.classList.remove('is-leaving'), 900);
    current = next;
    if (count) count.textContent = String(next + 1).padStart(2, '0');
  };

  let lastP = -1;
  updaters.push((y) => {
    const p = clamp((y - top) / distance);
    if (p === lastP) return; // fora da seção: nada muda
    lastP = p;
    const idx = Math.min(phrases.length - 1, Math.floor(p * phrases.length));
    show(idx);
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
  });
}

/* ---------------------------------------------------------
   Serviços: cards empilhados (mesma mecânica do Prolab)
   - cada card é sticky (CSS); aqui só calculamos escala e deslocamento
   - escala final por card: 0.4, 0.5, 0.6, 0.7 (o de trás encolhe mais)
   - todos sobem até ~11% da altura da tela ao longo da seção
   --------------------------------------------------------- */
function splitChars(el, baseDelay) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'ch';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = char === ' ' ? '\u00a0' : char;
    span.style.transitionDelay = `${(baseDelay + i * 0.03).toFixed(2)}s`;
    el.appendChild(span);
  });
}

function initStack() {
  const stack = document.querySelector('[data-stack]');
  if (!stack) return;
  const cards = [...stack.querySelectorAll('[data-card]')];

  cards.forEach((card) => {
    card.querySelectorAll('[data-split="name"]').forEach((el) => splitChars(el, 0));
  });

  // O título anima quando o card entra na tela e reinicia quando ele sai.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.intersectionRatio >= 0.45) e.target.classList.add('is-in');
          else if (!e.isIntersecting) e.target.classList.remove('is-in');
        });
      },
      { threshold: [0, 0.45] },
    );
    cards.forEach((c) => io.observe(c));
  } else {
    cards.forEach((c) => c.classList.add('is-in'));
  }

  let top = 0;
  let range = 1;
  measurers.push(() => {
    const r = stack.getBoundingClientRect();
    top = r.top + window.scrollY;
    range = Math.max(1, stack.offsetHeight);
  });

  let lastKey = '';
  updaters.push((y) => {
    if (reducedMotion.matches) {
      cards.forEach((c) => (c.style.transform = ''));
      return;
    }
    const p = clamp((y - top) / range);
    // Fora da seção (antes ou depois), não reescreve nada
    const key = `${p.toFixed(4)}|${vh}`;
    if (key === lastKey) return;
    lastKey = key;
    const ty = -(vh / 9) * p; // 100px numa tela de 900px
    cards.forEach((card, i) => {
      const endScale = Math.min(0.9, 0.4 + 0.1 * i);
      const s = 1 - (1 - endScale) * p;
      card.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
    });
  });
}

/* ---------------------------------------------------------
   Revelação ao entrar na tela
   --------------------------------------------------------- */
function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-chars, [data-logo-reveal]');
  if (!('IntersectionObserver' in window) || reducedMotion.matches) {
    targets.forEach((t) => t.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
  );
  targets.forEach((t) => io.observe(t));
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
   Clientes: o nome acende e, se o cliente tiver imagem,
   a prévia aparece ao lado do cursor
   --------------------------------------------------------- */
function initClients() {
  const section = document.querySelector('[data-clients]');
  if (!section || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const cursor = section.querySelector('[data-clients-cursor]');
  const list = section.querySelector('.clients__list');
  const shots = new Map([...section.querySelectorAll('[data-shot]')].map((el) => [el.dataset.shot, el]));
  let x = 0;
  let y = 0;
  let cx = 0;
  let cy = 0;
  let raf = 0;
  let current = null;

  const follow = () => {
    const k = reducedMotion.matches ? 1 : 0.25;
    cx += (x - cx) * k;
    cy += (y - cy) * k;
    cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(follow) : 0;
  };
  const show = (key) => {
    if (current === key) return;
    if (current != null) shots.get(current)?.classList.remove('is-on');
    current = key;
    if (key != null) shots.get(key)?.classList.add('is-on');
  };

  list.addEventListener('pointerenter', (e) => {
    cx = x = e.clientX;
    cy = y = e.clientY;
    follow();
  });
  list.addEventListener('pointerleave', () => show(null));
  list.addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(follow);
      const item = e.target.closest('.clients__item');
      show(item?.dataset.client ?? null);
    },
    { passive: true },
  );
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
initScrollWords();
initPhrases();
initStack();
initReveal();
initCursorPill();
initClients();
initMarquee();
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
