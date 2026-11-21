import assert from 'node:assert/strict';
import test from 'node:test';

import { canManageFaculty, canSeeSection, isOwnerUser } from './visibility';

const owner = { role: 'owner' };
const editor = { role: 'editor', sections: ['home/hero', 'research/downloads'] };

test('an owner sees every section and manages faculty', () => {
  assert.equal(isOwnerUser(owner), true);
  assert.equal(canSeeSection(owner, 'anything/at-all'), true);
  assert.equal(canManageFaculty(owner), true);
});

test('an editor sees only the sections on the account', () => {
  assert.equal(canSeeSection(editor, 'home/hero'), true);
  assert.equal(canSeeSection(editor, 'research/downloads'), true);
  assert.equal(canSeeSection(editor, 'home/stats'), false);
});

test('an editor with no sections, or nobody signed in, sees nothing', () => {
  assert.equal(canSeeSection({ role: 'editor' }, 'home/hero'), false);
  assert.equal(canSeeSection({ role: 'editor', sections: [] }, 'home/hero'), false);
  assert.equal(canSeeSection(null, 'home/hero'), false);
  assert.equal(canSeeSection(undefined, 'home/hero'), false);
});

test('faculty needs the owner or the faculty box on the account', () => {
  assert.equal(canManageFaculty(editor), false);
  assert.equal(canManageFaculty({ ...editor, canEditFaculty: false }), false);
  assert.equal(canManageFaculty({ ...editor, canEditFaculty: true }), true);
  assert.equal(canManageFaculty(null), false);
});
