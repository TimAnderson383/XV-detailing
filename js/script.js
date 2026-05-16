/* ═══════════════════════════════════════
   XV-Detailing · script.js
   ═══════════════════════════════════════ */

/* ── HEADER SCROLL ─────────────────── */
const header = document.getElementById('header');
let lastY = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 60);
  lastY = y;
}, { passive: true });

/* ── MOBILE NAV ────────────────────── */
const burger  = document.getElementById('burger');
const mainNav = document.getElementById('mainNav');
const overlay = document.getElementById('overlay');

function openNav() {
  mainNav.classList.add('open');
  burger.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  mainNav.classList.remove('open');
  burger.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  mainNav.classList.contains('open') ? closeNav() : openNav();
});

overlay.addEventListener('click', closeNav);

mainNav.querySelectorAll('.nav__item').forEach(link => {
  link.addEventListener('click', closeNav);
});

/* ── SMOOTH SCROLL ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const selector = a.getAttribute('href');
    if (selector === '#') return;
    const target = document.querySelector(selector);
    if (!target) return;
    e.preventDefault();
    closeNav();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── COUNTER ANIMATION ─────────────── */
function animateCount(el) {
  const target   = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start    = performance.now();

  const tick = now => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out quart
    const eased    = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(eased * target).toLocaleString('ru-RU');
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(animateCount);
    statObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.hero__stats');
if (statsBar) statObserver.observe(statsBar);

/* ── SCROLL REVEAL ─────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach(el => {
  revealObserver.observe(el);
});

/* ── PHONE MASK ────────────────────── */
const phoneInput = document.getElementById('phoneInput');
if (phoneInput) {
  phoneInput.addEventListener('input', function () {
    let raw = this.value.replace(/\D/g, '');

    // Normalize leading digit
    if (raw.startsWith('8'))      raw = '7' + raw.slice(1);
    if (!raw.startsWith('7'))     raw = '7' + raw;
    raw = raw.slice(0, 11);

    let out = '+7';
    if (raw.length > 1) out += ' (' + raw.slice(1, 4);
    if (raw.length >= 4) out += ') ' + raw.slice(4, 7);
    if (raw.length >= 7) out += '-' + raw.slice(7, 9);
    if (raw.length >= 9) out += '-' + raw.slice(9, 11);

    this.value = out;
  });

  phoneInput.addEventListener('keydown', function (e) {
    // Allow backspace to erase formatted chars
    if (e.key === 'Backspace') {
      const val = this.value;
      if (val.endsWith(') ') || val.endsWith('-')) {
        e.preventDefault();
        this.value = val.slice(0, -2);
      }
    }
  });
}

/* ── FORM SUBMIT ───────────────────── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('formSubmit');

if (contactForm && submitBtn) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const inputs = contactForm.querySelectorAll('[required]');
    let valid = true;
    inputs.forEach(inp => {
      if (!inp.value.trim()) {
        inp.style.borderColor = '#ef4444';
        inp.addEventListener('input', () => inp.style.borderColor = '', { once: true });
        valid = false;
      }
    });
    if (!valid) return;

    const original = submitBtn.textContent;
    submitBtn.textContent = 'Отправляем…';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      submitBtn.textContent = '✓ Заявка отправлена!';
      submitBtn.classList.add('btn-success');
      submitBtn.style.removeProperty('background');

      setTimeout(() => {
        submitBtn.textContent = original;
        submitBtn.classList.remove('btn-success');
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3500);
    }, 1100);
  });
}

/* ── ACTIVE NAV ON SCROLL ──────────── */
const sections = document.querySelectorAll('section[id]');

const navHighlight = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    document.querySelectorAll('.nav__item').forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.style.color = href === id ? '#e32636' : '';
    });
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(s => navHighlight.observe(s));

/* ── HOTSPOT Z-INDEX + TAP ─────────── */
const allHotspots = document.querySelectorAll('.hotspot');

function activateHotspot(hs) {
  allHotspots.forEach(h => { h.style.zIndex = ''; });
  if (hs) hs.style.zIndex = '100';
}

