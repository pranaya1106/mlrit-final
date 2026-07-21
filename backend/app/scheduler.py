from apscheduler.schedulers.background import BackgroundScheduler

from .config import SCRAPE_INTERVAL_HOURS
from .scraper import run_scrape

scheduler = BackgroundScheduler()


def _job():
    count = run_scrape()
    print(f"[scheduler] scrape complete — {count} new item(s)")


def start_scheduler() -> None:
    if scheduler.running:
        return
    scheduler.add_job(_job, "interval", hours=SCRAPE_INTERVAL_HOURS, id="news_scrape")
    scheduler.start()
