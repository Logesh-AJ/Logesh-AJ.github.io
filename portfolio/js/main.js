/* ============================================================
   LOGESH A J — PORTFOLIO JS  (v2)
   ============================================================ */

/* ─────────────────────────────────────────────────────────────
   CUSTOM CURSOR
   ───────────────────────────────────────────────────────────── */
const cur  = document.getElementById('cur');
const ring = document.getElementById('ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function cursorLoop() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(cursorLoop);
})();
document.querySelectorAll('a,button,.pcard,.icard,.ccard,.ach-item,.ieee-trigger,.tag,.social-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.width = cur.style.height = '18px';
    ring.style.width = ring.style.height = '46px';
    ring.style.borderColor = 'rgba(245,200,66,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.width = cur.style.height = '8px';
    ring.style.width = ring.style.height = '30px';
    ring.style.borderColor = 'rgba(245,200,66,0.5)';
  });
});

/* ─────────────────────────────────────────────────────────────
   ★  ORIGINAL RIPPLE / TRAIL MOUSE ANIMATION — COMMENTED OUT
   ─────────────────────────────────────────────────────────────
   document.addEventListener('mousemove', e => {
     const dot = document.createElement('div');
     dot.style.cssText = `position:fixed;width:5px;height:5px;background:#f5c842;
       border-radius:50%;left:${e.clientX}px;top:${e.clientY}px;
       pointer-events:none;z-index:9990;transition:all .5s;opacity:.8;
       transform:translate(-50%,-50%)`;
     document.body.appendChild(dot);
     requestAnimationFrame(() => { dot.style.opacity='0'; dot.style.transform='translate(-50%,-50%) scale(3)'; });
     setTimeout(() => dot.remove(), 500);
   });
   ─────────────────────────────────────────────────────────────
   ★  GLITTERING STARS MOUSE — ALSO COMMENTED OUT (prev version)
   ─────────────────────────────────────────────────────────────
   (see previous version in git history)
   ───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   ★  AMBIENT BACKGROUND STAR FIELD (golden + cyan drifting stars)
   ───────────────────────────────────────────────────────────── */
