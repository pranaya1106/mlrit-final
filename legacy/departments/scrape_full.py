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

def parse_full(html, slug):
    d = {}
    
    # Qualification
    m = re.search(r'Qualification[s]?\s*[:\-]?\s*(.*?)(?:Experience|Research|Subjects|Papers|Books|$)', html, re.DOTALL|re.IGNORECASE)
    if m:
        d["qual"] = clean(m.group(1))[:200]
    
    # Experience
    m = re.search(r'Experience[s]?\s*[:\-]?\s*(.*?)(?:Qualification|Research|Subjects|Papers|Books|$)', html, re.DOTALL|re.IGNORECASE)
    if m:
        d["exp"] = clean(m.group(1))[:100]
    
    # Research areas
    m = re.search(r'Research\s+(?:Area|Interest)[s]?\s*[:\-]?\s*(.*?)(?:Subjects|Papers|Books|Experience|Qualification|$)', html, re.DOTALL|re.IGNORECASE)
    if m:
        d["areas_text"] = clean(m.group(1))[:300]
    
    # Journal count
    m = re.search(r'Journals?\s*[-:]\s*(\d+)', html, re.IGNORECASE)
    if m:
        d["journal_count"] = int(m.group(1))
    
    # Conference count
    m = re.search(r'Conferences?\s*[-:]\s*(\d+)', html, re.IGNORECASE)
    if m:
        d["conf_count"] = int(m.group(1))
    
    # Journal titles - look for list items or numbered items
    m = re.search(r'Journal Publications?:?(.*?)(?:Conference|Subjects|Books|$)', html, re.DOTALL|re.IGNORECASE)
    if m:
        raw = clean(m.group(1))
        if len(raw) > 10:
            d["journal_text"] = raw[:2000]
    
    # Subjects
    m = re.search(r'Subjects?\s+Taught\s*[:\-]?\s*(.*?)(?:Books|Papers|Research|$)', html, re.DOTALL|re.IGNORECASE)
    if m:
        d["subjects_text"] = clean(m.group(1))[:500]
    
    # Books
    m = re.search(r'Books?\s+Published\s*[:\-]?\s*(.*?)(?:Papers|Subjects|Research|$)', html, re.DOTALL|re.IGNORECASE)
    if m:
        bt = clean(m.group(1))
        if bt and bt not in ["-", "\u2013", "\u2014"]:
            d["books_text"] = bt[:500]
    
    return d

# All slugs
slugs = [
    # EEE
    ("ashok-kumar-cheeli","eee","Prof. Ashok Kumar Cheeli","Professor & HOD"),
    ("dr-m-dileep-kumar","eee","Dr. M. Dileep Kumar","Associate Professor"),
    ("ashok-reddy-kanna","eee","Ashok Reddy Kanna","Associate Professor"),
    ("k-usha-rani","eee","K. Usha Rani","Associate Professor"),
    ("dr-sumana-das","eee","Dr. Sumana Das","Associate Professor"),
    ("dr-b-v-rajanna","eee","Dr. B. V. Rajanna","Associate Professor"),
    ("t-bhargava-ramu","eee","Dr. T. Bhargava Ramu","Associate Professor"),
    ("dr-sonu-kumar","eee","Dr. Sonu Kumar","Assistant Professor"),
    ("6242","eee","Dr. Y. Lalitha Kameswari","Assistant Professor"),
    ("t-mrudula-2","eee","T. Mrudula","Assistant Professor"),
    ("n-karthik","eee","N. Karthik","Assistant Professor"),
    ("p-jithendar","eee","P. Jithendar","Assistant Professor"),
    ("a-yadagiri","eee","A. Yadagiri","Assistant Professor"),
    ("k-rajasri","eee","K. Rajasri","Assistant Professor"),
    ("a-shubhangi-rao","eee","A. Shubhangi Rao","Assistant Professor"),
    ("ch-srivardhan-kumar","eee","Dr. CH. Srivardhan Kumar","Assistant Professor"),
    ("m-sreenivasa-reddy","eee","M. Sreenivasa Reddy","Associate Professor"),
    # Mechanical
    ("dr-ch-ravi-kiran","mech","Dr. Ch. Ravi Kiran","Associate Professor"),
    ("dr-harikishor-kumar","mech","Dr. Harikishor Kumar","Associate Professor"),
    ("dr-k-limbadri","mech","Dr. K. Limbadri","Associate Professor"),
    ("dr-pramod-kumar-p","mech","Dr. Pramod Kumar P","Associate Professor"),
    ("dr-lokasani-bhanuprakash","mech","Dr. Lokasani Bhanuprakash","Associate Professor"),
    ("dr-alli-anil-kumar","mech","Dr. Alli Anil Kumar","Assistant Professor"),
    ("mrs-laxmi","mech","Mrs. Laxmi","Assistant Professor"),
    # Aeronautical
    ("dr-a-vivek-anand","aero","Dr. A. Vivek Anand","Professor, Dean"),
    ("k-veeranjaneyulu","aero","K. Veeranjaneyulu","Professor"),
    ("dr-r-arvind-singh","aero","Dr. R. Arvind Singh","Professor of Eminence"),
    ("dr-s-jayalakshmi","aero","Dr. S. Jayalakshmi","Professor of Eminence"),
    ("dr-thangavel-sanjeeviraja","aero","Dr. Thangavel Sanjeeviraja","Associate Professor"),
    ("nayani-uday-ranjan-goud","aero","Nayani Uday Ranjan Goud","Associate Professor"),
    ("swetha-bala-mnvs","aero","Swetha Bala MNVS","Associate Professor"),
    ("dr-saiprakash","aero","Dr. Saiprakash","Associate Professor"),
    ("m-ganesh","aero","M. Ganesh","Associate Professor"),
    ("sreekanth-sura","aero","Sreekanth Sura","Assistant Professor"),
    ("nirmith-kumar-mishra","aero","Nirmith Kumar Mishra","Assistant Professor"),
    ("a-udaya-deepika","aero","A. Udaya Deepika","Assistant Professor"),
    ("b-nagaraj-goud","aero","B. Nagaraj Goud","Assistant Professor"),
    ("p-sai-kumar","aero","A. Sai Kumar","Assistant Professor"),
    # MBA
    ("dr-m-v-narasimha-rao","mba","Dr. M. V. Narasimha Rao","Professor"),
    ("m-umrez","mba","M. Umrez","Associate Professor"),
    ("dr-m-tirupalaiah","mba","Dr. M. Tirupalaiah","Associate Professor"),
    ("dr-jostna-kumar-gantepogu","mba","Dr. Jostna Kumar Gantepogu","Assistant Professor"),
    ("dr-vasudha-kurikala","mba","Dr. Vasudha Kurikala","Assistant Professor"),
    ("b-vishnu-prasad","mba","B. Vishnu Prasad","Assistant Professor"),
    ("mrs-sudha-rani-n","mba","Mrs. Sudha Rani N","Assistant Professor"),
    ("n-madhusudhanarao","mba","N. Madhusudhanarao","Assistant Professor"),
]

results = {}
for slug, dept, name, role in slugs:
    url = "https://mlrit.ac.in/faculty/" + slug + "/"
    html = fetch(url)
    if html and len(html) > 300:
        d = parse_full(html, slug)
        d["dept"] = dept
        d["name"] = name
        d["role"] = role
        results[slug] = d
        print("OK: " + slug + " qual=" + d.get("qual","")[:40])
    else:
        print("EMPTY: " + slug)
    time.sleep(0.25)

with open("scraped_full.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print("Done: " + str(len(results)) + " profiles")
