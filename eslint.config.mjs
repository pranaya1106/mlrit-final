import { FlatCompat } from '@eslint/eslintrc';

// eslint-config-next 15 still ships only the legacy (eslintrc) format, so it
// has to come through FlatCompat. Replace with a direct import once Next ships
// a flat config export.
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  { ignores: ['.next/**', 'node_modules/**', '.test-build/**', 'out/**'] },
  ...compat.extends('next/core-web-vitals'),
];
