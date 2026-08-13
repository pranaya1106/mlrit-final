import re
import logging
from typing import Dict, Optional

from data_paths import read_text

logger = logging.getLogger(__name__)

# ─── Administration Directory ───────────────────────────────────────────────
# Mirrors the pattern already used by FacultyDirectory (chatbot/faculty_directory.py)
# and LabsDirectory: parse the data out of the website's own source files at
# startup instead of hand-typing a duplicate copy of names/roles/contacts here.
#
# Each role below is auto-populated from the specific frontend file that
# already serves as that role's source of truth (the same file that renders
# the live page a user would land on):
#   - Principal / Dean, Academics  -> lib/info-pages.ts (feeds /about/messages/*)
#   - Controller of Examinations   -> app/examinations/support/page.tsx
#   - Placement Officer            -> app/placements/support/page.tsx
#   - Admission Officer            -> app/admissions/support/page.tsx (Key Contacts table)
#   - IQAC Coordinator             -> app/iqac/support/page.tsx
#
# Vice Principal, Registrar and NIRF Coordinator have NO name/contact published
# anywhere in the website source (verified by search across app/, lib/,
# components/, legacy/). Rather than inventing a person, those three entries
# are populated with the role's function and a pointer to the right page —
# no fabricated identity is added.
ROLE_CONFIG = {
    "principal": {
        "designation": "Principal",
        "nav_target": "principal",
        "source": ("lib/info-pages.ts", "about/messages/principal"),
        "aliases": ["principal"],
    },
    "dean_academics": {
        "designation": "Dean, Academics",
        "nav_target": "about",
        "nav_url_override": "/about/messages/dean",
        "source": ("lib/info-pages.ts", "about/messages/dean"),
        "aliases": ["dean academics", "dean, academics", "dean of academics", "academic dean", "dean"],
    },
    "vice_principal": {
        "designation": "Vice Principal",
        "nav_target": "about",
        "description": "The Vice Principal supports the Principal in academic administration and campus operations.",
        "source": None,
        "aliases": ["vice principal", "vice-principal", "vice-principal's"],
    },
    "registrar": {
        "designation": "Registrar",
        "nav_target": "about",
        "description": "The Registrar's office handles academic records, regulations, and official institutional documentation.",
        "source": None,
        "aliases": ["registrar"],
    },
    "controller_of_examinations": {
        "designation": "Controller of Examinations",
        "nav_target": "examinations",
        "source": ("app/examinations/support/page.tsx", "Controller of Examinations"),
        "aliases": ["controller of examinations", "coe", "controller of exams", "examination controller"],
    },
    "placement_officer": {
        "designation": "Placement Officer",
        "nav_target": "placements",
        "source": ("app/placements/support/page.tsx", "Head of Placements"),
        "aliases": [
            "placement officer", "training and placement officer", "training & placement officer",
            "tpo", "head of placements", "head - placements", "head placements",
        ],
    },
    "admission_officer": {
        "designation": "Admission Officer",
        "nav_target": "admissions",
        "source": ("app/admissions/support/page.tsx", "Admissions I/C"),
        "aliases": ["admission officer", "admissions officer", "admissions i/c", "admission in-charge", "admission incharge"],
    },
    "iqac_coordinator": {
        "designation": "Head of IQAC",
        "nav_target": "iqac",
        "source": ("app/iqac/support/page.tsx", "Head IQAC"),
        # The website source spells this "Dr. Radhika Devi V" — normalized here to the
        # institutionally-confirmed form "Dr. V. Radhika Devi" (same person, same role;
        # not a fabricated identity, just a name-order fix for the published spelling).
        "name_override": "Dr. V. Radhika Devi",
        "aliases": [
            "iqac coordinator", "head iqac", "iqac head", "iqac in-charge", "iqac incharge",
            "head of iqac", "who is head of iqac", "iqac chairman",
        ],
    },
    "nirf_coordinator": {
        "designation": "NIRF Coordinator",
        "nav_target": "nirf",
        "description": "The NIRF Coordinator compiles and submits MLRIT's annual National Institutional Ranking Framework (NIRF) data to the Ministry of Education.",
        "source": None,
        "aliases": ["nirf coordinator", "nirf head", "nirf in-charge", "nirf incharge"],
    },
    # Chairman / Vice Chairman / Secretary come from the KMR Educational Society
    # Governing Body roster on the Legacy page (lib/info-pages.ts, 'about/legacy'
    # -> kind: 'roster' block) — a different shape than the quote-block used by
    # Principal/Dean above, hence the separate "roster_detail_keyword" extractor.
    "chairman": {
        "designation": "Chairman",
        "nav_target": "about",
        "nav_url_override": "/about/legacy",
        "source": ("lib/info-pages.ts", "about/legacy"),
        "roster_detail_keyword": "Chairman,",
        "aliases": ["chairman", "chairman's message"],
    },
    "vice_chairman": {
        "designation": "Vice Chairman",
        "nav_target": "about",
        "nav_url_override": "/about/legacy",
        "source": ("lib/info-pages.ts", "about/legacy"),
        "roster_detail_keyword": "Vice Chairman,",
        "aliases": ["vice chairman", "vice-chairman"],
    },
    "secretary": {
        "designation": "Secretary",
        "nav_target": "about",
        "nav_url_override": "/about/legacy",
        "source": ("lib/info-pages.ts", "about/legacy"),
        "roster_detail_keyword": "Secretary,",
        "aliases": ["secretary"],
    },
}


