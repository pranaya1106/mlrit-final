import type { CollectionConfig, Field } from 'payload';

import { DEPARTMENTS } from '@/lib/departments';

import { canEditFaculty, hiddenUnlessFaculty } from '../access';
import { mediaField } from '../fields';

/**
 * Every faculty member, including heads of department. One document per person,
 * so a new joiner, a promotion or a new photo is a normal admin edit and the
 * department pages, the /faculty/<slug> profile and site search all follow.
 *
 * The first rows came from lib/faculty.ts and the department lists in
 * lib/dept-data.ts (see the faculty seed migration); after that the database is
 * the source and those files are only the fallback shown if it cannot be read.
 */

/** A list of short strings, stored as rows of one text column. */
const textList = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'array',
  labels: { singular: 'Entry', plural: 'Entries' },
  admin: { description },
  fields: [{ name: 'value', type: 'text', label: 'Text', required: true }],
});

/** A list of long entries (a publication is a whole citation). */
const longList = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'array',
  labels: { singular: 'Entry', plural: 'Entries' },
  admin: { description },
  fields: [{ name: 'value', type: 'textarea', label: 'Text', required: true }],
});

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const Faculty: CollectionConfig = {
  slug: 'faculty',
  labels: { singular: 'Faculty member', plural: 'Faculty' },
  admin: {
    group: 'Faculty',
    hidden: hiddenUnlessFaculty,
    useAsTitle: 'name',
    defaultColumns: ['name', 'department', 'designation', 'isHod'],
    listSearchableFields: ['name', 'empId', 'email'],
    pagination: { defaultLimit: 50 },
  },
  defaultSort: 'order',
  access: { read: () => true, create: canEditFaculty, update: canEditFaculty, delete: canEditFaculty },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        // The URL is /faculty/<slug>. Made once from the name when left empty,
        // then never changed on its own, so a rename does not break links.
        if (!data.slug && data.name) {
          data.slug = [slugify(String(data.name)), data.department].filter(Boolean).join('-');
        }
        return data;
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Name', required: true },
    { name: 'designation', type: 'text', label: 'Designation', required: true, admin: { description: 'For example: Professor, Associate Professor, Head of Department.' } },
    {
      type: 'row',
      fields: [
        {
          name: 'department',
          type: 'select',
          label: 'Department',
          required: true,
          index: true,
          options: DEPARTMENTS.map((d) => ({ label: d.name, value: d.slug })),
        },
        { name: 'isHod', type: 'checkbox', label: 'Head of Department', defaultValue: false, admin: { description: 'Shows this person in the "From the HOD\'s Desk" section of the department page.' } },
      ],
    },
    {
      name: 'hodMessage',
      type: 'textarea',
      label: 'HOD message',
      admin: {
        description: 'The message shown in the department\'s "From the HOD\'s Desk" section. Leave empty to use the department\'s general message.',
        condition: (_, siblingData) => Boolean(siblingData?.isHod),
      },
    },
    mediaField('photo', 'Photo', 'image'),
    { name: 'imageAlt', type: 'text', label: 'Photo description', admin: { description: 'Read out by screen readers. Defaults to "Portrait of <name>".' } },
    textList('qualifications', 'Qualifications', 'For example: M.Tech, Ph.D.'),
    textList('specialization', 'Areas of specialization'),
    { name: 'experience', type: 'text', label: 'Experience', admin: { description: 'For example: 8 YEARS.' } },
    textList('subjectsTaught', 'Subjects taught'),
    { name: 'description', type: 'textarea', label: 'About' },
    longList('publications', 'Publications'),
    longList('patents', 'Patents'),
    longList('books', 'Books'),
    { name: 'email', type: 'email', label: 'Email' },
    {
      name: 'profileLinks',
      type: 'group',
      label: 'Profile links',
      fields: [
        { name: 'linkedin', type: 'text', label: 'LinkedIn' },
        { name: 'googleScholar', type: 'text', label: 'Google Scholar' },
        { name: 'scopus', type: 'text', label: 'Scopus' },
        { name: 'orcid', type: 'text', label: 'ORCID' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'empId', type: 'text', label: 'Employee ID' },
        { name: 'order', type: 'number', label: 'Order', defaultValue: 1000, admin: { description: 'Lower numbers come first within a department. Ties are sorted by name.' } },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL name',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'The profile is at /faculty/<this>. Filled in from the name; leave it alone once the page is shared.' },
    },
  ],
};
