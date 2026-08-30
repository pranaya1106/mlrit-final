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

// --- repeater fields -------------------------------------------------------
// home/stats declares `stats` (target/suffix/label); home/achievements declares
// `ranks` alongside its gallery, so both orderings of the walk are exercised.

const stats = (rows: unknown) => findTransientMediaError('home', 'stats', { stats: rows });

test('rejects a blob: URL pasted into a repeater column', () => {
  const result = stats([
    { id: 'a', target: 20, suffix: '+', label: 'Years' },
    { id: 'b', target: 11, suffix: 'K+', label: 'blob:http://localhost:3000/pending' },
  ]);
  assert.ok(result, 'expected a rejection');
  assert.equal(result.field, 'stats');
  assert.match(result.error, /row 2 \(label\)/);
});

test('repeater row position is 1-based, matching the editor', () => {
  const result = stats([{ id: 'a', target: 1, suffix: '+', label: 'data:text/plain,x' }]);
  assert.ok(result, 'expected a rejection');
  assert.match(result.error, /row 1 /);
});

test('reports the first offending repeater row when several are bad', () => {
  const result = stats([
    { id: 'a', label: 'fine' },
    { id: 'b', label: 'blob:http://localhost:3000/x' },
    { id: 'c', label: 'blob:http://localhost:3000/y' },
  ]);
  assert.ok(result, 'expected a rejection');
  assert.match(result.error, /row 2 /);
});

test('the repeater id is never itself reported as a transient value', () => {
  // An id is client-minted and never a URL, but the walk must skip it rather
  // than rely on that — a crypto.randomUUID() value must not be scanned.
  assert.equal(stats([{ id: 'blob:not-a-column', label: 'fine' }]), null);
});

test('accepts numeric repeater columns', () => {
  assert.equal(stats([{ id: 'a', target: 98, suffix: '%', label: 'Placement Rate' }]), null);
});

test('accepts an empty repeater and a missing repeater', () => {
  assert.equal(stats([]), null);
  assert.equal(findTransientMediaError('home', 'stats', {}), null);
});

test('ignores malformed repeater entries rather than throwing', () => {
  assert.equal(stats(['nope', null, 42, { noId: true }]), null);
});

test('walks a repeater that sits alongside a gallery in the same section', () => {
  const result = findTransientMediaError('home', 'achievements', {
    headlineLead: 'Accreditations',
    headlineAccent: 'and Approvals.',
    body: 'Body copy.',
    logos: [{ id: 'l1', key: '/legacy/nirf/naac.svg' }],
    ranks: [
      { id: 'r1', num: '201', title: 'NIRF', sub: 'Band', tint: '#e85d04' },
      { id: 'r2', num: '#6', title: 'Times', sub: 'blob:http://localhost:3000/x', tint: '#1F6B24' },
    ],
  });
  assert.ok(result, 'expected a rejection');
  assert.equal(result.field, 'ranks');
  assert.match(result.error, /row 2 \(sub\)/);
});

test('a clean gallery + repeater section passes', () => {
  assert.equal(
    findTransientMediaError('home', 'achievements', {
      headlineLead: 'Accreditations',
      headlineAccent: 'and Approvals.',
      body: 'Body copy.',
      logos: [{ id: 'l1', key: 'home-achievements/abc.svg' }],
      ranks: [{ id: 'r1', num: 'AAAA', title: 'Careers360', sub: 'Four-A', tint: '#c26a2b' }],
    }),
    null
  );
});
