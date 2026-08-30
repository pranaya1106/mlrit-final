/**
 * Every CMS-editable section, keyed by `${page}/${section}` — the same pair
 * used for the content_blocks lookup and the /admin/[page]/[section] route.
 *
 * Adding an entry here is all that is needed to give a section an admin editor;
 * the write API reads this to know which fields are required.
 */
export const CONTENT_SECTIONS = {
  'home/hero': {
    label: 'Homepage — Hero',
    fields: [
      { name: 'headlineLead', label: 'Headline lead' },
      { name: 'headlineAccent', label: 'Headline accent' },
      { name: 'body', label: 'Body', multiline: true },
    ],
  },
  // Counters under the hero. Mirrors the STATS array in components/sections/Stats.tsx;
  // an empty repeater leaves that array in charge.
  'home/stats': {
    label: 'Homepage — Stat counters',
    fields: [
      {
        name: 'stats',
        label: 'Counters',
        type: 'repeater',
        itemFields: [
          { name: 'target', label: 'Number', type: 'number' },
          { name: 'suffix', label: 'Suffix' },
          { name: 'label', label: 'Label' },
        ],
        // 4 = the grid is grid-cols-2 md:grid-cols-4; a fifth would wrap
        // alone onto a second row.
        maxItems: 4,
        defaultItems: [
          { id: 'years', target: 20, suffix: '+', label: 'Years of Excellence' },
          { id: 'students', target: 11, suffix: 'K+', label: 'Students Enrolled' },
          { id: 'placement-rate', target: 98, suffix: '%', label: 'Placement Rate' },
          { id: 'recruiters', target: 200, suffix: '+', label: 'Recruiting Companies' },
        ],
      },
    ],
  },
  'home/achievements': {
    label: 'Homepage — Accreditations',
    fields: [
      { name: 'headlineLead', label: 'Headline lead' },
      { name: 'headlineAccent', label: 'Headline accent' },
      { name: 'body', label: 'Body', multiline: true },
      // 7 = the number of constellation slots in Achievements.tsx (BUBBLES).
      // defaultItems mirror that component's bundled logos so the editor opens
      // with the live set already listed and editable.
      {
        name: 'logos',
        label: 'Accreditation logos',
        type: 'gallery',
        itemFields: ['name'],
        maxItems: 7,
        defaultItems: [
          { id: 'naac', name: 'NAAC', key: '/legacy/nirf/naac.svg' },
          { id: 'aicte', name: 'AICTE', key: '/legacy/nirf/aicte.svg' },
          { id: 'the-week', name: 'The Week', key: '/legacy/nirf/the%20week.svg' },
          { id: 'ariia', name: 'ARIIA', key: '/legacy/nirf/arha.svg' },
          { id: 'nba', name: 'NBA', key: '/legacy/nirf/nba.svg' },
          { id: 'dataquest', name: 'Dataquest', key: '/legacy/nirf/dataquest.svg' },
          { id: 'gyaan-vigyan', name: 'Gyaan Vigyan', key: '/legacy/nirf/gyaanvigyan.svg' },
        ],
      },
      // Rank cards down the left column. `tint` is the accent colour used for
      // the number, the left rule and the hover index — any CSS colour.
      {
        name: 'ranks',
        label: 'Rank cards',
        type: 'repeater',
        itemFields: [
          { name: 'num', label: 'Figure' },
          { name: 'title', label: 'Title' },
          { name: 'sub', label: 'Subtitle' },
          { name: 'tint', label: 'Accent colour' },
        ],
        defaultItems: [
          {
            id: 'nirf',
            num: '201',
            title: 'NIRF Rankings 2024',
            sub: '201\u2013300 Band \u00b7 Engineering Category',
            tint: '#e85d04',
          },
          {
            id: 'times',
            num: '#6',
            title: 'Times Engineering Survey',
            sub: '6th in Telangana',
            tint: '#1F6B24',
          },
          {
            id: 'careers360',
            num: 'AAAA',
            title: 'Careers360 Rating',
            sub: 'Four-A Accredited Institution',
            tint: '#c26a2b',
          },
        ],
      },
    ],
  },
  'home/programs': {
    label: 'Homepage — Programmes',
    fields: [
      { name: 'headlineLead', label: 'Headline lead' },
      { name: 'headlineAccent', label: 'Headline accent' },
      { name: 'body', label: 'Body', multiline: true },
    ],
  },
  'home/why-mlrit': {
    label: 'Homepage — Why MLRIT',
    fields: [
      { name: 'heading', label: 'Heading' },
      { name: 'body', label: 'Body', multiline: true },
      { name: 'video', label: 'Background video', type: 'video' },
    ],
  },

  // Counters in the dark placements band. Mirrors the STATS array in
  // components/sections/Placements.tsx. Separate from home/stats: different
  // numbers, different component, edited independently.
  'home/placements': {
    label: 'Homepage — Placement counters',
    fields: [
      {
        name: 'stats',
        label: 'Counters',
        type: 'repeater',
        itemFields: [
          { name: 'target', label: 'Number', type: 'number' },
          { name: 'suffix', label: 'Suffix' },
          { name: 'label', label: 'Label' },
        ],
        // 4 = grid-cols-2 md:grid-cols-4, same reasoning as home/stats.
        maxItems: 4,
        defaultItems: [
          { id: 'highest', target: 44, suffix: 'LPA', label: 'Highest Package' },
          { id: 'placed', target: 5, suffix: 'K+', label: 'Students Placed in Top MNCs' },
          { id: 'average', target: 18, suffix: 'LPA', label: 'Avg. Salary \u2014 Top 25%' },
          {
            id: 'recruiters',
            target: 200,
            suffix: '+',
            label: 'Recruiters incl. IIT/IIM/NIT Hirers',
          },
        ],
      },
    ],
  },

  // Recruiter logos, shared by the homepage marquee and /placements/recruiters.
  // One field, two consumers — previously the same 16 paths were generated
  // independently in both places and would have drifted the moment either was
  // edited.
  'placements/recruiters': {
    label: 'Placements — Recruiter logos',
    fields: [
      {
        name: 'logos',
        label: 'Recruiter logos',
        type: 'gallery',
        itemFields: ['name'],
        defaultItems: [
          { id: 'p1', name: 'Recruiter', key: '/placements/p1.jpg' },
          { id: 'p2', name: 'Recruiter', key: '/placements/p2.jpg' },
          { id: 'p3', name: 'Recruiter', key: '/placements/p3.jpg' },
          { id: 'p4', name: 'Recruiter', key: '/placements/p4.jpg' },
          { id: 'p5', name: 'Recruiter', key: '/placements/p5.jpg' },
          { id: 'p6', name: 'Recruiter', key: '/placements/p6.jpg' },
          { id: 'p7', name: 'Recruiter', key: '/placements/p7.png' },
          { id: 'p8', name: 'Recruiter', key: '/placements/p8.png' },
          { id: 'p9', name: 'Recruiter', key: '/placements/p9.png' },
          { id: 'p10', name: 'Recruiter', key: '/placements/p10.png' },
          { id: 'p11', name: 'Recruiter', key: '/placements/p11.png' },
          { id: 'p12', name: 'Recruiter', key: '/placements/p12.png' },
          { id: 'p13', name: 'Recruiter', key: '/placements/p13.png' },
          { id: 'p14', name: 'Recruiter', key: '/placements/p14.png' },
          { id: 'p15', name: 'Recruiter', key: '/placements/p15.png' },
          { id: 'p16', name: 'Recruiter', key: '/placements/p16.png' },
        ],
      },
    ],
  },

  // TEMPORARY. Exists only to exercise the gallery field end to end without
  // touching production content. No public component reads test/*. Delete this
  // entry once a real section (banners, placements, achievements) is wired up.
  'test/gallery-sandbox': {
    label: 'Sandbox — Gallery field',
    fields: [
      { name: 'heading', label: 'Heading' },
      {
        name: 'images',
        label: 'Gallery (with per-item metadata)',
        type: 'gallery',
        itemFields: ['title', 'linkUrl', 'active', 'startDate', 'endDate'],
      },
      { name: 'plainImages', label: 'Gallery (images only)', type: 'gallery' },
    ],
  },
} as const;

