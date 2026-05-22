/* ============================================================
   PROGRAMMES SECTION — ScrollStack (ReactBits translate3d model)

   GSAP ScrollSmoother moves #smooth-content via CSS transform, so
   window.scrollY != visual scroll position during the smoother's
   inertia frames. Fix: read ScrollSmoother.get().scrollTop() when
   available — this is the interpolated visual position that matches
   GSAP's transform exactly, eliminating per-frame position drift.

   Card positions use offsetTop traversal (stops at smooth-content,
   which has no offsetParent — so the full chain sums correctly
   within the smooth-content coordinate space). Combined with
   smoothScrollY this gives stable, jitter-free stacking.
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
  var DESKTOP = {
    itemDist:  100,
    stackDist:  30,
    stackPct:  0.18,
    scaleEnd:  0.08,
    baseScale: 0.85,
    scaleStep: 0.03
  };

  var MOBILE = {
    itemDist:  60,
    stackDist:  0,
    stackPct:  0.12,
    scaleEnd:  0.10,
    baseScale: 1.0,
    scaleStep: 0.0
  };

  function cfg() { return mobileQuery.matches ? MOBILE : DESKTOP; }

  /* ------------------------------------------------------------------
     Scroll position — use ScrollSmoother's interpolated value when
     available so our positions match GSAP's actual transform exactly.
  ------------------------------------------------------------------ */
  function getScrollY() {
    if (window.ScrollSmoother && ScrollSmoother.get) {
      var sm = ScrollSmoother.get();
      if (sm) return sm.scrollTop();
    }
    return window.scrollY;
  }

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
    card.style.transform    = '';
    card.style.opacity      = '';
    card.style.zIndex       = '';
    card.style.marginBottom = '';
  }

  /* offsetTop sum within #smooth-content — stable layout position,
     unaffected by GSAP's transform or the card's own transform. */
  function getDocTop(el) {
    var top = 0;
    while (el) { top += el.offsetTop; el = el.offsetParent; }
    return top;
  }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  /* ------------------------------------------------------------------
     Offset cache — rebuilt at boot, tab-switch, resize, breakpoint.
     Maps card → offsetTop (layout px, never changes during scroll).
  ------------------------------------------------------------------ */
  var offsetCache = new Map();
  var endOffset   = 0;

  function buildOffsetCache() {
    offsetCache.clear();
    getAllVisible().forEach(function (card) {
      /* Temporarily zero the card's own transform so offsetTop
         reflects layout position, not visual position. */
      var prev = card.style.transform;
      card.style.transform = '';
      offsetCache.set(card, getDocTop(card));
      card.style.transform = prev;
    });
    var endEl = section.querySelector('.prog-stack-end');
    if (endEl) {
      endOffset = getDocTop(endEl);
    }
  }

  /* ------------------------------------------------------------------
     All cards eligible immediately — no IO gate
  ------------------------------------------------------------------ */
  var revealedCards = new Set();

  function seedAll() {
    getAllVisible().forEach(function (card) {
      revealedCards.add(card);
      card.classList.remove('prog-reveal', 'is-revealed');
    });
  }

  /* ------------------------------------------------------------------
     Init — set margins + GPU hints
  ------------------------------------------------------------------ */
  function initAll() {
    var c     = cfg();
    var isMob = mobileQuery.matches;

    if (isMob) {
      var cards = getAllVisible();
      cards.forEach(function (card, i) {
        card.style.marginBottom       = i < cards.length - 1 ? c.itemDist + 'px' : '';
        card.style.willChange         = 'transform';
        card.style.transformOrigin    = 'top center';
        card.style.backfaceVisibility = 'hidden';
        card.style.position           = 'relative';
        card.style.top                = '';
      });
    } else {
      cols.forEach(function (col) {
        var cards = getVisibleCards(col);
        cards.forEach(function (card, i) {
          card.style.marginBottom       = i < cards.length - 1 ? c.itemDist + 'px' : '';
          card.style.willChange         = 'transform';
          card.style.transformOrigin    = 'top center';
          card.style.backfaceVisibility = 'hidden';
          card.style.position           = 'relative';
          card.style.top                = '';
        });
      });
    }
  }

  /* ------------------------------------------------------------------
     Boot
  ------------------------------------------------------------------ */
  function boot() {
    initAll();
    seedAll();
    buildOffsetCache();
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
      buildOffsetCache();
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
     Stack engine

     scrollY    = ScrollSmoother.scrollTop() — matches GSAP's transform
     cardDocTop = offsetCache.get(card)      — stable layout position
     Both are in the same coordinate space, so the math is exact.

     triggerStart = cardDocTop - stackPosPx - stackDist * i
     while scrollY in [triggerStart, pinEnd]:
       translateY = scrollY - cardDocTop + stackPosPx + stackDist * i
  ------------------------------------------------------------------ */
  var ticking        = false;
  var lastTransforms = new Map();

  function applyStack() {
    ticking = false;

    var scrollY    = getScrollY();
    var containerH = window.innerHeight;
    var c          = cfg();
    var stackPosPx = containerH * c.stackPct;
    var scaleEndPx = containerH * c.scaleEnd;
    var pinEnd     = endOffset - containerH * 0.4;

    var isMob  = mobileQuery.matches;
    var groups;
    if (isMob) {
      groups = [ getAllVisible().filter(function (card) {
        return revealedCards.has(card);
      }) ];
    } else {
      groups = Array.prototype.map.call(cols, function (col) {
        return getVisibleCards(col).filter(function (card) {
          return revealedCards.has(card);
        });
      });
    }

    groups.forEach(function (cards) {
      if (!cards.length) return;

      cards.forEach(function (card, i) {
        var cardTop = offsetCache.get(card);
        if (cardTop === undefined) return;

        var triggerStart  = cardTop - stackPosPx - c.stackDist * i;
        var triggerEnd    = cardTop - scaleEndPx;

        var scaleProgress = clamp01(
          (scrollY - triggerStart) / Math.max(1, triggerEnd - triggerStart)
        );
        var targetScale   = c.baseScale + i * c.scaleStep;
        var scale         = 1 - scaleProgress * (1 - targetScale);

        var translateY = 0;
        if (scrollY >= triggerStart && scrollY <= pinEnd) {
          translateY = scrollY - cardTop + stackPosPx + c.stackDist * i;
        } else if (scrollY > pinEnd) {
          translateY = pinEnd - cardTop + stackPosPx + c.stackDist * i;
        }

        var ty   = Math.round(translateY * 10) / 10;
        var sc   = Math.round(scale * 1000) / 1000;

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
      buildOffsetCache();
      lastTransforms.clear();
      scheduleStack();
    }, 80);
  }

  function onMediaChange() {
    revealedCards.clear();
    lastTransforms.clear();
    getAllVisible().forEach(clearInline);
    initAll();
    seedAll();
    buildOffsetCache();
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
