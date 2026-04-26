// ============================================
// LOADER
// ============================================
(function () {
  const loader = document.getElementById('loader');
  const bar = loader.querySelector('.loader-bar span');
  const pct = document.getElementById('loaderPct');
  document.documentElement.classList.add('is-loading');

  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 18 + 6;
    if (p >= 100) { p = 100; clearInterval(tick); finish(); }
    bar.style.width = p + '%';
    pct.textContent = Math.floor(p);
  }, 120);

  function finish() {
    setTimeout(() => {
      loader.classList.add('done');
      document.documentElement.classList.remove('is-loading');
    }, 300);
  }

  window.addEventListener('load', () => {
    if (p < 100) { p = 100; bar.style.width = '100%'; pct.textContent = '100'; clearInterval(tick); finish(); }
  });
})();

// ============================================
// CUSTOM CURSOR
// ============================================
(function () {
  if (window.matchMedia('(hover: none)').matches || window.innerWidth < 901) return;

  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  let mx = 0, my = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  function raf() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(raf);
  }
  raf();

  document.querySelectorAll('a, button, [data-hover], [data-magnetic]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
})();

// ============================================
// NAV SCROLL STATE + PROGRESS
// ============================================
(function () {
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 20);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = ((y / h) * 100) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ============================================
// SCROLL REVEAL
// ============================================
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        // counters
        const nums = e.target.matches('[data-counter]') ? [e.target] : e.target.querySelectorAll('[data-counter]');
        nums.forEach(runCounter);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-anim], .service-card, .method-visual, .cta-final, [data-counter]').forEach(el => io.observe(el));
})();

// ============================================
// COUNTER
// ============================================
function runCounter(el) {
  if (el._done) return;
  el._done = true;
  const target = parseFloat(el.dataset.counter);
  const suffix = el.dataset.suffix || '';
  const isFloat = !Number.isInteger(target);
  const dur = 1400;
  const start = performance.now();
  function step(t) {
    const p = Math.min((t - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const v = target * eased;
    el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
  }
  requestAnimationFrame(step);
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    const strength = 0.3;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();

// ============================================
// TILT (hero visual)
// ============================================
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach(el => {
    const inner = el.querySelector('.hero-visual-inner') || el;
    const max = 8;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      inner.style.transform = '';
    });
  });
})();

// ============================================
// PARALLAX (about num, hero blobs)
// ============================================
(function () {
  const items = document.querySelectorAll('[data-parallax]');
  const blobs = document.querySelectorAll('.hero-bg-blob');
  if (!items.length && !blobs.length) return;

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      items.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translateY(${y * speed * -0.5}px)`;
      });
      blobs.forEach((b, i) => {
        const speed = 0.08 * (i + 1);
        b.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ============================================
// LETTER STAGGER (split text)
// ============================================
(function () {
  document.querySelectorAll('[data-stagger]').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((c, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = c === ' ' ? '\u00A0' : c;
      span.style.animationDelay = (0.3 + i * 0.035) + 's';
      el.appendChild(span);
    });
  });
})();

// ============================================
// HERO MOUSE SPOTLIGHT
// ============================================
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
    hero.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
  });
})();

// ============================================
// GALLERY horizontal drag + scroll parallax
// ============================================
(function () {
  const track = document.getElementById('galleryTrack');
  if (!track) return;
  const wrap = track.parentElement;

  // Pointer drag to scroll
  let isDown = false, startX = 0, startScroll = 0, moved = 0;

  // Block native img drag
  track.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));

  wrap.addEventListener('dragstart', (e) => e.preventDefault());

  wrap.addEventListener('pointerdown', (e) => {
    isDown = true;
    moved = 0;
    startX = e.clientX;
    startScroll = wrap.scrollLeft;
    wrap.classList.add('is-dragging');
    try { wrap.setPointerCapture(e.pointerId); } catch (_) {}
  });

  wrap.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    moved = Math.abs(dx);
    wrap.scrollLeft = startScroll - dx;
  });

  function endDrag(e) {
    if (!isDown) return;
    isDown = false;
    wrap.classList.remove('is-dragging');
    try { wrap.releasePointerCapture(e.pointerId); } catch (_) {}
  }
  wrap.addEventListener('pointerup', endDrag);
  wrap.addEventListener('pointercancel', endDrag);
  wrap.addEventListener('pointerleave', endDrag);

  // Block click after drag
  wrap.addEventListener('click', (e) => { if (moved > 5) { e.preventDefault(); e.stopPropagation(); } }, true);

  // Wheel: vertical → horizontal
  wrap.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      wrap.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });

  // Reveal items stagger
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in-view'), i * 100);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  track.querySelectorAll('.gallery-item').forEach(el => io.observe(el));
})();

// ============================================
// REVIEW CARD TILT
// ============================================
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.review-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${px * 5}deg) rotateX(${-py * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ============================================
// SMOOTH ANCHOR (respect reduced motion)
// ============================================
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.offsetTop - 70, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
