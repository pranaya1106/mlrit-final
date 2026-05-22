/* ============================================================
   PROGRAMMES SECTION — tabs + scroll-stack
   Scoped: only touches `.prog-stack-section` and children.
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
     Helpers
  ------------------------------------------------------------------ */

  function getCSSVar(name, fallback) {
    var raw = getComputedStyle(section).getPropertyValue(name).trim();
    var val = parseFloat(raw);
    return isNaN(val) ? fallback : val;
  }

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
     Tab switching — fade cards out/in instead of instant display:none
     so there is never a sudden layout jump.
  ------------------------------------------------------------------ */

  function setLevel(level) {
    var allCards = section.querySelectorAll('.prog-stack-card');

    /* Step 1 — mark outgoing cards, they animate out via CSS class */
    allCards.forEach(function (c) {
      if (c.dataset.level !== level && !c.hidden) {
        c.classList.add('is-leaving');
      }
    });

    /* Step 2 — after the leave transition (180 ms) hide them and show incoming */
    setTimeout(function () {
      allCards.forEach(function (c) {
        c.classList.remove('is-leaving', 'is-entering');

        if (c.dataset.level !== level) {
          c.hidden = true;
          clearInline(c);
        } else {
          if (c.hidden) {
            /* Pre-set opacity/transform so it can animate IN */
            c.style.opacity   = '0';
            c.style.transform = 'translateZ(0) translateY(12px)';
            c.hidden = false;
            c.classList.add('is-entering');

            /* Let the browser paint the initial state then animate */
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                c.style.opacity   = '';
                c.style.transform = '';
              });
            });

            /* Clean up entering class once done */
            setTimeout(function () {
              c.classList.remove('is-entering');
            }, 320);
          }
        }
      });

      /* Recalculate stack after DOM update */
      requestAnimationFrame(applyStack);
    }, 190);
  }

  /* Tab click handler */
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var level = tab.dataset.level;

      /* No-op if already active */
      if (tab.classList.contains('is-active')) return;

      tabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      setLevel(level);

      /* Scroll to catalogue — use ScrollSmoother if present, else native */
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
     Scroll-stack engine
     Strategy: read card positions once per frame using a single
     IntersectionObserver-driven dirty flag, then only call
     getBoundingClientRect when something has actually changed.
  ------------------------------------------------------------------ */

  var ticking    = false;
  var stackTop   = 152;
  var stepPx     = 14;
  var scaleStep  = 0.038;

  /* Cache CSS vars once (they're constant at runtime, only change on resize) */
  function refreshVars() {
    stackTop  = getCSSVar('--prog-stack-top',   152);
    stepPx    = getCSSVar('--prog-stack-step',   14);
    scaleStep = getCSSVar('--prog-stack-scale',  0.038);
  }

  function applyStack() {
    ticking = false;

    /* Mobile: nothing to do — CSS handles everything */
    if (mobileQuery.matches) {
      cols.forEach(function (col) {
        getVisibleCards(col).forEach(clearInline);
      });
      return;
    }

    /* Read all card rects in one batch to avoid interleaved read/write */
    var colData = [];
    cols.forEach(function (col) {
      var visible = getVisibleCards(col);
      colData.push({
        cards: visible,
        rects: visible.map(function (c) { return c.getBoundingClientRect(); })
      });
    });

    /* Write transforms in a second batch — no forced reflow here */
    colData.forEach(function (cd) {
      var cards = cd.cards;
      var rects = cd.rects;

      cards.forEach(function (card, i) {
        var nextRect  = rects[i + 1];
        var progress  = 0;

        if (nextRect) {
          var rangeStart = stackTop + 200;
          var rangeEnd   = stackTop;
          var raw = (rangeStart - nextRect.top) / (rangeStart - rangeEnd);
          /* Smooth the progress with a cubic ease to prevent oscillation */
          raw = Math.min(1, Math.max(0, raw));
          progress = raw * raw * (3 - 2 * raw); /* smoothstep */
        }

        /* Count cards that are fully behind the stack threshold */
        var depth = 0;
        for (var j = i + 1; j < cards.length; j++) {
          if (rects[j].top <= stackTop + 2) depth++;
        }

        var totalDepth = depth + progress;
        var scale   = Math.max(0.78, 1 - totalDepth * scaleStep);
        var liftY   = -(totalDepth * stepPx);
        /* Opacity: front card = 1, each layer behind loses 0.08, min 0.55 */
        var opacity = Math.max(0.55, 1 - totalDepth * 0.08);

        card.style.transform = 'translateZ(0) translateY(' + liftY.toFixed(2) + 'px) scale(' + scale.toFixed(4) + ')';
        card.style.opacity   = opacity.toFixed(3);
        card.style.zIndex    = String(i);
        /* No filter:blur — it causes expensive repaints on every frame */
      });
    });
  }

  /* Throttle scroll to one rAF at a time */
  function scheduleStack() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(applyStack);
    }
  }

  /* On resize: refresh CSS vars then recalculate */
  var resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      refreshVars();
      scheduleStack();
    }, 80);
  }

  function onMediaChange() {
    refreshVars();
    if (mobileQuery.matches) {
      cols.forEach(function (col) {
        getVisibleCards(col).forEach(clearInline);
      });
    } else {
      scheduleStack();
    }
  }

  /* ------------------------------------------------------------------
     Boot
  ------------------------------------------------------------------ */
  refreshVars();

  window.addEventListener('scroll', scheduleStack, { passive: true });
  window.addEventListener('resize', onResize);

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', onMediaChange);
  } else if (mobileQuery.addListener) {
    /* Safari < 14 fallback */
    mobileQuery.addListener(onMediaChange);
  }

  /* Initial paint — run on next frame so the DOM is settled */
  requestAnimationFrame(function () {
    refreshVars();
    applyStack();
  });

})();
