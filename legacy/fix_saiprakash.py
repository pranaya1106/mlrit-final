with open('homepage/departments/faculty-profile.html', encoding='utf-8') as f:
    content = f.read()

start = content.find('"saiprakash": {')
if start < 0:
    print('NOT FOUND')
else:
    brace = content.index('{', start)
    depth = 0
    pos = brace
    while pos < len(content):
        if content[pos] == '{': depth += 1
        elif content[pos] == '}':
            depth -= 1
            if depth == 0: break
        pos += 1

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

    content = content[:start] + new + content[pos+1:]
    with open('homepage/departments/faculty-profile.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Fixed saiprakash entry')
