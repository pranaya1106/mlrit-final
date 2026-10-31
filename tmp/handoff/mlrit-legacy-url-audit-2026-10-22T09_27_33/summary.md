/**
 * Handoff — legacy mlrit.ac.in hyperlink audit, 2026-10-22.
 *
 * Generated from a project-wide grep for:
 *   - wordpress references
 *   - mlrit.ac.in/(mandatory|financial-statements|nss-event-reports|iqac-mom|iqac/policies|iqac)/
 *   - mlrit.ac.in/wp-content
 *   - mlrit.edugrievance.com
 *   - any mlrit.ac.in/ path that the new app pages now own
 *
 * Outcome: every legacy hyperlink in the app lives on well-defined source
 * files. Nothing is buried in components that render arbitrary CMS content
 * (ContentBlock/InfoBlock). The remaining mlrit.ac.in URLs are either:
 *   (a) intentionally external (file server, grievance portal, social links),
 *   (b) document references the pages are built to display, or
 *   (c) migrations/schema defaults.
 *
 * === Source files that contain the relevant links ===
 *
 *   1. app/(frontend)/iqac/reports/page.tsx          — 2
 *   2. components/Footer.tsx                         — 3
 *   3. lib/content/sections.ts                       — 2
 *   4. app/(frontend)/iqac/minutes/page.tsx         — 8
 *   5. app/(frontend)/iqac/policies/page.tsx        — 15
 *   6. app/(frontend)/mandatory-disclosures/page.tsx — 10
 *   7. app/(frontend)/financial-statements/page.tsx  — 3
 *   8. app/(frontend)/nss-event-reports/page.tsx     — 6
 *   9. lib/chronicles.ts                             — 15
 *  10. app/(frontend)/admissions/why-mlrit/WhyMLRITSections.tsx — 1
 *  11. app/(frontend)/student-life/sports/SportsPage.tsx        — 1
 *  12. migrations/20261006_083430_initial.ts                  — 2
 *
 * Each number is the count of matched relevant link references in that file.
 *
 * === What counts as "relevant legacy url" here ===
 *
 * Relevant:
 *   - mlrit.ac.in/mandatory-disclosures/
 *   - mlrit.ac.in/financial-statements/
 *   - mlrit.ac.in/nss-event-reports/
 *   - mlrit.ac.in/iqac-mom/
 *   - mlrit.ac.in/iqac/policies/
 *   - mlrit.ac.in/iqac/                          (broad IQAC landing refs)
 *   - mlrit.ac.in/wp-content/...                 (legacy uploads)
 *   - mlrit.edugrievance.com                     (external grievance portal)
 *
 * Not in scope for the "no wordpress/legacy diversion" rule, and
 * deliberately left alone:
 *   - files.mlrit.ac.in/...                      (institutional file server for PDFs)
 *   - lms.mlrit.ac.in, campushub.mlrit.ac.in     (live institutional services)
 *   - social media URLs (LinkedIn, Instagram, etc.)
 *   - mailto: / tel:
 *
 * === Scope note for the "no external diversion" rule ===
 *
 * The ask was specifically about not letting links divert to the legacy
 * wordpress site. The audit is therefore scoped to hyperlinks that point
 * back to mlrit.ac.in pages that the running app should now own or that
 * point to the legacy wordpress-hosted uploads path.
 *
 * If the intent is broader — for example, also removing all external
 * mlrit.ac.in links including the file server — that is a separate,
 * larger decision. This handoff does not assume that.
 *
 * === Files with zero relevant legacy links (for reference) ===
 *
 *   - app/(frontend)/iqac/aqar/page.tsx
 *   - app/(frontend)/iqac/naac/page.tsx
 *   - app/(frontend)/iqac/nba/page.tsx
 *   - app/(frontend)/iqac/contact/page.tsx
 *   - app/(frontend)/iqac/feedback/page.tsx
 *   - app/(frontend)/iqac/functions/page.tsx
 *   - app/(frontend)/iqac/initiatives/page.tsx
 *   - app/(frontend)/iqac/objectives/page.tsx
 *   - app/(frontend)/iqac/support/page.tsx
 *   - app/(frontend)/campus/clubs/came/CameCollectionGallery.tsx
 *   - lib/newsApi.ts
 *   - components/SearchOverlay.tsx
 *   - components/PageHeader.tsx
 *   - app/(frontend)/student-life/discover-mlr/VirtualTourSection.tsx
 *
 * Zero-relevant-link files are listed for context only — they are not
 * asserted to be fully clean of every possible external URL in the project.
 * Only the relevant legacy patterns above were grepped.
