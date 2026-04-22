"""
Remove the duplicate switchTab IIFE from all dept pages.
The updateSidebar function now handles tab switching, so switchTab is redundant
and causes conflicts.
"""
import glob, os, re

files = glob.glob('homepage/departments/*.html')
skip = {'faculty-profile.html', 'ug.html', 'pg.html'}
files = [f for f in files if os.path.basename(f) not in skip and not os.path.basename(f).startswith('cse-')]

# Pattern for the old switchTab IIFE
SWITCHTAB_PATTERN = re.compile(
    r'\s*// Tab switching.*?\}\)\(\);',
    re.DOTALL
)

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'dark-sidebar' not in content:
        continue

    dept = os.path.basename(filepath).replace('.html', '')

    # Find and remove the switchTab IIFE (but NOT the dark sidebar IIFE)
    # The switchTab IIFE contains 'function switchTab'
    pattern = re.compile(
        r'    // Tab switching \+ quick sidebar\s*\(function \(\) \{.*?var hash.*?\}\)\(\);',
        re.DOTALL
    )

    match = pattern.search(content)
    if match:
        content = content[:match.start()] + content[match.end():]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'FIXED {dept}: removed duplicate switchTab IIFE')
    else:
        # Try alternate pattern
        pattern2 = re.compile(
            r'\s*// Tab switching.*?function switchTab.*?\}\)\(\);',
            re.DOTALL
        )
        match2 = pattern2.search(content)
        if match2:
            content = content[:match2.start()] + content[match2.end():]
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'FIXED {dept}: removed switchTab (alt pattern)')
        else:
            print(f'NO MATCH {dept}: switchTab IIFE not found (may already be removed)')
