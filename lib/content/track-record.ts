import { asNumber, asRepeaterItems, asText } from '@/lib/content/sections';
import { PLACEMENT_YEARS, type PlacementYearSummary } from '@/lib/placements';

/**
 * Rebuilds the year-wise placement record from two flat repeaters.
 *
 * A year owns a list of companies, which a repeater row cannot hold, so the
 * rows are stored flat and grouped here by their `year` column — the same
 * shape the footer uses for its nav columns. Adding a year is one row in
 * `years` plus company rows carrying that year.
 *
 * Returns the bundled PLACEMENT_YEARS when nothing is saved, so the page
 * renders unchanged until someone edits it.
 */
export function trackRecordFrom(
  yearRows: unknown,
  companyRows: unknown
): PlacementYearSummary[] {
  const years = asRepeaterItems(yearRows);
  if (years.length === 0) return PLACEMENT_YEARS;

  const byYear = new Map<string, PlacementYearSummary['companies']>();
  for (const row of asRepeaterItems(companyRows)) {
    const year = asText(row.year);
    const company = asText(row.company);
    if (!year || !company) continue;

    const selected = asText(row.selected).toLowerCase();
    // Blank means the count was never published; "in-progress" is its own
    // state. Only a real number is a confirmed count.
    const selections: PlacementYearSummary['companies'][number]['selections'] =
      selected === 'in-progress'
        ? { status: 'in-progress' }
        : selected === ''
          ? { status: 'unknown' }
          : { status: 'confirmed', value: asNumber(selected, 0) };

    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push({
      id: String(row.id),
      company,
      role: asText(row.role),
      salaryDisplay: asText(row.salaryDisplay),
      selections,
    });
  }

  return years.map((row) => {
    const year = asText(row.year);
    const bundled = PLACEMENT_YEARS.find((y) => y.year === year);

    return {
      // Fields the table does not render but the type requires keep whatever
      // the bundled year had, so a CMS edit cannot silently blank them.
      ...(bundled ?? ({} as PlacementYearSummary)),
      year,
      academicYear: asText(row.academicYear, bundled?.academicYear ?? ''),
      jobOffers: asNumber(row.jobOffers, bundled?.jobOffers ?? 0),
      companiesVisited: asNumber(row.companiesVisited, bundled?.companiesVisited ?? 0),
      highestPackageLpa: asNumber(row.highestPackageLpa, bundled?.highestPackageLpa ?? 0),
      isProvisional: asText(row.provisional).toLowerCase() === 'yes',
      companies: byYear.get(year) ?? [],
    };
  });
}
