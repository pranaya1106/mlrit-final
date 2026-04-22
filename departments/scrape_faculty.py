import urllib.request
import json
import re
import time

def fetch(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.read().decode("utf-8", errors="ignore")
    except Exception as e:
        return ""

def parse_profile(html, slug):
    data = {"slug": slug, "journals": [], "conferences": 0, "books": [], "subjects": [], "qual": "", "areas": []}
    
    # Papers Published
    m = re.search(r'Papers Published.*?Journals?[-\s]*(\d+)', html, re.DOTALL|re.IGNORECASE)
    if m:
        data["journal_count"] = int(m.group(1))
    
    m = re.search(r'Conferences?[-\s]*(\d+)', html, re.DOTALL|re.IGNORECASE)
    if m:
        data["conferences"] = int(m.group(1))
    
    # Journal titles
    m = re.search(r'Journal Publications?:?(.*?)(?:Subjects Taught|Books Published|Conference)', html, re.DOTALL|re.IGNORECASE)
    if m:
        raw = m.group(1).strip()
        raw = re.sub(r'<[^>]+>', '', raw)
        raw = re.sub(r'\s+', ' ', raw).strip()
        if raw and len(raw) > 5:
            data["journal_text"] = raw
    
    # Subjects
    m = re.search(r'Subjects Taught(.*?)(?:Books Published|Papers Published|$)', html, re.DOTALL|re.IGNORECASE)
    if m:
        raw = m.group(1).strip()
        raw = re.sub(r'<[^>]+>', '', raw)
        raw = re.sub(r'\s+', ' ', raw).strip()
        if raw:
            data["subjects_text"] = raw
    
    # Books
    m = re.search(r'Books Published(.*?)(?:Papers Published|Subjects Taught|$)', html, re.DOTALL|re.IGNORECASE)
    if m:
        raw = m.group(1).strip()
        raw = re.sub(r'<[^>]+>', '', raw)
        raw = re.sub(r'\s+', ' ', raw).strip()
        if raw and raw != "-" and raw != "–":
            data["books_text"] = raw
    
    return data

# All faculty slugs to scrape
slugs = {
    # EEE
    "ashok-kumar-cheeli": "eee",
    "dr-m-dileep-kumar": "eee",
    "ashok-reddy-kanna": "eee",
    "k-usha-rani": "eee",
    "dr-sumana-das": "eee",
    "dr-b-v-rajanna": "eee",
    "t-bhargava-ramu": "eee",
    "dr-sonu-kumar": "eee",
    "6242": "eee",  # y-lalitha-kameswari
    "t-mrudula-2": "eee",
    "n-karthik": "eee",
    "p-jithendar": "eee",
    "a-yadagiri": "eee",
    "k-rajasri": "eee",
    "a-shubhangi-rao": "eee",
    "ch-srivardhan-kumar": "eee",
    "m-sreenivasa-reddy": "eee",
    # Mechanical
    "j-krishnaraj": "mech",
    "dr-n-prabhu-kishore": "mech",
    "dr-ch-ravi-kiran": "mech",
    "dr-harikishor-kumar": "mech",
    "dr-k-limbadri": "mech",
    "dr-pramod-kumar-p": "mech",
    "dr-lokasani-bhanuprakash": "mech",
    "dr-alli-anil-kumar": "mech",
    "mrs-laxmi": "mech",
    "chintala-muralikrishna": "mech",
    "j-sunil-kumar": "mech",
    "j-laxmi-prasad": "mech",
    "n-e-chandra-prasad": "mech",
    "mudhuganti-mahender": "mech",
    "dr-g-chandramohana-reddy": "mech",
    "m-sundeep": "mech",
    "s-nagaraju": "mech",
    "g-anandarao": "mech",
    "gottipati-venkata-rambabu": "mech",
    "m-venkateswar-reddy": "mech",
    # Aeronautical
    "m-satyanarayana-gupta": "aero",
    "dr-a-vivek-anand": "aero",
    "k-veeranjaneyulu": "aero",
    "dr-r-arvind-singh": "aero",
    "dr-s-jayalakshmi": "aero",
    "dr-thangavel-sanjeeviraja": "aero",
    "nayani-uday-ranjan-goud": "aero",
    "swetha-bala-mnvs": "aero",
    "dr-saiprakash": "aero",
    "m-ganesh": "aero",
    "yelamasetti-balram": "aero",
    "sreekanth-sura": "aero",
    "g-sravanthi": "aero",
    "b-manideep": "aero",
    "nirmith-kumar-mishra": "aero",
    "a-udaya-deepika": "aero",
    "k-arun-kumar": "aero",
    "b-nagaraj-goud": "aero",
    "p-sai-kumar": "aero",
    # MBA
    "n-ramanjaneyulu": "mba",
    "dr-m-v-narasimha-rao": "mba",
    "m-umrez": "mba",
    "dr-m-tirupalaiah": "mba",
    "dr-jostna-kumar-gantepogu": "mba",
    "dr-vasudha-kurikala": "mba",
    "a-koti-reddy": "mba",
    "m-parsharamulu": "mba",
    "b-s-venkat-narayana": "mba",
    "b-vishnu-prasad": "mba",
    "dr-k-rajya-lakshmi": "mba",
    "mrs-sudha-rani-n": "mba",
    "n-madhusudhanarao": "mba",
    "ram-narsa-goud": "mba",
}

results = {}
for slug, dept in slugs.items():
    url = f"https://mlrit.ac.in/faculty/{slug}/"
    html = fetch(url)
    if html and len(html) > 300:
        data = parse_profile(html, slug)
        data["dept"] = dept
        results[slug] = data
        print(f"OK: {slug} - journals:{data.get('journal_count','?')} conf:{data.get('conferences','?')}")
    else:
        print(f"EMPTY: {slug}")
    time.sleep(0.3)

with open("scraped_faculty.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"\nTotal scraped: {len(results)}")
