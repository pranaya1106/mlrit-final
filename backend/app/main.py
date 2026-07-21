import threading
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import CORS_ORIGINS
from .db import get_achievements, get_news, init_db
from .scheduler import start_scheduler
from .scraper import backfill_images, run_scrape


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
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/news")
def news(limit: int = 30):
    return {"items": get_news(limit=limit)}


@app.get("/api/achievements")
def achievements():
    return {"categories": get_achievements()}


@app.post("/api/scrape/run")
def trigger_scrape():
    new_count = run_scrape()
    return {"new_items": new_count}


@app.post("/api/scrape/backfill-images")
def trigger_backfill():
    updated = backfill_images()
    return {"updated": updated}
