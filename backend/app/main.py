import os
import threading
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader

from .config import CORS_ORIGINS
from .db import get_achievements, get_news, init_db
from .scheduler import start_scheduler
from .scraper import backfill_images, run_scrape

_SCRAPE_API_KEY = os.environ.get("SCRAPE_API_KEY", "")
_api_key_header = APIKeyHeader(name="X-Scrape-Key", auto_error=False)


def _require_scrape_key(key: str | None = Security(_api_key_header)) -> None:
    if not _SCRAPE_API_KEY:
        raise HTTPException(status_code=503, detail="Scrape key not configured on server.")
    if key != _SCRAPE_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing X-Scrape-Key header.")


def _startup_scrape():
    run_scrape()
    backfill_images()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    threading.Thread(target=_startup_scrape, daemon=True).start()
    start_scheduler()
    yield


app = FastAPI(title="MLRIT Chronicles News API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/news")
def news(limit: int = Query(default=30, ge=1, le=200)):
    return {"items": get_news(limit=limit)}


@app.get("/api/achievements")
def achievements():
    return {"categories": get_achievements()}


@app.post("/api/scrape/run", dependencies=[Depends(_require_scrape_key)])
def trigger_scrape():
    new_count = run_scrape()
    return {"new_items": new_count}


@app.post("/api/scrape/backfill-images", dependencies=[Depends(_require_scrape_key)])
def trigger_backfill():
    updated = backfill_images()
    return {"updated": updated}
