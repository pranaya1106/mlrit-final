/*
  mobile-nav.js — Shared mobile hamburger drawer for every page that
  loads the navbar partial. Adds a hamburger button to the masthead
  on mobile (≤768px) and builds a slide-down accordion drawer with
  links pulled from partials/navbar.html.

  This script is safe to include on dept pages that strip the green
  main-nav via `data-no-mainnav` — it fetches the full partial on its
  own to populate the drawer. Desktop is untouched.
*/
(function () {
  'use strict';

  var MQ = window.matchMedia('(max-width: 768px)');
  if (!MQ.matches) return;

  /* Locate the partial: every page that uses site-navbar.js sets a
     data-base attribute on that script tag with the relative path back
     to the project root (e.g. "./", "../", "../../"). Reuse it. */
  function findBase() {
    var s = document.querySelector('script[data-base][src*="site-navbar.js"]');
    var base = s ? s.getAttribute('data-base') : './';
    if (!base) base = './';
    if (base.slice(-1) !== '/') base += '/';
    return base;
  }

  var BASE = findBase();
  var menuHtmlCache = null;

  /* Poll for the masthead — the partial is fetched async by
     site-navbar.js, so it may not be in the DOM yet. */
  var hamburger = null;
  var siteHeader = null;
  var drawer = null;
  var initialized = false;

  function tryInit() {
    if (initialized) return true;
    siteHeader = document.querySelector('.site-header');
    var mastInner = document.querySelector('.masthead__inner, .masthead .container');
    if (!siteHeader || !mastInner) return false;
    /* Don't double-mount if a page already injected its own hamburger */
    if (mastInner.querySelector('.nav-hamburger')) {
      initialized = true;
      return true;
    }
    initialized = true;
    mount(mastInner);
    return true;
  }

  if (!tryInit()) {
    var tries = 0;
    var poller = setInterval(function () {
      tries++;
      if (tryInit() || tries > 80) clearInterval(poller);
    }, 100);
  }

  function mount(mastInner) {
    /* ── Hamburger button ── */
    hamburger = document.createElement('button');
    hamburger.className = 'nav-hamburger';
    hamburger.setAttribute('aria-label', 'Toggle navigation');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML =
      '<span class="nav-hamburger__bar"></span>' +
      '<span class="nav-hamburger__bar"></span>' +
      '<span class="nav-hamburger__bar"></span>';
    mastInner.appendChild(hamburger);

    /* ── Drawer overlay ── */
    drawer = document.createElement('div');
    drawer.id = 'mobileNavDrawer';
    Object.assign(drawer.style, {
      position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
      zIndex: '998',
      display: 'none', flexDirection: 'column',
      background: '#1a5c1e', overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    });
    document.body.appendChild(drawer);

    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (drawer.style.display === 'flex') {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) closeDrawer();
    });

    window.addEventListener('resize', function () {
      if (!MQ.matches) closeDrawer();
    });
  }

  function openDrawer() {
    ensureMenu(function () {
      var hh = siteHeader ? siteHeader.offsetHeight : 56;
      drawer.style.top = hh + 'px';
      drawer.style.display = 'flex';
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.style.display = 'none';
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* Build menu from the navbar partial. If the page injected the full
     navbar (with main-nav), read items directly from the DOM. Otherwise
     fetch the partial and parse menu items from the markup. */
  function ensureMenu(cb) {
    if (drawer.dataset.built === '1') return cb();

    var navList = document.querySelector('.main-nav__list');
    if (navList) {
      buildFromDom(navList);
      drawer.dataset.built = '1';
      return cb();
    }

    if (menuHtmlCache) {
      buildFromHtml(menuHtmlCache);
      drawer.dataset.built = '1';
      return cb();
    }

    fetch(BASE + 'partials/navbar.html', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (html) {
        if (!html) return;
        var resolved = html.replace(/\{\{base\}\}/g, BASE);
        menuHtmlCache = resolved;
        buildFromHtml(resolved);
        drawer.dataset.built = '1';
      })
      .catch(function () {})
      .then(cb);
  }

  function buildFromHtml(html) {
    var tpl = document.createElement('div');
    tpl.innerHTML = html;
    var list = tpl.querySelector('.main-nav__list');
    if (list) buildFromDom(list);
  }

  function buildFromDom(navList) {
    drawer.innerHTML = '';
    var allPanels = [];

    var originalItems = Array.from(navList.querySelectorAll(':scope > .main-nav__item'));

    originalItems.forEach(function (origItem) {
      /* Skip hidden helper items (e.g. support, has [hidden] attr) */
      if (origItem.hasAttribute('hidden')) return;

      var wrapper = document.createElement('div');
      wrapper.style.cssText = 'border-bottom:1px solid rgba(255,255,255,0.1);';

      var row = document.createElement('div');
      row.style.cssText = [
        'display:flex', 'align-items:center', 'justify-content:space-between',
        'padding:0.9rem 1.25rem', 'cursor:pointer', 'user-select:none'
      ].join(';');

      var origLink = origItem.querySelector(':scope > .main-nav__link');
      var labelText = origLink && origLink.childNodes[0]
        ? origLink.childNodes[0].textContent.trim()
        : (origLink ? origLink.textContent.trim() : '');

      var label = document.createElement('span');
      label.textContent = labelText;
      label.style.cssText = 'color:#fff;font-size:1rem;font-weight:600;font-family:Poppins,sans-serif;';

      var origDrop = origItem.querySelector(':scope > .dropdown, :scope > .support-panel');

      if (origDrop) {
        var arrow = document.createElement('span');
        arrow.textContent = '›';
        arrow.style.cssText = 'color:rgba(255,255,255,0.6);font-size:1.4rem;line-height:1;transition:transform 0.25s;display:inline-block;';

        row.appendChild(label);
        row.appendChild(arrow);
        wrapper.appendChild(row);

        var panel = document.createElement('div');
        panel.style.cssText = [
          'display:flex', 'flex-direction:column',
          'background:rgba(255,255,255,0.12)',
          'padding:0 1.25rem',
          'max-height:0',
          'overflow:hidden',
          'opacity:0',
          'transition:max-height 0.35s ease, opacity 0.3s ease, padding 0.3s ease'
        ].join(';');

        var cols = Array.from(origDrop.querySelectorAll('.dropdown__col'));
        if (cols.length === 0) {
          /* Fallback: collect any direct anchors under this dropdown */
          var anchors = Array.from(origDrop.querySelectorAll('a'));
          anchors.forEach(function (a) { appendLink(panel, a); });
        } else {
          cols.forEach(function (col) {
            var heading = col.querySelector('h4');
            if (heading) {
              var h = document.createElement('div');
              h.textContent = heading.textContent.trim();
              h.style.cssText = [
                'font-size:0.62rem', 'font-weight:700',
                'letter-spacing:0.12em', 'text-transform:uppercase',
                'color:rgba(255,255,255,0.5)',
                'margin:0.75rem 0 0.4rem',
                'padding-bottom:0.3rem',
                'border-bottom:1px solid rgba(255,255,255,0.12)'
              ].join(';');
              panel.appendChild(h);
            }
            var links = Array.from(col.querySelectorAll('a'));
            links.forEach(function (a) { appendLink(panel, a); });
          });
        }

        wrapper.appendChild(panel);

        allPanels.push({ panel: panel, arrow: arrow, row: row, isOpen: false });
        var thisEntry = allPanels[allPanels.length - 1];

        row.addEventListener('click', function () {
          var opening = !thisEntry.isOpen;

          allPanels.forEach(function (entry) {
            if (entry !== thisEntry && entry.isOpen) {
              entry.isOpen = false;
              entry.panel.style.maxHeight = '0';
              entry.panel.style.opacity = '0';
              entry.panel.style.padding = '0 1.25rem';
              entry.arrow.style.transform = 'rotate(0deg)';
              entry.row.style.background = '';
            }
          });

          thisEntry.isOpen = opening;
          if (opening) {
            panel.style.maxHeight = panel.scrollHeight + 200 + 'px';
            panel.style.opacity = '1';
            panel.style.padding = '0.25rem 1.25rem 1rem';
            arrow.style.transform = 'rotate(90deg)';
            row.style.background = 'rgba(255,255,255,0.08)';
          } else {
            panel.style.maxHeight = '0';
            panel.style.opacity = '0';
            panel.style.padding = '0 1.25rem';
            arrow.style.transform = 'rotate(0deg)';
            row.style.background = '';
          }
        });

      } else {
        var href = origLink ? origLink.getAttribute('href') : '#';
        var directLink = document.createElement('a');
        directLink.href = href || '#';
        directLink.style.cssText = [
          'display:flex', 'align-items:center', 'justify-content:space-between',
          'padding:0.9rem 1.25rem', 'color:#fff',
          'font-size:1rem', 'font-weight:600',
          'font-family:Poppins,sans-serif',
          'text-decoration:none', 'width:100%'
        ].join(';');
        directLink.textContent = labelText;
        wrapper.appendChild(directLink);
      }

      drawer.appendChild(wrapper);
    });
  }

  function appendLink(panel, sourceAnchor) {
    var item = document.createElement('a');
    item.href = sourceAnchor.getAttribute('href') || '#';
    item.textContent = sourceAnchor.textContent.trim();
    item.style.cssText = [
      'display:block', 'padding:0.45rem 0',
      'color:rgba(255,255,255,0.85)',
      'font-size:0.88rem',
      'font-family:Poppins,sans-serif',
      'text-decoration:none',
      'border-bottom:1px solid rgba(255,255,255,0.08)'
    ].join(';');
    panel.appendChild(item);
  }
})();
