with open('_old_index.html', encoding='utf-16') as f:
    content = f.read()

s = content.find('<section class="hero">')
print('hero section at:', s)
if s >= 0:
    print(content[s:s+2000])
else:
    # Try finding the hero comment
    s2 = content.find('1. HERO')
    print('1. HERO at:', s2)
    print(content[s2-5:s2+2000])
