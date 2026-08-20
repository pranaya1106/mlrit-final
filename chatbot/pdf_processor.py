import os
import logging
from pathlib import Path
from typing import List

from pypdf import PdfReader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from config import CHUNK_SIZE, CHUNK_OVERLAP

logger = logging.getLogger(__name__)


def scan_pdfs(pdf_dir: str) -> List[str]:
    """Recursively find all PDF files in the given directory."""
    pdf_paths = []
    pdf_dir_path = Path(pdf_dir)

    if not pdf_dir_path.exists():
        logger.warning(f"PDF directory does not exist: {pdf_dir}")
        return pdf_paths

    for pdf_file in pdf_dir_path.rglob("*.pdf"):
        pdf_paths.append(str(pdf_file))
        logger.info(f"Found PDF: {pdf_file}")

    logger.info(f"Total PDFs found: {len(pdf_paths)}")
    return pdf_paths


def get_department_from_path(pdf_path: str) -> str:
    """
    Extract department name from the PDF filename or path.

    KNOWN DATA GAP — chatbot/pdfs/"CSD CSM.pdf": this filename does not contain
    any key below (it has neither "aiml"/"artificial_intelligence" nor
    "cse_ds"/"cse-ds"/"data_science" as a literal substring — "csd"/"csm" are
    informal department abbreviations, not the mapped keys), so it falls
    through to "General" rather than "AIML" or "CSE-DS". Since this single
    file appears to cover CSE (Data Science) ["CSD"] and AIML ["CSM", the
    department's historical name at many JNTUH-affiliated colleges] together,
    it CANNOT be safely tagged as just one of the two — guessing either label
    would silently mix that department's content into the other's RAG
    retrieval, exactly the cross-department contamination this pipeline is
    built to prevent. Fix requires either splitting the source PDF by
    department or renaming/re-scoping it per department; both are content
    changes outside this codebase, not something to guess programmatically
    here. Until then, AIML/CSE-DS RAG queries correctly and honestly return
    "I couldn't find official information for the AIML/CSE-DS department"
    (see chatbot.py's _handle_department_query et al.) rather than borrowing
    CSE's or another department's content.
    """
    filename = Path(pdf_path).stem.lower()

    department_map = {
        "cse": "CSE",
        "computer_science": "CSE",
        "computer science": "CSE",
        "ece": "ECE",
        "electronics": "ECE",
        "eee": "EEE",
        "electrical": "EEE",
        "it": "IT",
        "information_technology": "IT",
        "information technology": "IT",
        "csit": "CSIT",
        "mechanical": "Mechanical",
        "mech": "Mechanical",
        "aeronautical": "Aeronautical",
        "aero": "Aeronautical",
        "aiml": "AIML",
        "artificial_intelligence": "AIML",
        "cse_cs": "CSE-CS",
        "cse-cs": "CSE-CS",
        "cyber_security": "CSE-CS",
        "cse_ds": "CSE-DS",
        "cse-ds": "CSE-DS",
        "data_science": "CSE-DS",
        "mba": "MBA",
        "management": "MBA",
        "admissions": "Admissions",
        "admission": "Admissions",
        "placement": "Placements",
        "placements": "Placements",
        "scholarship": "Scholarships",
        "scholarships": "Scholarships",
        "hostel": "Campus Life",
        "library": "Campus Life",
        "sports": "Campus Life",
        "campus": "Campus Life",
        "research": "Research",
        "naac": "Accreditation",
        "nirf": "Rankings",
        "iqac": "IQAC",
    }

    for key, dept in department_map.items():
        if key in filename:
            return dept

    # Check parent directory name
    parent = Path(pdf_path).parent.name.lower()
    for key, dept in department_map.items():
        if key in parent:
            return dept

    return "General"


def extract_text_from_pdf(pdf_path: str) -> List[dict]:
    """Extract text from a PDF file, returning list of {page_num, text} dicts."""
    pages_data = []

    try:
        reader = PdfReader(pdf_path)
        total_pages = len(reader.pages)
        logger.info(f"Processing {pdf_path} ({total_pages} pages)")

        for page_num, page in enumerate(reader.pages, start=1):
            try:
                text = page.extract_text()
                if text and text.strip():
                    pages_data.append({
                        "page_num": page_num,
                        "text": text.strip()
                    })
            except Exception as e:
                logger.warning(f"Could not extract page {page_num} from {pdf_path}: {e}")
                continue

    except Exception as e:
        logger.error(f"Failed to read PDF {pdf_path}: {e}")

    return pages_data


def chunk_documents(documents: List[Document]) -> List[Document]:
    """Split documents into chunks using RecursiveCharacterTextSplitter."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunked_docs = []
    for doc in documents:
        chunks = splitter.split_documents([doc])
        for i, chunk in enumerate(chunks):
            chunk.metadata["chunk_id"] = i
            chunked_docs.append(chunk)

    logger.info(f"Created {len(chunked_docs)} chunks from {len(documents)} documents")
    return chunked_docs


def process_pdf_files(pdf_paths: List[str]) -> List[Document]:
    """
    Extract and chunk a specific list of PDF file paths.
    Returns a list of LangChain Document objects with metadata.
    """
    if not pdf_paths:
        return []

    raw_documents = []

    for pdf_path in pdf_paths:
        department = get_department_from_path(pdf_path)
        pages_data = extract_text_from_pdf(pdf_path)

        for page_data in pages_data:
            doc = Document(
                page_content=page_data["text"],
                metadata={
                    "source": os.path.basename(pdf_path),
                    "source_path": pdf_path,
                    "department": department,
                    "page": page_data["page_num"],
                    "chunk_id": 0,
                }
            )
            raw_documents.append(doc)

    logger.info(f"Extracted {len(raw_documents)} pages from {len(pdf_paths)} PDFs")

    chunked_documents = chunk_documents(raw_documents)
    logger.info(f"Final chunk count: {len(chunked_documents)}")

    return chunked_documents


def process_all_pdfs(pdf_dir: str) -> List[Document]:
    """
    Main function: scan, extract, and chunk all PDFs in the directory.
    Returns a list of LangChain Document objects with metadata.
    """
    pdf_paths = scan_pdfs(pdf_dir)

    if not pdf_paths:
        logger.warning("No PDFs found to process.")
        return []

    return process_pdf_files(pdf_paths)
