/*
  site-navbar.js — fetches the shared navbar partial and injects it
  into the page. Every page declares its own relative path back to the
  Website/ root via data-base on the script tag (e.g. "../" or "../../").

  Usage in each HTML page:
    <div id="site-navbar"></div>
    <script src="../js/site-navbar.js" data-base="../"></script>

  Note: requires the site to be served over HTTP (e.g. VS Code Live
  Server). file:// URLs block fetch() in most browsers.
*/
(function () {
  var script = document.currentScript;
  var base = (script && script.getAttribute('data-base')) || './';
  if (base && base.slice(-1) !== '/') base += '/';

  function initChroniclesReveal() {
    var item = document.querySelector('.main-nav__item--chronicles');
    if (!item) return;

    var revealEls = item.querySelectorAll('[data-reveal]');

    function triggerReveal() {
      revealEls.forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add('chron-ep--visible');
        }, i * 60);
      });
    }

    function resetReveal() {
      revealEls.forEach(function (el) {
        el.classList.remove('chron-ep--visible');
      });
    }

    item.addEventListener('mouseenter', triggerReveal);
    item.addEventListener('mouseleave', resetReveal);
    item.addEventListener('focusin',    triggerReveal);
    item.addEventListener('focusout',   resetReveal);
  }

  function inject(html) {
    var mount = document.getElementById('site-navbar');
    if (!mount) {
      console.warn('[site-navbar] No <div id="site-navbar"> mount point found.');
      return;
    }
    mount.outerHTML = html.replace(/\{\{base\}\}/g, base);
    initChroniclesReveal();
  }

  fetch(base + 'partials/navbar.html', { cache: 'no-cache' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(inject)
    .catch(function (err) {
      console.error('[site-navbar] Failed to load partial:', err);
    });
})();