/* Elevate each hotspot during its intro tip animation */
allHotspots.forEach(hs => {
  const d = parseInt(hs.dataset.delay || '0');
  const start = (1.4 + d * 2) * 1000;
  setTimeout(() => {
    if (!hs.classList.contains('active')) {
      hs.style.zIndex = '100';
      setTimeout(() => {
        if (!hs.classList.contains('active') && !hs.matches(':hover')) {
          hs.style.zIndex = '';
        }
      }, 2000);
    }
  }, start);
});

const hotspotScrollMap = { '0':'#wrap', '1':'#polish', '2':'#clean', '3':'#noise', '4':'#leather', '5':'#install' };

/* ── SERVICE CARD VIDEO ────────────── */
function getPreviewTime(v) {
  return parseFloat(v.dataset.preview ?? 1);
}

const isTouchDevice = window.matchMedia('(hover: none)').matches;

function loadVideo(v) {
  const source = v.querySelector('source[data-src]');
  if (!source || source.src) return;
  source.src = source.dataset.src;
  v.load();
  v.addEventListener('loadedmetadata', () => { v.currentTime = getPreviewTime(v); }, { once: true });
}

const videoCards = document.querySelectorAll('.srv-card--video');

const videoLazyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const v = entry.target.querySelector('video');
    if (v) loadVideo(v);
    videoLazyObserver.unobserve(entry.target);
  });
}, { rootMargin: '200px' });

videoCards.forEach(card => videoLazyObserver.observe(card));

function playCardVideo(card) {
  const v = card && card.querySelector('video');
  if (!v) return;
  loadVideo(v);
  card.classList.add('is-playing');
  v.play();
}
function pauseCardVideo(card) {
  const v = card && card.querySelector('video');
  if (!v) return;
  card.classList.remove('is-playing');
  v.pause();
  v.currentTime = getPreviewTime(v);
}

let scrollingFromHotspot = false;

videoCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    if (scrollingFromHotspot) return;
    videoCards.forEach(c => { if (c !== card) pauseCardVideo(c); });
    playCardVideo(card);
  });
  card.addEventListener('mouseleave', () => { if (!scrollingFromHotspot) pauseCardVideo(card); });
});

allHotspots.forEach(hs => {
  hs.addEventListener('mouseenter', () => activateHotspot(hs));
  hs.addEventListener('mouseleave', () => activateHotspot(null));
  hs.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = hs.classList.contains('active');
    allHotspots.forEach(h => h.classList.remove('active'));
    activateHotspot(null);
    if (!isOpen) {
      hs.classList.add('active');
      activateHotspot(hs);
    }
    const target = document.querySelector(hotspotScrollMap[hs.dataset.delay]);
    if (!target) return;
    const isMobile = window.matchMedia('(hover: none)').matches;
    const delay = (isMobile && !isOpen) ? 2000 : 0;
    setTimeout(() => {
      const headerH = document.querySelector('.header')?.offsetHeight || 80;
      const y = target.getBoundingClientRect().top + window.pageYOffset - headerH;
      scrollingFromHotspot = true;
      videoCards.forEach(c => c.style.pointerEvents = 'none');
      window.scrollTo({ top: y, behavior: 'smooth' });
      setTimeout(() => {
        scrollingFromHotspot = false;
        videoCards.forEach(c => c.style.pointerEvents = '');
        playCardVideo(target);
      }, 900);
    }, delay);
  });
});
document.addEventListener('click', () => {
  allHotspots.forEach(h => h.classList.remove('active'));
  activateHotspot(null);
});

/* ── CAR MAKE / MODEL INPUTS ───────── */
(function () {
  const makeEl  = document.getElementById('carMake');
  const modelEl = document.getElementById('carModel');
  const makeDL  = document.getElementById('carMakeList');
  const modelDL = document.getElementById('carModelList');
  if (!makeEl || !modelEl || typeof CAR_DATA === 'undefined') return;

  const makes = Object.keys(CAR_DATA);
  const frag = document.createDocumentFragment();
  makes.forEach(make => {
    const opt = document.createElement('option');
    opt.value = make;
    frag.appendChild(opt);
  });
  makeDL.appendChild(frag);

  function updateModels() {
    const key = makes.find(m => m.toLowerCase() === makeEl.value.trim().toLowerCase());
    const models = key ? CAR_DATA[key] : [];
    modelDL.innerHTML = '';
    if (models.length) {
      const f = document.createDocumentFragment();
      models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        f.appendChild(opt);
      });
      modelDL.appendChild(f);
    }
  }

  makeEl.addEventListener('input', updateModels);
  makeEl.addEventListener('change', updateModels);
})();

