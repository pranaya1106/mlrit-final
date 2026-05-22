/* ============================================================
   PROGRAMMES SECTION — tabs + scroll-stack
   Scoped: only touches `.prog-stack-section` and its children.
   ============================================================ */
(function () {
  'use strict';

  var section = document.querySelector('.prog-stack-section');
  if (!section) return;

  var tabs = section.querySelectorAll('.prog-stack-tab');
  var catalogue = section.querySelector('.prog-stack-catalogue');
  var cols = section.querySelectorAll('.prog-stack-col');
  var mobileQuery = window.matchMedia('(max-width: 900px)');

  function getCards() {
    return section.querySelectorAll('.prog-stack-card');
  }

  function clearInline(card) {
    card.style.transform = '';
    card.style.opacity = '';
    card.style.filter = '';
    card.style.zIndex = '';
  }

  function setLevel(level) {
    getCards().forEach(function (c) {
      c.hidden = (c.dataset.level !== level);
    });
    requestAnimationFrame(applyStack);
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (o) {
        o.classList.remove('is-active');
        o.setAttribute('aria-selected', 'false');
      });
      t.classList.add('is-active');
      t.setAttribute('aria-selected', 'true');
      setLevel(t.dataset.level);
      if (catalogue) {
        var y = catalogue.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Scroll stack ---------- */
  var ticking = false;

  function readVar(name, fallback) {
    var v = parseFloat(getComputedStyle(section).getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  }

  function applyStack() {
    ticking = false;

    if (mobileQuery.matches) {
      getCards().forEach(clearInline);
      return;
    }

    var stackTop = readVar('--prog-stack-top', 96);
    var stepPx = readVar('--prog-stack-step', 14);
    var scaleS = readVar('--prog-stack-scale', 0.045);

    cols.forEach(function (col) {
      var visible = Array.prototype.filter.call(
        col.querySelectorAll('.prog-stack-card'),
        function (c) { return !c.hidden; }
      );

      visible.forEach(function (card, i) {
        var next = visible[i + 1];
        var progress = 0;
        if (next) {
          var nr = next.getBoundingClientRect();
          var start = stackTop + 220;
          var end = stackTop;
          progress = Math.min(1, Math.max(0, (start - nr.top) / (start - end)));
        }
        var stackedBehind = visible.slice(i + 1).filter(function (c) {
          var cr = c.getBoundingClientRect();
          return cr.top <= stackTop + 1;
        }).length;

        var depth = stackedBehind;
        var scale = 1 - (depth + progress) * scaleS;
        var lift = -((depth + progress) * stepPx);

        card.style.transform = 'translateY(' + lift.toFixed(2) + 'px) scale(' + scale.toFixed(4) + ')';
        card.style.opacity = Math.max(0.55, 1 - (depth + progress) * 0.10).toFixed(3);
        card.style.zIndex = i;
        card.style.filter = depth > 0 ? 'blur(' + Math.min(2, depth * 0.4).toFixed(2) + 'px)' : '';
      });
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(applyStack);
    }
  }

  function onMediaChange() {
    if (mobileQuery.matches) {
      getCards().forEach(clearInline);
    } else {
      requestAnimationFrame(applyStack);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', onMediaChange);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(onMediaChange);
  }

  applyStack();
})();
