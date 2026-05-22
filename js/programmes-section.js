/* ============================================================
   PROGRAMMES SECTION — scroll-stack + reveal
   Handles: tab switching, scroll-stack stacking, and the
   initial scroll-reveal fade-up for each card.
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

  function getAllVisibleCards() {
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

  /* ------------------------------------------------------------------
     Initial scroll-reveal
     Cards start hidden (opacity 0, translateY 28px). Each card gets
     revealed exactly once via IntersectionObserver, then the stack
     engine takes over with inline styles.
  ------------------------------------------------------------------ */

  var revealedCards = new Set();

  function setupReveal() {
    var allCards = section.querySelectorAll('.prog-stack-card');

    /* Only activate reveal on desktop where sticky stacking also runs */
    if (mobileQuery.matches) return;

    /* Pre-hide all visible (non-hidden) cards */
    allCards.forEach(function (card) {
      if (!card.hidden) {
        card.classList.add('prog-reveal');
      }
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var card = entry.target;
        revealedCards.add(card);
        card.classList.add('is-revealed');
        io.unobserve(card);
        /* Once revealed, transition handled by CSS. Stack engine
           will overwrite inline styles after 600ms. */
        setTimeout(function () {
          /* Hand control to stack engine — clear CSS-class-driven opacity
             so the JS inline styles can take over cleanly */
          card.classList.remove('prog-reveal', 'is-revealed');
        }, 580);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -50px 0px'
    });

    allCards.forEach(function (card) {
      if (!card.hidden) io.observe(card);
    });

    return io;
  }

  var revealIO = setupReveal();

  /* ------------------------------------------------------------------
     Tab switching — fade cards out/in instead of instant display:none
  ------------------------------------------------------------------ */

  function setLevel(level) {
    var allCards = section.querySelectorAll('.prog-stack-card');

    allCards.forEach(function (c) {
      if (c.dataset.level !== level && !c.hidden) {
        c.classList.add('is-leaving');
      }
    });

    setTimeout(function () {
      allCards.forEach(function (c) {
        c.classList.remove('is-leaving', 'is-entering', 'prog-reveal', 'is-revealed');

        if (c.dataset.level !== level) {
          c.hidden = true;
          clearInline(c);
          revealedCards.delete(c);
        } else {
          if (c.hidden) {
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
              /* After entering transition, clear any inline transform
                 so the stack engine drives it without a stale baseline */
              c.style.transform = '';
            }, 260);
          }
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
     Scroll-stack engine
     Only applies to cards that have been revealed (revealedCards set).
  ------------------------------------------------------------------ */

  var ticking   = false;
  var stackTop  = 152;
  var stepPx    = 14;
  var scaleStep = 0.038;

  function refreshVars() {
    stackTop  = getCSSVar('--prog-stack-top',  152);
    stepPx    = getCSSVar('--prog-stack-step',  14);
    scaleStep = getCSSVar('--prog-stack-scale', 0.038);
  }

  function applyStack() {
    ticking = false;

    if (mobileQuery.matches) {
      cols.forEach(function (col) {
        getVisibleCards(col).forEach(clearInline);
      });
      return;
    }

    /* Batch-read all rects first, then write — avoids interleaved reflows */
    var colData = [];
    cols.forEach(function (col) {
      var visible = getVisibleCards(col).filter(function (c) {
        return revealedCards.has(c);
      });
      colData.push({
        cards: visible,
        rects: visible.map(function (c) { return c.getBoundingClientRect(); })
      });
    });

    colData.forEach(function (cd) {
      var cards = cd.cards;
      var rects = cd.rects;

      cards.forEach(function (card, i) {
        var nextRect = rects[i + 1];
        var progress = 0;

        if (nextRect) {
          var rangeStart = stackTop + 200;
          var rangeEnd   = stackTop;
          var raw = (rangeStart - nextRect.top) / (rangeStart - rangeEnd);
          raw = Math.min(1, Math.max(0, raw));
          progress = raw * raw * (3 - 2 * raw); /* smoothstep */
        }

        var depth = 0;
        for (var j = i + 1; j < cards.length; j++) {
          if (rects[j].top <= stackTop + 2) depth++;
        }

        var totalDepth = depth + progress;
        var scale   = Math.max(0.78, 1 - totalDepth * scaleStep);
        var liftY   = -(totalDepth * stepPx);
        var opacity = Math.max(0.55, 1 - totalDepth * 0.08);

        card.style.transform = 'translateZ(0) translateY(' + liftY.toFixed(2) + 'px) scale(' + scale.toFixed(4) + ')';
        card.style.opacity   = opacity.toFixed(3);
        card.style.zIndex    = String(i);
      });
    });
  }

  function scheduleStack() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(applyStack);
    }
  }

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
      /* Also clear reveal classes on all cards for clean mobile state */
      section.querySelectorAll('.prog-stack-card').forEach(function (c) {
        c.classList.remove('prog-reveal', 'is-revealed');
        clearInline(c);
      });
      revealedCards.clear();
    } else {
      if (revealIO) revealIO.disconnect();
      revealedCards.clear();
      revealIO = setupReveal();
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
    mobileQuery.addListener(onMediaChange);
  }

  requestAnimationFrame(function () {
    refreshVars();
    applyStack();
  });

})();
