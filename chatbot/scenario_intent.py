import re
from typing import Any, Dict, List, Optional

from config import WEBSITE_ROUTES, COLLEGE_INFO
import eamcet_cutoffs

# ─── Scenario / Advisory Understanding Layer ────────────────────────────────
# Handles open-ended, conversational student questions that are NOT lookups
# ("what is X") but reasoning/advice requests ("should I...", "I like...",
# "can I get..."). These have no PDF chapter and no single factual answer, so
# sending them to hybrid retrieval either returns nothing or a misleading
# nearest-neighbour chunk. Every branch here returns the same response shape
# used everywhere else in the chatbot (answer/sources/navigation_target/
# navigation_url/confidence/query_type) — no schema change.
#
# Categories: college_guidance, branch_selection, recommendation, advisory,
# career_guidance, prediction (rank-based), admission_guidance, comparison.

INTEREST_TO_DEPARTMENTS = [
    (
        ["coding", "programming", "software", "coding contests", "developer", "app development", "web development"],
        [("cse", "CSE"), ("aiml", "AIML"), ("cse-ds", "CSE (Data Science)")],
        "these departments are built around software, coding, and problem-solving.",
    ),
    (
        ["ai", "artificial intelligence", "machine learning", "deep learning", "data science", "data"],
        [("aiml", "AIML"), ("cse-ds", "CSE (Data Science)"), ("cse", "CSE")],
        "these programs focus directly on AI, machine learning, and data-driven systems.",
    ),
    (
        ["electronics", "circuits", "embedded", "chips", "communication systems"],
        [("ece", "ECE")],
        "ECE covers electronics, communication systems, and embedded hardware design.",
    ),
    (
        ["robotics", "robot", "automation"],
        [("mechanical", "Mechanical"), ("ece", "ECE"), ("aiml", "AIML")],
        "robotics draws on all three — Mechanical for the physical design and actuators, ECE for embedded "
        "control systems, and AIML for perception and autonomous decision-making.",
    ),
    (
        ["electrical", "power", "power systems"],
        [("eee", "EEE")],
        "EEE focuses on electrical systems, power engineering, and control systems.",
    ),
    (
        ["mechanical", "machines", "mechanical design", "manufacturing", "automobiles", "cars"],
        [("mechanical", "Mechanical")],
        "Mechanical Engineering covers machine design, manufacturing, and automotive systems.",
    ),
    (
        ["airplanes", "aircraft", "aviation", "flying", "aerospace", "rockets"],
        [("aeronautical", "Aeronautical")],
        "Aeronautical Engineering is MLRIT's dedicated aircraft/aerospace program.",
    ),
    (
        ["business", "management", "marketing", "entrepreneurship", "finance"],
        [("mba", "MBA")],
        "MBA is MLRIT's program for business, management, and entrepreneurship.",
    ),
]

BRANCH_SELECTION_PATTERNS = [
    r"which (department|branch|course) should i (choose|pick|take|select)",
    r"i don'?t know which (course|department|branch) to choose",
    r"which (department|branch) is (best|good) for me",
    r"help me (choose|pick|select) a (department|branch|course)",
]

COLLEGE_GUIDANCE_PATTERNS = [
    r"is mlrit good", r"is mlrit worth it", r"should i join mlrit",
    r"should i choose mlrit", r"is mlrit a good college", r"how is mlrit",
    # Natural word orders and third-party phrasing ("my parents want to know if
    # MLRIT is good") that don't match the "is mlrit ..." patterns above.
    r"mlrit is good", r"mlrit is worth it", r"mlrit is a good college",
    r"mlrit good or not", r"is mlrit (any )?good",
    r"(parents?|family) .*(mlrit|college).*(good|worth)",
]

