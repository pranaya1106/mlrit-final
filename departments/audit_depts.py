import glob, os, re
from collections import Counter

files = glob.glob('homepage/departments/*.html')
skip = {'faculty-profile.html', 'ug.html', 'pg.html'}
files = [f for f in files if os.path.basename(f) not in skip and not os.path.basename(f).startswith('cse-')]

for filepath in sorted(files):
    dept = os.path.basename(filepath).replace('.html','')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    title = re.search(r'<title>(.*?)</title>', content)
    hero = re.search(r'dept-hero__title[^>]*>(.*?)</div>', content, re.DOTALL)
    hod = re.search(r'hod-msg__name[^>]*>(.*?)</div>', content, re.DOTALL)
    vision = re.search(r'<h3>Vision</h3><p>(.*?)</p>', content, re.DOTALL)
    tabs = list(dict.fromkeys(re.findall(r'data-tab="([^"]+)"', content)))
    panels = re.findall(r'id="panel-([^"]+)"', content)
    sidebar = Counter(re.findall(r'data-ds-tab="([^"]+)"', content))

    print(f'--- {dept} ---')
    print(f'  Title:   {title.group(1) if title else "MISSING"}')
    print(f'  Hero:    {hero.group(1).strip()[:70] if hero else "MISSING"}')
    print(f'  HOD:     {hod.group(1).strip()[:60] if hod else "MISSING"}')
    print(f'  Vision:  {vision.group(1).strip()[:80] if vision else "MISSING"}')
    print(f'  Tabs:    {tabs}')
    print(f'  Panels:  {panels}')
    print(f'  Sidebar: {dict(sidebar)}')
    print()
