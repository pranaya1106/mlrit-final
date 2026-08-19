import assert from 'node:assert/strict';
import test from 'node:test';

import { findTransientMediaError } from './validate';

// home/why-mlrit is the only section with a media field (`video`).
const BASE = { heading: 'Industry Integrated Curriculum', body: 'Body copy.' };
const forVideo = (video: unknown) => findTransientMediaError('home', 'why-mlrit', { ...BASE, video });

test('rejects a blob: URL — the value that once reached the live homepage', () => {
  const result = forVideo('blob:http://localhost:3000/85504cc5-30c1-4344-82ce-36016f27cd82');
  assert.ok(result, 'expected a rejection');
  assert.equal(result.field, 'video');
  assert.match(result.error, /must be an uploaded asset/);
});

test('scheme match is case-insensitive', () => {
  assert.ok(forVideo('BLOB:http://localhost:3000/x'), 'BLOB: must be rejected');
});

test('rejects a data: URL', () => {
  assert.ok(forVideo('data:video/mp4;base64,AAAA'), 'data: must be rejected');
});

test('accepts a real storage key', () => {
  assert.equal(forVideo('home-why-mlrit/efcb42706fb5a7d3.mp4'), null);
});

test('accepts an empty value — media fields are optional', () => {
  assert.equal(forVideo(''), null);
});

test('accepts an absent media field', () => {
  assert.equal(findTransientMediaError('home', 'why-mlrit', BASE), null);
});

test('accepts a rooted path such as the bundled fallback', () => {
  assert.equal(forVideo('/videos/sports.mp4'), null);
});

test('ignores blob: in a non-media field (home/hero has no media fields)', () => {
  const result = findTransientMediaError('home', 'hero', {
    headlineLead: 'blob:not-a-media-field',
    headlineAccent: 'Accent',
    body: 'Body',
  });
  assert.equal(result, null);
});
