import os
import logging
from typing import Any, Dict, List, Optional

from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from config import EMBEDDING_MODEL, MAX_RETRIEVAL_DOCS
from pdf_processor import process_all_pdfs, process_pdf_files, scan_pdfs
from index_manifest import compute_file_hash, load_manifest, save_manifest

logger = logging.getLogger(__name__)


class VectorStore:
    """Manages ChromaDB vector store with HuggingFace sentence-transformer embeddings."""

    def __init__(self, persist_dir: str, embedding_model: str = EMBEDDING_MODEL):
        self.persist_dir = persist_dir
        self.embedding_model = embedding_model
        self.embeddings = None
        self.chroma = None
        self._init_embeddings()
        self._init_chroma()

    def _init_embeddings(self):
        """Initialize HuggingFace sentence-transformer embeddings."""
        try:
            self.embeddings = HuggingFaceEmbeddings(
                model_name=self.embedding_model,
            )
            logger.info(f"Embeddings initialized with model: {self.embedding_model}")
        except Exception as e:
            logger.error(f"Failed to initialize embeddings: {e}")
            raise

    def _init_chroma(self):
        """Initialize persistent ChromaDB instance."""
        try:
            self.chroma = Chroma(
                collection_name="mlrit_knowledge_base",
                embedding_function=self.embeddings,
                persist_directory=self.persist_dir,
            )
            count = self.get_collection_count()
            logger.info(f"ChromaDB initialized. Current document count: {count}")
        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB: {e}")
            raise

    def add_documents(self, documents: List[Document]) -> int:
        """Add documents to the vector store. Returns number of documents added."""
        if not documents:
            logger.warning("No documents provided to add.")
            return 0

        try:
            batch_size = 100
            total_added = 0

            for i in range(0, len(documents), batch_size):
                batch = documents[i:i + batch_size]
                self.chroma.add_documents(batch)
                total_added += len(batch)
                logger.info(f"Added batch {i // batch_size + 1}: {len(batch)} documents")

            logger.info(f"Total documents added: {total_added}")
            return total_added

        except Exception as e:
            logger.error(f"Failed to add documents: {e}")
            raise

    def similarity_search(
        self,
        query: str,
        k: int = MAX_RETRIEVAL_DOCS,
        department: Optional[str] = None,
    ) -> List[Document]:
        """
        Perform similarity search. Optionally filter by department metadata.
        Returns list of relevant Document objects.
        """
        try:
            if department:
                filter_dict = {"department": department}
                results = self.chroma.similarity_search(
                    query,
                    k=k,
                    filter=filter_dict,
                )
                # Deliberately NO unfiltered fallback here — a department filter with
                # zero matches must return empty, not another department's chunks.
                # The caller (chatbot.py) is responsible for turning an empty result
                # into an honest "couldn't find official information" response.
                if not results:
                    logger.info(f"No results for department '{department}'; returning empty (no cross-department fallback).")
            else:
                results = self.chroma.similarity_search(query, k=k)

            logger.info(f"Similarity search returned {len(results)} results for query: '{query[:60]}...'")
            return results

        except Exception as e:
            logger.error(f"Similarity search failed: {e}")
            return []

    def get_all_documents(self) -> List[Document]:
        """Fetch every chunk currently stored in the collection (used to build the BM25 index)."""
        try:
            total = self.get_collection_count()
            batch_size = 300
            docs = []
            for offset in range(0, total, batch_size):
                data = self.chroma.get(limit=batch_size, offset=offset)
                for content, meta in zip(data.get("documents", []), data.get("metadatas", [])):
                    docs.append(Document(page_content=content, metadata=meta or {}))
            return docs
        except Exception as e:
            logger.error(f"Failed to fetch all documents: {e}")
            return []

    def delete_by_source(self, source: str) -> None:
        """Delete all chunks belonging to a given source filename."""
        try:
            self.chroma._collection.delete(where={"source": source})
            logger.info(f"Deleted existing chunks for source: {source}")
        except Exception as e:
            logger.warning(f"Failed to delete existing chunks for {source}: {e}")

    def sync_index(self, pdf_dir: str, manifest_path: str) -> Dict[str, Any]:
        """
        Incrementally sync the vector store with the PDFs on disk using a
        file-hash manifest: only new or modified PDFs are re-processed and
        re-embedded, removed PDFs have their chunks deleted, and unchanged
        PDFs are left untouched.
        """
        manifest = load_manifest(manifest_path)
        pdf_paths = scan_pdfs(pdf_dir)

        current_files = set()
        new_manifest = {}
        changed_paths = []

        for path in pdf_paths:
            source_name = os.path.basename(path)
            file_hash = compute_file_hash(path)
            current_files.add(source_name)
            new_manifest[source_name] = file_hash
            if manifest.get(source_name) != file_hash:
                changed_paths.append(path)

        removed_files = [f for f in manifest.keys() if f not in current_files]

        for source_name in removed_files:
            self.delete_by_source(source_name)

        added_count = 0
        if changed_paths:
            for path in changed_paths:
                self.delete_by_source(os.path.basename(path))
            documents = process_pdf_files(changed_paths)
            added_count = self.add_documents(documents)

        save_manifest(manifest_path, new_manifest)

        result = {
            "changed_files": [os.path.basename(p) for p in changed_paths],
            "removed_files": removed_files,
            "chunks_added": added_count,
        }
        logger.info(f"Index sync complete: {result}")
        return result

    def get_collection_count(self) -> int:
        """Return the number of documents in the collection."""
        try:
            return self.chroma._collection.count()
        except Exception as e:
            logger.warning(f"Could not get collection count: {e}")
            return 0

    def is_empty(self) -> bool:
        """Check if the vector store has no documents."""
        return self.get_collection_count() == 0

    def clear_collection(self):
        """Delete all documents from the collection."""
        try:
            self.chroma.delete_collection()
            # Re-initialize after deletion
            self._init_chroma()
            logger.info("Collection cleared successfully.")
        except Exception as e:
            logger.error(f"Failed to clear collection: {e}")
            raise

    def reindex(self, pdf_dir: str) -> int:
        """
        Clear the existing collection and re-index all PDFs from the given directory.
        Returns the number of documents indexed.
        """
        logger.info("Starting full reindex...")
        self.clear_collection()

        documents = process_all_pdfs(pdf_dir)
        if not documents:
            logger.warning("No documents found during reindex.")
            return 0

        count = self.add_documents(documents)
        logger.info(f"Reindex complete. {count} document chunks indexed.")
        return count
