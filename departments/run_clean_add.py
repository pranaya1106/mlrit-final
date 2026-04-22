#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Run add_all_faculty.py but skip keys already in facultyDB."""
import sys, io, re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

fpath = 'c:/mlr/homepage/departments/faculty-profile.html'

# Read the add script to get NEW_ENTRIES
with open('c:/mlr/add_all_faculty.py', 'r', encoding='utf-8') as f:
    add_content = f.read()

# Extract NEW_ENTRIES string
ne_start = add_content.find('NEW_ENTRIES = r"""') + len('NEW_ENTRIES = r"""')
ne_end = add_content.find('"""', ne_start)
new_entries_raw = add_content[ne_start:ne_end]

# Keys already in DB - skip these
skip_keys = {
    'j-krishnaraj', 'n-ramanjaneyulu', 'j-mahalakshmi',
    'n-sirisha', 'kandrakunta-chinnaiah', 'k-gagan-kumar'
}

# Parse individual entries: find each "key": { ... }, block
# Strategy: split on top-level entry boundaries
# Find all entry start positions
entry_pattern = re.compile(r'\n      "([a-z][a-z0-9-]*)":\s*\{')
matches = list(entry_pattern.finditer(new_entries_raw))

kept_entries = []
skipped = []

for i, m in enumerate(matches):
    key = m.group(1)
    entry_start = m.start()  # start of \n      "key":
    # End is start of next entry (or end of string)
    if i + 1 < len(matches):
        entry_end = matches[i+1].start()
    else:
        entry_end = len(new_entries_raw)

    entry_text = new_entries_raw[entry_start:entry_end]

    if key in skip_keys:
        skipped.append(key)
        print(f'SKIP (already in DB): {key}')
        continue

    kept_entries.append(entry_text)

print(f'\nKept: {len(kept_entries)} entries, Skipped: {len(skipped)} entries')

# Build the cleaned NEW_ENTRIES
# Preserve comments before first entry
first_entry_start = matches[0].start() if matches else 0
header = new_entries_raw[:first_entry_start]

cleaned_entries = header + ''.join(kept_entries)

# Read faculty-profile.html
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Verify marker exists
marker = '        patents: [], awards: []\n      }\n    };'
if marker not in content:
    print('ERROR: Insertion marker not found!')
    sys.exit(1)

# Count occurrences - should be exactly 1
count = content.count(marker)
print(f'Marker found {count} time(s)')
if count != 1:
    print('ERROR: Expected exactly 1 marker occurrence!')
    sys.exit(1)

# Do the insertion
replacement = '        patents: [], awards: []\n      },' + cleaned_entries + '\n    };'
new_content = content.replace(marker, replacement, 1)

# Verify the result
new_keys = re.findall(r'"([a-z][a-z0-9-]*)":\s*\{', new_content[new_content.find('var facultyDB'):new_content.find('};', new_content.find('var facultyDB'))+2])
print(f'Total keys after update: {len(new_keys)}')

# Write back
with open(fpath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done! faculty-profile.html updated.')
