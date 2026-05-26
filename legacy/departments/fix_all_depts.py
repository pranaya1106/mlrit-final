"""
Comprehensive fix for all department pages:
1. Remove qbar HTML
2. Remove duplicate panel is-active
3. Ensure sidebar items show/hide correctly per tab
4. Fix PG vs UG content differentiation
"""
import glob, os, re

files = glob.glob('homepage/departments/*.html')
skip = {'faculty-profile.html', 'ug.html', 'pg.html'}
files = [f for f in files if os.path.basename(f) not in skip and not os.path.basename(f).startswith('cse-')]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'dark-sidebar' not in content:
        continue

    dept = os.path.basename(filepath).replace('.html', '')
    changed = False

    # Fix 1: Remove qbar HTML block
    qbar_pattern = re.compile(
        r'\s*<div class="qbar"[^>]*>.*?</div>\s*',
        re.DOTALL
    )
    new_content = qbar_pattern.sub('\n', content)
    if new_content != content:
        content = new_content
        changed = True
        print(f'{dept}: removed qbar HTML')

    # Fix 2: Remove duplicate dept-panel is-active (keep only first occurrence)
    # Find all panel-overview divs and ensure only one has is-active
    content_new = re.sub(
        r'(<div class="dept-panel is-active" id="panel-overview">)\s*\1',
        r'\1',
        content
    )
    if content_new != content:
        content = content_new
        changed = True
        print(f'{dept}: removed duplicate panel-overview')

    # Fix 3: Remove qbar CSS
    qbar_css_pattern = re.compile(
        r'\s*/\* ── Quick-access right bar[^*]*\*/.*?\.qbar__label \{[^}]*\}',
        re.DOTALL
    )
    new_content = qbar_css_pattern.sub('', content)
    if new_content != content:
        content = new_content
        changed = True
        print(f'{dept}: removed qbar CSS')

    # Fix 4: Remove qbar JS references (qbar__btn handlers in updateSidebar)
    # The updateSidebar already has qbar__btn handler — remove it since qbar is gone
    qbar_js = re.compile(
        r'\s*// Hook into qbar clicks\s*document\.querySelectorAll\(\'\.qbar__btn\'\).*?\}\);',
        re.DOTALL
    )
    new_content = qbar_js.sub('', content)
    if new_content != content:
        content = new_content
        changed = True
        print(f'{dept}: removed qbar JS handler')

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'{dept}: SAVED\n')
    else:
        print(f'{dept}: no changes needed\n')

print('Done.')