export type SectionKey = keyof typeof CONTENT_SECTIONS;

export type FieldType = 'text' | 'multiline' | 'image' | 'video' | 'gallery' | 'repeater';

/** Per-item metadata a gallery may collect alongside each image. */
export type GalleryItemField = 'name' | 'title' | 'linkUrl' | 'active' | 'startDate' | 'endDate';

/**
 * One column of a repeater row. Unlike a gallery's itemFields — a fixed set of
 * known metadata names — a repeater declares its own shape, because the rows
 * are the content rather than annotations on an uploaded image.
 */
export type RepeaterItemField = {
  readonly name: string;
  readonly label: string;
  readonly type?: 'text' | 'number';
};

export type FieldConfig = {
  readonly name: string;
  readonly label: string;
  readonly type?: FieldType;
  /** Legacy shorthand for `type: 'multiline'`; existing configs still use it. */
  readonly multiline?: boolean;
  /**
   * List fields only. For a gallery: which metadata inputs each item gets, as
   * names from the fixed GalleryItemField set (omit for a plain list of images
   * with no per-item fields). For a repeater: the row's columns, declared
   * inline because a repeater defines its own shape.
   *
   * Read through galleryItemFields()/repeaterItemFields() rather than directly
   * — those narrow the union by the element kind actually present.
   */
  readonly itemFields?: readonly GalleryItemField[] | readonly RepeaterItemField[];
  /**
   * List fields only. How many items the consuming component can actually
   * render. Extras are kept in the data but never displayed, so the editor
   * warns rather than letting someone add rows that silently vanish. Omit when
   * the list has no fixed limit.
   */
  readonly maxItems?: number;
  /**
   * Gallery only. Seeds the EDITOR when nothing has been saved yet, so a
   * section that currently ships hardcoded assets opens with those assets as
   * real, editable rows instead of an empty list.
   *
   * These are never written to the database on load — only an explicit Save
   * persists them. That matters: the public components treat an empty stored
   * gallery as "use my bundled fallback", and auto-saving defaults would
   * quietly convert every section from fallback-driven to CMS-driven.
   */
  readonly defaultItems?: readonly GalleryItem[] | readonly RepeaterItem[];
};