(function initStarBg() {
  const canvas = document.getElementById('starCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize(); addEventListener('resize', resize);

  const STAR_COUNT = 130;
  const COLORS = ['rgba(245,200,66,', 'rgba(255,255,255,', 'rgba(0,212,255,', 'rgba(255,220,100,'];

  class Star {
    constructor() { this.reset(true); }
    reset(init) {
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : -5;
      this.size  = Math.random() * 1.8 + 0.3;
      this.speed = Math.random() * 0.25 + 0.05;
      this.alpha = Math.random() * 0.7 + 0.1;
      this.twinkleSpeed = Math.random() * 0.04 + 0.01;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.drift = (Math.random() - 0.5) * 0.1;
    }
    update() {
      this.y += this.speed;
      this.x += this.drift;
      this.twinklePhase += this.twinkleSpeed;
      if (this.y > H + 5) this.reset(false);
    }
    draw() {
      const a = this.alpha * (0.6 + 0.4 * Math.sin(this.twinklePhase));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + a + ')';
      // glow for bigger stars
      if (this.size > 1.2) {
        ctx.shadowBlur  = 6;
        ctx.shadowColor = this.color + '0.8)';
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    }
  }

  const stars = Array.from({ length: STAR_COUNT }, () => new Star());

  // Shooting star
  let shoot = null;
  function spawnShoot() {
    shoot = { x: Math.random() * W * 0.7, y: Math.random() * H * 0.3, vx: 5 + Math.random() * 4, vy: 2 + Math.random() * 2, life: 0, maxLife: 50, trail: [] };
    setTimeout(spawnShoot, 4000 + Math.random() * 6000);
  }
  setTimeout(spawnShoot, 2000);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => { s.update(); s.draw(); });

    // Shooting star
    if (shoot) {
      shoot.life++;
      shoot.x += shoot.vx; shoot.y += shoot.vy;
      shoot.trail.push({ x: shoot.x, y: shoot.y });
      if (shoot.trail.length > 18) shoot.trail.shift();
      if (shoot.life < shoot.maxLife && shoot.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(shoot.trail[0].x, shoot.trail[0].y);
        shoot.trail.forEach(p => ctx.lineTo(p.x, p.y));
        const grad = ctx.createLinearGradient(shoot.trail[0].x, shoot.trail[0].y, shoot.x, shoot.y);
        grad.addColorStop(0, 'rgba(245,200,66,0)');
        grad.addColorStop(1, 'rgba(245,200,66,0.9)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8; ctx.shadowColor = '#f5c842';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      if (shoot.life >= shoot.maxLife) shoot = null;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────
   ANIMATED PARTICLE BACKGROUND (network mesh)
   ───────────────────────────────────────────────────────────── */
(function initBg() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, pts = [];

  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize(); addEventListener('resize', resize);

  class Pt {
    constructor() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.vx = (Math.random() - .5) * .25; this.vy = (Math.random() - .5) * .25;
      this.r = Math.random() * 1.2 + .4; this.alpha = Math.random() * .4 + .05;
    }
    move() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
  }
  for (let i = 0; i < 80; i++) pts.push(new Pt());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.move();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,180,255,${p.alpha})`; ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,180,255,${.08 * (1 - d / 110)})`;
          ctx.lineWidth = .4; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
   ───────────────────────────────────────────────────────────── */
const scrollBar = document.getElementById('scrollBar');
addEventListener('scroll', () => {
  scrollBar.style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%';
});

/* ─────────────────────────────────────────────────────────────
   NAVBAR
   ───────────────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('shrunk', scrollY > 60));

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open'); navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open'); navLinks.classList.remove('open');
}));

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEAL
   ───────────────────────────────────────────────────────────── */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('in');
}), { threshold: .1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.rv').forEach(el => io.observe(el));
addEventListener('load', () => document.querySelectorAll('.hero .rv').forEach(el => el.classList.add('in')));

/* ─────────────────────────────────────────────────────────────
   ACTIVE NAV
   ───────────────────────────────────────────────────────────── */
document.querySelectorAll('section[id]').forEach(sec =>
  new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting)
      navLinks.querySelectorAll('a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
      );
  }), { threshold: .35 }).observe(sec)
);

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTERS
   ───────────────────────────────────────────────────────────── */
const coio = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, t = +el.dataset.t, dur = 1400, step = t / (dur / 16);
  let c = 0;
  const id = setInterval(() => {
    c += step; if (c >= t) { c = t; clearInterval(id); }
    el.textContent = Math.floor(c);
  }, 16);
  coio.unobserve(el);
}), { threshold: .5 });
document.querySelectorAll('.stat-num').forEach(el => coio.observe(el));

/* ─────────────────────────────────────────────────────────────
   PARALLAX ORBS on mouse
   ───────────────────────────────────────────────────────────── */
addEventListener('mousemove', e => {
  const x = (e.clientX / innerWidth  - .5) * 30;
  const y = (e.clientY / innerHeight - .5) * 30;
  document.querySelectorAll('.glow-orb').forEach((o, i) => {
    o.style.transform = `translate(${x * (i === 1 ? -.5 : i === 2 ? .3 : 1)}px, ${y * (i === 1 ? -.5 : i === 2 ? .3 : 1)}px)`;
  });
});

/* ─────────────────────────────────────────────────────────────
   3D TILT on Project Cards
   ───────────────────────────────────────────────────────────── */