ADVISORY_PATTERNS = [
    r"should i (choose|join|pick|take|opt for) (cse|ece|eee|it|csit|mechanical|mech|aeronautical|aero|aiml|csd|csm|mba)",
    r"is (cse|ece|eee|it|csit|mechanical|mech|aeronautical|aero|aiml|csd|csm|mba) good",
    r"is (cse|ece|eee|it|csit|mechanical|mech|aeronautical|aero|aiml|csd|csm|mba) worth it",
]

CAREER_GUIDANCE_PATTERNS = [
    r"which (branch|department) has (more|the most|better) (jobs|placements|package)",
    r"i want a high(er)? package",
    r"can i get (a job|placed|placements)\b(?!.*(statistic|process|training|eligib))",
]

PREDICTION_PATTERNS = [
    r"my rank is\s*\d+",
    r"\brank\s*(is|of)?\s*\d{3,6}\b",
    r"\bi (got|have|scored)\s*\d{3,6}\s*rank\b",
    r"\d{3,6}\s*rank\b",
    r"can i get (cse|ece|eee|it|csit|mechanical|mech|aeronautical|aero|aiml|csd|csm|mba)\b(?!.*placement)",
    r"with (my )?rank",
    # "k"-shorthand ranks (25k, 100k, ...) — eamcet_cutoffs.extract_rank() already
    # expands these, but that helper is only ever reached if one of these gate
    # patterns matches first, so "25k rank"/"rank is 25k" need their own patterns
    # here (plain \d{3,6} above never matches "25k", since "k" isn't a digit).
    r"\d{1,3}(?:\.\d+)?k\s*rank\b",
    r"\brank\s*(is|of)?\s*\d{1,3}(?:\.\d+)?k\b",
    r"\bi (got|have|scored)\s*\d{1,3}(?:\.\d+)?k\s*rank\b",
]


# Student-facing wording only — no admission year, no exact rank numbers.
# Exact opening/closing ranks remain available to a student who explicitly
# asks for the cutoff (chatbot.py's factual admission-rank intercept).
PREDICTION_DISCLAIMER = (
    "These are indicative possibilities based on previous admission trends. Cutoffs can vary each year "
    "depending on competition, seat availability, and other factors, so this does not guarantee admission."
)


def is_prediction_trigger(query: str) -> bool:
    """True if `query` (any case, any length — checked as a whole string, not
    per-sentence) contains rank-prediction language. Used by chatbot.py to give
    EAMCET/admission-rank scenarios priority over generic multi-part-question
    splitting, since splitting on sentence boundaries would otherwise scatter
    rank/category/gender/branch (often stated in separate sentences) across
    independently-routed fragments that never see each other's context."""
    q = query.lower()
    return any(re.search(p, q) for p in PREDICTION_PATTERNS)

ADMISSION_GUIDANCE_PATTERNS = [
    r"can diploma students join",
    r"can i transfer (colleges?|to mlrit)",
    r"is attendance strict",
    r"eligible for lateral entry",
]

DEPARTMENT_LABELS = {
    "cse": "CSE", "ece": "ECE", "eee": "EEE", "it": "IT", "csit": "CSIT",
    "mechanical": "Mechanical", "mech": "Mechanical", "aeronautical": "Aeronautical",
    "aero": "Aeronautical", "aiml": "AIML", "csd": "CSE (Data Science)",
    "csm": "AIML", "cse-ds": "CSE (Data Science)", "mba": "MBA",
}


def _dept_route_key(short: str) -> str:
    return {"mech": "mechanical", "aero": "aeronautical", "csd": "cse-ds", "csm": "aiml"}.get(short, short)


def _response(answer: str, nav_target: Optional[str] = None, category: str = "advisory") -> Dict[str, Any]:
    return {
        "answer": answer,
        "sources": [],
        "navigation_target": nav_target,
        "navigation_url": WEBSITE_ROUTES.get(nav_target) if nav_target else None,
        "confidence": 1.0,
        "query_type": "general",
        "scenario_category": category,  # informational only — not part of the API schema
    }


