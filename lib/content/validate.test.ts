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

// --- gallery fields --------------------------------------------------------
// test/gallery-sandbox declares `images` (with itemFields) and `plainImages`.

const gallery = (items: unknown) =>
  findTransientMediaError('test', 'gallery-sandbox', { heading: 'H', images: items });

test('rejects a gallery item still holding a blob: key', () => {
  const result = gallery([
    { id: 'a', key: 'test-gallery-sandbox/aaa.png' },
    { id: 'b', key: 'blob:http://localhost:3000/pending' },
  ]);
  assert.ok(result, 'expected a rejection');
  assert.equal(result.field, 'images');
  assert.match(result.error, /image 2 is still uploading/);
});

test('rejects a data: key inside a gallery item', () => {
  assert.ok(gallery([{ id: 'a', key: 'data:image/png;base64,AAAA' }]));
});

test('accepts a gallery of real storage keys', () => {
  assert.equal(
    gallery([
      { id: 'a', key: 'test-gallery-sandbox/aaa.png', title: 'One', active: true },
      { id: 'b', key: 'test-gallery-sandbox/bbb.png' },
    ]),
    null
  );
});

test('accepts an empty gallery and a missing gallery', () => {
  assert.equal(gallery([]), null);
  assert.equal(findTransientMediaError('test', 'gallery-sandbox', { heading: 'H' }), null);
});

test('ignores malformed gallery entries rather than throwing', () => {
  assert.equal(gallery(['nope', null, 42, { noKey: true }]), null);
});

test('reports the first offending item when several are pending', () => {
  const result = gallery([
    { id: 'a', key: 'ok/one.png' },
    { id: 'b', key: 'blob:http://localhost:3000/x' },
    { id: 'c', key: 'blob:http://localhost:3000/y' },
  ]);
  assert.ok(result, 'expected a rejection');
  assert.match(result.error, /image 2 /);
});