document.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - .5;
    const y = (e.clientY - r.top)  / r.height - .5;
    card.style.transform = `translateY(-5px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    card.style.transition = 'transform .1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s var(--ease)';
  });
});

/* ─────────────────────────────────────────────────────────────
   TYPING ANIMATION for hero title
   ───────────────────────────────────────────────────────────── */
(function initTyping() {
  const el    = document.getElementById('heroTyped');
  if (!el) return;
  const roles = [
    'ECE Student · AI / ML Engineer · Embedded Systems',
    'Computer Vision Researcher · Edge AI Developer',
    'Aerospace Tech Enthusiast · Patent Holder',
    'IEEE Published Author · R&D Seeker'
  ];
  let ri = 0, ci = 0, deleting = false;

  function type() {
    const current = roles[ri];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; return setTimeout(type, 2200); }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 28 : 52);
  }
  setTimeout(type, 1500);
})();

/* ─────────────────────────────────────────────────────────────
   SKILL TAG hover sparkle (micro interaction)
   ───────────────────────────────────────────────────────────── */
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('mouseenter', e => {
    const rect = tag.getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
      const p = document.createElement('div');
      const angle = (i / 4) * Math.PI * 2;
      const dist  = 20 + Math.random() * 15;
      p.style.cssText = `
        position:fixed;
        left:${rect.left + rect.width/2}px;
        top:${rect.top + rect.height/2}px;
        width:4px;height:4px;
        background:#f5c842;border-radius:50%;
        pointer-events:none;z-index:9990;
        transition:all .5s cubic-bezier(.4,0,.2,1);
        transform:translate(-50%,-50%);
        opacity:1;
      `;
      document.body.appendChild(p);
      requestAnimationFrame(() => {
        p.style.left   = (rect.left + rect.width/2 + Math.cos(angle) * dist) + 'px';
        p.style.top    = (rect.top  + rect.height/2 + Math.sin(angle) * dist) + 'px';
        p.style.opacity = '0';
        p.style.transform = 'translate(-50%,-50%) scale(0)';
      });
      setTimeout(() => p.remove(), 500);
    }
  });
});

/* ─────────────────────────────────────────────────────────────
   IEEE MODAL
   ───────────────────────────────────────────────────────────── */
const modal    = document.getElementById('ieeeModal');
const closeBtn = document.getElementById('modalClose');

function openModal()  { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }

document.getElementById('ieeTrigger').addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ─────────────────────────────────────────────────────────────
   FLOATING RINGS — inject decorative rings behind sections
   ───────────────────────────────────────────────────────────── */
(function injectRings() {
  const positions = [
    { top: '20%', right: '-80px', size: 320 },
    { top: '55%', left: '-100px', size: 400 },
    { top: '80%', right: '-60px', size: 200 },
  ];
  positions.forEach(({ top, left, right, size }, i) => {
    const el = document.createElement('div');
    el.className = 'float-ring';
    el.style.cssText = `
      width:${size}px;height:${size}px;
      top:${top};
      ${left ? 'left:' + left : 'right:' + right};
      animation-delay:${i * 1.5}s;
    `;
    document.body.appendChild(el);
  });
})();

/* ─────────────────────────────────────────────────────────────
   ACHIEVEMENT ITEM stagger on scroll
   ───────────────────────────────────────────────────────────── */
const achIO = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) {
    e.target.querySelectorAll('.ach-item').forEach((item, i) => {
      setTimeout(() => item.classList.add('in'), i * 80);
    });
    achIO.unobserve(e.target);
  }
}), { threshold: .1 });
document.querySelectorAll('.ach-list').forEach(l => achIO.observe(l));

/* ─────────────────────────────────────────────────────────────
   GMAIL SMART LINK
   On desktop → opens Gmail web compose with TO pre-filled
   On mobile  → opens native Gmail app via mailto: with TO pre-filled
   ───────────────────────────────────────────────────────────── */
(function setGmailLinks() {
  const TO = 'contact.logeshaj@gmail.com';
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
                   || window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  const gmailHref   = isMobile
    ? `mailto:${TO}`
    : `https://mail.google.com/mail/?view=cm&to=${TO}`;
  const targetAttr  = isMobile ? '_self' : '_blank';

  ['gmailHeroBtn', 'gmailContactBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href   = gmailHref;
    el.target = targetAttr;
  });
})();
