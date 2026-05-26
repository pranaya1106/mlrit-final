with open('homepage/departments/faculty-profile.html', encoding='utf-8') as f:
    content = f.read()

print('File length:', len(content))

# Find saiprakash entry using next entry as end anchor
MARKER_START = '"saiprakash": {'
MARKER_END = '"sreekanth-sura":'

start = content.find(MARKER_START)
end = content.find(MARKER_END, start + 10)

print('saiprakash start:', start)
print('sreekanth-sura at:', end)

if start < 0 or end < 0:
    print('MARKERS NOT FOUND')
    exit()

# The old entry is from start to just before the next entry
# Find the comma+newline before sreekanth-sura
# Go backwards from end to find the closing },
old_end = end
# Walk back to find the }, that ends saiprakash
i = end - 1
while i > start and content[i] in ' \n\r\t':
    i -= 1
# Should be at }
print('Char before next entry:', repr(content[i-2:i+2]))

old = content[start:i+1]
print('Old entry length:', len(old))

new = (
    '"saiprakash": {\n'
    '        name: "Dr. M. Saiprakash", role: "Associate Professor", dept: "Aeronautical Engineering",\n'
    '        photo: "images/aeronautical/saiprakash.jpg", qual: "M.E (Aerospace Engineering), B.E",\n'
    '        email: "iamsaiaero@gmail.com", exp: "4.5 Years", joined: "",\n'
    '        areas: ["Hypersonic Aerodynamics", "Shock Tunnel Testing", "NDT", "Space Technology"],\n'
    '        subjects: ["Nondestructive Testing (NDT)", "Introduction to Space Technology", "Aerodynamics Lab"],\n'
    '        journals: [\n'
    '          {t: "Visualization of shock wave phenomenon around a sharp cone model at hypersonic Mach Number in a shock tunnel", j: "Journal of Applied Fluid Mechanics", y: "2019"},\n'
    '          {t: "Heat transfer rate and surface pressure measurements in short duration hypersonic flow", j: "Aeronautical Journal, Vol. 123, Issue 1269", y: "2019"},\n'
    '          {t: "Effects of angle of attack and bluntness on heating rate distribution of blunt models at hypersonic speeds", j: "Fluid Dynamics, Springer", y: "2018"},\n'
    '          {t: "Convective heat-transfer rate and surface pressure distribution over a cone model at hypersonic speeds", j: "Proc. IMechE Part G: Journal of Aerospace Engineering", y: "2018"},\n'
    '          {t: "Heat Transfer Measurements on Blunt model at Hypersonic Mach number", j: "International Journal of Aerospace Engineering", y: "2018"}\n'
    '        ],\n'
    '        conferences: 6, confTitles: [], books: [], patents: [], awards: []\n'
    '      }'
)

content = content[:start] + new + content[i+1:]

print('New file length:', len(content))
print('script tags:', content.count('<script>'), content.count('<' + '/script>'))

with open('homepage/departments/faculty-profile.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
