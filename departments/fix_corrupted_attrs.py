"""
Remove corrupted data-ds-tab attributes that contain JS template strings.
These appear as literal: data-ds-tab="' + activeTab + '" and data-ds-tab="' + tab + '"
"""
import glob, os, re

files = glob.glob('homepage/departments/*.html')
skip = {'faculty-profile.html', 'ug.html', 'pg.html'}
files = [f for f in files if os.path.basename(f) not in skip and not os.path.basename(f).startswith('cse-')]

for filepath in sorted(files):
    dept = os.path.basename(filepath).replace('.html','')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Remove any ds-item elements with corrupted data-ds-tab values
    # Pattern: <a class="ds-item" data-ds-tab="' + activeTab + '" ...>...</a>
    content = re.sub(
        r'<a class="ds-item" data-ds-tab="[^"]*\+[^"]*"[^>]*>.*?</a>\s*',
        '',
        content,
        flags=re.DOTALL
    )

    # Also remove any stray dept-tab elements with corrupted data-tab
    content = re.sub(
        r'<a class="dept-tab[^"]*" data-tab="[^"]*\+[^"]*"[^>]*>.*?</a>\s*',
        '',
        content,
        flags=re.DOTALL
    )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'FIXED {dept}: removed corrupted attributes')
    else:
        print(f'OK    {dept}: no corrupted attributes found')