def _read_file(rel_path: str) -> Optional[str]:
    """`rel_path` is repo-root-relative (e.g. 'lib/info-pages.ts',
    'app/examinations/support/page.tsx') — resolved via data_paths.py's
    shared FRONTEND_ROOT logic."""
    return read_text(rel_path, feature="Administrator/contact lookup")


def _extract_contact_card(content: str, role_keyword: str) -> Optional[Dict[str, str]]:
    """
    Extracts {name, phone, email, purpose} from a `{ name: '...', role: '...',
    phone(s): '...'/[...], email: '...', purpose: '...' }` object literal —
    the shape used by the *support/page.tsx contact-card files and the
    admissions Key Contacts table. Locates the object by its `role` field
    containing role_keyword, then reads sibling fields from that same block.
    """
    match = re.search(r"role:\s*'([^']*" + re.escape(role_keyword) + r"[^']*)'", content, re.IGNORECASE)
    if not match:
        return None

    start = content.rfind("{", 0, match.start())
    end = content.find("}", match.end())
    if start == -1 or end == -1:
        return None
    block = content[start:end + 1]

    name_m = re.search(r"name:\s*'([^']*)'", block)
    phone_m = re.search(r"phones?:\s*\[?\s*'([^']*)'", block)
    email_m = re.search(r"email:\s*'([^']*)'", block)
    purpose_m = re.search(r"purpose:\s*'([^']*)'", block)

    return {
        "name": name_m.group(1) if name_m else None,
        "role": match.group(1),
        "phone": phone_m.group(1) if phone_m else None,
        "email": email_m.group(1) if email_m else None,
        "purpose": purpose_m.group(1) if purpose_m else None,
    }


def _extract_roster_member(content: str, slug: str, detail_keyword: str) -> Optional[Dict[str, str]]:
    """
    Extracts {name, detail} from an info-pages.ts entry containing a
    `{ kind: 'roster', items: [ { name: '...', detail: '...', tag: '...' }, ... ] }`
    block — the shape used by the Governing Body roster on the Legacy page.
    Matches the first item whose `detail` field STARTS WITH detail_keyword
    (anchored right after the opening quote) so a search for "Chairman," never
    accidentally matches "Vice Chairman," (which also contains that substring).
    """
    idx = content.find(f"'{slug}':")
    if idx == -1:
        return None
    next_idx = content.find("\n  '", idx + 1)
    block = content[idx:next_idx] if next_idx != -1 else content[idx:idx + 8000]

    roster_idx = block.find("kind: 'roster'")
    if roster_idx == -1:
        return None
    roster_block = block[roster_idx:]

    pattern = re.compile(
        r"name:\s*'([^']*)'\s*,\s*detail:\s*'(" + re.escape(detail_keyword) + r"[^']*)'",
    )
    m = pattern.search(roster_block)
    if not m:
        return None
    return {"name": m.group(1), "detail": m.group(2)}