/**
 * One gallery entry. `id` is minted client-side on add and never changes, so it
 * survives reordering and is safe as a React key; `key` is the storage key (or,
 * briefly, a local object URL while the upload is in flight).
 */
export type GalleryItem = {
  id: string;
  key: string;
  name?: string;
  title?: string;
  linkUrl?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
};

/**
 * One repeater row. `id` is minted client-side on add and never changes, so it
 * survives reordering and is safe as a React key; every other key is a column
 * declared by the field's itemFields.
 *
 * Number columns are stored as numbers, but a row that has been through a
 * text input can hold the string form — consumers coerce rather than trust.
 */
export type RepeaterItem = {
  id: string;
  [column: string]: string | number | undefined;
};

/** Resolved field type — `type` wins, then the `multiline` shorthand, then text. */
export const fieldType = (field: FieldConfig): FieldType =>
  field.type ?? (field.multiline ? 'multiline' : 'text');

/**
 * Media fields hold an uploaded asset key and are optional: a section with no
 * uploaded file falls back to whatever the component hardcodes. Only the text
 * fields are required on save.
 */
export const isMediaField = (field: FieldConfig): boolean => {
  const type = fieldType(field);
  return type === 'image' || type === 'video' || type === 'gallery';
};

/** Gallery fields hold an array of items rather than a single string value. */
export const isGalleryField = (field: FieldConfig): boolean => fieldType(field) === 'gallery';

/** Repeater fields hold an array of structured rows — text-first, no uploads. */
export const isRepeaterField = (field: FieldConfig): boolean => fieldType(field) === 'repeater';

/** Either kind of list field: stored as an array, never as a string. */
export const isListField = (field: FieldConfig): boolean =>
  isGalleryField(field) || isRepeaterField(field);

/**
 * Whether a save must reject this field when it is blank.
 *
 * Media is optional (no upload => the component's bundled asset), and so is a
 * repeater (no rows => the component's bundled array). Only plain text fields
 * are required, which is what keeps a repeater-only section savable at all.
 */
export const isRequiredField = (field: FieldConfig): boolean =>
  !isMediaField(field) && !isRepeaterField(field);

/**
 * The gallery metadata names on a field, ignoring repeater column objects.
 * Filtering by element kind rather than casting keeps a mis-declared config
 * from reaching the editor as a malformed input.
 */
export const galleryItemFields = (field: FieldConfig): readonly GalleryItemField[] =>
  (field.itemFields ?? []).filter(
    (item): item is GalleryItemField => typeof item === 'string'
  );

/** The repeater columns on a field, ignoring gallery metadata names. */
export const repeaterItemFields = (field: FieldConfig): readonly RepeaterItemField[] =>
  (field.itemFields ?? []).filter(
    (item): item is RepeaterItemField => typeof item === 'object' && item !== null
  );

/** Narrows an unknown stored value to repeater rows, discarding malformed ones. */
export const asRepeaterItems = (value: unknown): RepeaterItem[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is RepeaterItem =>
      typeof item === 'object' &&
      item !== null &&
      !Array.isArray(item) &&
      typeof (item as RepeaterItem).id === 'string'
  );
};

/**
 * A repeater column read as a number, for the counter targets.
 *
 * Accepts the number itself and the string an <input type="number"> produces;
 * anything unusable yields the fallback so a half-typed row renders the
 * component's own value rather than NaN.
 */
export const asNumber = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : Number(String(value ?? '').trim());
  return Number.isFinite(parsed) ? parsed : fallback;
};

/** A repeater column read as a trimmed string. */
export const asText = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;

/** Narrows an unknown stored value to gallery items, discarding malformed ones. */
export const asGalleryItems = (value: unknown): GalleryItem[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is GalleryItem =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as GalleryItem).id === 'string' &&
      typeof (item as GalleryItem).key === 'string'
  );
};

/** Field config for a page/section pair, or null when it is not editable. */
export function getSectionConfig(
  page: string,
  section: string
): { label: string; fields: readonly FieldConfig[] } | null {
  const key = `${page}/${section}`;
  if (!Object.prototype.hasOwnProperty.call(CONTENT_SECTIONS, key)) return null;
  return CONTENT_SECTIONS[key as SectionKey];
}
