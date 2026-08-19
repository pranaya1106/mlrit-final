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
} as const;

export type SectionKey = keyof typeof CONTENT_SECTIONS;

export type FieldType = 'text' | 'multiline' | 'image' | 'video';

export type FieldConfig = {
  readonly name: string;
  readonly label: string;
  readonly type?: FieldType;
  /** Legacy shorthand for `type: 'multiline'`; existing configs still use it. */
  readonly multiline?: boolean;
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
  return type === 'image' || type === 'video';
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
