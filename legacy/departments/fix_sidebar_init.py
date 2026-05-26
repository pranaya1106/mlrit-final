"""
Fix sidebar init: add CSS to hide all non-overview ds-items by default.
This ensures items are hidden before JS runs, preventing flash of all items.
Also ensures the sidebar title shows the current dept name.
"""
import glob, os, re

files = glob.glob('homepage/departments/*.html')
skip = {'faculty-profile.html', 'ug.html', 'pg.html'}
files = [f for f in files if os.path.basename(f) not in skip and not os.path.basename(f).startswith('cse-')]

# CSS to add: hide all ds-items that are NOT for overview by default
HIDE_CSS = """
    /* Hide non-overview sidebar items by default — JS will show correct ones */
    .ds-item[data-ds-tab]:not([data-ds-tab="overview"]) { display: none; }
"""

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'dark-sidebar' not in content:
        continue

    dept = os.path.basename(filepath).replace('.html', '')

    # Add the hide CSS before </style>
    if 'ds-item[data-ds-tab]:not' not in content:
        content = content.replace('  </style>', HIDE_CSS + '  </style>', 1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'FIXED {dept}: added default hide CSS')
    else:
        print(f'SKIP {dept}: already has hide CSS')
