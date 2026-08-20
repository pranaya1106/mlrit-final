import json
import logging
import time
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from starlette.concurrency import iterate_in_threadpool
from pydantic import BaseModel, Field

from config import HOST, PORT, CORS_ORIGINS, GROQ_API_KEY, WEBSITE_ROUTES
from chatbot import CollegeAssistant
from profiler import RequestProfiler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# Global chatbot instance
assistant: Optional[CollegeAssistant] = None

# In-memory session storage
sessions: Dict[str, List[Dict[str, str]]] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize the chatbot on startup and clean up on shutdown."""
    global assistant
    logger.info("Starting MLRIT Chatbot API...")
    if not GROQ_API_KEY:
        # Every LLM-dependent path (RAG answers, website-content summaries, off-topic
        # redirects) needs this. Don't crash — fast-path/direct-index answers still
        # work without it — but make the gap impossible to miss in the logs.
        logger.error(
            "GROQ_API_KEY is not set. LLM-dependent responses (RAG answers, website-content "
            "summaries, off-topic redirects) will fail at request time. Set it in chatbot/.env "
            "(or the deployment platform's environment variables) before serving production traffic."
        )
    try:
        assistant = CollegeAssistant()
        logger.info("CollegeAssistant initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize CollegeAssistant: {e}")
        # Don't crash the server — allow degraded mode
        assistant = None
    yield
    logger.info("Shutting down MLRIT Chatbot API...")


# Initialize FastAPI app
app = FastAPI(
    title="MLRIT College AI Chatbot API",
    description="Production-ready RAG-powered chatbot for MLR Institute of Technology",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
# Wildcard origin + allow_credentials=True is an invalid combination per the CORS
# spec — browsers reject it outright. This frontend never sends credentialed
# requests to the chatbot, so it's safe to disable credentials specifically when
# CORS_ORIGINS is left at its default "*" (local dev); production deployments
# should set CORS_ORIGINS to the real site origin(s) explicitly.
_cors_is_wildcard = CORS_ORIGINS == ["*"]
if _cors_is_wildcard:
    logger.warning(
        "CORS_ORIGINS is '*' — fine for local development, but must be set to the "
        "exact production frontend origin(s) (e.g. https://mlrit.ac.in) before deployment."
    )
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=not _cors_is_wildcard,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request / Response Models ────────────────────────────────────────────────

class ConversationTurn(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User message")
    session_id: str = Field(default="default", description="Session identifier")
    conversation_history: Optional[List[ConversationTurn]] = Field(
        default=None, description="Previous conversation turns"
    )


class EntityLink(BaseModel):
    label: str
    url: str


class ChatResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]] = []
    navigation_target: Optional[str] = None
    navigation_url: Optional[str] = None
    entities: List[EntityLink] = []
    confidence: float = 0.0
    query_type: str = "general"
    session_id: str


class ReindexResponse(BaseModel):
    success: bool
    message: str
    chunk_count: int


class HealthResponse(BaseModel):
    status: str
    pdf_count: int
    vector_count: int
    pdf_dir: str
    chroma_dir: str
    uptime_seconds: float


# Track startup time
_start_time = time.time()


# ─── Middleware ───────────────────────────────────────────────────────────────

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests and their response times."""
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    logger.info(f"{request.method} {request.url.path} → {response.status_code} ({duration}ms)")
    return response


# ─── Exception Handlers ──────────────────────────────────────────────────────

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again."},
    )


