"""
Fix quick-nav sidebar across all department pages:
1. Make .dark-sidebar position:fixed (never moves, always pinned left)
2. .dept-body uses margin-left: 220px so content clears the fixed sidebar
3. Mobile overrides hide sidebar and remove margin
4. Ensure orange is-active highlight is always visible
"""
import re, os, glob

DEPT_NAMES = ['cse.html','aiml.html','ece.html','it.html','eee.html',
              'mechanical.html','aeronautical.html','cse-cs.html',
              'cse-ds.html','csit.html','mba.html','freshman.html']
BASE = os.path.dirname(os.path.abspath(__file__))
DEPT_FILES = [os.path.join(BASE, n) for n in DEPT_NAMES if os.path.exists(os.path.join(BASE, n))]

SIDEBAR_CSS = (
    '.dark-sidebar {\n'
    '      position: fixed; left: 0; top: 166px; width: 220px;\n'
    '      height: calc(100vh - 166px); overflow-y: auto;\n'
    '      background: #FAFAF8; z-index: 35; padding-top: 24px;\n'
    '      border-right: 1px solid rgba(0,0,0,0.05);\n'
    '    }'
)

def fix_html(path):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    original = html

    # 1. Replace dark-sidebar block (match first occurrence only)
    html = re.sub(
        r'\.dark-sidebar\s*\{[^}]*\}',
        SIDEBAR_CSS,
        html,
        count=1
    )

    # 2. Replace .dept-body desktop rule — find the outermost (first) .dept-body {}
    #    that contains display:flex or display:grid (not inside @media)
    #    Use a targeted replacement for known patterns
    html = re.sub(
        r'\.dept-body\s*\{\s*display:\s*(?:flex|grid)[^}]*\}',
        '.dept-body { margin-left: 220px; }',
        html,
        count=1
    )

    # 3. In mobile @media block, ensure sidebar hidden and body margin reset
    #    Find @media (max-width: 768px) or (max-width: 900px) block
    def patch_mobile(m):
        block = m.group(0)
        # Fix sidebar display:none if not already there
        if '.dark-sidebar { display: none; }' not in block and '.dark-sidebar { display:none' not in block:
            block = block.replace('.dark-sidebar { display: none; }', '.dark-sidebar { display: none; }')
        # Fix dept-body mobile override — was display:block, should reset margin
        block = re.sub(
            r'\.dept-body\s*\{\s*display:\s*block[^}]*\}',
            '.dept-body { margin-left: 0; display: block; }',
            block
        )
        return block

    html = re.sub(
        r'@media\s*\(max-width:\s*(?:768|900)px\)\s*\{[^@]*\}',
        patch_mobile,
        html,
        count=1,
        flags=re.DOTALL
    )

    # 4. Ensure is-active label color is orange (strong)
    html = re.sub(
        r'(\.ds-item\.is-active\s+\.ds-item__label\s*\{[^}]*color:\s*)#E85D1F(\s*;)',
        r'\g<1>#E85D1F !important\g<2>',
        html
    )

    if html == original:
        print(f'  [skip] no changes needed: {os.path.basename(path)}')
        return

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'  [OK]   {os.path.basename(path)}')

print('Fixing sidebar on all dept pages...')
for p in DEPT_FILES:
    fix_html(p)
print('Done.')
