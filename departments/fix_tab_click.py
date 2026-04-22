import glob, os

OLD = """      // Hook into tab clicks
      document.querySelectorAll('.dept-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          updateSidebar(tab.getAttribute('data-tab'));
          fireStreak();
        });
      });"""

NEW = """      // Hook into tab clicks
      document.querySelectorAll('.dept-tab').forEach(function (tab) {
        tab.addEventListener('click', function (e) {
          e.preventDefault();
          updateSidebar(tab.getAttribute('data-tab'));
          fireStreak();
        });
      });"""

files = glob.glob('homepage/departments/*.html')
skip = {'faculty-profile.html', 'ug.html', 'pg.html'}
files = [f for f in files if os.path.basename(f) not in skip and not os.path.basename(f).startswith('cse-')]

for filepath in files:
    dept = os.path.basename(filepath).replace('.html','')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if OLD in content:
        content = content.replace(OLD, NEW)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'FIXED {dept}')
    else:
        print(f'SKIP  {dept}')
