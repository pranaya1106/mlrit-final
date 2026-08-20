import os
from dotenv import load_dotenv

load_dotenv()

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# Paths
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
PDF_DIR = os.getenv("PDF_DIR", "./pdfs")

# Server
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8001"))
CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin.strip()]

# Performance profiling (Phase 1: instrumentation only — see profiler.py).
# Toggle per-request latency reporting without any code change.
ENABLE_PROFILING = os.getenv("ENABLE_PROFILING", "false").strip().lower() in ("1", "true", "yes")

# Phase 6: max number of Groq requests in flight at once, across every call
# site (RAG answers, batched multi-question answers, website-content
# summaries, streaming). Keeps the app under the account's RPM under load
# without disabling or changing the Groq SDK's own retry behavior — see
# groq_metrics.py.
GROQ_MAX_CONCURRENCY = int(os.getenv("GROQ_MAX_CONCURRENCY", "4"))

# RAG Settings
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
MAX_RETRIEVAL_DOCS = 4
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
LLM_MODEL = "llama-3.1-8b-instant"

# Hybrid retrieval (BM25 keyword index + re-ranking) settings
BM25_INDEX_PATH = os.getenv("BM25_INDEX_PATH", os.path.join(CHROMA_PERSIST_DIR, "bm25_index.pkl"))
INDEX_MANIFEST_PATH = os.getenv("INDEX_MANIFEST_PATH", os.path.join(CHROMA_PERSIST_DIR, "index_manifest.json"))
RERANK_MODEL = os.getenv("RERANK_MODEL", "cross-encoder/ms-marco-MiniLM-L-6-v2")
HYBRID_CANDIDATE_K = 8

# Website Routes
WEBSITE_ROUTES = {
    "home": "/",
    "admissions": "/admissions",
    "placements": "/placements",
    "faculty": "/departments/cse#all-faculty",
    "contact": "https://mlrit.ac.in/contactus/",
    "fees": "/admissions",
    "scholarships": "https://mlrit.ac.in/scholarships/",
    "cse": "/departments/cse",
    "ece": "/departments/ece",
    "eee": "/departments/eee",
    "mechanical": "/departments/mechanical",
    "aeronautical": "/departments/aeronautical",
    "aiml": "/departments/aiml",
    "cse-ds": "/departments/cse-ds",
    "mba": "/departments/mba",
    "ug": "/departments/ug",
    "pg": "/departments/pg",
    "chronicles": "/chronicles",
    "academics": "/academics",
    "examinations": "/examinations",
    "departments": "/departments/ug",
    "iqac": "/iqac",
    "naac": "/iqac/naac",
    "nba": "/iqac/nba",
    "nirf": "https://mlrit.ac.in/nirf-ranked-institution/",
    "research": "/research",
    "publications": "/research/publications",
    "sports": "/campus/sports",
    "hostel": "/campus/hostels",
    "cafeteria": "/campus/cafeteria",
    "clubs": "/campus/clubs",
    "library": "https://mlrit.ac.in/campus-life/library/",
    "transport": "/campus/transport",
    "events": "/campus/events",
    "alumni": "https://alumni.mlrit.ac.in/",
    "careers": "https://mlrit.ac.in/careers/",
    "about": "/about",
    "principal": "/about/messages/principal",
}

# College Knowledge Base
COLLEGE_INFO = {
    "name": "MLR Institute of Technology (MLRIT)",
    "location": "Dundigal, Hyderabad, Telangana",
    "established": "2005",
    "type": "Private Engineering College",
    "affiliation": "JNTUH (Jawaharlal Nehru Technological University Hyderabad)",
    "approvals": ["AICTE", "NAAC", "NBA"],
    "nirf_rank": "201-300 Band (Engineering Category)",
    "times_rank": "6th in Telangana",
    "careers360": "AAAA Rating",
    "phone": "+91 96522 26061",
    "email": "info@mlrinstitutions.ac.in",
    "website": "https://mlrit.ac.in",
    "departments": ["CSE", "ECE", "EEE", "IT", "CSIT", "Mechanical", "Aeronautical", "AIML", "CSE-CS", "CSE-DS", "MBA", "Freshman"],
    "programs": ["B.Tech", "M.Tech", "MBA", "Ph.D"],
    "placement_rate": "98%",
    "highest_package": "44 LPA",
    "students": "11,000+",
    "recruiters": "200+",
}

# HOD and Key People Directory
HOD_INFO = {
    "cse": {
        "name": "Dr. Ajmeera Kiran",
        "role": "Associate Professor & HOD",
        "specialization": "Deep Learning, Machine Learning, IoT",
        "url": "/departments/cse"
    },
    "cse-cs": {
        "name": "Dr. P. Subhashini",
        "role": "Professor & HOD",
        "specialization": "Cyber Security",
        "url": None
    },
    "cse-ds": {
        "name": "Dr. P. Subhashini",
        "role": "Professor & HOD",
        "specialization": "Data Science",
        "url": "/departments/cse-ds"
    },
    "aiml": {
        "name": "Dr. Kashi Sai Prasad",
        "role": "Associate Professor & HOD",
        "specialization": "Artificial Intelligence & Machine Learning",
        "url": "/departments/aiml"
    },
    "csit": {
        "name": "Dr. D.B.K. Kamesh",
        "role": "Professor & HOD",
        "specialization": "Computer Science & Information Technology",
        "url": None
    },
    "it": {
        "name": "Dr. N V Raja Sekhar Reddy",
        "role": "Professor & HOD",
        "specialization": "Wireless Networks, Cloud Computing",
        "url": None
    },
    "ece": {
        "name": "Dr. S V S Prasad",
        "role": "Professor & HOD",
        "specialization": "Image Processing, VLSI, Signal Processing",
        "url": "/departments/ece"
    },
    "eee": {
        "name": "Prof. Ashok Kumar Cheeli",
        "role": "Professor & HOD",
        "specialization": "Communication Engineering, VLSI, Fiber Optics",
        "url": "/departments/eee"
    },
    "mechanical": {
        "name": "Dr. J. Krishnaraj",
        "role": "Professor & HOD",
        "specialization": "Manufacturing Engineering, Composites, NDT",
        "url": "/departments/mechanical"
    },
    "aeronautical": {
        "name": "Dr. M. Satyanarayana Gupta",
        "role": "Professor & HOD",
        "specialization": "FEM, Machine Design, Smart Aerospace",
        "url": "/departments/aeronautical"
    },
    "mba": {
        "name": "Dr. N. Ramanjaneyulu",
        "role": "Professor & HOD",
        "specialization": "Strategic Management, Leadership",
        "url": "/departments/mba"
    }
}
