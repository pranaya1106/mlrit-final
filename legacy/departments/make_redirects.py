redirects = {
    'departments/mba.html': '../homepage/departments/mba.html',
    'departments/mechanical.html': '../homepage/departments/mechanical.html',
    'departments/ece.html': '../homepage/departments/ece.html',
    'departments/eee.html': '../homepage/departments/eee.html',
    'departments/aeronautical.html': '../homepage/departments/aeronautical.html',
}

for filepath, target in redirects.items():
    html = (
        '<!DOCTYPE html>\n'
        '<html>\n'
        '<head>\n'
        '<meta charset="UTF-8"/>\n'
        '<meta http-equiv="refresh" content="0; url=' + target + '"/>\n'
        '<title>Redirecting...</title>\n'
        '</head>\n'
        '<body>\n'
        '<script>window.location.replace("' + target + '");</script>\n'
        '</body>\n'
        '</html>'
    )
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print('Redirect: ' + filepath + ' -> ' + target)
