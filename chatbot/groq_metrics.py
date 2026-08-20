"""
Phase 6 — Concurrency and Rate-Limit Resilience.

Every blocking Groq SDK call (ChatGroq.invoke / ChatGroq.stream) in this
codebase is routed through this module so that:

  1. The call runs off the FastAPI event loop thread (via asyncio.to_thread),
     so a Groq rate-limit retry sleep never blocks other in-flight requests.
  2. Concurrent outbound Groq requests are capped by a single shared
     semaphore (GROQ_MAX_CONCURRENCY in config.py), so the app can't exceed
     the account's RPM under load.
  3. Every 429 the Groq SDK's own retry loop hits is observed (via an httpx
     response event hook — see build_http_client()) and logged/counted, along
     with total call duration, queueing time, and time actually blocked
     inside the SDK.

This module NEVER changes retry behavior — the Groq SDK's built-in
`max_retries` backoff is untouched; this only *observes* it and adds a
concurrency gate around it.
"""
import asyncio
import contextvars
import logging
import threading
import time
from typing import Optional

import httpx

from config import GROQ_MAX_CONCURRENCY

logger = logging.getLogger("groq_metrics")


class _CallMetrics:
    __slots__ = ("retry_count", "retry_wait_ms", "success")

    def __init__(self):
        self.retry_count = 0
        self.retry_wait_ms = 0.0
        self.success: Optional[bool] = None


# Propagates into the worker thread `asyncio.to_thread` runs on (it copies the
# calling context via contextvars.copy_context()), so the httpx response hook
# below — which fires inside that same thread/call stack — can attribute a
# 429 it observes to the specific Groq call currently in flight.
_current_call: "contextvars.ContextVar[Optional[_CallMetrics]]" = contextvars.ContextVar(
    "_current_call", default=None
)

# Single concurrency gate shared by every Groq call site, sync or async —
# threading.BoundedSemaphore is used (rather than asyncio.Semaphore) so the
# same object can be acquired both directly (sync call sites, e.g. streaming)
# and via asyncio.to_thread (async call sites) without needing two separate
# pools.
_groq_semaphore = threading.BoundedSemaphore(GROQ_MAX_CONCURRENCY)


def _parse_retry_after(headers: httpx.Headers) -> Optional[float]:
    """Mirrors the Groq/OpenAI-style SDK's own header preference: precise
    `retry-after-ms` first, falling back to integer-second `retry-after`."""
    ms = headers.get("retry-after-ms")
    if ms is not None:
        try:
            return float(ms) / 1000.0
        except ValueError:
            pass
    secs = headers.get("retry-after")
    if secs is not None:
        try:
            return float(secs)
        except ValueError:
            pass
    return None


def _on_response(response: httpx.Response) -> None:
    """httpx response event hook — fires for every HTTP response the Groq SDK
    receives, including ones its own retry loop is about to retry after. Purely
    observational: never raises, never alters the response/request."""
    if response.status_code != 429:
        return
    metrics = _current_call.get()
    retry_after = _parse_retry_after(response.headers)
    if metrics is not None:
        metrics.retry_count += 1
        if retry_after is not None:
            metrics.retry_wait_ms += retry_after * 1000.0
    logger.warning(
        "groq_429_retry path=%s retry_after_s=%s attempt=%s",
        response.request.url.path,
        f"{retry_after:.3f}" if retry_after is not None else "unknown",
        metrics.retry_count if metrics is not None else "?",
    )


def build_http_client() -> httpx.Client:
    """One shared httpx.Client (passed to ChatGroq(http_client=...)) whose
    response hook observes every 429 the SDK's internal retry loop hits.
    Does not touch retry counts/behavior — `max_retries` on ChatGroq itself
    still governs that."""
    return httpx.Client(event_hooks={"response": [_on_response]})


class _GroqCallScope:
    """Context manager wrapping ONE Groq call (an `invoke`, or an entire
    `stream` iteration) with the concurrency gate + retry/latency metrics.
    Synchronous by design — the async entry point below (`call_groq`) runs it
    inside a worker thread via asyncio.to_thread; the sync entry point
    (`groq_call_scope`, used directly by the streaming path, which already
    runs in its own dedicated thread — see chatbot.py's chat_stream) uses it
    as-is."""

    __slots__ = ("profiler", "label", "metrics", "_t_wait0", "_t_acquired", "_token")

    def __init__(self, profiler, label: str):
        self.profiler = profiler
        self.label = label
        self.metrics = _CallMetrics()

    def __enter__(self) -> "_GroqCallScope":
        self._token = _current_call.set(self.metrics)
        self._t_wait0 = time.perf_counter()
        _groq_semaphore.acquire()
        self._t_acquired = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc, tb) -> bool:
        self.metrics.success = exc_type is None
        _groq_semaphore.release()
        now = time.perf_counter()
        queue_wait_ms = 1000.0 * (self._t_acquired - self._t_wait0)
        blocked_ms = 1000.0 * (now - self._t_acquired)
        total_ms = 1000.0 * (now - self._t_wait0)

        if self.profiler is not None:
            self.profiler.count("Groq Retries", self.metrics.retry_count)
            self.profiler.note(
                f"Groq[{self.label}] success={self.metrics.success} retries={self.metrics.retry_count} "
                f"retry_wait_ms={self.metrics.retry_wait_ms:.0f} queue_wait_ms={queue_wait_ms:.0f} "
                f"blocked_ms={blocked_ms:.0f} total_ms={total_ms:.0f}"
            )

        logger.info(
            "groq_call label=%s success=%s retries=%d retry_wait_ms=%.0f "
            "queue_wait_ms=%.0f blocked_ms=%.0f total_ms=%.0f",
            self.label, self.metrics.success, self.metrics.retry_count,
            self.metrics.retry_wait_ms, queue_wait_ms, blocked_ms, total_ms,
        )
        _current_call.reset(self._token)
        return False


def groq_call_scope(profiler=None, label: str = "invoke") -> _GroqCallScope:
    """Sync context manager — use directly when already running off the main
    event loop thread (e.g. the streaming path, which runs inside its own
    dedicated worker thread — see chatbot.py's chat_stream)."""
    return _GroqCallScope(profiler, label)


async def call_groq(fn, *args, profiler=None, label: str = "invoke", **kwargs):
    """Async entry point — runs one blocking Groq SDK call
    (e.g. `self.llm.invoke`) off the FastAPI event loop thread, under the
    shared concurrency gate, with retry/latency metrics attached. Awaiting
    this never blocks the event loop, even while the Groq SDK is asleep
    inside a 429 retry backoff."""
    def _run():
        with groq_call_scope(profiler, label):
            return fn(*args, **kwargs)

    return await asyncio.to_thread(_run)
