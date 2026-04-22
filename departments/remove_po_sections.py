#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Remove repeated PO/PSO sections from all dept pages and fix sidebar nav links."""
import re, os

dept_files = [
    'c:/mlr/homepage/departments/cse.html',
    'c:/mlr/homepage/departments/ece.html',
    'c:/mlr/homepage/departments/eee.html',
    'c:/mlr/homepage/departments/mechanical.html',
    'c:/mlr/homepage/departments/aeronautical.html',
    'c:/mlr/homepage/departments/mba.html',
    'c:/mlr/homepage/departments/freshman.html',
]

for fpath in dept_files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    name = os.path.basename(fpath)
    changes = []

    # 1. Remove the PO section heading + numbered list block
    # Pattern: <div class="panel-sub"id="po-section">...</div>\n    <div class="obe-list-numbered"...>...(PO content)...</div>
    content = re.sub(
        r'\n    <div class="panel-sub"id="po-section">Programme Outcomes \(POs\)</div>\n    <div class="obe-list-numbered"[^>]*>.*?</div>',
        '',
        content,
        flags=re.DOTALL
    )
    if content != original:
        changes.append('Removed PO section + numbered list')
        original = content

    # 2. Remove PSO section (only in cse.html)
    content = re.sub(
        r'\n    <div class="panel-sub">Programme Specific Outcomes \(PSOs\)</div>\n    <p><strong>PSO1:.*?</p>\n    <p><strong>PSO2:.*?</p>',
        '',
        content,
        flags=re.DOTALL
    )
    if content != original:
        changes.append('Removed PSO section')
        original = content

    # 3. Remove sidebar nav link to po-section
    # Matches: <a class="ds-item" data-ds-tab="objectives" data-ds-target="po-section">...</a>
    content = re.sub(
        r'\n    <a class="ds-item" data-ds-tab="objectives" data-ds-target="po-section">.*?</a>',
        '',
        content,
        flags=re.DOTALL
    )
    if content != original:
        changes.append('Removed sidebar po-section link')
        original = content

    if changes:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'{name}: {", ".join(changes)}')
    else:
        print(f'{name}: no changes')

# Fix faculty-profile.html - remove "Detailed research profile" message
fpath = 'c:/mlr/homepage/departments/faculty-profile.html'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the line with the empty-msg
new_content = re.sub(
    r"\n\s*h \+= '<p class=\"empty-msg\">Detailed research profile is being compiled\. Check back soon\.</p>';\n",
    '\n',
    content
)
if new_content != content:
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('faculty-profile.html: Removed "Detailed research profile" message')
else:
    print('faculty-profile.html: no change (check pattern)')

print('\nDone.')
