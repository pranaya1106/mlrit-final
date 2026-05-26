with open('homepage/departments/faculty-profile.html', encoding='utf-8') as f:
    content = f.read()

old = 'awards: []\n      }\n      "sreekanth-sura"'
new = 'awards: []\n      },\n      "sreekanth-sura"'

if old in content:
    content = content.replace(old, new, 1)
    with open('homepage/departments/faculty-profile.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Fixed comma')
else:
    print('Pattern not found')
    idx = content.find('sreekanth-sura')
    print(repr(content[idx-80:idx+20]))
