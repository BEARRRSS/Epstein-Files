/* ═══════════════════════════════════════════════════════════════
   FAYAADH ADHLI NUGROHO — Portfolio JavaScript
   Features: Particles · Score Rings · Countdown Timers · Filters
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── UTBK Score Data ──────────────────────────────────────────── */
const SCORES = [
  { label: 'Penalaran Umum', sub: '🔥 Kritis untuk IT', val: 620.06, pct: 62.0, color: '#C9A84C' },
  { label: 'Literasi Bahasa Inggris', sub: '🌐 Vital untuk IT', val: 617.81, pct: 61.8, color: '#C9A84C' },
  { label: 'Penalaran Matematika', sub: '🔥 Kritis untuk IT', val: 604.61, pct: 60.5, color: '#C9A84C' },
  { label: 'Literasi BI (Saintek)', sub: '📄 Jalur Saintek', val: 571.46, pct: 57.1, color: '#7B9E8C' },
  { label: 'Pemahaman Bacaan & Menulis', sub: '📖 Relevan', val: 505.90, pct: 50.6, color: '#8B9BAD' },
  { label: 'Pengetahuan & Pemahaman Umum', sub: '📚 Relevan', val: 505.16, pct: 50.5, color: '#8B9BAD' },
  { label: 'Pengetahuan Kuantitatif', sub: '⚠ Area Tingkatkan', val: 425.62, pct: 42.6, color: '#C05252' },
  { label: 'Literasi BI (Soshum)', sub: '📄 Jalur Soshum', val: 355.07, pct: 35.5, color: '#A07060' },
];

/* ─── Countdown Deadlines (keyed by ID) ────────────────────────── */
const DEADLINES = {
  'uny':   new Date('2026-07-02T23:59:00+07:00'),
  'its':   new Date('2026-06-20T23:59:00+07:00'),
  'undip': new Date('2026-06-30T23:59:00+07:00'),
  'uns':   new Date('2026-07-04T23:59:00+07:00'),
  'upn':   new Date('2026-07-15T23:59:00+07:00'),
  'ub':    new Date('2026-07-05T23:59:00+07:00'),
};

/* ─── Helper: pad number ─────────────────────────────────────────── */
const pad = n => String(Math.max(0, Math.floor(n))).padStart(2, '0');

/* ─── Navbar scroll behavior ─────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);

    // Active link highlighting
    const sections = ['hero', 'journey', 'scores', 'radar', 'jadwal'];
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 100) current = id;
    });

    links.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
    });
  }, { passive: true });
}

/* ─── Particle system ────────────────────────────────────────────── */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 40;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 2.5 + 0.5;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 40}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 20 + 12}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}

