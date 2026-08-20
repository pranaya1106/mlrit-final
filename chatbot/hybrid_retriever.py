import logging
import pickle
import re
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import List, Optional

from langchain_core.documents import Document
from rank_bm25 import BM25Okapi

from config import RERANK_MODEL
from profiler import get_noop_profiler

logger = logging.getLogger(__name__)

# Shared pool for running the vector-store and BM25 lookups concurrently —
# both are independent, read-only operations against separate indexes, so
# there's no reason to pay their latency sequentially. Small pool: these are
# short-lived per-request calls, not long background work.
_retrieval_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="retrieval")


def _tokenize(text: str) -> List[str]:
    return text.lower().split()


# Short, single-topic lookups where the RRF-fused (vector + BM25) order is already
# a reliable ranking — reranking these with the cross-encoder adds ~20-25s of CPU
# time for no measurable quality gain, since there is only one plausible topic to
# match rather than several semantically-close candidates to disambiguate.
SIMPLE_QUERY_TERMS = {
    "placements", "placement", "departments", "department", "cse", "ece", "eee",
    "aiml", "hod", "fee", "fees", "admission", "admissions", "mba", "mech",
    "mechanical", "aero", "aeronautical", "library", "hostel", "principal",
}


def _is_simple_query(query: str) -> bool:
    """True for short queries built entirely from simple keyword lookups
    (e.g. 'placements', 'cse hod', 'library fee') — as opposed to longer,
    semantically complex questions ('Compare CSE and AIML placements.') that
    still need cross-encoder reranking to disambiguate close candidates."""
    words = re.findall(r"[a-z]+", query.lower())
    return bool(words) and len(words) <= 3 and all(w in SIMPLE_QUERY_TERMS for w in words)


# Broader intent-based bypass, on top of the strict keyword-only check above —
# a short, single-topic factual question ("What is the CSE HOD's specialization?",
# "How many students in AIML?") has only one plausible topic to retrieve for, so
# the RRF-fused order is already reliable. Only questions that name 2+ distinct
# entities to disambiguate between (comparisons, "and"/"vs" conjunctions) or that
# run long enough to plausibly bundle several sub-asks still need the cross-encoder.
_COMPLEX_QUERY_MARKERS = re.compile(
    r"\b(compare|comparison|versus|vs\.?|difference between|better than|"
    r"pros and cons|advantages and disadvantages)\b"
)
_SIMPLE_QUERY_MAX_WORDS = 9


def _is_simple_intent_query(query: str) -> bool:
    """Intent-based reranker bypass: a short, single-clause factual question
    with no comparison/multi-entity marker doesn't need cross-encoder
    disambiguation — the fused vector+BM25 order already resolves it."""
    if _is_simple_query(query):
        return True
    words = re.findall(r"[a-z']+", query.lower())
    if not words or len(words) > _SIMPLE_QUERY_MAX_WORDS:
        return False
    if _COMPLEX_QUERY_MARKERS.search(query.lower()):
        return False
    # More than one '?' or a conjunction joining two separate asks ("and who is
    # the HOD") still benefits from reranking to sort out which chunk answers what.
    if query.count("?") > 1 or " and " in query.lower():
        return False
    return True


