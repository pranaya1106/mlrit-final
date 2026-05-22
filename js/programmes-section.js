/* ============================================================
   PROGRAMMES SECTION — ScrollStack (ReactBits port, vanilla JS)
   useWindowScroll mode: translate3d + scale driven by window.scrollY.
   No CSS transitions on card wrapper — zero jitter.
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
     Config — ReactBits ScrollStack defaults
  ------------------------------------------------------------------ */
  var ITEM_DISTANCE      = 100;   /* px between cards */
  var ITEM_SCALE         = 0.03;  /* scale step per stacked depth */
  var ITEM_STACK_DIST    = 30;    /* px vertical offset per card in stack */
  var STACK_POSITION_PCT = 0.20;  /* vh fraction where stacking triggers */
  var SCALE_END_PCT      = 0.10;  /* vh fraction where scale completes */
  var BASE_SCALE         = 0.85;  /* target scale of deepest card */

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
  }

  function getDocTop(el) {
    var top = 0;
    while (el) { top += el.offsetTop; el = el.offsetParent; }
    return top;
  }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  /* ------------------------------------------------------------------
     Card init — margins + GPU hints (called after any level change)
  ------------------------------------------------------------------ */
  function initCards(cards) {
    cards.forEach(function (c, i) {
      c.style.marginBottom      = i < cards.length - 1 ? ITEM_DISTANCE + 'px' : '';
      c.style.willChange        = 'transform';
      c.style.transformOrigin   = 'top center';
      c.style.backfaceVisibility = 'hidden';
    });
  }

  function initAllCols() {
    cols.forEach(function (col) { initCards(getVisibleCards(col)); });
  }

  /* ------------------------------------------------------------------
     Reveal — fade-in for cards that scroll into view.
     Cards already in viewport on boot skip the fade immediately.
  ------------------------------------------------------------------ */
  var revealedCards = new Set();

  function seedRevealedCards() {
    /* Any card whose top is within the current viewport gets added
       immediately so the stack engine can act on them right away. */
    var vh = window.innerHeight;
    getAllVisible().forEach(function (card) {
      var rect = card.getBoundingClientRect();
      if (rect.top < vh * 1.2) {   /* generous — include slightly below fold */
        revealedCards.add(card);
        card.classList.remove('prog-reveal', 'is-revealed');
      }
    });
  }

  function setupReveal() {
    /* Mark cards not yet revealed as faded */
    getAllVisible().forEach(function (card) {
      if (!revealedCards.has(card)) card.classList.add('prog-reveal');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var card = entry.target;
        if (revealedCards.has(card)) return; /* already seeded */
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

  function boot() {
    initAllCols();
    seedRevealedCards();   /* instant — no 580ms gate on visible cards */
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

      initAllCols();
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
     ScrollStack engine — ReactBits translate3d+scale model

     pinStart = cardTop - stackPos - ITEM_STACK_DIST * i
     pinEnd   = endSentinel - containerH * 0.5

     while scrollY in [pinStart, pinEnd]:
       translateY = scrollY - cardTop + stackPos + ITEM_STACK_DIST * i

     scale compresses from 1→targetScale as card enters the stack zone.
     No CSS transitions on the card wrapper — JS owns every frame.
  ------------------------------------------------------------------ */
  var ticking      = false;
  var lastTransforms = new Map();

  function applyStack() {
    ticking = false;

    var scrollY    = window.scrollY;
    var containerH = window.innerHeight;
    var stackPct   = mobileQuery.matches ? 0.14 : STACK_POSITION_PCT;
    var stackPosPx = containerH * stackPct;
    var scaleEndPx = containerH * SCALE_END_PCT;

    var endEl  = section.querySelector('.prog-stack-end');
    var endTop = endEl ? getDocTop(endEl) : 0;
    var pinEnd = endTop - containerH * 0.5;

    cols.forEach(function (col) {
      var cards = getVisibleCards(col).filter(function (c) {
        return revealedCards.has(c);
      });
      if (!cards.length) return;

      /* Batch read */
      var tops = cards.map(getDocTop);

      cards.forEach(function (card, i) {
        var cardTop      = tops[i];
        var triggerStart = cardTop - stackPosPx - ITEM_STACK_DIST * i;
        var triggerEnd   = cardTop - scaleEndPx;

        /* Scale: 1 → targetScale as card enters stack zone */
        var scaleProgress = clamp01(
          (scrollY - triggerStart) / Math.max(1, triggerEnd - triggerStart)
        );
        var targetScale = BASE_SCALE + i * ITEM_SCALE;
        var scale       = 1 - scaleProgress * (1 - targetScale);

        /* Pin: card sticks at stackPos + per-card offset while in range */
        var translateY = 0;
        var pinStart   = triggerStart;
        if (scrollY >= pinStart && scrollY <= pinEnd) {
          translateY = scrollY - cardTop + stackPosPx + ITEM_STACK_DIST * i;
        } else if (scrollY > pinEnd) {
          translateY = pinEnd - cardTop + stackPosPx + ITEM_STACK_DIST * i;
        }

        var ty = Math.round(translateY * 10) / 10;
        var sc = Math.round(scale * 1000) / 1000;

        var last = lastTransforms.get(card);
        if (last && Math.abs(last.ty - ty) < 0.15 && Math.abs(last.sc - sc) < 0.001) return;

        lastTransforms.set(card, { ty: ty, sc: sc });
        card.style.transform = 'translate3d(0,' + ty + 'px,0) scale(' + sc + ')';
        card.style.zIndex    = String(i + 1);
      });
    });
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
    initAllCols();
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
