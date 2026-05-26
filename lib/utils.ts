// Standard shadcn utility helper — class merge with tailwind awareness.
// We don't pull in tailwind-merge to keep deps slim; classnames join is enough
// for our usage patterns. If we ever hit conflicting class duplication we'll
// upgrade to clsx + tailwind-merge.

export type ClassValue = string | number | boolean | null | undefined | ClassValue[] | { [k: string]: boolean | null | undefined };

function toClass(input: ClassValue): string {
  if (!input) return '';
  if (typeof input === 'string' || typeof input === 'number') return String(input);
  if (Array.isArray(input)) return input.map(toClass).filter(Boolean).join(' ');
  if (typeof input === 'object') {
    return Object.entries(input)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k)
      .join(' ');
  }
  return '';
}

export function cn(...inputs: ClassValue[]): string {
  return inputs.map(toClass).filter(Boolean).join(' ');
}