def _extract_info_page_quote(content: str, slug: str) -> Optional[Dict[str, str]]:
    """
    Extracts {attribution (name), role} from an info-pages.ts entry shaped
    like `'<slug>': { ... blocks: [ { kind: 'quote', ..., attribution: '...',
    role: '...' }, ... ] }`.
    """
    idx = content.find(f"'{slug}':")
    if idx == -1:
        return None

    # Scope the search to this entry only — stop at the next top-level
    # (2-space-indented) key, or after a generous fallback window.
    next_idx = content.find("\n  '", idx + 1)
    block = content[idx:next_idx] if next_idx != -1 else content[idx:idx + 4000]

    name_m = re.search(r"attribution:\s*'([^']*)'", block)
    role_m = re.search(r"role:\s*'([^']*)'", block)
    if not name_m:
        return None

    return {"name": name_m.group(1), "role": role_m.group(1) if role_m else None}


class AdministrationDirectory:
    """
    Loads administrator identity/contact data from the website's own frontend
    source files at startup (same pattern as FacultyDirectory / LabsDirectory),
    so the chatbot never carries a second, hand-typed copy of this information.
    """

    def __init__(self):
        self.directory: Dict[str, Dict] = {}
        self._load()

    def _load(self):
        info_pages_content = _read_file("lib/info-pages.ts")

        for role_key, cfg in ROLE_CONFIG.items():
            entry = {
                "designation": cfg["designation"],
                "nav_target": cfg["nav_target"],
                "nav_url_override": cfg.get("nav_url_override"),
                "name": None,
                "description": cfg.get("description"),
                "email": None,
                "phone": None,
                "source_file": None,
            }

            source = cfg.get("source")
            if source:
                source_file, lookup_key = source

                if source_file == "lib/info-pages.ts":
                    if info_pages_content:
                        roster_keyword = cfg.get("roster_detail_keyword")
                        if roster_keyword:
                            data = _extract_roster_member(info_pages_content, lookup_key, roster_keyword)
                            if data:
                                entry["name"] = data["name"]
                                entry["description"] = f"{data['detail']}."
                                entry["source_file"] = source_file
                        else:
                            data = _extract_info_page_quote(info_pages_content, lookup_key)
                            if data:
                                entry["name"] = data["name"]
                                entry["description"] = f"{data['role']}." if data.get("role") else None
                                entry["source_file"] = source_file
                else:
                    content = _read_file(source_file)
                    if content:
                        data = _extract_contact_card(content, lookup_key)
                        if data and data.get("name"):
                            entry["name"] = data["name"]
                            entry["email"] = data.get("email")
                            entry["phone"] = data.get("phone")
                            entry["description"] = data.get("purpose") or f"{data.get('role')}."
                            entry["source_file"] = source_file

            if cfg.get("name_override"):
                entry["name"] = cfg["name_override"]

            if not entry["name"] and not entry["description"]:
                entry["description"] = f"Contact information for the {cfg['designation']} is not currently published on the MLRIT website."

            self.directory[role_key] = entry

        loaded = sum(1 for e in self.directory.values() if e["name"])
        logger.info(f"AdministrationDirectory loaded: {loaded}/{len(self.directory)} roles have published names.")

    def detect_role(self, query: str) -> Optional[str]:
        """Returns the ROLE_CONFIG key matching this query, or None."""
        query_lower = query.lower()
        best_key = None
        best_len = 0
        for role_key, cfg in ROLE_CONFIG.items():
            for alias in cfg["aliases"]:
                if re.search(r'\b' + re.escape(alias) + r'\b', query_lower) and len(alias) > best_len:
                    best_key = role_key
                    best_len = len(alias)
        return best_key

    def is_general_administration_query(self, query: str) -> bool:
        query_lower = query.lower()
        return any(
            re.search(r'\b' + k + r'\b', query_lower)
            for k in ["administration", "admin team", "administrators", "management team", "college management"]
        )

    def get_role(self, role_key: str) -> Optional[Dict]:
        return self.directory.get(role_key)

    def get_all(self) -> Dict[str, Dict]:
        return self.directory
