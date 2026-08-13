import difflib
import hashlib
import logging
import time
from collections import OrderedDict
from typing import List, Optional, Dict, Any

from langchain_core.documents import Document
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

from config import GROQ_API_KEY, LLM_MODEL, MAX_RETRIEVAL_DOCS, COLLEGE_INFO
from intent_router import get_retrieval_profile
from profiler import get_noop_profiler
from groq_metrics import call_groq, groq_call_scope, build_http_client

logger = logging.getLogger(__name__)

# The placements line is built at call time (see _build_system_prompt below) from
# COLLEGE_INFO, not baked in here as a static figure — COLLEGE_INFO gets synced
# from the live PlacementIndex (lib/placements.ts) at CollegeAssistant startup,
# so this stays consistent with every other placement figure the assistant reports
# instead of carrying its own separate, driftable copy.
MLRIT_SYSTEM_PROMPT_TEMPLATE = """You are a concise and friendly AI assistant for MLR Institute of Technology (MLRIT), Dundigal, Hyderabad.

## Core Facts
- Established: 2005 | Affiliation: JNTUH | Approvals: AICTE, NAAC, NBA
- NIRF: 201-300 (Engg) | Times: 6th in Telangana | Careers360: AAAA
- Phone: +91 96522 26061 | Email: info@mlrinstitutions.ac.in | Web: https://mlrit.ac.in
- Placements: {placement_rate} rate | Highest: {highest_package} | 200+ recruiters
- B.Tech: CSE, ECE, EEE, IT, CSIT, Mechanical, Aeronautical, AIML, CSE-CS, CSE-DS | PG: M.Tech, MBA, Ph.D

## CRITICAL Response Rules
1. **Be brief by default.** For general questions about a department or topic, give a SHORT summary (3-5 lines max). Do NOT dump everything you know.
2. **Only expand if asked.** If the user asks "tell me more", "elaborate", "what else", "details", "explain", then give a fuller response.
3. **One topic at a time.** Answer only what was asked. Do not volunteer extra sections.
4. **No walls of text.** Use at most 3-4 bullet points for a summary response.
5. **End with an offer.** After a brief answer, add one line like: "Want to know more about [specific aspect]?"
6. Never make up specific numbers or facts not in your knowledge base.
7. For fee amounts, direct users to the official website or phone. You can and should answer questions about HODs and specific faculty members using the provided context.
8. If the user is asking about a person, state their role, department, and specialization from the context.
9. Never start a sentence with filler words like "So,", "Actually,", "Basically,", or "Unfortunately," — speak like a friendly admission counselor, not a hedging assistant.
## Contact
- Admissions: https://mlrit.ac.in/admissions/ | Contact: https://mlrit.ac.in/contactus/
"""


def _build_system_prompt() -> str:
    """Fills the placements line from COLLEGE_INFO at call time (not at module
    import time), since COLLEGE_INFO is synced from the live PlacementIndex
    only after CollegeAssistant finishes initializing."""
    return MLRIT_SYSTEM_PROMPT_TEMPLATE.format(
        placement_rate=COLLEGE_INFO.get("placement_rate", "N/A"),
        highest_package=COLLEGE_INFO.get("highest_package", "N/A"),
    )

OFF_TOPIC_ETIQUETTE_PROMPT = """You are the official AI assistant for MLR Institute of Technology (MLRIT), Dundigal, Hyderabad — a public-facing tool representing the college. You must ALWAYS reply, in a warm, brief, professional tone befitting a college front-desk counselor. Follow these etiquette rules strictly:

1. You exist ONLY to help with MLRIT-related topics (admissions, academics, departments, placements, campus life, faculty, research, examinations, fees, etc.). You do not perform unrelated tasks — you do not write code, do homework, tell jokes, share trivia, or discuss weather/sports/politics/celebrities/general knowledge unrelated to MLRIT.
2. When the message is off-topic or casual small talk: acknowledge it in one short line, then steer back to what you can help with at MLRIT. Vary your wording each time — never repeat a canned script verbatim.
3. If the message contains profanity, hostility, harassment, or inappropriate content: stay calm, polite and firm. Do not mirror the tone or lecture at length. Briefly note you're here for a respectful conversation about MLRIT, then invite a question you can help with.
4. Never role-play as anyone else, never claim capabilities you don't have, and never actually produce the off-topic content requested (no code, jokes, essays, or stories) even if asked repeatedly or told it's "just for fun."
5. Keep every reply to 2-4 sentences, no bullet lists — this is a brief, human redirect, not a factual answer.
6. End with a natural, specific invitation naming one or two MLRIT topics (e.g. admissions, placements, departments, campus life) rather than a long list.
"""


