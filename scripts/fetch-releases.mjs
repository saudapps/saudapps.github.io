/**
 * Fetches all released versions + release notes for each app
 * from the App Store Connect API, and writes releases.json.
 *
 * Required env vars:
 *   ASC_KEY_ID         (10-character key ID)
 *   ASC_ISSUER_ID      (UUID)
 *   ASC_PRIVATE_KEY    (contents of the .p8 file, including header/footer)
 */

import fs from 'node:fs/promises';
import jwt from 'jsonwebtoken';

// ── Config ───────────────────────────────────────────────────
const APPS = [
  { key: 'sshift',     appStoreId: '6751362215' },
  { key: 'phonespace', appStoreId: '6765632161' },
];

const API_BASE = 'https://api.appstoreconnect.apple.com/v1';

// ── JWT generation ───────────────────────────────────────────
function generateToken() {
  const { ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY } = process.env;
  if (!ASC_KEY_ID || !ASC_ISSUER_ID || !ASC_PRIVATE_KEY) {
    throw new Error('Missing one of: ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY');
  }
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

async function fetchVersions(internalAppId, token) {
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

      // DEBUG: log per-version
      console.log(`  ◦ v${attr.versionString} (${attr.appStoreState}): ${locs.length} locale(s)`);
      for (const loc of locs) {
        const preview = loc.whatsNew
          ? `"${loc.whatsNew.slice(0, 50).replace(/\n/g, ' ')}..."`
          : '(empty)';
        console.log(`      ${loc.locale}: ${preview}`);
      }
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

  // Keep only versions actually released to users (not pending review)
  // READY_FOR_SALE = currently live. Older versions remain READY_FOR_SALE
  // historically in their record. To capture all that were public, include:
  const RELEASED_STATES = new Set([
    'READY_FOR_SALE',
    'PROCESSING_FOR_APP_STORE',
    'PENDING_DEVELOPER_RELEASE',
    'REPLACED_WITH_NEW_VERSION',
    'REMOVED_FROM_SALE',
    'NOT_APPLICABLE',
  ]);
  const released = versions.filter(v =>
    v.version && RELEASED_STATES.has(v.state) && v.releasedAt
  );

  // Sort newest first by semver-ish then by date
  released.sort((a, b) => {
    const va = a.version.split('.').map(n => parseInt(n, 10) || 0);
    const vb = b.version.split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(va.length, vb.length); i++) {
      const da = va[i] ?? 0;
      const db = vb[i] ?? 0;
      if (da !== db) return db - da;
    }
    return new Date(b.releasedAt) - new Date(a.releasedAt);
  });

  return released;
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

// ── Main ─────────────────────────────────────────────────────
async function main() {
  const token = generateToken();
  const output = {
    updatedAt: new Date().toISOString(),
    apps: {},
  };

  for (const app of APPS) {
    try {
      console.log(`Fetching ${app.key} (id ${app.appStoreId})...`);
      const internalId = await resolveAppId(app.appStoreId, token);
      const versions = await fetchVersions(internalId, token);
      output.apps[app.key] = {
        appStoreId: app.appStoreId,
        versions,
      };
      console.log(`  ✓ ${versions.length} version(s) found`);
    } catch (err) {
      console.error(`  ✗ ${app.key}:`, err.message);
      output.apps[app.key] = { appStoreId: app.appStoreId, versions: [], error: err.message };
    }
  }

  await fs.writeFile('releases.json', JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log('\nWrote releases.json');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
