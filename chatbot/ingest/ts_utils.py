"""
Shared, generic TS/TSX source-parsing primitives for the ingest/ modules.

These generalize the bracket-depth-aware extraction techniques already used
in website_content.py (_extract_const) and faculty_directory.py/labs_directory.py
(regex-per-object parsing) into reusable building blocks, so each *_ingest.py
module only has to describe ITS data shape, not re-implement string/brace
handling. Nothing here talks to the network or a database — every function
is a pure string -> string/list transform over already-read file content.
"""
import re
from typing import List, Optional, Tuple

_QUOTE_CHARS = "'\"`"


def _find_matching_close(content: str, open_idx: int, open_ch: str, close_ch: str) -> int:
    """Given the index of an opening bracket, returns the index of its
    matching close bracket, skipping over nested brackets and string
    literals (including escaped quotes inside them)."""
    depth = 0
    i = open_idx
    in_string = None
    n = len(content)
    while i < n:
        ch = content[i]
        if in_string:
            if ch == "\\":
                i += 2
                continue
            if ch == in_string:
                in_string = None
        elif ch in _QUOTE_CHARS:
            in_string = ch
        elif ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


def extract_const(content: str, const_name: str) -> Optional[str]:
    """Extracts the full source text of `[export] const NAME = ...;` — same
    technique as website_content._extract_const, duplicated here so ingest/
    modules have their own dependency-free copy of this primitive."""
    m = re.search(r"(?:export\s+)?const\s+" + re.escape(const_name) + r"\b[^=]*=", content, re.DOTALL)
    if not m:
        return None
    start = m.end()
    depth = 0
    i = start
    in_string = None
    n = len(content)
    while i < n:
        ch = content[i]
        if in_string:
            if ch == "\\":
                i += 2
                continue
            if ch == in_string:
                in_string = None
        elif ch in _QUOTE_CHARS:
            in_string = ch
        elif ch in "([{":
            depth += 1
        elif ch in ")]}":
            depth -= 1
        elif ch == ";" and depth <= 0:
            return content[start:i]
        i += 1
    return content[start:]


def split_top_level_objects(array_text: str) -> List[str]:
    """Splits a `{...}, {...}, ...` array body into individual `{...}` object
    source strings, respecting nested braces/brackets and string literals."""
    objects = []
    depth = 0
    start = None
    in_string = None
    i = 0
    n = len(array_text)
    while i < n:
        ch = array_text[i]
        if in_string:
            if ch == "\\":
                i += 2
                continue
            if ch == in_string:
                in_string = None
        elif ch in _QUOTE_CHARS:
            in_string = ch
        elif ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start is not None:
                objects.append(array_text[start:i + 1])
                start = None
        i += 1
    return objects


_KEY_RE = re.compile(r"""\s*['"]?([\w.-]+)['"]?\s*:\s*""")


def split_top_level_keys(content: str) -> List[Tuple[str, str]]:
    """For the inside of an object literal, returns [(key, value_str), ...].
    When a key's value is itself an object/array, value_str is the full
    balanced `{...}`/`[...]` block — used for nested Record<string, T>
    structures like SYLLABUS_DATA's program -> regulation -> semester
    nesting, or RESEARCH_PAGES'/DEPT_DATA's slug -> {...} mapping. Scalar
    values (bare numbers/strings) are skipped over rather than returned,
    since none of this codebase's nested-record use cases need them."""
    results = []
    i = 0
    n = len(content)
    while i < n:
        m = _KEY_RE.match(content, i)
        if not m:
            i += 1
            continue
        key = m.group(1)
        j = m.end()
        if j >= n:
            break
        open_ch = content[j]
        if open_ch in "{[":
            close_ch = "}" if open_ch == "{" else "]"
            end = _find_matching_close(content, j, open_ch, close_ch)
            if end == -1:
                break
            results.append((key, content[j:end + 1]))
            i = end + 1
        else:
            # Scalar value — skip ahead to the next top-level comma.
            depth = 0
            in_string = None
            while i < n:
                ch = content[i]
                if in_string:
                    if ch == "\\":
                        i += 2
                        continue
                    if ch == in_string:
                        in_string = None
                elif ch in _QUOTE_CHARS:
                    in_string = ch
                elif ch in "([{":
                    depth += 1
                elif ch in ")]}":
                    depth -= 1
                elif ch == "," and depth == 0:
                    break
                i += 1
        while i < n and content[i] in ", \n\t\r":
            i += 1
    return results


_STR_FIELD_RE_CACHE = {}


# Keys may be written either bare (`name: 'X'`, the typical hand-authored TS
# style seen in lib/faculty.ts) or double/single-quoted (`"code": "X"`, as in
# the auto-generated lib/syllabus-data.ts) — the optional `['\"]?` after the
# key name handles both without needing two separate code paths.
_KEY_PREFIX = r"['\"]?\s*:\s*"


def str_field(obj_src: str, key: str) -> Optional[str]:
    """Extracts a single quoted string field's value, e.g. `name: 'Dr. X'` or
    `"code": "A6BS01"`."""
    pattern = _STR_FIELD_RE_CACHE.get(key)
    if pattern is None:
        pattern = re.compile(r"\b" + re.escape(key) + _KEY_PREFIX + r"(['\"`])((?:(?!\1)[^\\]|\\.)*)\1")
        _STR_FIELD_RE_CACHE[key] = pattern
    m = pattern.search(obj_src)
    return m.group(2).strip() if m else None


def bool_field(obj_src: str, key: str) -> Optional[bool]:
    m = re.search(r"\b" + re.escape(key) + _KEY_PREFIX + r"(true|false)", obj_src)
    return (m.group(1) == "true") if m else None


def num_field(obj_src: str, key: str) -> Optional[float]:
    m = re.search(r"\b" + re.escape(key) + _KEY_PREFIX + r"(-?[\d.]+)", obj_src)
    return float(m.group(1)) if m else None


def str_array_field(obj_src: str, key: str) -> List[str]:
    """Extracts a `key: ['a', 'b', ...]` string array's values."""
    m = re.search(r"\b" + re.escape(key) + _KEY_PREFIX + r"\[(.*?)\]", obj_src, re.DOTALL)
    if not m:
        return []
    body = m.group(1)
    return [g[1] for g in re.findall(r"""(['"`])((?:(?!\1)[^\\]|\\.)*)\1""", body)]
