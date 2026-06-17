/* ─────────────────────────────────────────────────────────────
   Saud Apps — live App Store data loader
   Fetches public iTunes Search API for each app, caches in
   localStorage (30 min), then populates badges marked with
   data-app="<key>" data-field="<status|version|rating|updated>".
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  // App IDs on the App Store
  const APPS = {
    sshift: '6751362215',
    phonespace: '6765632161',
    dufaat: '6780440703'
  };

  const CACHE_TTL = 30 * 60 * 1000;      // 30 minutes
  const FETCH_TIMEOUT = 8000;            // 8 seconds
  const CACHE_KEY = id => `appdata:${id}`;

  // ── Formatters ─────────────────────────────────────────────
  function fmtUpdated(iso) {
    if (!iso) return null;
    const then = new Date(iso).getTime();
    if (isNaN(then)) return null;
    const diffMs = Date.now() - then;
    const day = 24 * 60 * 60 * 1000;
    const days = Math.floor(diffMs / day);

    if (days < 1)   return 'Updated today';
    if (days < 7)   return `Updated ${days}d ago`;
    if (days < 30)  return `Updated ${Math.floor(days / 7)}w ago`;
    if (days < 365) return `Updated ${Math.floor(days / 30)}mo ago`;
    return `Updated ${Math.floor(days / 365)}y ago`;
  }

  function fmtRating(avg, count) {
    if (!count || count < 1 || typeof avg !== 'number') return null;
    return `★ ${avg.toFixed(1)} (${count})`;
  }

  // ── DOM updater ────────────────────────────────────────────
  function applyToCard(appKey, data) {
    const nodes = document.querySelectorAll(`[data-app="${appKey}"]`);
    nodes.forEach(el => {
      const field = el.dataset.field;

      if (field === 'status') {
        // App removed from App Store → hide; otherwise show
        el.style.display = data ? '' : 'none';
        return;
      }

      if (!data) return; // no data: leave HTML defaults

      if (field === 'version' && data.version) {
        el.textContent = `iOS · v${data.version}`;
      } else if (field === 'rating') {
        const txt = fmtRating(data.averageUserRating, data.userRatingCount);
        if (txt) {
          el.textContent = txt;
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      } else if (field === 'updated') {
        const txt = fmtUpdated(data.currentVersionReleaseDate);
        if (txt) {
          el.textContent = txt;
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      }
    });
  }

  // ── Cache helpers ──────────────────────────────────────────
  function readCache(id) {
    try {
      const raw = localStorage.getItem(CACHE_KEY(id));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  function writeCache(id, data) {
    try {
      localStorage.setItem(CACHE_KEY(id), JSON.stringify({ t: Date.now(), d: data }));
    } catch (e) { /* quota or private mode — silently skip */ }
  }

  // ── Fetch + fallback ───────────────────────────────────────
  async function fetchApp(id) {
    // 1) fresh cache wins (no network)
    const cached = readCache(id);
    if (cached && (Date.now() - cached.t) < CACHE_TTL) {
      return cached.d;
    }

    // 2) network with timeout
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT);
      const res = await fetch(`https://itunes.apple.com/lookup?id=${id}`, {
        signal: ctrl.signal,
        cache: 'no-store'
      });
      clearTimeout(t);
      if (!res.ok) throw new Error('HTTP ' + res.status);

      const json = await res.json();
      const data = (json && json.resultCount > 0) ? json.results[0] : null;
      writeCache(id, data);
      return data;

    } catch (err) {
      // 3) network failed → use stale cache if we have it
      if (cached) return cached.d;
      // 4) nothing usable → signal "no data, keep HTML defaults"
      return undefined;
    }
  }

  // ── Init ───────────────────────────────────────────────────
  function init() {
    Object.entries(APPS).forEach(([key, id]) => {
      fetchApp(id).then(data => {
        if (data !== undefined) applyToCard(key, data);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
