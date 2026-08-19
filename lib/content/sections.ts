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

export type FieldType = 'text' | 'multiline' | 'image' | 'video' | 'gallery';

/** Per-item metadata a gallery may collect alongside each image. */
export type GalleryItemField = 'name' | 'title' | 'linkUrl' | 'active' | 'startDate' | 'endDate';

export type FieldConfig = {
  readonly name: string;
  readonly label: string;
  readonly type?: FieldType;
  /** Legacy shorthand for `type: 'multiline'`; existing configs still use it. */
  readonly multiline?: boolean;
  /**
   * Gallery only. Which metadata inputs each item gets. Omit for a plain list
   * of images with no per-item fields.
   */
  readonly itemFields?: readonly GalleryItemField[];
  /**
   * Gallery only. How many items the consuming component can actually render.
   * Extra uploads are kept in the data but never displayed, so the editor warns
   * rather than letting someone add images that silently vanish. Omit when the
   * gallery has no fixed limit.
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
  readonly defaultItems?: readonly GalleryItem[];
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
