import test from 'node:test';
import assert from 'node:assert/strict';

import {
  APPS,
  LIVE_STATE,
  buildOutput,
  filterAndSortVersions,
  loadKnownGood,
} from '../scripts/fetch-releases.mjs';

const DIAGNOSTIC = 'ASC /apps → 401: SECRET-RESPONSE-BODY';

function hasKeyDeep(value, key) {
  if (Array.isArray(value)) return value.some(v => hasKeyDeep(v, key));
  if (value && typeof value === 'object') {
    return Object.entries(value).some(
      ([k, v]) => k === key || hasKeyDeep(v, key)
    );
  }
  return false;
}

function assertNoDiagnostics(json) {
  const serialized = JSON.stringify(json);
  assert.equal(hasKeyDeep(json, 'error'), false, 'no error keys in public output');
  assert.ok(!serialized.includes('SECRET-RESPONSE-BODY'), 'no raw diagnostics in public output');
}

function version(version, state, releasedAt, notes = 'notes') {
  return {
    version,
    state,
    releasedAt,
    whatsNew: { en: notes, ar: '' },
  };
}

test('APPS keys stay aligned with the public release hooks', () => {
  assert.deepEqual(APPS.map(a => a.key), [
    'sshift',
    'phonespace',
    'dufaat',
    'filed',
    'dabta',
  ]);
});

test('filterAndSortVersions selects only READY_FOR_SALE and sorts newest first', () => {
  const raw = [
    version('2.0', LIVE_STATE, '2026-08-01T00:00:00Z'),
    version('1.9', 'PENDING_DEVELOPER_RELEASE', '2026-08-20T00:00:00Z'),
    version('1.8', 'PROCESSING_FOR_APP_STORE', '2026-07-01T00:00:00Z'),
    version('1.7', 'REPLACED_WITH_NEW_VERSION', '2026-06-01T00:00:00Z'),
    version('1.6', 'REMOVED_FROM_SALE', '2026-05-01T00:00:00Z'),
    version('1.5', 'NOT_APPLICABLE', '2026-04-01T00:00:00Z'),
    version('1.0', LIVE_STATE, '2025-01-01T00:00:00Z', 'first'),
    version('', LIVE_STATE, '2026-03-01T00:00:00Z'),
    version('9.9', LIVE_STATE, ''),
  ];

  const selected = filterAndSortVersions(raw);

  assert.deepEqual(
    selected.map(v => [v.version, v.state]),
    [
      ['2.0', LIVE_STATE],
      ['1.0', LIVE_STATE],
    ]
  );
  assert.equal(selected[1].whatsNew.en, 'first');
});

test('filterAndSortVersions breaks semver ties by release date', () => {
  const selected = filterAndSortVersions([
    version('1.0.10', LIVE_STATE, '2026-01-01T00:00:00Z', 'old-tie'),
    version('1.0.10', LIVE_STATE, '2026-06-01T00:00:00Z', 'new-tie'),
    version('1.0.9', LIVE_STATE, '2026-07-01T00:00:00Z', 'lower-semver'),
  ]);

  assert.deepEqual(
    selected.map(v => v.whatsNew.en),
    ['new-tie', 'old-tie', 'lower-semver']
  );
});

test('buildOutput publishes fresh data for every app with no diagnostics', async () => {
  const fetchApp = async app => [
    version('4.2', LIVE_STATE, '2026-08-01T00:00:00Z', `fresh ${app.key}`),
  ];

  const result = await buildOutput({
    nowIso: '2026-08-25T00:00:00.000Z',
    apps: APPS,
    knownGood: null,
    fetchApp,
  });

  assert.equal(result.ok, true);
  assert.equal(result.json.updatedAt, '2026-08-25T00:00:00.000Z');
  for (const app of APPS) {
    assert.deepEqual(result.json.apps[app.key], {
      appStoreId: app.appStoreId,
      versions: [version('4.2', LIVE_STATE, '2026-08-01T00:00:00Z', `fresh ${app.key}`)],
    });
  }
  assertNoDiagnostics(result.json);
});

