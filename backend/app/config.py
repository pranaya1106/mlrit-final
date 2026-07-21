from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "data" / "news.db"

# Google News RSS search queries. Each is run independently and results are merged + deduped.
QUERIES = [
    '"Marri Laxman Reddy Institute of Technology"',
    '"MLR Institute of Technology" Dundigal',
    "MLRIT Dundigal award OR achievement OR wins OR ranked",
    "MLRIT Dundigal placement OR package OR LPA",
    "MLRIT Dundigal students",
]

# Google News language/region editions to search — institution names and acronyms
# (MLRIT, NIRF, NBA, MoU, LPA) are almost always kept in Latin script even inside
# vernacular articles, so the same QUERIES work across editions unmodified.
LANGUAGE_EDITIONS = [
    "hl=en-IN&gl=IN&ceid=IN:en",  # English
    "hl=te-IN&gl=IN&ceid=IN:te",  # Telugu — Sakshi, Eenadu, Namasthe Telangana, ETV Bharat Telugu etc.
]

SCRAPE_INTERVAL_HOURS = 6

CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

# Real college terms — at least one must appear for an article to count as "about us".
REQUIRE_TERMS = [
    "mlrit",
    "marri laxman reddy",
    "mlr institute of technology",
]

# A different, frequently-confused college (Malla Reddy Institute of Technology &
# Management). Any hit here disqualifies the article outright.
EXCLUDE_COLLEGE_TERMS = [
    "mlritm",
    "malla reddy institute of technology and management",
    "malla reddy institute of technology & management",
    "malla reddy",
]

# Achievement / positive-news signal words. Article must match at least one.
POSITIVE_KEYWORDS = [
    "award", "awarded", "awards", "wins", "won", "winner", "winners",
    "champion", "championship", "gold medal", "silver medal", "bronze medal",
    "medal", "rank 1", "ranked", "top rank", "best college", "excellence",
    "accredited", "accreditation", "naac", "nba", "nirf", "placement",
    "placements", "placed", "package", "lpa", "highest package",
    "scholarship", "patent", "published", "research grant", "funded",
    "mou signed", "signs mou", "sign mou", "mou with", "collaboration", "hackathon winner", "startup",
    "incubation", "recognized", "recognised", "felicitat", "honour",
    "honor", "achievement", "achieves", "qualifies", "selected for",
    "internship offer", "record", "milestone", "topper", "toppers",
    "gold medallist", "first place", "1st place", "represent",
    "bag ", "bags ", "bagged", "first prize", "1st prize", "clinches",
    "clinched", "laurels", "state-level", "national-level",
    # Telugu equivalents — regional press expresses these concepts in Telugu script
    # even when the institution name/acronyms stay in English.
    "పురస్కారం", "సత్కారం", "సత్కరించారు", "అవార్డు", "సాధించారు",
    "గెలుపొందారు", "గెలిచారు", "ప్రథమ స్థానం", "ర్యాంక్", "ర్యాంకింగ్",
    "స్కాలర్‌షిప్", "అత్యుత్తమ", "శిఖరాలకు", "చాంపియన్", "పతకం",
]

# Hard negative signals — presence disqualifies regardless of positive matches.
NEGATIVE_KEYWORDS = [
    "protest", "strike", "arrested", "case filed", "fir ", "death", "died",
    "fire ", "accident", "controversy", "scam", "fraud", "suicide",
    "ragging", "complaint", "harassment", "lawsuit", "penalty",
    "fine imposed", "shut down", "closure", "banned", "molest",
    # Telugu equivalents
    "మృతి", "మరణం", "నిరసన", "కేసు", "ఫిర్యాదు", "ర్యాగింగ్", "అరెస్టు",
]

# Ordered: first matching category wins. Keep specific buckets before generic ones.
CATEGORY_KEYWORDS = [
    ("Placements", ["placement", "package", "lpa", "hired", "recruit", "offer letter", "internship", "ప్లేస్‌మెంట్"]),
    ("Sports", ["sports", "tournament", "championship", "medal", "cricket", "football", "athletics", "badminton", "kabaddi", "chess", "క్రీడలు", "పతకం", "చాంపియన్"]),
    ("Research", ["research", "patent", "publication", "journal", "paper presented", "grant", "funded project"]),
    ("Academics & Rankings", ["nirf", "naac", "nba", "ranked", "accreditation", "rank ", "ర్యాంక్", "ర్యాంకింగ్"]),
    ("Awards & Recognition", ["award", "felicitat", "honour", "honor", "winner", "excellence", "recognized", "recognised", "పురస్కారం", "సత్కారం", "సత్కరించారు", "అవార్డు"]),
    ("Events", ["fest", "summit", "hackathon", "workshop", "seminar", "conclave"]),
]
DEFAULT_CATEGORY = "Campus News"
