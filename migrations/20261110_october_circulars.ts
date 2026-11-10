import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * October 2026's circulars as rows in the Circulars list in the admin, so each
 * can be edited or deleted there. They were until now only built into the page
 * (lib/content/circulars-data.ts); the files are the same ones, already in S3
 * and served from /examinations/circulars/..., and a row here takes the place
 * of its built-in copy on the page.
 *
 * Only rows whose file is not already in the list are added, so a re-run
 * changes nothing and an edit made in the admin is never overwritten.
 */
const ROWS = [
  { id: "i-b-tech-i-sem-regular-and-supply-and-i-b-tech-ii-sem-supply", title: "I B.Tech I Sem Regular/Supply and I B.Tech II Sem Supply Examinations December 2026 Fee Notification", category: "Fee", date: "October 29, 2026", file: "/examinations/circulars/I-B.Tech-I-Sem.-Regular-and-Supply-and-I-B.Tech.-II-Sem.-Supply-Examinations-December-2026-Fee-Notification.pdf" },
  { id: "iv-b-tech-i-sem-practical-regular-examinations-november-2026", title: "IV B.Tech I Sem - Practical Regular Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/IV-B.Tech.-I-Sem.-Practical-Regular-Examinations-November-2026-Timetable.pdf" },
  { id: "iii-b-tech-i-sem-practical-regular-examinations-november-202", title: "III B.Tech I Sem - Practical Regular Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/III-B.Tech.-I-Sem.-Practical-Regular-Examinations-November-2026-Timetable.pdf" },
  { id: "ii-b-tech-i-sem-practical-regular-examinations-november-2026", title: "II B.Tech I Sem - Practical Regular Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/II-B.Tech.-I-Sem.-Practical-Regular-Examinations-November-2026-Timetable.pdf" },
  { id: "iii-b-tech-ii-sem-supply-examinations-timetable-november2026", title: "III B.Tech II Sem - Supply Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/III-B.Tech-II-Sem-Supply-Examinations-TImeTable-November2026.pdf" },
  { id: "ii-b-tech-ii-sem-supply-examinations-timetable-november2026", title: "II B.Tech II Sem - Supply Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/II-B.Tech-II-Sem-Supply-Examinations-TImeTable-November2026.pdf" },
  { id: "iv-b-tech-i-sem-regular-and-supply-examinations-november-or-", title: "IV B.Tech I Sem - Regular and Supply Examinations November/December 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/IV-B.Tech-I-Sem-Regular-and-Supply-Examinations-November-or-December-2026-Timetable.pdf" },
  { id: "iii-b-tech-i-sem-regular-supply-examinations-timetable-novem", title: "III B.Tech I Sem - Regular and Supply Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/III-B.Tech-I-Sem-Regular,Supply-Examinations-TImeTable-November2026.pdf" },
  { id: "ii-b-tech-i-sem-regular-supply-examinations-timetable-novemb", title: "II B.Tech I Sem - Regular and Supply Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/II-B.Tech-I-Sem-Regular,Supply-Examinations-TImeTable-November2026.pdf" },
  { id: "otc-project-permission-for-late-submission-proceeding", title: "JNTUH One-Time-Chance Project - Permission for Late Submission Proceedings", category: "Notice", date: "October 27, 2026", file: "/examinations/circulars/OTC project - permission for late submission proceeding.pdf" },
  { id: "ph-d-course-work-cie-i-examinations-november-2026-timetable", title: "Ph.D. Course Work CIE-I Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/Ph.D-Course-Work-CIE-I-Examinations-November-2026-Timetable.pdf" },
  { id: "i-m-tech-i-sem-r25-cie-i-examinations-november-2026-timetabl", title: "I M.Tech I Sem R25 CIE-I Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/I-M.Tech.-I-Sem.-R25-CIE-I-Examinations-November-2026-Timetable.pdf" },
  { id: "ii-mba-i-semester-r25-cie-i-examinations-november-2026-timet", title: "II MBA I Sem R25 CIE-I Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/II-MBA-I-Semester-R25-CIE-I-Examinations-November-2026-Timetable.pdf" },
  { id: "i-mba-i-semester-r25-cie-i-examinations-november-2026-timeta", title: "I MBA I Sem R25 CIE-I Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/I-MBA-I-Semester-R25-CIE-I-Examinations-November-2026-Timetable.pdf" },
  { id: "iv-b-tech-i-semester-r22-cie-ii-examinations-november-2026-t", title: "IV B.Tech I Sem R22 CIE-II Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/IV-B.Tech.-I-Semester-R22-CIE-II-Examinations-November-2026-Timetable.pdf" },
  { id: "iii-b-tech-i-semester-r22-cie-ii-examinations-november-2026-", title: "III B.Tech I Sem R22 CIE-II Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/III-B.Tech.-I-Semester-R22-CIE-II-Examinations-November-2026-Timetable.pdf" },
  { id: "ii-b-tech-i-semester-r22-cie-ii-examinations-november-2026-t", title: "II B.Tech I Sem R22 CIE-II Examinations November 2026 Timetable (Re-Registered Students)", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/II-B.Tech.-I-Semester-R22-CIE-II-Examinations-November-2026-Timetable-For-Re-Registered-Students.pdf" },
  { id: "ii-b-tech-i-semester-r25-cie-ii-examinations-november-2026-t", title: "II B.Tech I Sem R25 CIE-II Examinations November 2026 Timetable", category: "Timetable", date: "October 27, 2026", file: "/examinations/circulars/II-B.Tech.-I-Semester-R25-CIE-II-Examinations-November-2026-Timetable.pdf" },
  { id: "ii-iii-and-iv-b-tech-i-sem-regular-or-supplementary-and-ii-a", title: "II, III & IV B.Tech I Sem Regular/Supplementary and II & III B.Tech II Sem Supplementary Examinations November 2026 Fee Notification", category: "Fee", date: "October 27, 2026", file: "/examinations/circulars/II-III-and-IV-B.Tech.-I-Sem.-Regular-or-Supplementary-and-II-and-III-B.Tech.-II-Sem.-Supplementary-Examinations-November-2026-Fee-Notification.pdf" },
]

const SLUG = 'examinations-circulars' as const

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const current = (await payload.findGlobal({ slug: SLUG, depth: 0, overrideAccess: true, req })) as {
    circularList?: { file?: string | null }[] | null
  }
  const list = current.circularList ?? []
  const have = new Set(list.map((r) => String(r.file ?? '')))
  const fresh = ROWS.filter((r) => !have.has(r.file)).map(({ id, ...r }) => ({ ...r, itemId: id }))
  if (!fresh.length) return

  await payload.updateGlobal({
    slug: SLUG,
    data: { circularList: [...list, ...fresh], _status: 'published' } as never,
    depth: 0,
    overrideAccess: true,
    req,
  })
  payload.logger.info(`october 2026 circulars: added ${fresh.length} to the existing ${list.length}`)
}

// Rows are ordinary CMS content from here on; nothing to undo.
export async function down(_: MigrateDownArgs): Promise<void> {}