/* ─── Score ring animation via IntersectionObserver ─────────────── */
function initScoreRings() {
  const cards = document.querySelectorAll('.score-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const ring = entry.target.querySelector('.ring-fg');
      if (!ring) return;
      const pct = parseFloat(ring.getAttribute('data-pct')) / 100;
      const circumference = 2 * Math.PI * 50; // r=50
      ring.style.strokeDashoffset = circumference * (1 - pct);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  cards.forEach(c => obs.observe(c));
}

/* ─── Bar chart builder ──────────────────────────────────────────── */
function buildBarChart() {
  const container = document.getElementById('chartBars');
  if (!container) return;

  SCORES.forEach(s => {
    const row = document.createElement('div');
    row.className = 'chart-bar-row reveal';
    const bgSize = s.pct > 0 ? (10000 / s.pct).toFixed(2) : 100;
    row.innerHTML = `
      <div class="chart-bar-label">${s.label}<span>${s.sub}</span></div>
      <div class="chart-bar-track">
        <div class="chart-bar-fill" data-width="${s.pct}" style="background-size: ${bgSize}% 100%; width:0%">
          <div class="chart-bar-shimmer"></div>
        </div>
      </div>
      <div class="chart-bar-val mono">${s.val.toFixed(0)}</div>
    `;
    container.appendChild(row);
  });

  // Animate on scroll
  const fills = container.querySelectorAll('.chart-bar-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const fill = e.target;
      fill.style.width = fill.getAttribute('data-width') + '%';
      obs.unobserve(e.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.chart-bar-row').forEach(row => obs.observe(row));
}

/* ─── Metric ring animation ──────────────────────────────────────── */
function initMetricRings() {
  const items = document.querySelectorAll('.metric-item');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const ring = entry.target.querySelector('.mring-fg');
      const valEl = entry.target.querySelector('.metric-val:not(.rank-label)');

      if (ring) {
        const pct = parseFloat(ring.getAttribute('data-pct')) / 100;
        const circumference = 2 * Math.PI * 32; // r=32
        ring.style.strokeDashoffset = circumference * (1 - pct);
      }

      if (valEl && valEl.getAttribute('data-target')) {
        const target = parseInt(valEl.getAttribute('data-target'));
        animateCounter(valEl, 0, target, 1400);
      }

      obs.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  items.forEach(i => obs.observe(i));
}

/* ─── Animated counter ───────────────────────────────────────────── */
function animateCounter(el, from, to, duration) {
  const start = performance.now();
  const ease = t => 1 - Math.pow(1 - t, 3);

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(from + (to - from) * ease(progress));
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ─── Countdown timers ───────────────────────────────────────────── */
function updateCountdown(key, deadline) {
  const now = new Date();
  const diff = deadline - now;

  const dEl = document.getElementById(`${key}-d`);
  const hEl = document.getElementById(`${key}-h`);
  const mEl = document.getElementById(`${key}-m`);
  const sEl = document.getElementById(`${key}-s`);

  if (!dEl) return;

  if (diff <= 0) {
    dEl.textContent = hEl.textContent = mEl.textContent = '00';
    if (sEl) sEl.textContent = '00';
    const cd = document.getElementById(`cd-${key}`);
    if (cd) {
      cd.style.borderColor = 'rgba(139,155,173,0.2)';
      cd.querySelector('.cd-label').textContent = '⏱ Pendaftaran telah ditutup';
    }
    return;
  }

  const totalSecs = diff / 1000;
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = Math.floor(totalSecs % 60);

  dEl.textContent = pad(days);
  hEl.textContent = pad(hours);
  mEl.textContent = pad(mins);
  if (sEl) sEl.textContent = pad(secs);

  // Urgent flash when < 3 days
  const cd = document.getElementById(`cd-${key}`);
  if (cd && days < 3) {
    cd.classList.add('countdown-urgent');
  }
}

function initAllCountdowns() {
  Object.entries(DEADLINES).forEach(([key, deadline]) => {
    updateCountdown(key, deadline);
  });
  setInterval(() => {
    Object.entries(DEADLINES).forEach(([key, deadline]) => {
      updateCountdown(key, deadline);
    });
  }, 1000);
}

/* ─── Main banner countdown (UNY CBT) ───────────────────────────── */
function initMainCountdown() {
  const target = new Date('2026-07-02T23:59:00+07:00');
  const dEl = document.getElementById('mc-days');
  const hEl = document.getElementById('mc-hours');
  const mEl = document.getElementById('mc-mins');
  const sEl = document.getElementById('mc-secs');

  function tick() {
    const diff = target - new Date();
    if (diff <= 0) {
      if (dEl) dEl.textContent = '00';
      if (hEl) hEl.textContent = '00';
      if (mEl) mEl.textContent = '00';
      if (sEl) sEl.textContent = '00';
      return;
    }
    const secs = diff / 1000;
    if (dEl) dEl.textContent = pad(secs / 86400);
    if (hEl) hEl.textContent = pad((secs % 86400) / 3600);
    if (mEl) mEl.textContent = pad((secs % 3600) / 60);
    if (sEl) sEl.textContent = pad(secs % 60);
  }

  tick();
  setInterval(tick, 1000);
}

/* ─── Date display ───────────────────────────────────────────────── */
function setTodayDate() {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  const s = fmt.format(now);
  ['todayDate', 'todayDateRadar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = s;
  });
}

/* ─── Filter buttons (PTN Radar) ─────────────────────────────────── */
function initFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const cards = document.querySelectorAll('.ptn-card');

      cards.forEach(card => {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          const filters = card.getAttribute('data-filter') || '';
          card.style.display = filters.includes(filter) ? '' : 'none';
        }
      });

      // Re-adjust featured column span
      const featured = document.querySelector('.ptn-featured');
      if (featured && featured.style.display !== 'none') {
        featured.style.gridColumn = 'span 3';
      }
    });
  });
}

