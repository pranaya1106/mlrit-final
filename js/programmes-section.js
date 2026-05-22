/* ============================================================
   PROGRAMMES SECTION — ScrollStack (React Bits port, vanilla JS)
   Tab switching + per-column scroll-stack stacking.
   Stack physics ported from ReactBits ScrollStack component.
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
     Config — mirrors ReactBits ScrollStack props
  ------------------------------------------------------------------ */
  var ITEM_DISTANCE      = 100;   /* px margin between cards */
  var ITEM_SCALE         = 0.03;  /* scale decrement per depth level */
  var ITEM_STACK_DIST    = 28;    /* px offset per card in the pin zone */
  var STACK_POSITION_PCT = 0.20;  /* viewport % where stacking begins */
  var SCALE_END_PCT      = 0.10;  /* viewport % where scale finishes */
  var BASE_SCALE         = 0.86;  /* minimum scale for deepest card */

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  function getVisibleCards(col) {
    return Array.prototype.filter.call(
      col.querySelectorAll('.prog-stack-card'),
      function (c) { return !c.hidden; }
    );
  }

  function clearInline(card) {
    card.style.transform = '';
    card.style.opacity   = '';
    card.style.zIndex    = '';
  }

  /* ------------------------------------------------------------------
     Reveal — simple opacity fade, IO-triggered
  ------------------------------------------------------------------ */
  var revealedCards = new Set();

  function setupReveal() {
    if (mobileQuery.matches) return null;

    section.querySelectorAll('.prog-stack-card').forEach(function (card) {
      if (!card.hidden) card.classList.add('prog-reveal');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var card = entry.target;
        card.classList.add('is-revealed');
        io.unobserve(card);
        setTimeout(function () {
          revealedCards.add(card);
          card.classList.remove('prog-reveal', 'is-revealed');
        }, 580);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

    section.querySelectorAll('.prog-stack-card').forEach(function (card) {
      if (!card.hidden) io.observe(card);
    });

    return io;
  }

  var revealIO = setupReveal();

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
          c.style.opacity = '0';
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
     ScrollStack engine — ReactBits port (useWindowScroll mode)

     For each card[i] in a column:
       cardTop  = card's offsetTop from document top
       stackPos = containerH * STACK_POSITION_PCT
       scaleEnd = containerH * SCALE_END_PCT

       triggerStart = cardTop - stackPos - ITEM_STACK_DIST * i
       triggerEnd   = cardTop - scaleEnd
       pinStart     = triggerStart
       pinEnd       = endSentinelTop - containerH * 0.5

       scaleProgress = clamp01((scrollY - triggerStart) / (triggerEnd - triggerStart))
       targetScale   = BASE_SCALE + i * ITEM_SCALE
       scale         = 1 - scaleProgress * (1 - targetScale)

       if pinned: translateY = scrollY - cardTop + stackPos + ITEM_STACK_DIST * i
       if past:   translateY = pinEnd  - cardTop + stackPos + ITEM_STACK_DIST * i

     No CSS transitions on transform — JS writes every rAF frame directly.
  ------------------------------------------------------------------ */

  var ticking = false;

  /* Cache of { translateY, scale } per card — skip DOM write if unchanged */
  var lastTransforms = new Map();

  function getCardOffset(el) {
    var top = 0;
    while (el) { top += el.offsetTop; el = el.offsetParent; }
    return top;
  }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function applyStack() {
    ticking = false;

    if (mobileQuery.matches) {
      cols.forEach(function (col) { getVisibleCards(col).forEach(clearInline); });
      return;
    }

    var scrollY      = window.scrollY;
    var containerH   = window.innerHeight;
    var stackPosPx   = containerH * STACK_POSITION_PCT;
    var scaleEndPx   = containerH * SCALE_END_PCT;

    var endEl        = section.querySelector('.prog-stack-end');
    var endTop       = endEl ? getCardOffset(endEl) : 0;

    cols.forEach(function (col) {
      var cards = getVisibleCards(col).filter(function (c) {
        return revealedCards.has(c);
      });
      if (!cards.length) return;

      /* Batch-read offsets */
      var offsets = cards.map(getCardOffset);

      cards.forEach(function (card, i) {
        var cardTop      = offsets[i];
        var triggerStart = cardTop - stackPosPx - ITEM_STACK_DIST * i;
        var triggerEnd   = cardTop - scaleEndPx;
        var pinStart     = triggerStart;
        var pinEnd       = endTop - containerH * 0.5;

        /* Scale */
        var scaleProgress = clamp01((scrollY - triggerStart) / (Math.max(1, triggerEnd - triggerStart)));
        var targetScale   = BASE_SCALE + i * ITEM_SCALE;
        var scale         = 1 - scaleProgress * (1 - targetScale);

        /* TranslateY */
        var translateY = 0;
        if (scrollY >= pinStart && scrollY <= pinEnd) {
          translateY = scrollY - cardTop + stackPosPx + ITEM_STACK_DIST * i;
        } else if (scrollY > pinEnd) {
          translateY = pinEnd - cardTop + stackPosPx + ITEM_STACK_DIST * i;
        }

        /* Round to reduce sub-pixel writes */
        var ty  = Math.round(translateY * 10) / 10;
        var sc  = Math.round(scale * 1000) / 1000;

        var last = lastTransforms.get(card);
        if (last && Math.abs(last.ty - ty) < 0.2 && Math.abs(last.sc - sc) < 0.001) return;

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
     Set margin-bottom on all but last card per column (ITEM_DISTANCE)
  ------------------------------------------------------------------ */
  function applyMargins() {
    cols.forEach(function (col) {
      var cards = getVisibleCards(col);
      cards.forEach(function (c, i) {
        c.style.marginBottom = i < cards.length - 1 ? ITEM_DISTANCE + 'px' : '';
        c.style.willChange   = 'transform';
        c.style.transformOrigin = 'top center';
        c.style.backfaceVisibility = 'hidden';
      });
    });
  }

  /* ------------------------------------------------------------------
     Resize + media change
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
    if (mobileQuery.matches) {
      cols.forEach(function (col) { getVisibleCards(col).forEach(clearInline); });
      section.querySelectorAll('.prog-stack-card').forEach(function (c) {
        c.classList.remove('prog-reveal', 'is-revealed');
        c.style.marginBottom = '';
        c.style.willChange = '';
        clearInline(c);
      });
      revealedCards.clear();
      lastTransforms.clear();
    } else {
      if (revealIO) revealIO.disconnect();
      revealedCards.clear();
      lastTransforms.clear();
      applyMargins();
      revealIO = setupReveal();
      scheduleStack();
    }
  }

  /* ------------------------------------------------------------------
     Boot
  ------------------------------------------------------------------ */
  applyMargins();

  window.addEventListener('scroll', scheduleStack, { passive: true });
  window.addEventListener('resize', onResize);

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', onMediaChange);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(onMediaChange);
  }

  requestAnimationFrame(applyStack);

})();
