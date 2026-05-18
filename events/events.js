// ═══════════════════════════════════════════════════════════════
//  MLRIT EVENTS — full-viewport rotating stage
//  Auto-rotate every 6s; hover 3s anywhere on stage → enter "playing"
// ═══════════════════════════════════════════════════════════════
(function () {
  'use strict';
  const stage = document.getElementById('evStage');
  if (!stage) return;

  const slides = [
    {
      logo: 'https://mlrit-next.vercel.app/assets/logo.svg',
      alt:  'The Equinox E-Summit 2K24',
      tag:  'Entrepreneurship Summit · 2024',
      title:'The Equinox<br>E-Summit 2K24',
      desc: "MLRIT's flagship annual summit bringing together entrepreneurs, investors, and innovators to inspire the next generation of leaders.",
    },
    {
      logo: 'https://mlrit-next.vercel.app/assets/main%20logo.svg',
      alt:  'Zignasa 2025',
      tag:  'Technical & Cultural Fest · 2025',
      title:'Zignasa<br>2025',
      desc: "MLRIT's grand annual extravaganza featuring technical competitions, hackathons, cultural performances, and celebrity nights.",
    },
    {
      logo: 'https://mlrit-next.vercel.app/assets/logo.svg',
      alt:  'Zenith 2K25',
      tag:  'National Tech Fest · 2025',
      title:'Zenith<br>2K25',
      desc: "Three days, dozens of events — robotics arenas, coding marathons and an opening-night band lineup that lit up the main grounds.",
    },
    {
      logo: 'https://mlrit-next.vercel.app/assets/logo.svg',
      alt:  'Trishna Annual Day 2K26',
      tag:  'Institutional · Annual Day 2026',
      title:'Trishna<br>Annual Day 2K26',
      desc: "MLRIT's 21st Annual Day — student awards, alumni stories and a quiet evening that earned its loud applause.",
    },
  ];

  const bgs   = stage.querySelectorAll('.ev-stage__bg, .ev-stage__video');
  const dots  = stage.querySelectorAll('.ev-stage__dot');
  const card      = document.getElementById('evCard');
  const cardLogo  = document.getElementById('evCardLogo');
  const cardTag   = document.getElementById('evCardTag');
  const cardTitle = document.getElementById('evCardTitle');
  const cardDesc  = document.getElementById('evCardDesc');
  const chipLogo  = document.getElementById('evChipLogo');
  const chipTag   = document.getElementById('evChipTag');

  let active   = 0;
  let playing  = false;
  let auto, hoverTimer;

  function paint(idx) {
    const s = slides[idx]; if (!s) return;
    active = idx;
    bgs.forEach((el, i) => {
      const isActive = i === idx;
      el.classList.toggle('is-active', isActive);
      if (el.tagName !== 'VIDEO') return;

      if (isActive) {
        // muted autoplay is always allowed in modern browsers
        el.muted = true;
        el.playsInline = true;
        const tryPlay = () => {
          const p = el.play();
          if (p && p.catch) p.catch(() => {
            // If first play() fails, retry once on next user interaction
            const retry = () => { el.play().catch(() => {}); document.removeEventListener('pointermove', retry); };
            document.addEventListener('pointermove', retry, { once: true });
          });
        };
        if (el.readyState >= 2) {
          tryPlay();
        } else {
          // wait for enough data to play
          el.addEventListener('loadeddata', tryPlay, { once: true });
          el.addEventListener('canplay',    tryPlay, { once: true });
          el.load();
        }
      } else {
        try { el.pause(); } catch (e) {}
      }
    });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    if (cardLogo)  { cardLogo.src = s.logo; cardLogo.alt = s.alt; }
    if (cardTag)   cardTag.textContent = s.tag;
    if (cardTitle) cardTitle.innerHTML = s.title;
    if (cardDesc)  cardDesc.textContent = s.desc;
    if (chipLogo)  { chipLogo.src = s.logo; chipLogo.alt = s.alt; }
    if (chipTag)   chipTag.textContent = s.tag;
    if (card) void card.offsetWidth;
  }

  function startAuto() {
    stopAuto();
    auto = setInterval(() => paint((active + 1) % slides.length), 6000);
  }
  function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }

  function enterPlay() {
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      playing = true;
      stage.classList.add('is-playing');
      stopAuto();
    }, 3000);
  }
  function exitPlay() {
    clearTimeout(hoverTimer);
    if (playing) {
      playing = false;
      stage.classList.remove('is-playing');
    }
    startAuto();
  }

  stage.addEventListener('pointerenter', enterPlay);
  stage.addEventListener('pointerleave', exitPlay);
  stage.addEventListener('touchstart', () => { playing ? exitPlay() : enterPlay(); }, { passive: true });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.dataset.idx, 10);
      if (Number.isFinite(idx)) { paint(idx); startAuto(); }
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto(); else if (!playing) startAuto();
  });

  paint(0);
  startAuto();
})();