class BM25Index:
    """Keyword (BM25) index over the same chunks stored in ChromaDB, persisted to disk."""

    def __init__(self, persist_path: str):
        self.persist_path = Path(persist_path)
        self.documents: List[Document] = []
        self.bm25: Optional[BM25Okapi] = None
        self._load()

    def _load(self):
        if not self.persist_path.exists():
            return
        try:
            with open(self.persist_path, "rb") as f:
                data = pickle.load(f)
            self.documents = data.get("documents", [])
            self._build_index()
            logger.info(f"BM25 index loaded with {len(self.documents)} chunks")
        except Exception as e:
            logger.warning(f"Failed to load BM25 index, will rebuild: {e}")
            self.documents = []
            self.bm25 = None

    def _build_index(self):
        self.bm25 = BM25Okapi([_tokenize(d.page_content) for d in self.documents]) if self.documents else None

    def is_empty(self) -> bool:
        return not self.documents

    def rebuild(self, documents: List[Document]) -> None:
        self.documents = list(documents)
        self._build_index()
        try:
            self.persist_path.parent.mkdir(parents=True, exist_ok=True)
            with open(self.persist_path, "wb") as f:
                pickle.dump({"documents": self.documents}, f)
            logger.info(f"BM25 index rebuilt and persisted with {len(self.documents)} chunks")
        except Exception as e:
            logger.warning(f"Failed to persist BM25 index: {e}")

    def search(self, query: str, k: int = 10, department: Optional[str] = None) -> List[Document]:
        if not self.bm25 or not self.documents:
            return []
        try:
            scores = self.bm25.get_scores(_tokenize(query))
            ranked_idx = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
            ranked_docs = [self.documents[i] for i in ranked_idx if scores[i] > 0]

            if department:
                # Always department-scoped when a department is given, even if that
                # means returning zero results — never silently fall back to
                # unfiltered (cross-department) matches.
                filtered = [d for d in ranked_docs if d.metadata.get("department") == department]
                return filtered[:k]

            return ranked_docs[:k]
        except Exception as e:
            logger.error(f"BM25 search failed: {e}")
            return []


