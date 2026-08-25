import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('package.json is minimal and pins jsonwebtoken exactly', async () => {
  const pkg = JSON.parse(await read('package.json'));
  assert.equal(pkg.private, true);
  assert.deepEqual(Object.keys(pkg.dependencies), ['jsonwebtoken']);
  assert.equal(pkg.dependencies.jsonwebtoken, '9.0.3');
});

test('package-lock.json locks the registry-pinned tree', async () => {
  const pkg = JSON.parse(await read('package.json'));
  const lock = JSON.parse(await read('package-lock.json'));

  assert.equal(lock.lockfileVersion, 3);
  assert.deepEqual(lock.packages[''].dependencies, pkg.dependencies);

  const jwt = lock.packages['node_modules/jsonwebtoken'];
  assert.equal(jwt.version, '9.0.3');
  assert.match(jwt.resolved, /^https:\/\/registry\.npmjs\.org\//);
  assert.match(jwt.integrity, /^sha512-/);

  for (const [path, entry] of Object.entries(lock.packages)) {
    if (path === '') continue;
    assert.ok(entry.resolved, `${path} has a resolved URL`);
    assert.match(
      entry.resolved,
      /^https:\/\/registry\.npmjs\.org\//,
      `${path} resolves from the official registry`
    );
    assert.ok(entry.integrity, `${path} has an integrity hash`);
  }
});

test('release workflow installs from the lockfile with scripts disabled', async () => {
  const workflow = await read('.github/workflows/sync-releases.yml');

  assert.match(workflow, /run: npm ci --ignore-scripts/);
  assert.doesNotMatch(workflow, /npm install\b/);
});

test('release workflow serializes runs instead of cancelling them', async () => {
  const workflow = await read('.github/workflows/sync-releases.yml');

  assert.match(workflow, /concurrency:\n\s+group: sync-releases\n\s+cancel-in-progress: false\n/);
});

test('release workflow pushes safely to main without force', async () => {
  const workflow = await read('.github/workflows/sync-releases.yml');

  assert.match(workflow, /git fetch origin main --no-tags --prune/);
  assert.match(workflow, /git rebase origin\/main/);
  assert.match(workflow, /git push origin HEAD:main/);
  assert.doesNotMatch(workflow, /--force|force-with-lease|-f\b/);
});

test('the release fetcher still consumes the pinned dependency', async () => {
  const source = await read('scripts/fetch-releases.mjs');

  assert.match(source, /import\('jsonwebtoken'\)/);
});
