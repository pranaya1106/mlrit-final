import json
import re

with open("scraped_raw.json", encoding="utf-8") as f:
    scraped = json.load(f)

with open("homepage/departments/faculty-profile.html", encoding="utf-8") as f:
    content = f.read()

# Map from scrape slug to DB key
slug_to_dbkey = {
    "ashok-kumar-cheeli": "ashok-kumar-cheeli",
    "dr-m-dileep-kumar": "dileep-kumar",
    "ashok-reddy-kanna": "ashok-reddy-kanna",
    "k-usha-rani": "k-usha-rani",
    "dr-sumana-das": "sumana-das",
    "dr-b-v-rajanna": "bv-rajanna",
    "t-bhargava-ramu": "t-bhargava-ramu",
    "dr-sonu-kumar": "sonu-kumar",
    "6242": "y-lalitha-kameswari",
    "t-mrudula-2": "t-mrudula",
    "n-karthik": "n-karthik",
    "p-jithendar": "p-jithendar",
    "a-yadagiri": "a-yadagiri",
    "k-rajasri": "k-rajasri",
    "a-shubhangi-rao": "a-shubhangi-rao",
    "ch-srivardhan-kumar": "ch-srivardhan-kumar",
    "m-sreenivasa-reddy": "m-sreenivasa-reddy",
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
    s = s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ").replace("\r", "")
    return '"' + s + '"'

def js_arr_str(lst):
    return "[" + ", ".join(js_str(x) for x in lst) + "]"

def js_journals(journals):
    items = []
    for j in journals:
        t = j.get("t","").replace('"','\\"')
        jn = j.get("j","International Journal").replace('"','\\"')
        y = j.get("y","")
        items.append('{t: "' + t + '", j: "' + jn + '", y: "' + y + '"}')
    return "[" + ", ".join(items) + "]"

updated = 0
for scrape_slug, dbkey in slug_to_dbkey.items():
    if scrape_slug not in scraped:
        continue
    s = scraped[scrape_slug]
    
    # Find the DB entry
    pattern = r'("' + re.escape(dbkey) + r'":\s*\{[^}]*?\})'
    m = re.search(pattern, content, re.DOTALL)
    if not m:
        print("NOT FOUND in DB: " + dbkey)
        continue
    
    old_entry = m.group(1)
    
    # Build updates
    updates = {}
    
    qual = s.get("qual","").strip()
    if qual and len(qual) > 3:
        # Clean up qual - remove "from" prefixes
        qual = re.sub(r'\s*from\s+\w+', '', qual, flags=re.IGNORECASE)
        updates["qual"] = qual[:150]
    
    exp = s.get("exp","").strip()
    if exp and exp not in ["-", "0", "01", "0 Years"]:
        updates["exp"] = exp[:50]
    
    email = s.get("email","").strip()
    if email and "@" in email:
        updates["email"] = email[:80]
    
    joined = s.get("joined","").strip()
    if joined and joined not in ["-"]:
        updates["joined"] = joined[:20]
    
    areas = s.get("areas",[])
    if areas:
        updates["areas"] = areas
    
    subjects = s.get("subjects",[])
    if subjects:
        updates["subjects"] = subjects
    
    journals = s.get("journals",[])
    if journals:
        updates["journals"] = journals
    
    conf_count = s.get("conferences", 0)
    if conf_count > 0:
        updates["conferences"] = conf_count
    
    journal_count = s.get("journal_count", 0)
    if journal_count:
        updates["journal_count_note"] = journal_count
    
    # Apply updates to the entry
    new_entry = old_entry
    
    for field, val in updates.items():
        if field == "areas":
            new_entry = re.sub(r'areas:\s*\[[^\]]*\]', 'areas: ' + js_arr_str(val), new_entry)
        elif field == "subjects":
            new_entry = re.sub(r'subjects:\s*\[[^\]]*\]', 'subjects: ' + js_arr_str(val), new_entry)
        elif field == "journals":
            new_entry = re.sub(r'journals:\s*\[[^\]]*\]', 'journals: ' + js_journals(val), new_entry)
        elif field == "conferences":
            new_entry = re.sub(r'conferences:\s*\d+', 'conferences: ' + str(val), new_entry)
        elif field == "qual":
            new_entry = re.sub(r'qual:\s*"[^"]*"', 'qual: ' + js_str(val), new_entry)
        elif field == "exp":
            new_entry = re.sub(r'exp:\s*"[^"]*"', 'exp: ' + js_str(val), new_entry)
        elif field == "email":
            new_entry = re.sub(r'email:\s*"[^"]*"', 'email: ' + js_str(val), new_entry)
        elif field == "joined":
            new_entry = re.sub(r'joined:\s*"[^"]*"', 'joined: ' + js_str(val), new_entry)
    
    if new_entry != old_entry:
        content = content.replace(old_entry, new_entry, 1)
        updated += 1
        print("UPDATED: " + dbkey)
    else:
        print("NO CHANGE: " + dbkey)

with open("homepage/departments/faculty-profile.html", "w", encoding="utf-8") as f:
    f.write(content)

print("\nTotal updated: " + str(updated))
