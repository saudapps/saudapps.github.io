/* ─────────────────────────────────────────────────────────────
   Saud Apps — "What's New" section renderer
   Reads releases.json and populates [data-releases="<appKey>"]
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  const RELEASES_URL = '/releases.json';
  const FALLBACK_URL = 'releases.json'; // relative fallback for subpaths

  // ── Helpers ────────────────────────────────────────────────
  function getLang() {
    const htmlLang = document.documentElement.getAttribute('lang');
    return htmlLang === 'ar' ? 'ar' : 'en';
  }

  function fmtDate(iso, lang) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const now = Date.now();
    const diffDays = Math.floor((now - d.getTime()) / (24 * 60 * 60 * 1000));

    const labels = {
      en: {
        today: 'today',
        days: n => `${n} day${n === 1 ? '' : 's'} ago`,
        weeks: n => `${n} week${n === 1 ? '' : 's'} ago`,
        months: n => `${n} month${n === 1 ? '' : 's'} ago`,
        years: n => `${n} year${n === 1 ? '' : 's'} ago`,
      },
      ar: {
        today: 'اليوم',
        days: n => `قبل ${n} يوم`,
        weeks: n => `قبل ${n} أسبوع`,
        months: n => `قبل ${n} شهر`,
        years: n => `قبل ${n} سنة`,
      }
    };
    const L = labels[lang];

    if (diffDays < 1) return L.today;
    if (diffDays < 7) return L.days(diffDays);
    if (diffDays < 30) return L.weeks(Math.floor(diffDays / 7));
    if (diffDays < 365) return L.months(Math.floor(diffDays / 30));
    return L.years(Math.floor(diffDays / 365));
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  }

  // Convert plain-text release notes into HTML list items.
  // Lines starting with "•", "-", "*" become list items.
  // Empty lines split paragraphs.
  function formatNotes(text) {
    if (!text) return '';
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return '';

    const isBullet = l => /^[•\-\*]\s+/.test(l);
    const allBullets = lines.every(isBullet);

    if (allBullets) {
      const items = lines.map(l => `<li>${escapeHtml(l.replace(/^[•\-\*]\s+/, ''))}</li>`);
      return `<ul class="release-notes">${items.join('')}</ul>`;
    }

    // Mixed or plain prose — render as paragraphs, bullets where present
    let html = '<div class="release-notes">';
    let inList = false;
    for (const line of lines) {
      if (isBullet(line)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${escapeHtml(line.replace(/^[•\-\*]\s+/, ''))}</li>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p>${escapeHtml(line)}</p>`;
      }
    }
    if (inList) html += '</ul>';
    html += '</div>';
    return html;
  }

  // ── Rendering ──────────────────────────────────────────────
  function renderApp(appKey, versions) {
    const root = document.querySelector(`[data-releases="${appKey}"]`);
    if (!root) return;

    if (!versions || versions.length === 0) {
      root.style.display = 'none';
      return;
    }

    const lang = getLang();
    const labels = {
      en: { version: 'Version', showAll: 'Show all versions', noNotes: 'No release notes provided.' },
      ar: { version: 'الإصدار', showAll: 'عرض جميع الإصدارات', noNotes: 'لا توجد ملاحظات لهذا الإصدار.' }
    };
    const L = labels[lang];

    const latest = versions[0];
    const older = versions.slice(1);

    const latestNotes = lang === 'ar'
      ? (latest.whatsNew?.ar || latest.whatsNew?.en || '')
      : (latest.whatsNew?.en || latest.whatsNew?.ar || '');

    const latestHtml = `
      <article class="release release--latest">
        <header class="release-head">
          <h3 class="release-version">${L.version} ${escapeHtml(latest.version)}</h3>
          <span class="release-date">${fmtDate(latest.releasedAt, lang)}</span>
        </header>
        ${latestNotes ? formatNotes(latestNotes) : `<p class="release-notes muted">${L.noNotes}</p>`}
      </article>
    `;

    const olderHtml = older.length > 0 ? `
      <details class="release-history">
        <summary>${L.showAll} (${older.length})</summary>
        <div class="release-history-list">
          ${older.map(v => {
            const notes = lang === 'ar'
              ? (v.whatsNew?.ar || v.whatsNew?.en || '')
              : (v.whatsNew?.en || v.whatsNew?.ar || '');
            return `
              <article class="release">
                <header class="release-head">
                  <h4 class="release-version">${L.version} ${escapeHtml(v.version)}</h4>
                  <span class="release-date">${fmtDate(v.releasedAt, lang)}</span>
                </header>
                ${notes ? formatNotes(notes) : `<p class="release-notes muted">${L.noNotes}</p>`}
              </article>
            `;
          }).join('')}
        </div>
      </details>
    ` : '';

    root.innerHTML = latestHtml + olderHtml;
    root.style.display = '';
  }

  // ── Fetch + init ───────────────────────────────────────────
  async function init() {
    const roots = document.querySelectorAll('[data-releases]');
    if (roots.length === 0) return;

    let data;
    try {
      let res = await fetch(RELEASES_URL, { cache: 'no-cache' });
      if (!res.ok) {
        res = await fetch(FALLBACK_URL, { cache: 'no-cache' });
      }
      if (!res.ok) throw new Error('HTTP ' + res.status);
      data = await res.json();
    } catch (err) {
      // No releases.json yet — hide the section silently
      roots.forEach(r => { r.style.display = 'none'; });
      return;
    }

    roots.forEach(root => {
      const appKey = root.dataset.releases;
      const appData = data.apps?.[appKey];
      renderApp(appKey, appData?.versions);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-render on language toggle (existing pages have a setLang function;
  // we listen for DOM mutations on <html lang>)
  const obs = new MutationObserver(() => {
    if (document.querySelector('[data-releases]')) init();
  });
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
