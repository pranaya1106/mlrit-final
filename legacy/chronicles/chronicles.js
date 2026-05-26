/* MLRIT Chronicles — interactivity
   - Sidebar category filter (active-state + grid filtering)
   - Bulletin tab highlight
   - Load-more stub
*/
(function () {

  /* ── Sidebar category filter ───────────────────────────── */
  var sideLinks = document.querySelectorAll('.ch-side__link[data-cat]');
  var cards = document.querySelectorAll('.ch-card[data-cat]');
  var grid = document.getElementById('chGrid');

  sideLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      sideLinks.forEach(function (l) { l.classList.remove('is-active'); });
      link.classList.add('is-active');

      var cat = link.getAttribute('data-cat');
      var visible = 0;
      cards.forEach(function (card) {
        var match = (cat === 'all') || (card.getAttribute('data-cat') === cat);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      // Scroll into view so user sees the filtered grid on small screens
      if (grid && window.innerWidth <= 980) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Bulletin tabs (visual highlight) ──────────────────── */
  var btabs = document.querySelectorAll('.ch-bulletins__tab');
  btabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      btabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
    });
  });

  /* ── Load more stub ─────────────────────────────────────── */
  var more = document.getElementById('chLoadMore');
  if (more) {
    more.addEventListener('click', function () {
      more.textContent = 'You’re all caught up ✓';
      more.disabled = true;
      more.style.opacity = '0.6';
      more.style.cursor = 'default';
    });
  }

})();