class ScenarioIntentDetector:
    """Classifies and answers open-ended advisory/scenario questions before
    they would otherwise reach hybrid retrieval."""

    def detect(self, query: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> Optional[Dict[str, Any]]:
        q = query.lower().strip()

        handler = (
            self._try_branch_selection(q)
            or self._try_college_guidance(q)
            or self._try_advisory(q)
            or self._try_career_guidance(q)
            or self._try_prediction(q)
            or self._try_admission_guidance(q)
            or self._try_recommendation(q)
        )
        return handler

    # ── Branch Selection ────────────────────────────────────────────────────
    def _try_branch_selection(self, q: str) -> Optional[Dict[str, Any]]:
        if not any(re.search(p, q) for p in BRANCH_SELECTION_PATTERNS):
            return None
        answer = (
            "I'd be happy to help you choose.\n\n"
            "What interests you the most?\n\n"
            "- **Programming** (software, coding, apps)\n"
            "- **Artificial Intelligence** (AI, ML, data)\n"
            "- **Electronics** (circuits, communication systems)\n"
            "- **Mechanical Design** (machines, manufacturing)\n"
            "- **Aeronautics** (aircraft, aerospace)\n"
            "- **Business** (management, entrepreneurship)\n\n"
            "Tell me which of these excites you (e.g. \"I like coding\" or \"I'm interested in electronics\") "
            "and I'll recommend the right department."
        )
        return _response(answer, nav_target="departments", category="branch_selection")

    # ── Recommendation (interest -> department) ─────────────────────────────
    def _try_recommendation(self, q: str) -> Optional[Dict[str, Any]]:
        if not re.search(r"\bi (like|love|enjoy|prefer|want to (study|do|learn))\b|\bi'?m interested in\b", q):
            return None

        # "Research" alone doesn't map to one department the way "coding" -> CSE
        # does — recommend the departments whose research areas are the closest
        # fit, then point to the college-wide Research Cell. A more specific
        # interest mentioned alongside it (e.g. "AI research") still wins via the
        # per-department loop below since that's checked first here.
        has_specific_interest = any(
            re.search(r'\b' + re.escape(kw) + r'\b', q)
            for interests, _, _ in INTEREST_TO_DEPARTMENTS for kw in interests
        )
        if re.search(r"\bresearch\b", q) and not has_specific_interest:
            answer = (
                "Research interest can point to different departments depending on the area:\n\n"
                "- **AI / Machine Learning** → **AIML**\n"
                "- **Software / Systems** → **CSE**\n"
                "- **Electronics / Communication** → **ECE**\n"
                "- **Mechanical Design / Manufacturing** → **Mechanical**\n"
                "- **Aerospace** → **Aeronautical**\n\n"
                "Every department also connects into MLRIT's central **Research Cell** for funded "
                "projects, publications, and faculty mentorship.\n\n"
                "Which area interests you most?"
            )
            return _response(answer, nav_target="research", category="recommendation")

        for interests, depts, reason in INTEREST_TO_DEPARTMENTS:
            if any(re.search(r'\b' + re.escape(kw) + r'\b', q) for kw in interests):
                dept_list = "\n".join(f"- **{label}**" for _, label in depts)
                primary_key = depts[0][0]
                answer = (
                    f"Based on that interest, I'd recommend:\n\n{dept_list}\n\n"
                    f"**Why**: {reason}\n\n"
                    f"Want a closer look at any of these, e.g. \"{depts[0][1]} faculty\" or \"{depts[0][1]} placements\"?"
                )
                return _response(answer, nav_target=_dept_route_key(primary_key), category="recommendation")
        return None

    # ── College Guidance ────────────────────────────────────────────────────
    def _try_college_guidance(self, q: str) -> Optional[Dict[str, Any]]:
        if not any(re.search(p, q) for p in COLLEGE_GUIDANCE_PATTERNS):
            return None
        answer = (
            "MLRIT is a well-established, NAAC- and NBA-accredited engineering college affiliated to JNTUH, "
            f"with a {COLLEGE_INFO['placement_rate']} placement rate and packages up to {COLLEGE_INFO['highest_package']}.\n\n"
            "Strengths worth knowing about:\n"
            "- JNTUH-affiliated curriculum, updated periodically to match industry trends.\n"
            "- Active Training & Placement Cell with 200+ recruiting companies.\n"
            "- Well-equipped labs and a research-active faculty base.\n\n"
            "Like any college, the right fit also depends on the specific department and what you want out of it — "
            "want me to go into a particular department, hostel life, or placements in more detail?"
        )
        return _response(answer, nav_target="about", category="college_guidance")

    # ── Advisory (branch-level "should I / is it good") ─────────────────────
    def _try_advisory(self, q: str) -> Optional[Dict[str, Any]]:
        match = None
        for p in ADVISORY_PATTERNS:
            match = re.search(p, q)
            if match:
                break
        if not match:
            return None

        dept_short = next((g for g in match.groups() if g in DEPARTMENT_LABELS), None)
        if not dept_short:
            return None
        dept_label = DEPARTMENT_LABELS[dept_short]
        dept_key = _dept_route_key(dept_short)

        # Note: deliberately avoids repeating the department name or the word
        # "Placements" as its own bulleted mention — the existing entity-scan
        # post-processor (_attach_entities) turns 2+ distinct bulleted entity
        # mentions into a multi-link list, which would override the single,
        # more useful department navigation button intended here.
        answer = (
            f"**{dept_label}** is a solid choice if it matches your interests — here's a balanced view:\n\n"
            f"- **Pros**: Established department with dedicated faculty, labs, and industry-aligned curriculum at MLRIT.\n"
            f"- **Placement outlook**: Benefits from MLRIT's overall {COLLEGE_INFO['placement_rate']} placement rate; specific recruiters vary by branch.\n"
            f"- **Consider**: Your interest in the subject matters more long-term than rankings alone — it suits you "
            f"if you enjoy its core subjects (ask me and I can outline them).\n\n"
            f"Want this department's HOD, labs, or placement details to help you decide?"
        )
        return _response(answer, nav_target=dept_key, category="advisory")

    # ── Career Guidance ──────────────────────────────────────────────────────
    def _try_career_guidance(self, q: str) -> Optional[Dict[str, Any]]:
        if not any(re.search(p, q) for p in CAREER_GUIDANCE_PATTERNS):
            return None
        answer = (
            "Placement outcomes at MLRIT depend more on preparation than the branch alone — CSE, AIML, and CSE (Data Science) "
            "typically see the highest number of recruiter visits, while every branch benefits from the same central "
            f"Training & Placement Cell ({COLLEGE_INFO['placement_rate']} overall placement rate, packages up to "
            f"{COLLEGE_INFO['highest_package']}).\n\n"
            "What helps most: consistent academics (no backlogs), aptitude/coding practice, and taking the pre-placement "
            "training seriously.\n\n"
            "Want department-wise placement stats, or details on the training program?"
        )
        return _response(answer, nav_target="placements", category="career_guidance")

    # ── Prediction (rank-based) ──────────────────────────────────────────────
    # Student-facing wording deliberately never surfaces exact opening/closing
    # rank numbers or the admission year here — only whether the rank
    # historically fell within range, described as an indicative possibility.
    # The underlying comparison is still the real deterministic lookup
    # (eamcet_cutoffs.get_cutoff/branches_for_rank against the real closing
    # ranks) — only the words wrapped around that result changed. Exact
    # numbers remain available elsewhere: chatbot.py's factual admission-rank
    # intercept still answers direct "what is the cutoff for X" questions with
    # eamcet_cutoffs.format_single/format_branch_table, unchanged.
    def _try_prediction(self, q: str) -> Optional[Dict[str, Any]]:
        if not any(re.search(p, q) for p in PREDICTION_PATTERNS):
            return None

        rank = eamcet_cutoffs.extract_rank(q)
        branch = eamcet_cutoffs.extract_branch(q)
        gender = eamcet_cutoffs.extract_gender(q)
        category = eamcet_cutoffs.extract_category(q)

        # No numeric rank given at all -- nothing to compare against real data.
        if rank is None:
            answer = (
                "I can compare your rank against MLRIT's historical EAMCET cutoff trends, but I need your actual "
                "rank, category (OC/EWS/BC-A to BC-E/SC/ST), and gender to do that.\n\n"
                f"{PREDICTION_DISCLAIMER}"
            )
            return _response(answer, nav_target="admissions", category="prediction")

        # Rank + branch known, but category and/or gender missing -- never assume
        # OC/male/BC-A/female. Rather than blocking on a "please tell me
        # first" prompt, give a broad, category/gender-agnostic indication
        # right away (eamcet_cutoffs.general_possibility, filtered by whatever
        # IS known), then offer category/gender/branch as an OPTIONAL
        # refinement -- never phrased as a requirement.
        if branch and (not gender or not category):
            label = eamcet_cutoffs.DEPT_DISPLAY.get(branch, branch)
            verdict = eamcet_cutoffs.general_possibility(branch, rank, gender, category)
            if verdict == "within":
                lead = (
                    f"Based on your rank of **{rank}**, **{label}** may be possible under some category/gender "
                    "combinations."
                )
            elif verdict == "outside":
                lead = (
                    f"Based on your rank of **{rank}**, **{label}** doesn't appear possible under any category/gender "
                    "combination in this data."
                )
            else:
                lead = f"Sufficient cutoff information isn't available for **{label}** to give even a general indication."
            answer = (
                f"{lead}\n\nYour actual possibilities depend on your category and gender. If you share those "
                f"details, I can give you a more specific comparison.\n\n{PREDICTION_DISCLAIMER}"
            )
            return _response(answer, nav_target="admissions", category="prediction")

        # Rank + category + gender known, but no specific branch -- list which
        # branches historically fell within range as a clean opportunity list,
        # with no numbers and no "outside"/"insufficient" clutter (Section 4,
        # Example 3). Branches with no usable cutoff data are simply omitted.
        if not branch and gender and category:
            buckets = eamcet_cutoffs.branches_for_rank(rank, gender, category)
            within_names = [eamcet_cutoffs.DEPT_DISPLAY[b] for b, _ in buckets["within"]]
            known_count = len(buckets["within"]) + len(buckets["outside"])

            if within_names:
                bullets = "\n".join(f"- {name}" for name in within_names)
                answer = (
                    f"Based on your **{category} {gender}** category and a rank of **{rank}**, you may have "
                    f"opportunities in:\n\n{bullets}\n\n{PREDICTION_DISCLAIMER}"
                )
            elif known_count:
                answer = (
                    f"Based on your **{category} {gender}** category and a rank of **{rank}**, none of MLRIT's "
                    f"branches with available cutoff data historically fell within that range.\n\n{PREDICTION_DISCLAIMER}"
                )
            else:
                answer = (
                    f"Sufficient cutoff information isn't available for the **{category} {gender}** category to "
                    "give you an indication right now."
                )
            return _response(answer, nav_target="admissions", category="prediction")

        # Rank + branch + category + gender all known -- direct comparison
        # (Section 4, Example 2), described qualitatively, not numerically.
        if branch and gender and category:
            label = eamcet_cutoffs.DEPT_DISPLAY.get(branch, branch)
            pair = eamcet_cutoffs.get_cutoff(branch, gender, category)
            if not pair or (pair[0] is None and pair[1] is None):
                answer = (
                    f"Sufficient cutoff information isn't available for **{label}** under the **{category} {gender}** "
                    "category to give you an indication right now."
                )
            elif pair[1] is None:
                answer = (
                    f"There isn't enough historical closing-rank data available for **{label}** under the "
                    f"**{category} {gender}** category to give a reliable indication for your rank.\n\n{PREDICTION_DISCLAIMER}"
                )
            elif rank <= pair[1]:
                answer = (
                    f"Your rank may be competitive for **{label}** under the **{category} {gender}** category, based "
                    f"on previous admission trends.\n\n{PREDICTION_DISCLAIMER}"
                )
            else:
                answer = (
                    f"Your rank appears to fall outside the typical range for **{label}** under the **{category} {gender}** "
                    f"category, based on previous admission trends. It may still be worth checking other branches or "
                    f"categories.\n\n{PREDICTION_DISCLAIMER}"
                )
            return _response(answer, nav_target="admissions", category="prediction")

        # Rank known, no specific branch, and category/gender not fully known
        # (neither given, or only one of the two) -- never assume the other;
        # give a broad, category/gender-agnostic "which departments" list
        # right away (eamcet_cutoffs.branches_general_possibility, filtered by
        # whatever IS known) instead of blocking on a "please tell me first"
        # prompt, then offer the missing detail as an OPTIONAL refinement.
        buckets = eamcet_cutoffs.branches_general_possibility(rank, gender, category)
        within_names = [eamcet_cutoffs.DEPT_DISPLAY[b] for b in buckets["within"]]
        known_count = len(buckets["within"]) + len(buckets["outside"])

        if within_names:
            bullets = "\n".join(f"- {name}" for name in within_names)
            lead = (
                f"Based on your rank of **{rank}**, these branches may be possible under some category/gender "
                f"combinations:\n\n{bullets}"
            )
        elif known_count:
            lead = (
                f"Based on your rank of **{rank}**, none of MLRIT's branches with available cutoff data appear "
                "possible under any category/gender combination in this data."
            )
        else:
            lead = "Sufficient cutoff information isn't available to give even a general indication for your rank right now."

        refinement = (
            "your category and gender" if not gender and not category
            else "your gender" if not gender
            else "your category"
        )
        answer = (
            f"{lead}\n\nYour actual possibilities depend on your category and gender. If you share "
            f"{refinement}{', or a preferred branch,' if not (gender and category) else ''} I can give you a "
            f"more specific comparison.\n\n{PREDICTION_DISCLAIMER}"
        )
        return _response(answer, nav_target="admissions", category="prediction")

    # ── Admission Guidance (diploma/transfer/attendance policy questions) ──
    def _try_admission_guidance(self, q: str) -> Optional[Dict[str, Any]]:
        if re.search(r"can diploma students join|eligible for lateral entry|diploma admission|diploma (student|holder)s?\b|lateral entry", q):
            answer = (
                "Yes — diploma holders can join MLRIT's B.Tech program directly into the **2nd year** through "
                "**lateral entry** via TS ECET (Engineering Common Entrance Test), provided they meet the minimum "
                "aggregate required in their diploma.\n\n"
                "Want details on the ECET counselling process?"
            )
            return _response(answer, nav_target="admissions", category="admission_guidance")

        if re.search(r"can i transfer (colleges?|to mlrit)", q):
            answer = (
                "College transfers in engineering programs are governed by university (JNTUH) and AICTE norms, and are "
                "only permitted in specific circumstances with vacant seats and approval from both institutions.\n\n"
                "For an accurate answer for your situation, please contact MLRIT's admissions office directly."
            )
            return _response(answer, nav_target="admissions", category="admission_guidance")

        if re.search(r"is attendance strict", q):
            answer = (
                "MLRIT follows the standard JNTUH norm: a minimum of **75% attendance** is required to be eligible "
                "to write semester examinations. Students with 65-74% attendance can apply for **condonation** "
                "(subject to a fee and valid reason); below that, a repeat/detained year may apply, with exceptions "
                "for approved medical leave.\n\n"
                "Want to know more about examination regulations?"
            )
            return _response(answer, nav_target="examinations", category="admission_guidance")

        return None
