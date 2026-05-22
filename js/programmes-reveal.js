/* ============================================================
   PROGRAMMES SECTION — scroll-reveal tile animations
   Adds smooth fade + upward motion as cards enter viewport.
   Uses IntersectionObserver for performance.
   ============================================================ */
(function () {
  'use strict';

  var section = document.querySelector('.prog-stack-section');
  if (!section) return;

  var cards = section.querySelectorAll('.prog-stack-card');
  if (!cards.length) return;

  /* Mark all cards as reveal-enabled and initially hidden */
  cards.forEach(function (card) {
    card.classList.add('prog-reveal');
  });

  /* Intersection observer triggers reveal as cards enter viewport */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  cards.forEach(function (card) {
    revealObserver.observe(card);
  });

})();