/* ── PRICE MODAL ───────────────────── */
const PRICES = {
  wrap: {
    badge: 'Оклейка',
    title: 'Оклейка',
    sub: 'Бронепленка PPF, антихром и изменение цвета кузова',
    rows: [
      { name: 'Зоны риска PPF',         desc: 'Бампер + капот + зеркала',    val: 'от 25 000 ₽' },
      { name: 'Полуоклейка PPF',        desc: 'Передняя часть + крыша',      val: 'от 55 000 ₽' },
      { name: 'Полная оклейка PPF',     desc: 'Максимальная защита',         val: 'от 120 000 ₽' },
      'sep',
      { name: 'Антихром',               desc: 'Матовая плёнка на хром',      val: 'от 5 000 ₽' },
      { name: 'Изменение цвета',        desc: 'Виниловая оклейка кузова',    val: 'от 40 000 ₽' },
      { name: 'Материал XPEL Ultimate+',desc: 'Премиум, доп. стоимость',     val: '+ 20%' },
    ]
  },
  polish: {
    badge: 'Полировка и керамика',
    title: 'Полировка и керамика',
    sub: 'Восстановление блеска ЛКП и нанокерамическое покрытие',
    rows: [
      { name: 'Безабразивная полировка', desc: 'Голограммы, матовость',       val: 'от 8 000 ₽' },
      { name: 'Одношаговая абразивная',  desc: 'Лёгкие царапины и оксидация', val: 'от 12 000 ₽' },
      { name: 'Двухшаговая абразивная',  desc: 'Глубокие дефекты, максимум',  val: 'от 18 000 ₽' },
      'sep',
      { name: 'CarPro CQUARTZ UK 3.0',   desc: 'Керамика, гарантия 1 год',   val: 'от 15 000 ₽' },
      { name: 'Gyeon Q² Mohs+',          desc: 'Керамика, гарантия 2 года',  val: 'от 22 000 ₽' },
      { name: 'CarPro Dlux Pro',         desc: 'Керамика, гарантия 3 года',  val: 'от 32 000 ₽' },
    ]
  },
  clean: {
    badge: 'Химчистка и детейлинг',
    title: 'Химчистка и детейлинг',
    sub: 'Химчистка салона, детейлинг-мойка и очистка подкапотного пространства',
    rows: [
      { name: 'Детейлинг-мойка',         desc: 'Малый класс',                 val: 'от 3 500 ₽' },
      { name: 'Детейлинг-мойка',         desc: 'Средний / большой класс',     val: 'от 5 500 ₽' },
      'sep',
      { name: 'Частичная химчистка',     desc: 'Сиденья + коврики',           val: 'от 6 000 ₽' },
      { name: 'Полная химчистка салона', desc: 'Все поверхности + озонирование', val: 'от 11 000 ₽' },
      'sep',
      { name: 'Очистка подкапотного',    desc: 'Мойка и обезжиривание',       val: 'от 2 500 ₽' },
    ]
  },
  noise: {
    badge: 'Шумоизоляция',
    title: 'Шумоизоляция',
    sub: 'Снижение шума, вибраций и звука двигателя в салоне',
    rows: [
      { name: 'Двери (4 шт.)',           desc: 'Вибро + шумо изоляция',       val: 'от 15 000 ₽' },
      { name: 'Пол + арки',             desc: 'Полная обработка пола',        val: 'от 20 000 ₽' },
      { name: 'Крыша',                  desc: 'Вибро + шумо изоляция',        val: 'от 10 000 ₽' },
      'sep',
      { name: 'Капот',                  desc: 'Дополнительно',                val: 'от 4 000 ₽' },
      { name: 'Комплексная шумоизол.', desc: 'Весь автомобиль',               val: 'от 50 000 ₽' },
    ]
  },
  leather: {
    badge: 'Восстановление кожи',
    title: 'Восстановление кожи',
    sub: 'Ремонт и восстановление кожаных поверхностей салона',
    rows: [
      { name: 'Ремонт трещин и порезов', desc: 'За 1 элемент',                val: 'от 2 000 ₽' },
      { name: 'Покраска и тонировка',    desc: 'Восстановление цвета',        val: 'от 5 000 ₽' },
      { name: 'Полное восстановление',   desc: 'Сиденье целиком',             val: 'от 10 000 ₽' },
      'sep',
      { name: 'Защитная пропитка',       desc: 'Кондиционирование кожи',      val: 'от 1 500 ₽' },
      { name: 'Комплекс (весь салон)',    desc: 'Все кожаные поверхности',     val: 'от 25 000 ₽' },
    ]
  },
  install: {
    badge: 'Доп. оборудование',
    title: 'Установка доп. оборудования',
    sub: 'Доводчики дверей, электронная тонировка и аксессуары',
    rows: [
      { name: 'Доводчики дверей',        desc: '4 двери, плавное закрытие',   val: 'от 8 000 ₽' },
      { name: 'Электронная тонировка',   desc: 'Smart-стекло на авто',        val: 'по запросу' },
      'sep',
      { name: 'Дополнительные аксессуары', desc: 'Консультация бесплатно',   val: 'по запросу' },
    ]
  }
};

