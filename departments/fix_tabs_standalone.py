"""
Add a standalone tab switcher at the TOP of the script block,
completely independent of updateSidebar, to ensure tabs always work.
"""
import glob, os

STANDALONE_SWITCHER = """    // ── STANDALONE TAB SWITCHER (runs first, always works) ──
    (function () {
      var tabs = document.querySelectorAll('.dept-tab');
      var panels = document.querySelectorAll('.dept-panel');
      if (!tabs.length || !panels.length) return;
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function (e) {
          e.preventDefault();
          var id = tab.getAttribute('data-tab');
          tabs.forEach(function (t) { t.classList.remove('is-active'); });
          panels.forEach(function (p) { p.classList.remove('is-active'); });
          tab.classList.add('is-active');
          var panel = document.getElementById('panel-' + id);
          if (panel) panel.classList.add('is-active');
        });
      });
    })();

"""

files = glob.glob('homepage/departments/*.html')
skip = {'faculty-profile.html', 'ug.html', 'pg.html'}
files = [f for f in files if os.path.basename(f) not in skip and not os.path.basename(f).startswith('cse-')]

for filepath in sorted(files):
    dept = os.path.basename(filepath).replace('.html', '')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'STANDALONE TAB SWITCHER' in content:
        print(f'SKIP  {dept}: already has standalone switcher')
        continue

    # Insert right after <script>
    if '<script>' in content:
        content = content.replace('<script>\n', '<script>\n' + STANDALONE_SWITCHER, 1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'FIXED {dept}')
    else:
        print(f'MISS  {dept}: no <script> tag found')
