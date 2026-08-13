import json
import hashlib
import logging
from pathlib import Path
from typing import Dict

logger = logging.getLogger(__name__)


def compute_file_hash(path: str) -> str:
    """Compute a SHA-256 hash of a file's contents, used to detect changes."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def load_manifest(manifest_path: str) -> Dict[str, str]:
    """Load the {filename: file_hash} manifest of previously indexed PDFs."""
    p = Path(manifest_path)
    if not p.exists():
        return {}
    try:
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.warning(f"Failed to load index manifest: {e}")
        return {}


def save_manifest(manifest_path: str, manifest: Dict[str, str]) -> None:
    """Persist the {filename: file_hash} manifest to disk."""
    p = Path(manifest_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
