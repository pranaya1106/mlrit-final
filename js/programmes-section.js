/* ============================================================
   PROGRAMMES SECTION — ScrollStack
   Desktop: position:sticky CSS pins cards; JS writes scale+opacity only.
   Mobile:  translate3d model — flat single column, JS drives everything.
   No CSS transitions on transform — zero jitter.
   ============================================================ */
(function () {
  'use strict';

  var section = document.querySelector('.prog-stack-section');
  if (!section) return;

  var tabs        = section.querySelectorAll('.prog-stack-tab');
  var catalogue   = section.querySelector('.prog-stack-catalogue');
  var cols        = section.querySelectorAll('.prog-stack-col');
  var mobileQuery = window.matchMedia('(max-width: 900px)');

  /* ------------------------------------------------------------------
     Config
  ------------------------------------------------------------------ */
  /* Desktop sticky model */
  var STACK_TOP_PX  = 152;   /* matches --prog-stack-top CSS var */
  var SCALE_STEP    = 0.032; /* scale reduction per depth level */
  var STEP_PX       = 18;    /* translateY per depth level (desktop) */
  var MIN_SCALE     = 0.78;
  var MIN_OPACITY   = 0.55;

  /* Mobile translate3d model */
  var M_ITEM_DIST   = 60;    /* margin-bottom between cards */
  var M_STACK_DIST  = 20;    /* px offset per card in pin zone */
  var M_STACK_PCT   = 0.12;  /* vh fraction for pin trigger */
  var M_SCALE_END   = 0.10;
  var M_BASE_SCALE  = 0.85;
  var M_SCALE_STEP  = 0.03;

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  function getVisibleCards(col) {
    return Array.prototype.filter.call(
      col.querySelectorAll('.prog-stack-card'),
      function (c) { return !c.hidden; }
    );
  }

  function getAllVisible() {
    var all = [];
    cols.forEach(function (col) {
      getVisibleCards(col).forEach(function (c) { all.push(c); });
    });
    return all;
  }

  function clearInline(card) {
    card.style.transform = '';
    card.style.opacity   = '';
    card.style.zIndex    = '';
    card.style.marginBottom = '';
  }

  function getDocTop(el) {
    var top = 0;
    while (el) { top += el.offsetTop; el = el.offsetParent; }
    return top;
  }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function smoothstep(v) { return v * v * (3 - 2 * v); }

  /* ------------------------------------------------------------------
     Reveal — fade-in for cards scrolling into view.
     Cards already visible on boot are seeded immediately.
  ------------------------------------------------------------------ */
  var revealedCards = new Set();

  function seedRevealedCards() {
    var vh = window.innerHeight;
    getAllVisible().forEach(function (card) {
      if (card.getBoundingClientRect().top < vh * 1.2) {
        revealedCards.add(card);
        card.classList.remove('prog-reveal', 'is-revealed');
      }
    });
  }

  function setupReveal() {
    getAllVisible().forEach(function (card) {
      if (!revealedCards.has(card)) card.classList.add('prog-reveal');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var card = entry.target;
        if (revealedCards.has(card)) return;
        card.classList.add('is-revealed');
        io.unobserve(card);
        setTimeout(function () {
          revealedCards.add(card);
          card.classList.remove('prog-reveal', 'is-revealed');
        }, 560);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

    getAllVisible().forEach(function (card) {
      if (!revealedCards.has(card)) io.observe(card);
    });

    return io;
  }

  var revealIO = null;

  /* ------------------------------------------------------------------
     Desktop: init — no margin-bottom overrides (CSS handles spacing)
  ------------------------------------------------------------------ */
  function initDesktop() {
    getAllVisible().forEach(function (card) {
      card.style.marginBottom     = '';
      card.style.willChange       = 'transform, opacity';
      card.style.transformOrigin  = 'top center';
      card.style.backfaceVisibility = 'hidden';
    });
  }

  /* ------------------------------------------------------------------
     Mobile: init — set margin-bottom for translate3d spacing
  ------------------------------------------------------------------ */
  function initMobile() {
    var cards = getAllVisible();
    cards.forEach(function (c, i) {
      c.style.marginBottom      = i < cards.length - 1 ? M_ITEM_DIST + 'px' : '';
      c.style.willChange        = 'transform';
      c.style.transformOrigin   = 'top center';
      c.style.backfaceVisibility = 'hidden';
    });
  }

  function initAll() {
    mobileQuery.matches ? initMobile() : initDesktop();
  }

  /* ------------------------------------------------------------------
     Boot
  ------------------------------------------------------------------ */
  function boot() {
    initAll();
    seedRevealedCards();
    revealIO = setupReveal();
    scheduleStack();
  }

  /* ------------------------------------------------------------------
     Tab switching
  ------------------------------------------------------------------ */
  function setLevel(level) {
    var allCards = section.querySelectorAll('.prog-stack-card');

    allCards.forEach(function (c) {
      if (c.dataset.level !== level && !c.hidden) c.classList.add('is-leaving');
    });

    setTimeout(function () {
      allCards.forEach(function (c) {
        c.classList.remove('is-leaving', 'is-entering', 'prog-reveal', 'is-revealed');

        if (c.dataset.level !== level) {
          c.hidden = true;
          clearInline(c);
          revealedCards.delete(c);
        } else if (c.hidden) {
          c.style.opacity   = '0';
          c.style.transform = 'translateZ(0)';
          c.hidden = false;
          c.classList.add('is-entering');
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              c.style.opacity = '';
              revealedCards.add(c);
            });
          });
          setTimeout(function () {
            c.classList.remove('is-entering');
            c.style.transform = '';
          }, 260);
        }
      });

      initAll();
      lastTransforms.clear();
      requestAnimationFrame(applyStack);
    }, 190);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var level = tab.dataset.level;
      if (tab.classList.contains('is-active')) return;
      tabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      setLevel(level);
      if (catalogue) {
        var targetY = catalogue.getBoundingClientRect().top + window.scrollY - 120;
        if (window.ScrollSmoother && ScrollSmoother.get()) {
          ScrollSmoother.get().scrollTo(targetY, true, 'top top');
        } else {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    });
  });

  /* ------------------------------------------------------------------
     Stack engine — desktop (sticky model)
     CSS pins each card at top:152px. JS reads how many cards are
     already fully stacked above and applies scale + translateY offset
     to compress the deck visually.
  ------------------------------------------------------------------ */
  var ticking      = false;
  var lastTransforms = new Map();

  function applyStackDesktop() {
    var scrollY = window.scrollY;

    cols.forEach(function (col) {
      var cards = getVisibleCards(col).filter(function (c) {
        return revealedCards.has(c);
      });
      if (!cards.length) return;

      /* Batch-read rects */
      var rects = cards.map(function (c) { return c.getBoundingClientRect(); });

      cards.forEach(function (card, i) {
        var nextRect = rects[i + 1];
        var progress = 0;

        if (nextRect) {
          var rangeStart = STACK_TOP_PX + 200;
          var rangeEnd   = STACK_TOP_PX;
          var raw = (rangeStart - nextRect.top) / (rangeStart - rangeEnd);
          raw = clamp01(raw);
          progress = smoothstep(raw);
        }

        /* Count cards fully stacked above this one */
        var depth = 0;
        for (var j = i + 1; j < cards.length; j++) {
          if (rects[j].top <= STACK_TOP_PX + 2) depth++;
        }

        var totalDepth = depth + progress;
        var scale   = Math.max(MIN_SCALE, 1 - totalDepth * SCALE_STEP);
        var liftY   = -(totalDepth * STEP_PX);
        var opacity = Math.max(MIN_OPACITY, 1 - totalDepth * 0.08);

        var ty = Math.round(liftY * 10) / 10;
        var sc = Math.round(scale * 1000) / 1000;
        var op = Math.round(opacity * 1000) / 1000;

        var last = lastTransforms.get(card);
        if (last &&
            Math.abs(last.ty - ty) < 0.15 &&
            Math.abs(last.sc - sc) < 0.001 &&
            Math.abs(last.op - op) < 0.001) return;

        lastTransforms.set(card, { ty: ty, sc: sc, op: op });
        card.style.transform = 'translateZ(0) translateY(' + ty + 'px) scale(' + sc + ')';
        card.style.opacity   = String(op);
        card.style.zIndex    = String(i + 1);
      });
    });
  }

  /* ------------------------------------------------------------------
     Stack engine — mobile (translate3d model)
     Cards are position:relative; JS translates them to simulate pinning.
  ------------------------------------------------------------------ */
  function applyStackMobile() {
    var scrollY    = window.scrollY;
    var containerH = window.innerHeight;
    var stackPosPx = containerH * M_STACK_PCT;
    var scaleEndPx = containerH * M_SCALE_END;

    var endEl  = section.querySelector('.prog-stack-end');
    var endTop = endEl ? getDocTop(endEl) : 0;
    var pinEnd = endTop - containerH * 0.5;

    var cards = getAllVisible().filter(function (c) { return revealedCards.has(c); });
    if (!cards.length) return;

    var tops = cards.map(getDocTop);

    cards.forEach(function (card, i) {
      var cardTop      = tops[i];
      var triggerStart = cardTop - stackPosPx - M_STACK_DIST * i;
      var triggerEnd   = cardTop - scaleEndPx;

      var scaleProgress = clamp01(
        (scrollY - triggerStart) / Math.max(1, triggerEnd - triggerStart)
      );
      var targetScale = M_BASE_SCALE + i * M_SCALE_STEP;
      var scale       = 1 - scaleProgress * (1 - targetScale);

      var translateY = 0;
      if (scrollY >= triggerStart && scrollY <= pinEnd) {
        translateY = scrollY - cardTop + stackPosPx + M_STACK_DIST * i;
      } else if (scrollY > pinEnd) {
        translateY = pinEnd - cardTop + stackPosPx + M_STACK_DIST * i;
      }

      var ty = Math.round(translateY * 10) / 10;
      var sc = Math.round(scale * 1000) / 1000;

      var last = lastTransforms.get(card);
      if (last && Math.abs(last.ty - ty) < 0.15 && Math.abs(last.sc - sc) < 0.001) return;

      lastTransforms.set(card, { ty: ty, sc: sc });
      card.style.transform = 'translate3d(0,' + ty + 'px,0) scale(' + sc + ')';
      card.style.zIndex    = String(i + 1);
    });
  }

  function applyStack() {
    ticking = false;
    mobileQuery.matches ? applyStackMobile() : applyStackDesktop();
  }

  function scheduleStack() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(applyStack);
    }
  }

  /* ------------------------------------------------------------------
     Resize + breakpoint change
  ------------------------------------------------------------------ */
  var resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      lastTransforms.clear();
      scheduleStack();
    }, 80);
  }

  function onMediaChange() {
    if (revealIO) revealIO.disconnect();
    revealedCards.clear();
    lastTransforms.clear();
    /* Reset inline styles so the new mode starts clean */
    getAllVisible().forEach(clearInline);
    initAll();
    seedRevealedCards();
    revealIO = setupReveal();
    scheduleStack();
  }

  /* ------------------------------------------------------------------
     Boot
  ------------------------------------------------------------------ */
  boot();

  window.addEventListener('scroll', scheduleStack, { passive: true });
  window.addEventListener('resize', onResize);

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', onMediaChange);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(onMediaChange);
  }

})();
