/**
 * Fetches all released versions + release notes for each app
 * from the App Store Connect API, and writes releases.json.
 *
 * Safety contract:
 * - Only READY_FOR_SALE versions are selected.
 * - A successful fetch that yields zero live versions falls back to
 *   that app's NON-EMPTY previous known-good versions array.
 * - An EMPTY previous versions array is not known-good.
 * - A per-app fetch failure retains that app's previous known-good
 *   entry from the existing releases.json.
 * - Raw diagnostics are never written into the public releases.json.
 * - A failure with no known-good data is unsafe: the run exits
 *   non-zero and releases.json is NOT rewritten, so the workflow
 *   aborts before any commit/push.
 *
 * Required env vars:
 *   ASC_KEY_ID         (10-character key ID)
 *   ASC_ISSUER_ID      (UUID)
 *   ASC_PRIVATE_KEY    (contents of the .p8 file, including header/footer)
 */

import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

// ── Config ───────────────────────────────────────────────────
export const APPS = [
  { key: 'sshift',     appStoreId: '6751362215' },
  { key: 'phonespace', appStoreId: '6765632161' },
  { key: 'dufaat',     appStoreId: '6780440703' },
  { key: 'filed',      appStoreId: '6781196551' },
];

export const LIVE_STATE = 'READY_FOR_SALE';

const OUTPUT_PATH = 'releases.json';
const API_BASE = 'https://api.appstoreconnect.apple.com/v1';

// ── JWT generation ───────────────────────────────────────────
async function generateToken() {
  const { ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY } = process.env;
  if (!ASC_KEY_ID || !ASC_ISSUER_ID || !ASC_PRIVATE_KEY) {
    throw new Error('Missing one of: ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY');
  }
  const jwtModule = await import('jsonwebtoken');
  const jwt = jwtModule.default;
  return jwt.sign(
    {
      iss: ASC_ISSUER_ID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 20 * 60, // 20 min
      aud: 'appstoreconnect-v1',
    },
    ASC_PRIVATE_KEY,
    {
      algorithm: 'ES256',
      header: { alg: 'ES256', kid: ASC_KEY_ID, typ: 'JWT' },
    }
  );
}

