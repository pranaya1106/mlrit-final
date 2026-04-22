import urllib.request
import json
import re
import time
import html as html_module

def fetch(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=12) as r:
            return r.read().decode("utf-8", errors="ignore")
    except:
        return ""

def clean(s):
    s = re.sub(r'<[^>]+>', ' ', s)
    s = html_module.unescape(s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def get_field(text, label):
    # Markdown table: | Label | Value |
    pattern = r'\|\s*' + re.escape(label) + r'\s*\|\s*([^|\n]+?)\s*\|'
    m = re.search(pattern, text, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return ""

def parse_journals(text):
    """Extract numbered journal list items"""
    journals = []
    # Match numbered items like "1. Title, Journal Name"
    items = re.findall(r'\d+\.\s+([^\d][^.]{10,}?)(?=\s+\d+\.|$)', text, re.DOTALL)
    for item in items[:15]:
        item = item.strip()
        if len(item) > 15:
            journals.append(item[:200])
    return journals

def parse_subjects(text):
    """Parse comma or newline separated subjects"""
    text = re.sub(r'\d+\.', '', text)
    parts = re.split(r'[,\n]', text)
    subjects = []
    for p in parts:
        p = p.strip().strip(',').strip()
        if len(p) > 2 and len(p) < 100:
            subjects.append(p)
    return subjects[:15]

def parse_areas(text):
    """Parse comma separated areas"""
    parts = re.split(r'[,/]', text)
    areas = []
    for p in parts:
        p = p.strip()
        if len(p) > 2 and len(p) < 80:
            areas.append(p)
    return areas[:8]

def parse_profile(rendered_html, slug, name, role, photo, dept):
    d = {
        "name": name, "role": role, "photo": photo, "dept": dept,
        "qual": "", "email": "", "exp": "", "joined": "",
        "areas": [], "subjects": [],
        "journals": [], "conferences": 0, "confTitles": [],
        "books": [], "patents": [], "awards": []
    }
    
    text = rendered_html
    
    # Table fields
    desig = get_field(text, "Designation")
    d["exp"] = get_field(text, "Years of Experience")
    d["email"] = get_field(text, "Email Id")
    areas_raw = get_field(text, "Areas of Specialization")
    ug = get_field(text, "UG Degree")
    pg = get_field(text, "PG Degree")
    phd = get_field(text, "Ph.D")
    d["joined"] = get_field(text, "Joining Date")
    
    # Build qual
    qual_parts = []
    if phd and phd not in ["-", "\u2013", "- -"]:
        qual_parts.append(phd)
    if pg and pg not in ["-", "\u2013", "- -"]:
        qual_parts.append(pg)
    if ug and ug not in ["-", "\u2013", "- -"]:
        qual_parts.append(ug)
    d["qual"] = ", ".join(qual_parts)
    
    if areas_raw:
        d["areas"] = parse_areas(areas_raw)
    
    # Journal count
    m = re.search(r'Journals?\s*[-:]\s*(\d+)', text, re.IGNORECASE)
    if m:
        d["journal_count"] = int(m.group(1))
    
    # Conference count
    m = re.search(r'Conferences?\s*[-:]\s*(\d+)', text, re.IGNORECASE)
    if m:
        d["conferences"] = int(m.group(1))
    
    # Journal titles
    m = re.search(r'Journal Publications?:?\s*(.*?)(?:###\s*Subjects|Subjects Taught|###\s*Books|Books Published)', text, re.DOTALL|re.IGNORECASE)
    if m:
        raw = m.group(1).strip()
        journals = parse_journals(raw)
        if journals:
            d["journals"] = [{"t": j, "j": "International Journal", "y": ""} for j in journals]
        elif len(raw) > 10:
            d["journal_raw"] = raw[:500]
    
    # Subjects
    m = re.search(r'Subjects Taught\s*(.*?)(?:###|Books Published|Official Address|$)', text, re.DOTALL|re.IGNORECASE)
    if m:
        raw = m.group(1).strip()
        if raw:
            d["subjects"] = parse_subjects(raw)
    
    # Books
    m = re.search(r'Books Published\s*(.*?)(?:###|Official Address|$)', text, re.DOTALL|re.IGNORECASE)
    if m:
        raw = m.group(1).strip()
        if raw and raw not in ["-", "\u2013", "\u2014", "- -", "- - -"]:
            d["books_raw"] = raw[:300]
    
    return d

# All slugs
slugs = [
    ("ashok-kumar-cheeli","eee","Prof. Ashok Kumar Cheeli","Professor & HOD","images/eee/ashok-kumar.jpg"),
    ("dr-m-dileep-kumar","eee","Dr. M. Dileep Kumar","Associate Professor","images/eee/dileep-kumar.jpg"),
    ("ashok-reddy-kanna","eee","Ashok Reddy Kanna","Associate Professor","images/eee/placeholder.jpg"),
    ("k-usha-rani","eee","K. Usha Rani","Associate Professor","images/eee/placeholder.jpg"),
    ("dr-sumana-das","eee","Dr. Sumana Das","Associate Professor","images/eee/sumana-das.jpeg"),
    ("dr-b-v-rajanna","eee","Dr. B. V. Rajanna","Associate Professor","images/eee/bv-rajanna.jpg"),
    ("t-bhargava-ramu","eee","Dr. T. Bhargava Ramu","Associate Professor","images/eee/t-bhargava-ramu.jpg"),
    ("dr-sonu-kumar","eee","Dr. Sonu Kumar","Assistant Professor","images/eee/sonu-kumar.jpeg"),
    ("6242","eee","Dr. Y. Lalitha Kameswari","Assistant Professor","images/eee/y-lalitha-kameswari.jpeg"),
    ("t-mrudula-2","eee","T. Mrudula","Assistant Professor","images/eee/t-mrudula.jpg"),
    ("n-karthik","eee","N. Karthik","Assistant Professor","images/eee/n-karthik.jpg"),
    ("p-jithendar","eee","P. Jithendar","Assistant Professor","images/eee/p-jithendar.jpg"),
    ("a-yadagiri","eee","A. Yadagiri","Assistant Professor","images/eee/a-yadagiri.jpg"),
    ("k-rajasri","eee","K. Rajasri","Assistant Professor","images/eee/k-rajasri.jpg"),
    ("a-shubhangi-rao","eee","A. Shubhangi Rao","Assistant Professor","images/eee/a-shubhangi-rao.jpg"),
    ("ch-srivardhan-kumar","eee","Dr. CH. Srivardhan Kumar","Assistant Professor","images/eee/ch-srivardhan-kumar.jpg"),
    ("m-sreenivasa-reddy","eee","M. Sreenivasa Reddy","Associate Professor","images/eee/m-sreenivasa-reddy.jpg"),
    ("dr-ch-ravi-kiran","mech","Dr. Ch. Ravi Kiran","Associate Professor","images/mechanical/ravi-kiran.jpg"),
    ("dr-harikishor-kumar","mech","Dr. Harikishor Kumar","Associate Professor","images/mechanical/harikishor.jpg"),
    ("dr-k-limbadri","mech","Dr. K. Limbadri","Associate Professor","images/mechanical/k-limbadri.jpg"),
    ("dr-pramod-kumar-p","mech","Dr. Pramod Kumar P","Associate Professor","images/mechanical/pramod-kumar.jpg"),
    ("dr-lokasani-bhanuprakash","mech","Dr. Lokasani Bhanuprakash","Associate Professor","images/mechanical/lokasani-bhanuprakash.jpg"),
    ("dr-alli-anil-kumar","mech","Dr. Alli Anil Kumar","Assistant Professor","images/mechanical/alli-anil-kumar.jpg"),
    ("mrs-laxmi","mech","Mrs. Laxmi","Assistant Professor","images/mechanical/laxmi.jpg"),
    ("dr-a-vivek-anand","aero","Dr. A. Vivek Anand","Professor, Dean","images/aeronautical/vivek-anand.jpg"),
    ("k-veeranjaneyulu","aero","K. Veeranjaneyulu","Professor","images/aeronautical/veeranjaneyulu.jpg"),
    ("dr-r-arvind-singh","aero","Dr. R. Arvind Singh","Professor of Eminence","images/aeronautical/arvind-singh.jpg"),
    ("dr-s-jayalakshmi","aero","Dr. S. Jayalakshmi","Professor of Eminence","images/aeronautical/s-jayalakshmi.jpg"),
    ("dr-thangavel-sanjeeviraja","aero","Dr. Thangavel Sanjeeviraja","Associate Professor","images/aeronautical/thangavel-sanjeeviraja.jpeg"),
    ("nayani-uday-ranjan-goud","aero","Nayani Uday Ranjan Goud","Associate Professor","images/aeronautical/nayani-uday-ranjan.jpg"),
    ("swetha-bala-mnvs","aero","Swetha Bala MNVS","Associate Professor","images/aeronautical/swetha-bala.jpg"),
    ("dr-saiprakash","aero","Dr. Saiprakash","Associate Professor","images/aeronautical/saiprakash.jpg"),
    ("m-ganesh","aero","M. Ganesh","Associate Professor","images/aeronautical/m-ganesh.jpg"),
    ("sreekanth-sura","aero","Sreekanth Sura","Assistant Professor","images/aeronautical/sreekanth-sura.jpg"),
    ("nirmith-kumar-mishra","aero","Nirmith Kumar Mishra","Assistant Professor","images/aeronautical/nirmith-kumar-mishra.jpg"),
    ("a-udaya-deepika","aero","A. Udaya Deepika","Assistant Professor","images/aeronautical/a-udaya-deepika.jpg"),
    ("b-nagaraj-goud","aero","B. Nagaraj Goud","Assistant Professor","images/aeronautical/b-nagaraj-goud.jpg"),
    ("p-sai-kumar","aero","A. Sai Kumar","Assistant Professor","images/aeronautical/a-sai-kumar.jpg"),
    ("dr-m-v-narasimha-rao","mba","Dr. M. V. Narasimha Rao","Professor","images/mba/narasimha-rao.jpg"),
    ("m-umrez","mba","M. Umrez","Associate Professor","images/mba/umrez.jpg"),
    ("dr-m-tirupalaiah","mba","Dr. M. Tirupalaiah","Associate Professor","images/mba/m-tirupalaiah.jpg"),
    ("dr-jostna-kumar-gantepogu","mba","Dr. Jostna Kumar Gantepogu","Assistant Professor","images/mba/jostna-kumar.jpg"),
    ("dr-vasudha-kurikala","mba","Dr. Vasudha Kurikala","Assistant Professor","images/mba/vasudha-kurikala.jpg"),
    ("b-vishnu-prasad","mba","B. Vishnu Prasad","Assistant Professor","images/mba/b-vishnu-prasad.jpg"),
    ("mrs-sudha-rani-n","mba","Mrs. Sudha Rani N","Assistant Professor","images/mba/sudha-rani.jpeg"),
    ("n-madhusudhanarao","mba","N. Madhusudhanarao","Assistant Professor","images/mba/n-madhusudhanarao.jpg"),
]

results = {}
for item in slugs:
    slug, dept, name, role, photo = item
    url = "https://mlrit.ac.in/faculty/" + slug + "/"
    html = fetch(url)
    if html and len(html) > 300:
        d = parse_profile(html, slug, name, role, photo, dept)
        results[slug] = d
        print("OK: " + slug + " | exp=" + d.get("exp","") + " | areas=" + str(d.get("areas",[])))
    else:
        print("EMPTY: " + slug)
    time.sleep(0.25)

with open("scraped_final.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print("Done: " + str(len(results)))
