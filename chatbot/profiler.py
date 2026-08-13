"""
Request-scoped latency profiler — Phase 1 of the chatbot performance project.

ADD-ONLY: this module introduces pure instrumentation. It never changes
retrieval/ranking/prompt/caching/streaming behavior — call sites elsewhere
only ever gain a `with profiler.stage("..."):` wrapper around code that
already runs exactly as it did before.

Usage:
    profiler = RequestProfiler(query=message)   # reads ENABLE_PROFILING itself
    with profiler.stage("BM25"):
        ...
    profiler.skip("Cross Encoder")              # explicitly mark a bypassed stage
    profiler.finalize(EXPECTED_STAGES)          # mark any never-touched stage SKIPPED
    profiler.report()                           # logs the formatted report (no-op if disabled)

When ENABLE_PROFILING is false (the default), `stage()` returns a trivial
context manager that never calls time.perf_counter() and `report()` returns
immediately — overhead is a single boolean check plus one cheap object
construction per stage, negligible compared to request latency.
"""
import logging
import time
from collections import OrderedDict
from typing import Any, Dict, Iterable, Optional

from config import ENABLE_PROFILING

logger = logging.getLogger(__name__)


class _NoOpStage:
    """Returned by RequestProfiler.stage() when profiling is disabled — a true
    no-op, so disabled requests pay no perf_counter() cost at all."""

    __slots__ = ()

    def __enter__(self) -> "_NoOpStage":
        return self

    def __exit__(self, exc_type, exc, tb) -> bool:
        return False


_NOOP_STAGE = _NoOpStage()


class _StageTimer:
    """Context manager that times one stage and records it into the owning
    profiler. If the same stage name is entered more than once in a single
    request (e.g. a Context lookup consulted at several points in
    _route_message), the elapsed times are accumulated rather than
    overwritten, so the report reflects total time spent in that stage."""

    __slots__ = ("_profiler", "_name", "_t0")

    def __init__(self, profiler: "RequestProfiler", name: str):
        self._profiler = profiler
        self._name = name
        self._t0 = 0.0

    def __enter__(self) -> "_StageTimer":
        self._t0 = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc, tb) -> bool:
        elapsed_ms = 1000.0 * (time.perf_counter() - self._t0)
        stages = self._profiler._stages
        existing = stages.get(self._name)
        stages[self._name] = elapsed_ms if not existing else existing + elapsed_ms
        return False


class RequestProfiler:
    """
    Instantiated once per request. Holds an ordered stage-name -> elapsed-ms
    (or None for an explicitly-skipped stage) map, plus the query text, so a
    single structured latency report can be printed once the request finishes.
    """

    def __init__(self, query: str = "", enabled: Optional[bool] = None):
        self.enabled: bool = ENABLE_PROFILING if enabled is None else enabled
        self.query: str = query
        self._stages: "OrderedDict[str, Optional[float]]" = OrderedDict()
        self._request_start = time.perf_counter() if self.enabled else None
        # Phase 3 (multi-question batching) — simple named counters (e.g. "Sub-Questions
        # Detected", "Retrieval Operations", "Groq API Calls") and free-text notes (e.g.
        # per-call token usage), reported alongside the stage timings below.
        self._counters: "OrderedDict[str, int]" = OrderedDict()
        self._notes: list = []

    def count(self, name: str, n: int = 1) -> None:
        """Increments a named counter for this request. No-op when disabled."""
        if not self.enabled:
            return
        self._counters[name] = self._counters.get(name, 0) + n

    def note(self, text: str) -> None:
        """Records a free-text note (e.g. token usage for one Groq call) to be
        printed alongside the report. No-op when disabled."""
        if not self.enabled:
            return
        self._notes.append(text)

    def stage(self, name: str):
        """Context manager — `with profiler.stage("BM25"): ...`. No-op when
        profiling is disabled (does not call time.perf_counter at all)."""
        if not self.enabled:
            return _NOOP_STAGE
        return _StageTimer(self, name)

    def skip(self, name: str) -> None:
        """Explicitly mark a stage as bypassed on this request, so the report
        prints it as SKIPPED instead of silently omitting it. A stage that is
        both timed and skipped (shouldn't normally happen) keeps the timed
        value — skip() only sets stages that haven't been recorded yet."""
        if not self.enabled:
            return
        self._stages.setdefault(name, None)

    def finalize(self, expected_stages: Iterable[str]) -> None:
        """Marks any stage name in `expected_stages` that was neither timed
        nor explicitly skipped during this request as SKIPPED. Call once,
        after routing completes, so every fast-path/early-return branch in
        _route_message doesn't need its own profiler.skip(...) calls sprinkled
        through it — a stage nobody touched this request simply never ran."""
        if not self.enabled:
            return
        for name in expected_stages:
            self._stages.setdefault(name, None)

    def report(self) -> Optional[str]:
        """Logs (via logger.info, matching main.py's existing request-timing
        log style) and returns the formatted report block. Returns None
        (and logs nothing) when profiling is disabled."""
        if not self.enabled:
            return None

        total_ms = 1000.0 * (time.perf_counter() - self._request_start) if self._request_start else 0.0
        name_width = max((len(n) for n in self._stages), default=10)
        name_width = max(name_width, len("TOTAL"))

        lines = []
        lines.append("=" * 72)
        lines.append(f"REQUEST PROFILE  |  query: \"{self.query[:80]}\"")
        lines.append("-" * 72)
        for name, ms in self._stages.items():
            if ms is None:
                lines.append(f"  {name:<{name_width}} : {'SKIPPED':>10}")
            else:
                pct = (ms / total_ms * 100.0) if total_ms > 0 else 0.0
                lines.append(f"  {name:<{name_width}} : {ms:8.2f} ms  ({pct:5.1f}%)")
        lines.append("-" * 72)
        lines.append(f"  {'TOTAL':<{name_width}} : {total_ms:8.2f} ms  (100.0%)")
        if self._counters:
            lines.append("-" * 72)
            for name, n in self._counters.items():
                lines.append(f"  {name:<{name_width}} : {n:>10}")
        if self._notes:
            lines.append("-" * 72)
            for note in self._notes:
                lines.append(f"  {note}")
        lines.append("=" * 72)

        report_str = "\n".join(lines)
        logger.info("\n" + report_str)
        return report_str


def get_noop_profiler() -> RequestProfiler:
    """Shared disabled-profiler instance for call sites that need a default
    `profiler` argument without constructing a fresh object each time (e.g.
    module-level defaults in rag_engine.py / hybrid_retriever.py)."""
    return _NOOP_PROFILER


_NOOP_PROFILER = RequestProfiler(enabled=False)


# The full set of stage names the request pipeline can produce, in pipeline
# order. Passed to RequestProfiler.finalize() at the end of CollegeAssistant.
# chat()/chat_stream() so any stage a given request's fast-path never reached
# still shows up in the report as SKIPPED rather than being silently omitted.
# Adding/removing a stage elsewhere in the pipeline just means updating this
# one list — no other profiler code needs to change.
REQUEST_PIPELINE_STAGES = [
    "Scenario Advisory",
    "HOD Lookup",
    "Faculty Lookup",
    "Admin Lookup",
    "Labs Lookup",
    "Context",
    "Website Lookup",
    "Structured Lookup",
    "Intent Router",
    "BM25",
    "ChromaDB",
    "RRF",
    "Cross Encoder",
    "Prompt Build",
    "Groq API",
    "Response Format",
]
