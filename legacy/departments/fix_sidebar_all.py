"""
Fix sidebar behaviour across all department pages.
Problems:
1. updateSidebar() doesn't switch panels
2. Sidebar item clicks don't scroll to sections
3. data-ds-label used instead of data-ds-target
"""
import glob, os, re

OLD_UPDATE = """      function updateSidebar(activeTab) {
        dsItems.forEach(function (item) {
          var show = item.getAttribute('data-ds-tab') === activeTab;
          item.style.display = show ? 'flex' : 'none';
          item.classList.remove('is-active');
        });
        // Activate first visible item
        var first = document.querySelector('.ds-item[data-ds-tab="' + activeTab + '"]');
        if (first) first.classList.add('is-active');
      }"""

NEW_UPDATE = """      function updateSidebar(activeTab) {
        dsItems.forEach(function (item) {
          var show = item.getAttribute('data-ds-tab') === activeTab;
          item.style.display = show ? 'flex' : 'none';
          item.classList.remove('is-active');
        });
        // Activate first visible item
        var first = document.querySelector('.ds-item[data-ds-tab="' + activeTab + '"]');
        if (first) first.classList.add('is-active');
        // Switch the active tab panel
        document.querySelectorAll('.dept-panel').forEach(function(p){ p.classList.remove('is-active'); });
        document.querySelectorAll('.dept-tab').forEach(function(t){ t.classList.remove('is-active'); });
        var panel = document.getElementById('panel-' + activeTab);
        if (panel) panel.classList.add('is-active');
        var tab = document.querySelector('.dept-tab[data-tab="' + activeTab + '"]');
        if (tab) tab.classList.add('is-active');
      }"""

OLD_CLICK = """      // Sidebar item click — mark active + fire streak
      dsItems.forEach(function (item) {
        item.addEventListener('click', function () {
          var siblings = document.querySelectorAll('.ds-item[data-ds-tab="' + item.getAttribute('data-ds-tab') + '"]');
          siblings.forEach(function (s) { s.classList.remove('is-active'); });
          item.classList.add('is-active');
          fireStreak();
        });
      });"""

NEW_CLICK = """      // Sidebar item click — switch tab, mark active, scroll to section, fire streak
      dsItems.forEach(function (item) {
        item.addEventListener('click', function () {
          var tab = item.getAttribute('data-ds-tab');
          var target = item.getAttribute('data-ds-target');
          updateSidebar(tab);
          var siblings = document.querySelectorAll('.ds-item[data-ds-tab="' + tab + '"]');
          siblings.forEach(function (s) { s.classList.remove('is-active'); });
          item.classList.add('is-active');
          fireStreak();
          if (target) {
            setTimeout(function () {
              var el = document.getElementById(target);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
          }
        });
      });"""

files = glob.glob('homepage/departments/*.html')
files = [f for f in files if os.path.basename(f) not in ('faculty-profile.html','ug.html','pg.html') and not os.path.basename(f).startswith('cse-')]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'dark-sidebar' not in content:
        print(f'SKIP {filepath} — no dark-sidebar')
        continue

    changed = False
    dept = os.path.basename(filepath).replace('.html','')

    # Fix updateSidebar
    if OLD_UPDATE in content:
        content = content.replace(OLD_UPDATE, NEW_UPDATE)
        changed = True
        print(f'{dept}: fixed updateSidebar')
    else:
        print(f'{dept}: updateSidebar already fixed or different format')

    # Fix click handler
    if OLD_CLICK in content:
        content = content.replace(OLD_CLICK, NEW_CLICK)
        changed = True
        print(f'{dept}: fixed click handler')
    else:
        print(f'{dept}: click handler already fixed or different format')

    # Fix data-ds-label -> data-ds-target by mapping known labels to IDs
    # For each dept, map label text to section IDs
    label_to_id = {
        'HOD Message':    'hod-msg',
        'Vision, Mission':'vm-section',
        'Teaching':       'teaching-method',
        'History':        'about-dept',
        'Labs':           'labs-section',
        'PEOs':           'peo-section',
        'Outcomes (POs)': 'po-section',
        'OBE':            'obe-section',
        'Handbook':       'handbook-section',
        'All Faculty':    'panel-faculty',
        'Syllabus PDFs':  'syll-pdfs',
        'Course Catalog': 'catalog-section',
        'Syllabus Explorer': 'syll-explorer',
        'Achievements':   'honour-section',
        'Placements':     'placement-section',
        'Honours':        'honour-section',
        'Publications':   'pub-section',
        'Internships':    'intern-section',
    }

    for label, target_id in label_to_id.items():
        old = f'data-ds-label="{label}"'
        new = f'data-ds-target="{target_id}"'
        if old in content:
            content = content.replace(old, new)
            changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'{dept}: SAVED')
    else:
        print(f'{dept}: no changes needed')

print('\nDone.')