function buildPriceRows(rows) {
  return rows.map(r => {
    if (r === 'sep') return '<div class="price-modal__sep"></div>';
    return `<div class="price-row">
      <div class="price-row__left">
        <span class="price-row__name">${r.name}</span>
        ${r.desc ? `<span class="price-row__desc">${r.desc}</span>` : ''}
      </div>
      <span class="price-row__val">${r.val}</span>
    </div>`;
  }).join('');
}

const priceModal        = document.getElementById('priceModal');
const priceModalOverlay = document.getElementById('priceModalOverlay');
const priceModalClose   = document.getElementById('priceModalClose');
const priceModalCta     = document.getElementById('priceModalCta');

function openPriceModal(serviceKey) {
  const data = PRICES[serviceKey];
  if (!data) return;
  document.getElementById('priceModalBadge').textContent = data.badge;
  document.getElementById('priceModalTitle').textContent = data.title;
  document.getElementById('priceModalSub').textContent   = data.sub;
  document.getElementById('priceModalList').innerHTML    = buildPriceRows(data.rows);
  priceModal.classList.add('open');
  priceModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePriceModal() {
  priceModal.classList.remove('open');
  priceModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

let currentServiceKey = '';

document.querySelectorAll('.js-price-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('[data-service]');
    if (card) {
      currentServiceKey = card.dataset.service;
      openPriceModal(currentServiceKey);
    }
  });
});

if (priceModalOverlay) priceModalOverlay.addEventListener('click', closePriceModal);
if (priceModalClose)   priceModalClose.addEventListener('click', closePriceModal);
if (priceModalCta)     priceModalCta.addEventListener('click', () => {
  closePriceModal();
  openFormModal(currentServiceKey);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePriceModal(); });

/* ── BEFORE / AFTER SLIDERS ─────────── */
document.querySelectorAll('[data-slider]').forEach(slider => {
  const before = slider.querySelector('.case-before');
  const handle = slider.querySelector('.case-handle');
  let dragging = false;

  function setPos(clientX) {
    const rect = slider.getBoundingClientRect();
    const pct  = Math.max(2, Math.min(98, (clientX - rect.left) / rect.width * 100));
    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left     = pct + '%';
  }

  handle.addEventListener('mousedown',  e => { dragging = true; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  document.addEventListener('mouseup',   () => { dragging = false; });

  handle.addEventListener('touchstart', e => { dragging = true; }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (dragging) setPos(e.touches[0].clientX);
  }, { passive: true });
  document.addEventListener('touchend', () => { dragging = false; });
});

/* ── FORM MODAL ────────────────────── */
const formModal        = document.getElementById('formModal');
const openFormBtn      = document.getElementById('openFormBtn');
const formModalOverlay = document.getElementById('formModalOverlay');
const formModalClose   = document.getElementById('formModalClose');

function openFormModal(serviceKey) {
  const sel = document.getElementById('serviceSelect');
  if (sel && serviceKey) sel.value = serviceKey;
  formModal.classList.add('open');
  formModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeFormModal() {
  formModal.classList.remove('open');
  formModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (openFormBtn) openFormBtn.addEventListener('click', openFormModal);
if (formModalOverlay) formModalOverlay.addEventListener('click', closeFormModal);
if (formModalClose) formModalClose.addEventListener('click', closeFormModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFormModal(); });

