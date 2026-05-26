import json
import re

with open("scraped_raw.json", encoding="utf-8") as f:
    scraped = json.load(f)

with open("homepage/departments/faculty-profile.html", encoding="utf-8") as f:
    content = f.read()

slug_to_dbkey = {
    "dr-ch-ravi-kiran": "ravi-kiran",
    "dr-harikishor-kumar": "harikishor-kumar",
    "dr-k-limbadri": "k-limbadri",
    "dr-pramod-kumar-p": "pramod-kumar",
    "dr-lokasani-bhanuprakash": "lokasani-bhanuprakash",
    "dr-alli-anil-kumar": "alli-anil-kumar",
    "mrs-laxmi": "laxmi",
    "dr-a-vivek-anand": "vivek-anand",
    "k-veeranjaneyulu": "veeranjaneyulu",
    "dr-r-arvind-singh": "r-arvind-singh",
    "dr-s-jayalakshmi": "s-jayalakshmi",
    "dr-thangavel-sanjeeviraja": "thangavel-sanjeeviraja",
    "nayani-uday-ranjan-goud": "nayani-uday-ranjan",
    "swetha-bala-mnvs": "swetha-bala",
    "dr-saiprakash": "saiprakash",
    "m-ganesh": "m-ganesh",
    "sreekanth-sura": "sreekanth-sura",
    "nirmith-kumar-mishra": "nirmith-kumar-mishra",
    "a-udaya-deepika": "a-udaya-deepika",
    "b-nagaraj-goud": "b-nagaraj-goud",
    "p-sai-kumar": "a-sai-kumar",
    "dr-m-v-narasimha-rao": "narasimha-rao",
    "m-umrez": "umrez",
    "dr-m-tirupalaiah": "m-tirupalaiah",
    "dr-jostna-kumar-gantepogu": "jostna-kumar",
    "dr-vasudha-kurikala": "vasudha-kurikala",
    "b-vishnu-prasad": "b-vishnu-prasad",
    "mrs-sudha-rani-n": "sudha-rani",
    "n-madhusudhanarao": "n-madhusudhanarao",
}

def js_str(s):
    s = str(s).replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ").replace("\r", "")
    return '"' + s + '"'

def js_arr_str(lst):
    return "[" + ", ".join(js_str(x) for x in lst) + "]"

def js_journals(journals):
    items = []
    for j in journals:
        t = str(j.get("t","")).replace("\\", "\\\\").replace('"', '\\"')
        jn = str(j.get("j","International Journal")).replace("\\", "\\\\").replace('"', '\\"')
        y = str(j.get("y",""))
        items.append('{t: "' + t + '", j: "' + jn + '", y: "' + y + '"}')
    return "[" + ", ".join(items) + "]"

def safe_sub(pattern, replacement, text):
    # Use lambda to avoid backslash issues in replacement
    repl_str = replacement
    return re.sub(pattern, lambda m: repl_str, text)

updated = 0
for scrape_slug, dbkey in slug_to_dbkey.items():
    if scrape_slug not in scraped:
        continue
    s = scraped[scrape_slug]
    
    pattern = r'"' + re.escape(dbkey) + r'":\s*\{[^}]*?\}'
    m = re.search(pattern, content, re.DOTALL)
    if not m:
        print("NOT FOUND: " + dbkey)
        continue
    
    old_entry = m.group(0)
    new_entry = old_entry
    
    qual = s.get("qual","").strip()
    if qual and len(qual) > 3:
        qual = re.sub(r'\s*from\s+\w+', '', qual, flags=re.IGNORECASE)
        new_entry = safe_sub(r'qual:\s*"[^"]*"', 'qual: ' + js_str(qual[:150]), new_entry)
    
    exp = s.get("exp","").strip()
    if exp and exp not in ["-", "0", "01", "0 Years"]:
        new_entry = safe_sub(r'exp:\s*"[^"]*"', 'exp: ' + js_str(exp[:50]), new_entry)
    
    email = s.get("email","").strip()
    if email and "@" in email:
        new_entry = safe_sub(r'email:\s*"[^"]*"', 'email: ' + js_str(email[:80]), new_entry)
    
    joined = s.get("joined","").strip()
    if joined and joined not in ["-"]:
        new_entry = safe_sub(r'joined:\s*"[^"]*"', 'joined: ' + js_str(joined[:20]), new_entry)
    
    areas = s.get("areas",[])
    if areas:
        new_entry = safe_sub(r'areas:\s*\[[^\]]*\]', 'areas: ' + js_arr_str(areas), new_entry)
    
    subjects = s.get("subjects",[])
    if subjects:
        new_entry = safe_sub(r'subjects:\s*\[[^\]]*\]', 'subjects: ' + js_arr_str(subjects), new_entry)
    
    journals = s.get("journals",[])
    if journals:
        new_entry = safe_sub(r'journals:\s*\[[^\]]*\]', 'journals: ' + js_journals(journals), new_entry)
    
    conf_count = s.get("conferences", 0)
    if conf_count > 0:
        new_entry = safe_sub(r'conferences:\s*\d+', 'conferences: ' + str(conf_count), new_entry)
    
    if new_entry != old_entry:
        content = content.replace(old_entry, new_entry, 1)
        updated += 1
        print("UPDATED: " + dbkey)
    else:
        print("NO CHANGE: " + dbkey)

with open("homepage/departments/faculty-profile.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Total updated: " + str(updated))