class HybridRetriever:
    """
    Combines ChromaDB semantic search with BM25 keyword search via Reciprocal Rank
    Fusion, then re-ranks the fused candidates with a cross-encoder before the top
    results are handed to the LLM as context.
    """

    def __init__(self, vector_store, bm25_index: BM25Index, candidate_k: int = 15, rerank_model: str = RERANK_MODEL):
        self.vector_store = vector_store
        self.bm25_index = bm25_index
        self.candidate_k = candidate_k
        self.rerank_model = rerank_model
        self._cross_encoder = None

    def _get_cross_encoder(self):
        if self._cross_encoder is None:
            from sentence_transformers import CrossEncoder
            self._cross_encoder = CrossEncoder(self.rerank_model)
            logger.info(f"Cross-encoder re-ranker loaded: {self.rerank_model}")
        return self._cross_encoder

    def preload(self) -> None:
        """
        Eagerly load the cross-encoder so the download/init cost happens once at
        application startup instead of on the first user request. Safe no-op if
        it's already loaded (singleton via _cross_encoder). Failures are logged
        and swallowed — retrieval still works via lazy-load on first use.
        """
        try:
            self._get_cross_encoder()
        except Exception as e:
            logger.warning(f"Cross-encoder preload failed, will lazy-load on first request: {e}")

    @staticmethod
    def _doc_key(doc: Document):
        m = doc.metadata
        return (m.get("source"), m.get("page"), m.get("chunk_id"))

    def _fuse(self, vector_docs: List[Document], bm25_docs: List[Document]) -> List[Document]:
        """Reciprocal Rank Fusion of the two ranked result lists."""
        scores = {}
        docs_by_key = {}

        for rank, doc in enumerate(vector_docs):
            key = self._doc_key(doc)
            docs_by_key[key] = doc
            scores[key] = scores.get(key, 0.0) + 1.0 / (rank + 60)

        for rank, doc in enumerate(bm25_docs):
            key = self._doc_key(doc)
            docs_by_key.setdefault(key, doc)
            scores[key] = scores.get(key, 0.0) + 1.0 / (rank + 60)

        fused_keys = sorted(scores.keys(), key=lambda k: scores[k], reverse=True)
        return [docs_by_key[key] for key in fused_keys]

    @staticmethod
    def _choose_channels(query: str, force_rerank: bool) -> tuple:
        """
        Smarter Hybrid Retrieval — picks which retrieval channels a query
        actually needs instead of always paying for vector + BM25 + cross-encoder:

        - forced rerank (e.g. comparison intent): full hybrid, both channels.
        - short, single-topic factual query (already bypasses the cross-encoder
          — see _is_simple_intent_query): keyword lookup, BM25 alone is reliable
          and skips the embedding-search cost too.
        - everything else (semantic/complex phrasing): full hybrid, both channels,
          fused order handed to the caller's simple-intent/rerank decision.

        Returns (use_vector, use_bm25).
        """
        if force_rerank:
            return True, True
        if _is_simple_intent_query(query):
            return False, True
        return True, True

    def retrieve(
        self,
        query: str,
        k: int,
        department: Optional[str] = None,
        candidate_k: Optional[int] = None,
        force_rerank: bool = False,
        profiler=None,
    ) -> List[Document]:
        profiler = profiler or get_noop_profiler()
        effective_candidate_k = min(candidate_k, self.candidate_k) if candidate_k else self.candidate_k
        use_vector, use_bm25 = self._choose_channels(query, force_rerank)

        t0 = time.perf_counter()
        vector_docs: List[Document] = []
        bm25_docs: List[Document] = []
        if use_vector and use_bm25:
            # Parallel Execution — both channels are independent read-only
            # lookups against separate indexes, run concurrently instead of
            # paying their latency sequentially. Each timed stage is entered
            # INSIDE its own worker thread so "BM25"/"ChromaDB" reflect that
            # channel's own duration even though they overlap in wall time.
            def _timed_vector_search():
                with profiler.stage("ChromaDB"):
                    return self.vector_store.similarity_search(query, k=effective_candidate_k, department=department)

            def _timed_bm25_search():
                with profiler.stage("BM25"):
                    return self.bm25_index.search(query, k=effective_candidate_k, department=department)

            future_vector = _retrieval_executor.submit(_timed_vector_search)
            future_bm25 = _retrieval_executor.submit(_timed_bm25_search)
            vector_docs = future_vector.result()
            bm25_docs = future_bm25.result()
        elif use_vector:
            with profiler.stage("ChromaDB"):
                vector_docs = self.vector_store.similarity_search(query, k=effective_candidate_k, department=department)
            profiler.skip("BM25")
        elif use_bm25:
            with profiler.stage("BM25"):
                bm25_docs = self.bm25_index.search(query, k=effective_candidate_k, department=department)
            profiler.skip("ChromaDB")
        t1 = time.perf_counter()

        with profiler.stage("RRF"):
            candidates = self._fuse(vector_docs, bm25_docs)[: max(effective_candidate_k, k)]
        t2 = time.perf_counter()
        channel_label = "vector+bm25" if (use_vector and use_bm25) else ("vector" if use_vector else "bm25")
        if not candidates:
            logger.info(
                f"[timing] retrieve: channels={channel_label} search={1000*(t1-t0):.0f}ms "
                f"fuse={1000*(t2-t1):.0f}ms rerank=skipped(no-candidates) query='{query[:60]}'"
            )
            profiler.skip("Cross Encoder")
            return []

        if not force_rerank and _is_simple_intent_query(query):
            # Skip the cross-encoder for short, single-topic factual lookups — the
            # RRF-fused order is already reliable and this avoids ~20-25s of CPU
            # inference for the vast majority of common informational queries.
            logger.info(
                f"[timing] retrieve: channels={channel_label} search={1000*(t1-t0):.0f}ms "
                f"fuse={1000*(t2-t1):.0f}ms rerank=skipped(simple-intent) query='{query[:60]}'"
            )
            profiler.skip("Cross Encoder")
            return candidates[:k]

        try:
            with profiler.stage("Cross Encoder"):
                encoder = self._get_cross_encoder()
                pairs = [(query, doc.page_content) for doc in candidates]
                rerank_scores = encoder.predict(pairs, batch_size=len(pairs))
                reranked = sorted(zip(candidates, rerank_scores), key=lambda cs: cs[1], reverse=True)
            t3 = time.perf_counter()
            logger.info(
                f"[timing] retrieve: channels={channel_label} search={1000*(t1-t0):.0f}ms "
                f"fuse={1000*(t2-t1):.0f}ms rerank={1000*(t3-t2):.0f}ms query='{query[:60]}'"
            )
            return [doc for doc, _ in reranked[:k]]
        except Exception as e:
            logger.warning(f"Re-ranking failed, falling back to fused order: {e}")
            return candidates[:k]