// ── API helpers ──────────────────────────────────────────────
async function asc(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ASC ${path} → ${res.status}: ${body.slice(0, 400)}`);
  }
  return res.json();
}

// Resolve the App Store ID (numeric) to the internal App ID used by ASC API
async function resolveAppId(appStoreId, token) {
  const direct = await asc(`/apps?filter[id]=${appStoreId}`, token);
  if (direct.data?.length > 0) return direct.data[0].id;
  throw new Error(`Could not resolve internal app ID for App Store ID ${appStoreId}. Verify the ID is correct and the API key has access to this app.`);
}

function pickLocale(locs, preferred) {
  for (const want of preferred) {
    const hit = locs.find(l => l.locale === want);
    if (hit) return hit;
  }
  // Fallback: any locale that startsWith 'en' or 'ar'
  for (const prefix of preferred[0].slice(0, 2) === 'en' ? ['en'] : ['ar']) {
    const hit = locs.find(l => l.locale?.startsWith(prefix));
    if (hit) return hit;
  }
  return null;
}

// Pure selection + ordering of already-mapped version records.
// Only versions actually live on the store are published.
export function filterAndSortVersions(rawVersions) {
  const live = rawVersions.filter(v =>
    v.version && v.state === LIVE_STATE && v.releasedAt
  );

  // Sort newest first by semver-ish then by date
  live.sort((a, b) => {
    const va = a.version.split('.').map(n => parseInt(n, 10) || 0);
    const vb = b.version.split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(va.length, vb.length); i++) {
      const da = va[i] ?? 0;
      const db = vb[i] ?? 0;
      if (da !== db) return db - da;
    }
    return new Date(b.releasedAt) - new Date(a.releasedAt);
  });

  return live;
}

async function fetchAppVersions(internalAppId, token) {
  // Get all versions in descending order
  const url = `/apps/${internalAppId}/appStoreVersions`
    + `?limit=200`
    + `&fields[appStoreVersions]=versionString,appStoreState,createdDate,releaseType,earliestReleaseDate`;
  const data = await asc(url, token);

  console.log(`\n  → ${data.data.length} version(s) found`);

  // For each version, fetch its localizations separately.
  // This is the most reliable way to get whatsNew text per version.
  const versions = await Promise.all(data.data.map(async v => {
    const attr = v.attributes || {};
    const versionId = v.id;

    // Fetch localizations for this specific version
    let locs = [];
    try {
      const locUrl = `/appStoreVersions/${versionId}/appStoreVersionLocalizations`
        + `?fields[appStoreVersionLocalizations]=locale,whatsNew`
        + `&limit=200`;
      const locData = await asc(locUrl, token);
      locs = (locData.data || []).map(l => ({
        locale: l.attributes?.locale,
        whatsNew: l.attributes?.whatsNew || '',
      }));

      console.log(`  ◦ v${attr.versionString} (${attr.appStoreState}): ${locs.length} locale(s)`);
    } catch (err) {
      console.log(`  ◦ v${attr.versionString}: error fetching localizations — ${err.message}`);
    }

    // Choose preferred locales
    const en = pickLocale(locs, ['en-US', 'en-GB', 'en-AU', 'en-CA']);
    const ar = pickLocale(locs, ['ar-SA']);

    // Fallback: any non-empty locale if no English variant is available
    const fallback = (!en?.whatsNew)
      ? locs.find(l => l.whatsNew && l.whatsNew.trim())
      : null;

    return {
      version: attr.versionString,
      state: attr.appStoreState,
      releasedAt: attr.earliestReleaseDate || attr.createdDate,
      whatsNew: {
        en: en?.whatsNew || fallback?.whatsNew || '',
        ar: ar?.whatsNew || '',
      },
    };
  }));

  return filterAndSortVersions(versions);
}

// ── Known-good retention ─────────────────────────────────────
export async function loadKnownGood(path = OUTPUT_PATH, readFile = fs.readFile) {
  try {
    const parsed = JSON.parse(await readFile(path, 'utf8'));
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

// Builds the public output. Never embeds error text in the result:
// failures are reported out-of-band via the returned status.
export async function buildOutput({ nowIso, apps, knownGood, fetchApp }) {
  const output = {
    updatedAt: nowIso,
    apps: {},
  };
  const failures = [];

  for (const app of apps) {
    try {
      console.log(`Fetching ${app.key} (id ${app.appStoreId})...`);
      const versions = await fetchApp(app);
      const previous = knownGood?.apps?.[app.key];
      const previousVersions =
        previous && Array.isArray(previous.versions) ? previous.versions : null;

      if (versions.length === 0) {
        if (previousVersions && previousVersions.length > 0) {
          console.error(`  ✗ ${app.key}: no live versions found; retaining previous known-good release history.`);
          output.apps[app.key] = {
            appStoreId: previous.appStoreId ?? app.appStoreId,
            versions: previousVersions,
          };
        } else {
          failures.push({ app: app.key });
        }
      } else {
        output.apps[app.key] = {
          appStoreId: app.appStoreId,
          versions,
        };
        console.log(`  ✓ ${versions.length} version(s) found`);
      }
    } catch (err) {
      const previous = knownGood?.apps?.[app.key];
      const previousVersions =
        previous && Array.isArray(previous.versions) ? previous.versions : null;
      if (previousVersions && previousVersions.length > 0) {
        console.error(`  ✗ ${app.key}: fetch failed; retaining previous known-good release history.`);
        output.apps[app.key] = {
          appStoreId: previous.appStoreId ?? app.appStoreId,
          versions: previous.versions,
        };
      } else {
        failures.push({ app: app.key });
      }
    }
  }

  if (failures.length > 0) {
    return { ok: false, failures };
  }
  return { ok: true, json: output };
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  const token = await generateToken();
  const knownGood = await loadKnownGood();

  const result = await buildOutput({
    nowIso: new Date().toISOString(),
    apps: APPS,
    knownGood,
    fetchApp: async (app) => {
      const internalId = await resolveAppId(app.appStoreId, token);
      return fetchAppVersions(internalId, token);
    },
  });

  if (!result.ok) {
    const keys = result.failures.map(f => f.app).join(', ');
    console.error(`Unsafe: no previous known-good release history for ${keys}; releases.json was NOT written.`);
    process.exit(1);
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(result.json, null, 2) + '\n', 'utf8');
  console.log('\nWrote releases.json');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(err => {
    console.error('Fatal:', err.message);
    process.exit(1);
  });
}
