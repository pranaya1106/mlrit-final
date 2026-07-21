# MLRIT Chronicles — News API

FastAPI service that scrapes Google News RSS for positive/achievement news about
**MLR Institute of Technology, Dundigal** (explicitly excludes the similarly-named
Malla Reddy Institute of Technology & Management / MLRITM), stores results in
SQLite, and serves them to the Next.js frontend.

## Setup

```
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

## Run

```
uvicorn app.main:app --reload --port 8000
```

On startup it runs one scrape immediately, then every `SCRAPE_INTERVAL_HOURS`
(default 6, see `app/config.py`).

## Endpoints

- `GET /api/health` — liveness check
- `GET /api/news?limit=30` — flat list, newest first
- `GET /api/achievements` — same data grouped by category (Placements, Sports,
  Research, Academics & Rankings, Awards & Recognition, Events, Campus News),
  newest first within each group
- `POST /api/scrape/run` — trigger an off-cycle scrape manually

## Tuning

Everything filter-related lives in `app/config.py` and `app/filters.py`:
- `QUERIES` — Google News RSS search queries
- `REQUIRE_TERMS` / `EXCLUDE_COLLEGE_TERMS` — college-identity disambiguation
- `POSITIVE_KEYWORDS` / `NEGATIVE_KEYWORDS` — achievement-only filtering
- `CATEGORY_KEYWORDS` — sidebar grouping

Data is stored in `backend/data/news.db` (gitignored).