test('per-app failure retains previous known-good entry verbatim', async () => {
  const knownGoodVersions = [
    version('3.1', LIVE_STATE, '2026-05-01T00:00:00Z', 'known-good dufaat'),
    version('3.0', LIVE_STATE, '2026-02-01T00:00:00Z', 'older known-good'),
  ];
  const knownGood = {
    updatedAt: '2026-06-01T00:00:00.000Z',
    apps: {
      sshift: { appStoreId: '6751362215', versions: [] },
      phonespace: { appStoreId: '6765632161', versions: [] },
      dufaat: { appStoreId: '6780440703', versions: knownGoodVersions },
      filed: { appStoreId: '6781196551', versions: [] },
    },
  };

  const result = await buildOutput({
    nowIso: '2026-08-25T00:00:00.000Z',
    apps: APPS,
    knownGood,
    fetchApp: async app => {
      if (app.key === 'dufaat') throw new Error(DIAGNOSTIC);
      return [version('1.0', LIVE_STATE, '2026-08-01T00:00:00Z')];
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.json.apps.dufaat.versions, knownGoodVersions);
  assert.deepEqual(result.json.apps.sshift.versions, [
    version('1.0', LIVE_STATE, '2026-08-01T00:00:00Z'),
  ]);
  assertNoDiagnostics(result.json);
});

test('retained known-good entries never carry legacy error fields or text', async () => {
  const knownGood = {
    updatedAt: '2026-06-01T00:00:00.000Z',
    apps: {
      sshift: { appStoreId: '6751362215', versions: [] },
      phonespace: { appStoreId: '6765632161', versions: [] },
      dufaat: {
        appStoreId: '6780440703',
        versions: knownGoodVersions(),
        error: DIAGNOSTIC,
      },
      filed: { appStoreId: '6781196551', versions: [] },
    },
  };

  function knownGoodVersions() {
    return [version('2.2', LIVE_STATE, '2026-08-11T14:00:45Z', 'dufaat 2.2')];
  }

  const result = await buildOutput({
    nowIso: '2026-08-25T00:00:00.000Z',
    apps: APPS,
    knownGood,
    fetchApp: async app => {
      if (app.key === 'dufaat') throw new Error(DIAGNOSTIC);
      return [version('1.0', LIVE_STATE, '2026-08-01T00:00:00Z')];
    },
  });

  assert.equal(result.ok, true);
  assert.equal(knownGood.apps.dufaat.error.includes('SECRET-RESPONSE-BODY'), true);
  assert.deepEqual(result.json.apps.dufaat, {
    appStoreId: '6780440703',
    versions: [version('2.2', LIVE_STATE, '2026-08-11T14:00:45Z', 'dufaat 2.2')],
  });
  assertNoDiagnostics(result.json);
});

test('successful fetch with zero eligible versions retains non-empty known-good', async () => {
  const knownGoodVersions = [
    version('2.2', LIVE_STATE, '2026-08-11T14:00:45Z', 'known-good dufaat'),
  ];
  const knownGood = {
    updatedAt: '2026-06-01T00:00:00.000Z',
    apps: {
      sshift: { appStoreId: '6751362215', versions: [] },
      phonespace: { appStoreId: '6765632161', versions: [] },
      dufaat: { appStoreId: '6780440703', versions: knownGoodVersions },
      filed: { appStoreId: '6781196551', versions: [] },
    },
  };

  const result = await buildOutput({
    nowIso: '2026-08-25T00:00:00.000Z',
    apps: APPS,
    knownGood,
    fetchApp: async app => {
      if (app.key === 'dufaat') return []; // fetch succeeds, nothing READY_FOR_SALE
      return [version('1.0', LIVE_STATE, '2026-08-01T00:00:00Z')];
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.json.apps.dufaat.versions, knownGoodVersions);
  assert.deepEqual(result.json.apps.sshift.versions, [
    version('1.0', LIVE_STATE, '2026-08-01T00:00:00Z'),
  ]);
  assertNoDiagnostics(result.json);
});

test('zero eligible versions with no known-good is unsafe and produces no output JSON', async () => {
  const result = await buildOutput({
    nowIso: '2026-08-25T00:00:00.000Z',
    apps: APPS,
    knownGood: null,
    fetchApp: async app => {
      if (app.key === 'dufaat') return []; // fetch succeeds, nothing READY_FOR_SALE
      return [version('1.0', LIVE_STATE, '2026-08-01T00:00:00Z')];
    },
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.failures, [{ app: 'dufaat' }]);
  assert.equal(result.json, undefined);
});

test('known-good entry with an empty versions array is not valid and is unsafe', async () => {
  const knownGood = {
    updatedAt: '2026-06-01T00:00:00.000Z',
    apps: {
      sshift: { appStoreId: '6751362215', versions: [] },
      phonespace: { appStoreId: '6765632161', versions: [] },
      dufaat: { appStoreId: '6780440703', versions: [] }, // empty history is NOT known-good
      filed: { appStoreId: '6781196551', versions: [] },
    },
  };

  const result = await buildOutput({
    nowIso: '2026-08-25T00:00:00.000Z',
    apps: APPS,
    knownGood,
    fetchApp: async app => {
      if (app.key === 'dufaat') throw new Error(DIAGNOSTIC);
      return [version('1.0', LIVE_STATE, '2026-08-01T00:00:00Z')];
    },
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.failures, [{ app: 'dufaat' }]);
  assert.equal(result.json, undefined);
});

test('failure without known-good is unsafe and produces no output JSON', async () => {
  const result = await buildOutput({
    nowIso: '2026-08-25T00:00:00.000Z',
    apps: APPS,
    knownGood: null,
    fetchApp: async app => {
      if (app.key === 'filed') throw new Error(DIAGNOSTIC);
      return [version('1.0', LIVE_STATE, '2026-08-01T00:00:00Z')];
    },
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.failures, [{ app: 'filed' }]);
  assert.equal(result.json, undefined);
});

test('failure with no existing releases.json at all is unsafe', async () => {
  const result = await buildOutput({
    nowIso: '2026-08-25T00:00:00.000Z',
    apps: APPS,
    knownGood: null,
    fetchApp: async () => {
      throw new Error(DIAGNOSTIC);
    },
  });

  assert.equal(result.ok, false);
  assert.deepEqual(
    result.failures.map(f => f.app),
    ['sshift', 'phonespace', 'dufaat', 'filed', 'dabta']
  );
  assert.equal(result.json, undefined);
});

test('loadKnownGood parses an existing file via injected reader', async () => {
  const parsed = await loadKnownGood('releases.json', async () =>
    JSON.stringify({ updatedAt: 'x', apps: {} })
  );
  assert.deepEqual(parsed, { updatedAt: 'x', apps: {} });
});

test('loadKnownGood returns null for missing or invalid files', async () => {
  const missing = await loadKnownGood('releases.json', async () => {
    const err = new Error('ENOENT');
    err.code = 'ENOENT';
    throw err;
  });
  assert.equal(missing, null);

  const invalid = await loadKnownGood('releases.json', async () => '{ not json');
  assert.equal(invalid, null);
});


test('identical app data keeps the previous timestamp and skips rewriting', async () => {
  const app = APPS.find(app => app.key === 'dabta');
  const versions = [version('1.0', LIVE_STATE, '2026-11-21T17:44:00Z', '')];
  const knownGood = {
    updatedAt: '2026-11-21T00:00:00.000Z',
    apps: { dabta: { appStoreId: app.appStoreId, versions } },
  };
  const result = await buildOutput({
    nowIso: '2026-11-22T00:00:00.000Z',
    apps: [app],
    knownGood,
    fetchApp: async () => structuredClone(versions),
  });
  assert.equal(result.ok, true);
  assert.equal(result.changed, false);
  assert.deepEqual(result.json, knownGood);
});

test('keeps existing notes for the same version and locale when Apple returns blanks', async () => {
  const app = APPS.find(app => app.key === 'sshift');
  const current = version('5.2.2', LIVE_STATE, '2026-11-05T00:00:00Z', 'Original English');
  current.whatsNew.ar = 'ملاحظات عربية';
  const knownGood = {
    updatedAt: '2026-11-21T00:00:00.000Z',
    apps: { sshift: { appStoreId: app.appStoreId, versions: [current] } },
  };
  const next = version('5.2.3', LIVE_STATE, '2026-11-22T00:00:00Z', '');
  const result = await buildOutput({
    nowIso: '2026-11-22T00:00:00.000Z',
    apps: [app],
    knownGood,
    fetchApp: async () => [next, {
      ...current, whatsNew: { en: 'Updated English', ar: '   ' },
    }],
  });
  assert.equal(result.ok, true);
  assert.equal(result.changed, true);
  assert.equal(result.json.updatedAt, '2026-11-22T00:00:00.000Z');
  assert.deepEqual(result.json.apps.sshift.versions, [next, {
    ...current, whatsNew: { en: 'Updated English', ar: 'ملاحظات عربية' },
  }]);
});


test('Dabta 1.0 uses its verified public release date, not the creation date', async () => {
  const app = APPS.find(app => app.key === 'dabta');
  const initial = version('1.0', LIVE_STATE, '2026-10-19T10:14:26Z', '');
  const later = version('1.1', LIVE_STATE, '2027-01-02T12:00:00Z', 'Later release');
  const result = await buildOutput({
    nowIso: '2027-01-02T15:00:00Z',
    apps: [app],
    knownGood: null,
    fetchApp: async () => [later, initial],
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.json.apps.dabta.versions, [later, {
    ...initial, releasedAt: '2026-11-21T17:44:00Z',
  }]);
});
