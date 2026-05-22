/* ============================================================
   PROGRAMMES SECTION — ScrollStack (ReactBits translate3d model)
   GSAP ScrollSmoother moves #smooth-content via transform, which
   breaks position:sticky. Both desktop and mobile use translate3d
   driven by window.scrollY. No CSS transitions on wrapper = no jitter.
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
     Config — tuned per breakpoint
  ------------------------------------------------------------------ */
  var DESKTOP = {
    itemDist:   100,   /* margin-bottom between cards */
    stackDist:  30,    /* px offset per card in pin zone */
    stackPct:   0.18,  /* vh fraction for stack trigger */
    scaleEnd:   0.08,  /* vh fraction where scale completes */
    baseScale:  0.85,
    scaleStep:  0.03
  };

  var MOBILE = {
    itemDist:   60,
    stackDist:  20,
    stackPct:   0.12,
    scaleEnd:   0.10,
    baseScale:  0.85,
    scaleStep:  0.03
  };

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  function cfg() { return mobileQuery.matches ? MOBILE : DESKTOP; }

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

  function getDocTop(el) {
    var top = 0;
    while (el) { top += el.offsetTop; el = el.offsetParent; }
    return top;
  }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

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
    var c    = cfg();
    var isMob = mobileQuery.matches;

    if (isMob) {
      /* Mobile: flat single-col list */
      var cards = getAllVisible();
      cards.forEach(function (card, i) {
        card.style.marginBottom      = i < cards.length - 1 ? c.itemDist + 'px' : '';
        card.style.willChange        = 'transform';
        card.style.transformOrigin   = 'top center';
        card.style.backfaceVisibility = 'hidden';
        card.style.position          = 'relative';
        card.style.top               = '';
      });
    } else {
      /* Desktop: per-column */
      cols.forEach(function (col) {
        var cards = getVisibleCards(col);
        cards.forEach(function (card, i) {
          card.style.marginBottom      = i < cards.length - 1 ? c.itemDist + 'px' : '';
          card.style.willChange        = 'transform';
          card.style.transformOrigin   = 'top center';
          card.style.backfaceVisibility = 'hidden';
          card.style.position          = 'relative';
          card.style.top               = '';
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
     Stack engine — translate3d for both desktop and mobile.

     For each card[i] in a group:
       triggerStart = cardDocTop - stackPosPx - stackDist * i
       while scrollY in [triggerStart, pinEnd]:
         translateY = scrollY - cardDocTop + stackPosPx + stackDist * i
       scale compresses 1 → baseScale+i*scaleStep as card enters zone.
  ------------------------------------------------------------------ */
  var ticking      = false;
  var lastTransforms = new Map();

  function applyStack() {
    ticking = false;

    var scrollY    = window.scrollY;
    var containerH = window.innerHeight;
    var c          = cfg();
    var isMob      = mobileQuery.matches;
    var stackPosPx = containerH * c.stackPct;
    var scaleEndPx = containerH * c.scaleEnd;

    var endEl  = section.querySelector('.prog-stack-end');
    var endTop = endEl ? getDocTop(endEl) : 0;
    var pinEnd = endTop - containerH * 0.4;

    /* Groups: mobile = one flat list, desktop = per column */
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

      /* Batch read doc offsets once */
      var tops = cards.map(getDocTop);

      cards.forEach(function (card, i) {
        var cardTop      = tops[i];
        var triggerStart = cardTop - stackPosPx - c.stackDist * i;
        var triggerEnd   = cardTop - scaleEndPx;

        /* Scale: smoothly compresses as card enters the stack zone */
        var scaleProgress = clamp01(
          (scrollY - triggerStart) / Math.max(1, triggerEnd - triggerStart)
        );
        var targetScale = c.baseScale + i * c.scaleStep;
        var scale       = 1 - scaleProgress * (1 - targetScale);

        /* Pin: card translates to appear stuck while next cards scroll up */
        var translateY = 0;
        if (scrollY >= triggerStart && scrollY <= pinEnd) {
          translateY = scrollY - cardTop + stackPosPx + c.stackDist * i;
        } else if (scrollY > pinEnd) {
          translateY = pinEnd - cardTop + stackPosPx + c.stackDist * i;
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
    revealedCards.clear();
    lastTransforms.clear();
    getAllVisible().forEach(clearInline);
    initAll();
    seedAll();
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