# ─── Endpoints ───────────────────────────────────────────────────────────────

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chat endpoint. Accepts a user message and returns an AI-generated response.

    - Handles navigation, department-specific, and general queries
    - Maintains conversation context per session
    - Returns sources from PDF documents when available
    """
    if assistant is None:
        raise HTTPException(
            status_code=503,
            detail="Chatbot is not available. Please try again later.",
        )

    session_id = request.session_id

    # Build conversation history from request or session storage
    if request.conversation_history is not None:
        history = [{"role": t.role, "content": t.content} for t in request.conversation_history]
    else:
        history = sessions.get(session_id, [])

    try:
        # Phase 1 instrumentation (see profiler.py) — a no-op when ENABLE_PROFILING
        # is unset/false, so this changes nothing about the response or its timing.
        profiler = RequestProfiler(query=request.message)
        result = await assistant.chat(
            message=request.message,
            session_id=session_id,
            conversation_history=history,
            profiler=profiler,
        )

        # Update session history
        history.append({"role": "user", "content": request.message})
        history.append({"role": "assistant", "content": result["answer"]})

        # Keep only last 20 turns to prevent memory bloat
        if len(history) > 20:
            history = history[-20:]
        sessions[session_id] = history

        return ChatResponse(
            answer=result["answer"],
            sources=result.get("sources", []),
            navigation_target=result.get("navigation_target"),
            navigation_url=result.get("navigation_url"),
            entities=result.get("entities", []),
            confidence=result.get("confidence", 0.5),
            query_type=result.get("query_type", "general"),
            session_id=session_id,
        )

    except Exception as e:
        logger.error(f"Chat error for session {session_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to process your message. Please try again.",
        )


@app.post("/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    """
    Streaming counterpart to /chat — Server-Sent Events (SSE). Each event's
    `data:` payload is a JSON object shaped like the token/done dicts yielded
    by CollegeAssistant.chat_stream (see chatbot.py). Session history handling
    mirrors /chat exactly, just recorded after the stream completes.
    """
    if assistant is None:
        raise HTTPException(status_code=503, detail="Chatbot is not available. Please try again later.")

    session_id = request.session_id
    if request.conversation_history is not None:
        history = [{"role": t.role, "content": t.content} for t in request.conversation_history]
    else:
        history = sessions.get(session_id, [])

    async def event_source():
        final_answer = ""
        # Phase 1 instrumentation (see profiler.py) — best-effort for the streaming
        # path, per the same no-op-when-disabled contract as /chat above. Reporting
        # happens inside chat_stream's own worker thread once the stream ends, so
        # nothing here needs to change about the generator/threading logic.
        stream_profiler = RequestProfiler(query=request.message)
        try:
            async for event in iterate_in_threadpool(
                assistant.chat_stream(request.message, session_id, history, profiler=stream_profiler)
            ):
                if event["type"] == "done":
                    final_answer = event.get("answer", "")
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as e:
            logger.error(f"Chat stream error for session {session_id}: {e}", exc_info=True)
            yield f"data: {json.dumps({'type': 'error', 'message': 'Failed to process your message. Please try again.'})}\n\n"
            return

        history.append({"role": "user", "content": request.message})
        history.append({"role": "assistant", "content": final_answer})
        sessions[session_id] = history[-20:]

    return StreamingResponse(event_source(), media_type="text/event-stream")


@app.post("/reindex", response_model=ReindexResponse)
async def reindex_endpoint():
    """
    Trigger a full reindex of all PDF documents.
    Use this after adding new PDFs to the pdfs/ directory.
    """
    if assistant is None:
        raise HTTPException(status_code=503, detail="Chatbot is not available.")

    try:
        result = assistant.reindex_pdfs()
        return ReindexResponse(
            success=result["success"],
            message=result["message"],
            chunk_count=result["chunk_count"],
        )
    except Exception as e:
        logger.error(f"Reindex error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Reindex failed: {str(e)}")


@app.get("/health", response_model=HealthResponse)
async def health_endpoint():
    """
    Health check endpoint. Returns system status, PDF count, and vector store stats.
    """
    uptime = round(time.time() - _start_time, 2)

    if assistant is None:
        return HealthResponse(
            status="degraded",
            pdf_count=0,
            vector_count=0,
            pdf_dir="./pdfs",
            chroma_dir="./chroma_db",
            uptime_seconds=uptime,
        )

    info = assistant.get_health_info()
    return HealthResponse(
        status=info.get("status", "unknown"),
        pdf_count=info.get("pdf_count", 0),
        vector_count=info.get("vector_count", 0),
        pdf_dir=info.get("pdf_dir", "./pdfs"),
        chroma_dir=info.get("chroma_dir", "./chroma_db"),
        uptime_seconds=uptime,
    )


@app.get("/routes")
async def routes_endpoint():
    """
    Return all configured website routes.
    Useful for the frontend to know available navigation targets.
    """
    return {
        "routes": WEBSITE_ROUTES,
        "count": len(WEBSITE_ROUTES),
    }


@app.get("/")
async def root():
    """Root endpoint — API info."""
    return {
        "name": "MLRIT College AI Chatbot API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "chat": "POST /chat",
            "reindex": "POST /reindex",
            "health": "GET /health",
            "routes": "GET /routes",
            "docs": "GET /docs",
        },
    }


# ─── Entry Point ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    logger.info(f"Starting server on {HOST}:{PORT}")
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=False,
        log_level="info",
        access_log=True,
    )
