"""
Replace the sidebar IIFE in all department pages with the working CSE version.
"""
import glob, os

# The exact working sidebar IIFE from CSE (everything inside the IIFE)
WORKING_IIFE = """    // Dark sidebar — show items for active tab
    (function () {
      var dsItems = document.querySelectorAll('.ds-item');
      var streak = document.getElementById('navStreak');

      function fireStreak() {
        if (!streak) return;
        streak.classList.remove('is-firing');
        void streak.offsetWidth;
        streak.classList.add('is-firing');
        setTimeout(function () { streak.classList.remove('is-firing'); }, 600);
      }

      function updateSidebar(activeTab) {
        dsItems.forEach(function (item) {
          var show = item.getAttribute('data-ds-tab') === activeTab;
          item.style.display = show ? 'flex' : 'none';
          item.classList.remove('is-active');
        });
        // Activate first visible item
        var first = document.querySelector('.ds-item[data-ds-tab="' + activeTab + '"]');
        if (first) first.classList.add('is-active');
        // Also switch the active tab panel
        document.querySelectorAll('.dept-panel').forEach(function(p){ p.classList.remove('is-active'); });
        document.querySelectorAll('.dept-tab').forEach(function(t){ t.classList.remove('is-active'); });
        var panel = document.getElementById('panel-' + activeTab);
        if (panel) panel.classList.add('is-active');
        var tab = document.querySelector('.dept-tab[data-tab="' + activeTab + '"]');
        if (tab) tab.classList.add('is-active');
      }

      // Hook into tab clicks
      document.querySelectorAll('.dept-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          updateSidebar(tab.getAttribute('data-tab'));
          fireStreak();
        });
      });

      // Hook into qbar clicks
      document.querySelectorAll('.qbar__btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          updateSidebar(btn.getAttribute('data-qtab'));
          fireStreak();
        });
      });

      // Sidebar item click — mark active + fire streak + scroll to section
      dsItems.forEach(function (item) {
        item.addEventListener('click', function () {
          var tab = item.getAttribute('data-ds-tab');
          var target = item.getAttribute('data-ds-target');
          // Switch to the right tab first
          updateSidebar(tab);
          // Mark this item active
          var siblings = document.querySelectorAll('.ds-item[data-ds-tab="' + tab + '"]');
          siblings.forEach(function (s) { s.classList.remove('is-active'); });
          item.classList.add('is-active');
          fireStreak();
          // Scroll to target after a brief delay to let panel show
          if (target) {
            setTimeout(function () {
              var el = document.getElementById(target);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
          }
        });
      });

      // Initialize
      updateSidebar('overview');
    })();"""

import re

files = glob.glob('homepage/departments/*.html')
skip = {'cse.html', 'faculty-profile.html', 'ug.html', 'pg.html'}
files = [f for f in files if os.path.basename(f) not in skip and not os.path.basename(f).startswith('cse-')]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'dark-sidebar' not in content:
        print(f'SKIP {os.path.basename(filepath)} — no dark-sidebar')
        continue

    # Find and replace the entire sidebar IIFE block
    # Pattern: from "// Dark sidebar" to the closing })();
    pattern = r'    // Dark sidebar.*?    \}\)\(\);'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        content = content[:match.start()] + WORKING_IIFE + content[match.end():]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'FIXED: {os.path.basename(filepath)}')
    else:
        print(f'NO MATCH: {os.path.basename(filepath)} — sidebar IIFE not found')