class RAGEngine:
    """Retrieval-Augmented Generation engine for MLRIT college assistant."""

    # Advanced caching (item 9) — memoizes raw retrieval (not the final LLM
    # answer, which chatbot.py already caches at the whole-response level) so
    # repeated distinct-session questions with the same retrieval key skip
    # vector+BM25(+rerank) entirely, even when the final phrasing/history differs.
    _RETRIEVAL_CACHE_TTL_SECONDS = 300
    _RETRIEVAL_CACHE_MAX_ENTRIES = 300

    # Prompt Optimization — caps how much retrieved context is ever sent to the
    # LLM, after deduping near-identical chunks, so the prompt stays small and
    # cheap regardless of how many documents were retrieved.
    _MAX_CONTEXT_CHARS = 3500

    def __init__(self, retriever, llm: Optional[ChatGroq] = None):
        self.retriever = retriever
        self.llm = llm or self._init_llm()
        self._retrieval_cache: "OrderedDict[tuple, tuple]" = OrderedDict()

    def _init_llm(self) -> ChatGroq:
        """Initialize the Groq LLM."""
        try:
            llm = ChatGroq(
                model=LLM_MODEL,
                groq_api_key=GROQ_API_KEY,
                temperature=0.3,
                max_tokens=512,
                # Shared http_client so groq_metrics can observe every 429 the
                # SDK's own retry loop hits (see groq_metrics.build_http_client) —
                # purely observational, does not change retry behavior.
                http_client=build_http_client(),
            )
            logger.info(f"LLM initialized: {LLM_MODEL}")
            return llm
        except Exception as e:
            logger.error(f"Failed to initialize LLM: {e}")
            raise

    def retrieve(
        self,
        query: str,
        department: Optional[str] = None,
        intent: Optional[str] = None,
        profiler=None,
    ) -> List[Document]:
        """
        Retrieve relevant documents via the hybrid (semantic + keyword) retriever,
        which fuses ChromaDB and BM25 results and re-ranks them before returning.
        Optionally filter by department. `intent` (see intent_router.py) drives
        the dynamic top_k/candidate_k/force_rerank profile — e.g. a faculty/
        department-shaped question only needs 1-2 chunks, while a comparison
        needs a wider candidate pool and a forced cross-encoder pass.
        """
        profiler = profiler or get_noop_profiler()
        profile = get_retrieval_profile(intent)
        top_k = profile["top_k"]

        cache_key = (query.strip().lower(), department, top_k, intent)
        cached = self._retrieval_cache_get(cache_key)
        if cached is not None:
            logger.info(f"[timing] retrieval cache hit for query='{query[:60]}'")
            # A cache hit skips every downstream retrieval sub-stage entirely.
            profiler.skip("BM25")
            profiler.skip("ChromaDB")
            profiler.skip("RRF")
            profiler.skip("Cross Encoder")
            return cached

        try:
            profiler.count("Retrieval Operations")
            docs = self.retriever.retrieve(
                query,
                k=top_k,
                department=department,
                candidate_k=profile["candidate_k"],
                force_rerank=profile["force_rerank"],
                profiler=profiler,
            )
            logger.info(f"Retrieved {len(docs)} documents for query: '{query[:60]}' (intent={intent}, top_k={top_k})")
            self._retrieval_cache_set(cache_key, docs)
            return docs
        except Exception as e:
            logger.error(f"Retrieval failed: {e}")
            return []

    def _retrieval_cache_get(self, key: tuple) -> Optional[List[Document]]:
        entry = self._retrieval_cache.get(key)
        if entry is None:
            return None
        docs, expires_at = entry
        if time.monotonic() > expires_at:
            self._retrieval_cache.pop(key, None)
            return None
        self._retrieval_cache.move_to_end(key)
        return docs

    def _retrieval_cache_set(self, key: tuple, docs: List[Document]) -> None:
        self._retrieval_cache[key] = (docs, time.monotonic() + self._RETRIEVAL_CACHE_TTL_SECONDS)
        self._retrieval_cache.move_to_end(key)
        while len(self._retrieval_cache) > self._RETRIEVAL_CACHE_MAX_ENTRIES:
            self._retrieval_cache.popitem(last=False)

    def format_sources(self, docs: List[Document]) -> List[Dict[str, Any]]:
        """Format source documents into citation-friendly dicts."""
        sources = []
        seen = set()

        for doc in docs:
            source = doc.metadata.get("source", "Unknown")
            page = doc.metadata.get("page", "?")
            department = doc.metadata.get("department", "General")

            key = f"{source}:{page}"
            if key not in seen:
                seen.add(key)
                sources.append({
                    "file": source,
                    "page": page,
                    "department": department,
                    "snippet": doc.page_content[:150].strip() + "..." if len(doc.page_content) > 150 else doc.page_content.strip(),
                })

        return sources

    async def generate_answer(
        self,
        query: str,
        context: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        profiler=None,
    ) -> str:
        """
        Generate an answer using the LLM with the provided context and conversation history.

        The actual Groq call runs off the event loop thread (see
        groq_metrics.call_groq) so a rate-limit retry sleep here never blocks
        other in-flight requests.
        """
        profiler = profiler or get_noop_profiler()
        with profiler.stage("Prompt Build"):
            messages = self._build_messages(query, context, conversation_history)

        try:
            t0 = time.perf_counter()
            profiler.count("Groq API Calls")
            with profiler.stage("Groq API"):
                response = await call_groq(self.llm.invoke, messages, profiler=profiler, label="generate_answer")
            elapsed_ms = 1000 * (time.perf_counter() - t0)
            answer = response.content.strip()
            self._log_token_usage(response, profiler)
            logger.info(f"[timing] LLM generate={elapsed_ms:.0f}ms, {len(answer)} chars, query='{query[:60]}'")
            return answer
        except Exception as e:
            error_str = str(e)
            logger.error(f"LLM generation failed: {e}")
            # Rate limit — give a friendly message with retry hint
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                return "I'm currently experiencing high demand. Please wait a moment and try again. For immediate help, contact MLRIT at +91 96522 26061 or visit https://mlrit.ac.in"
            return "I'm sorry, I encountered an error while generating a response. Please try again or contact MLRIT directly at +91 96522 26061."

    @staticmethod
    def _build_messages(
        query: str,
        context: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
    ) -> List:
        messages = [SystemMessage(content=_build_system_prompt())]

        if conversation_history:
            for turn in conversation_history[-6:]:  # Keep last 6 turns for context
                role = turn.get("role", "user")
                content = turn.get("content", "")
                if role == "user":
                    messages.append(HumanMessage(content=content))
                elif role == "assistant":
                    messages.append(AIMessage(content=content))

        # Phase 2 optimization: this used to restate the system prompt's own
        # "CRITICAL Response Rules" (brevity, only-answer-what's-asked, end with
        # an offer) here nearly verbatim, on every single call — the system
        # prompt above is already sent with every request and already states
        # those rules, so repeating them per-message was pure token waste with
        # no behavior difference (the model still receives the exact same
        # instructions, once, via the system prompt).
        if context.strip():
            user_message = f"""Using the context below from MLRIT's documents, answer the user's question.

Context:
---
{context}
---

User question: {query}"""
        else:
            user_message = f"Question about MLRIT: {query}"

        messages.append(HumanMessage(content=user_message))
        return messages

    def generate_answer_stream(
        self,
        query: str,
        context: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        profiler=None,
    ):
        """
        Streaming Responses — yields answer text incrementally as the LLM
        produces it, instead of blocking until the full response is ready.
        Used by the /chat/stream endpoint. Falls back to yielding one final
        error string (matching generate_answer's own fallback text) if the
        stream itself fails partway through.
        """
        profiler = profiler or get_noop_profiler()
        with profiler.stage("Prompt Build"):
            messages = self._build_messages(query, context, conversation_history)
        t0 = time.perf_counter()
        chars = 0
        try:
            profiler.count("Groq API Calls")
            # This runs inside chat_stream's own dedicated worker thread (see
            # chatbot.py), never on the FastAPI event loop thread, so it's safe
            # to hold the concurrency gate synchronously for the whole
            # iteration — no asyncio.to_thread offload needed here.
            with profiler.stage("Groq API"), groq_call_scope(profiler, label="stream"):
                for chunk in self.llm.stream(messages):
                    piece = getattr(chunk, "content", "") or ""
                    if piece:
                        chars += len(piece)
                        yield piece
            logger.info(f"[timing] LLM stream generate={1000*(time.perf_counter()-t0):.0f}ms, {chars} chars, query='{query[:60]}'")
        except Exception as e:
            error_str = str(e)
            logger.error(f"LLM streaming generation failed: {e}")
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                yield "I'm currently experiencing high demand. Please wait a moment and try again. For immediate help, contact MLRIT at +91 96522 26061 or visit https://mlrit.ac.in"
            else:
                yield "I'm sorry, I encountered an error while generating a response. Please try again or contact MLRIT directly at +91 96522 26061."

    # Phase 2 optimization: this used to be a real Groq call (see
    # OFF_TOPIC_ETIQUETTE_PROMPT above, kept only as a record of the etiquette
    # rules these templates encode) — the audit found its only value-add over a
    # canned reply was wording *variety*, never new facts (rule 4 of that prompt
    # explicitly forbade it from answering the off-topic request itself), so it
    # was the single highest-value call to eliminate outright: a full ~400-1000ms+
    # Groq round trip was buying nothing but paraphrase variety. These template
    # pools reproduce that variety deterministically (same query text always picks
    # the same reply, so results stay reproducible/testable) with zero LLM cost.
    _OFF_TOPIC_TEMPLATES = [
        "That's outside what I can help with — I'm the MLRIT assistant, so I stick to things like admissions, "
        "placements, departments, and campus life. What would you like to know about MLRIT?",
        "I can't help with that one, but I'm happy to help with anything about MLRIT — admissions, academics, "
        "placements, or campus facilities. What's on your mind?",
        "That's a bit outside my scope — I'm here specifically for MLRIT questions. Want to know about our "
        "departments, placements, or admissions process instead?",
        "I'll have to pass on that, but ask me anything about MLRIT — departments, faculty, placements, "
        "hostel life, you name it.",
        "Not something I can help with directly, but I know MLRIT inside out — admissions, placements, "
        "research, campus life. What would be useful to you?",
    ]
    _INAPPROPRIATE_TEMPLATES = [
        "Let's keep this a respectful conversation. I'm here to help with MLRIT-related questions — feel "
        "free to ask about admissions, departments, or placements.",
        "I'd rather keep things courteous here. I'm glad to help with anything about MLRIT — admissions, "
        "academics, campus life — whenever you're ready.",
        "Let's stay on friendly terms. If there's something about MLRIT I can help with — departments, "
        "placements, facilities — just ask.",
    ]
    _HOSTILE_PATTERN_RE = None  # set lazily below (avoid recompiling per call)

    @classmethod
    def _is_hostile_or_inappropriate(cls, text: str) -> bool:
        """Small, deterministic heuristic — not the LLM's own judgment anymore,
        so it's intentionally narrow (common profanity/hostility markers) rather
        than trying to replicate nuanced moderation. Good enough to pick between
        the two template pools above; anything ambiguous falls back to the
        (perfectly fine) plain off-topic pool."""
        import re as _re
        if cls._HOSTILE_PATTERN_RE is None:
            cls._HOSTILE_PATTERN_RE = _re.compile(
                r"\b(fuck|shit|bitch|asshole|bastard|idiot|stupid|dumb(ass)?|shut up|hate you|"
                r"kill (yourself|urself)|screw you)\b",
                _re.IGNORECASE,
            )
        return bool(cls._HOSTILE_PATTERN_RE.search(text or ""))

    def generate_off_topic_response(
        self,
        query: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        """
        Deterministic, template-based redirect for a message the Scope Gate /
        Off-Topic Guard flagged as unrelated to MLRIT (small talk, unrelated task
        requests, or inappropriate content). Phase 2 optimization: this no longer
        calls Groq — see `_OFF_TOPIC_TEMPLATES` / `_INAPPROPRIATE_TEMPLATES` above
        for why. `conversation_history` is accepted for API compatibility (callers
        pass it unconditionally) but is no longer consulted — the reply doesn't
        depend on prior turns.
        """
        pool = self._INAPPROPRIATE_TEMPLATES if self._is_hostile_or_inappropriate(query) else self._OFF_TOPIC_TEMPLATES
        # Deterministic (not random.choice, and not Python's own hash() — that's
        # salted per-process via PYTHONHASHSEED, so it wouldn't even be stable
        # across restarts): md5 gives the same query the same reply forever,
        # which keeps this reproducible/testable, while still varying across
        # different queries so it doesn't read as one rigid script.
        digest = hashlib.md5(query.strip().lower().encode("utf-8")).hexdigest()
        answer = pool[int(digest, 16) % len(pool)]
        logger.info(f"Off-topic template redirect ({len(answer)} chars) for query: '{query[:60]}'")
        return answer

    @classmethod
    def _dedupe_and_cap_context(cls, docs: List[Document]) -> str:
        """
        Prompt Optimization — drops near-duplicate chunks (e.g. the same
        paragraph retrieved twice via both the vector and BM25 channels) and
        caps total context length, so the prompt sent to the LLM stays small
        even when the retriever returns several overlapping chunks. Chunks are
        kept in their existing rank order; once the char budget is spent,
        lower-ranked chunks are simply omitted rather than truncated mid-chunk.
        """
        kept: List[Document] = []
        kept_texts: List[str] = []
        for doc in docs:
            text = doc.page_content.strip()
            if not text:
                continue
            is_duplicate = any(
                difflib.SequenceMatcher(None, text, existing).ratio() > 0.85
                for existing in kept_texts
            )
            if is_duplicate:
                continue
            kept.append(doc)
            kept_texts.append(text)

        context_parts = []
        total_chars = 0
        for i, doc in enumerate(kept, start=1):
            source = doc.metadata.get("source", "Unknown")
            page = doc.metadata.get("page", "?")
            dept = doc.metadata.get("department", "General")
            part = f"[Source {i}: {source}, Page {page}, Dept: {dept}]\n{doc.page_content}"
            if total_chars + len(part) > cls._MAX_CONTEXT_CHARS and context_parts:
                # Budget spent — stop adding lower-ranked chunks rather than
                # truncating one mid-sentence.
                break
            context_parts.append(part)
            total_chars += len(part)

        return "\n\n".join(context_parts)

    def retrieve_context(
        self,
        query: str,
        department: Optional[str] = None,
        intent: Optional[str] = None,
        profiler=None,
    ) -> Dict[str, Any]:
        """
        The retrieval half of `answer_with_rag` — retrieve, dedupe/cap context,
        format sources, compute confidence — WITHOUT generating an answer. Split
        out for Phase 3 (multi-question batching): a multi-part message's
        department-scoped sub-questions can each retrieve their own context
        (retrieval quality/logic is unchanged — every question still gets its
        own real retrieval) and defer the actual Groq call until the caller
        knows whether 2+ of them can share ONE `generate_batched_answers` call.
        """
        profiler = profiler or get_noop_profiler()
        docs = self.retrieve(query, department=department, intent=intent, profiler=profiler)
        context = self._dedupe_and_cap_context(docs)
        sources = self.format_sources(docs)
        confidence = min(1.0, len(docs) / MAX_RETRIEVAL_DOCS) if docs else 0.5
        return {"context": context, "sources": sources, "confidence": round(confidence, 2), "retrieved_count": len(docs)}

    async def answer_with_rag(
        self,
        query: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        department: Optional[str] = None,
        intent: Optional[str] = None,
        profiler=None,
    ) -> Dict[str, Any]:
        """
        Full RAG pipeline: retrieve relevant docs, build context, generate answer.
        Returns dict with answer, sources, and confidence. `intent` (see
        intent_router.py) drives dynamic top_k/candidate_k/rerank — see retrieve().
        """
        profiler = profiler or get_noop_profiler()
        pipeline_start = time.perf_counter()
        retrieved = self.retrieve_context(query, department=department, intent=intent, profiler=profiler)
        retrieve_ms = 1000 * (time.perf_counter() - pipeline_start)

        answer = await self.generate_answer(query, retrieved["context"], conversation_history, profiler=profiler)

        total_ms = 1000 * (time.perf_counter() - pipeline_start)
        logger.info(
            f"[timing] answer_with_rag total={total_ms:.0f}ms retrieve={retrieve_ms:.0f}ms "
            f"llm={total_ms - retrieve_ms:.0f}ms query='{query[:60]}'"
        )

        return {
            "answer": answer,
            "sources": retrieved["sources"],
            "confidence": retrieved["confidence"],
            "retrieved_count": retrieved["retrieved_count"],
        }

    _BATCH_ANSWER_RE = None  # compiled lazily below (shared regex, avoid recompiling per call)

    async def generate_batched_answers(
        self,
        items: List[Dict[str, str]],
        conversation_history: Optional[List[Dict[str, str]]] = None,
        profiler=None,
    ) -> List[str]:
        """
        Phase 3 optimization: answers 2+ department/general RAG sub-questions
        (from one multi-part user message, already confirmed to share the same
        retrieval department/intent bucket by the caller) with ONE Groq call
        instead of one call per question. `items` is [{"query":..,"context":..}, ...]
        — each question's own retrieval already ran independently (retrieval
        quality/logic unchanged), only the generation step is merged.

        Falls back to one `generate_answer` call per item (the pre-batch
        behavior) if the model doesn't reply in the expected per-question
        format — guarantees no loss of answer correctness, at the cost of
        losing the batching savings for that one request.
        """
        import re as _re
        profiler = profiler or get_noop_profiler()
        if len(items) == 1:
            return [await self.generate_answer(items[0]["query"], items[0]["context"], conversation_history, profiler=profiler)]

        if self._BATCH_ANSWER_RE is None:
            RAGEngine._BATCH_ANSWER_RE = _re.compile(r"ANSWER\s*(\d+)\s*:\s*", _re.IGNORECASE)

        with profiler.stage("Prompt Build"):
            blocks = [
                f"### Question {i}\nContext:\n---\n{item['context']}\n---\nQuestion: {item['query']}"
                for i, item in enumerate(items, start=1)
            ]
            combined_user_message = (
                "Answer EACH of the following questions separately, using ONLY that question's own context. "
                "Reply with exactly one \"ANSWER N:\" block per question below, in the same order, and nothing "
                "else before the first one. Keep each answer brief per the rules above.\n\n" + "\n\n".join(blocks)
            )
            messages = [SystemMessage(content=_build_system_prompt())]
            if conversation_history:
                for turn in conversation_history[-6:]:
                    role = turn.get("role", "user")
                    content = turn.get("content", "")
                    if role == "user":
                        messages.append(HumanMessage(content=content))
                    elif role == "assistant":
                        messages.append(AIMessage(content=content))
            messages.append(HumanMessage(content=combined_user_message))

        async def _fallback() -> List[str]:
            return [await self.generate_answer(item["query"], item["context"], conversation_history, profiler=profiler) for item in items]

        try:
            profiler.count("Groq API Calls")
            with profiler.stage("Groq API"):
                response = await call_groq(self.llm.invoke, messages, profiler=profiler, label="generate_batched_answers")
            raw = response.content.strip()
            self._log_token_usage(response, profiler)
        except Exception as e:
            logger.error(f"Batched RAG generation failed, falling back to per-question calls: {e}")
            return await _fallback()

        matches = list(self._BATCH_ANSWER_RE.finditer(raw))
        if len(matches) != len(items):
            logger.warning(
                f"Batched RAG response had {len(matches)} ANSWER blocks, expected {len(items)} — "
                "falling back to per-question calls"
            )
            return await _fallback()

        answers = []
        for idx in range(len(items)):
            start = matches[idx].end()
            end = matches[idx + 1].start() if idx + 1 < len(matches) else len(raw)
            answers.append(raw[start:end].strip())
        return answers

    @staticmethod
    def _log_token_usage(response, profiler) -> None:
        """Best-effort token-usage capture for the profiler (Phase 3 item 8) —
        Groq responses carry usage under `response_metadata['token_usage']` via
        langchain-groq; silently no-ops if that shape isn't present."""
        try:
            usage = (getattr(response, "response_metadata", None) or {}).get("token_usage") or {}
            if usage:
                profiler.note(
                    f"Groq tokens: prompt={usage.get('prompt_tokens')} "
                    f"completion={usage.get('completion_tokens')} total={usage.get('total_tokens')}"
                )
        except Exception:
            pass

    def answer_with_rag_stream(
        self,
        query: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        department: Optional[str] = None,
        intent: Optional[str] = None,
        profiler=None,
    ):
        """
        Streaming counterpart to answer_with_rag — retrieval runs the same way
        (cached, dynamic top_k/candidate_k/rerank via `intent`), then LLM tokens
        are yielded incrementally instead of returned as one blocking string.
        Yields dicts: {"type": "token", "text": ...} while generating, then a
        final {"type": "done", "sources": [...], "confidence": ...}.
        """
        profiler = profiler or get_noop_profiler()
        docs = self.retrieve(query, department=department, intent=intent, profiler=profiler)
        context = self._dedupe_and_cap_context(docs)
        sources = self.format_sources(docs)
        confidence = min(1.0, len(docs) / MAX_RETRIEVAL_DOCS) if docs else 0.5

        for piece in self.generate_answer_stream(query, context, conversation_history, profiler=profiler):
            yield {"type": "token", "text": piece}

        yield {"type": "done", "sources": sources, "confidence": round(confidence, 2)}