/* ─── Intersection Observer: reveal elements ─────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .tl-card, .score-card, .ptn-card, .sched-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.06}s`;
    obs.observe(el);
  });
}

/* ─── Glassmorphism hover tilt on cards ──────────────────────────── */
function initCardTilt() {
  const cards = document.querySelectorAll('.ptn-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─── Smooth scroll for anchor links ─────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.offsetTop - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ─── Urgent CSS injection for near-deadline cards ───────────────── */
function injectUrgentStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .countdown-urgent {
      border-color: rgba(224,90,90,0.5) !important;
      animation: urgent-border 1.5s ease-in-out infinite;
    }
    @keyframes urgent-border {
      0%, 100% { border-color: rgba(224,90,90,0.4); box-shadow: none; }
      50% { border-color: rgba(224,90,90,0.8); box-shadow: 0 0 20px rgba(224,90,90,0.2); }
    }
    .cd-val { animation: cd-num-flash 1s ease-in-out infinite; }
    @keyframes cd-num-flash {
      0%, 100% { color: #E05A5A; }
      50% { color: #FF8A8A; }
    }
  `;
  document.head.appendChild(style);
}

/* ─── Polaroid image fallback with gradient ──────────────────────── */
function initPolaroidFallback() {
  const img = document.querySelector('.polaroid-img');
  if (!img) return;
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 100%;
      aspect-ratio: 4/5;
      background: linear-gradient(135deg, #1a1f2e 0%, #0f1117 50%, #1a1620 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: rgba(201,168,76,0.6);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
    `;
    placeholder.innerHTML = `
      <div style="font-size:2.5rem;">🖥️</div>
      <div>FAYAADH</div>
      <div style="font-size:0.6rem;color:#4A5568;">ADHLI NUGROHO</div>
    `;
    img.parentNode.insertBefore(placeholder, img);
  });
}

/* ─── Number ticker on hero score badges ─────────────────────────── */
function initHeroTicker() {
  const scoreEl = document.querySelector('.dc-score');
  if (!scoreEl) return;
  let val = 0;
  const target = 620;
  const interval = setInterval(() => {
    val = Math.min(val + Math.ceil((target - val) / 5), target);
    scoreEl.textContent = val;
    if (val >= target) clearInterval(interval);
  }, 50);
}

/* ─── Typing effect for terminal ──────────────────────────────────── */
function initTerminalTyping() {
  const outputs = document.querySelectorAll('.t-output');
  outputs.forEach((el, i) => {
    const text = el.textContent;
    el.textContent = '';
    el.style.opacity = '1';
    let j = 0;
    setTimeout(() => {
      const ticker = setInterval(() => {
        el.textContent = text.slice(0, ++j);
        if (j >= text.length) clearInterval(ticker);
      }, 18);
    }, 200 + i * 400);
  });
}

/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initPolaroidFallback();
  buildBarChart();
  setTodayDate();
  initAllCountdowns();
  initMainCountdown();
  initFilters();
  injectUrgentStyles();
  initTerminalTyping();
  initHeroTicker();

  // Delay observer-based inits slightly for DOM readiness
  requestAnimationFrame(() => {
    initScoreRings();
    initMetricRings();
    initReveal();
    initCardTilt();
    initSmoothScroll();
  });
});
