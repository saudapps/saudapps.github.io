/* ════════════════════════════════════════════════════════════════════════
   Saud Apps — shared behaviour
   · Theme (system default + manual toggle, persisted)
   · Language (EN/AR + RTL, persisted, auto-detect)
   · Signal-field pointer reactivity (reduced-motion safe)
   · Reveal-on-scroll
   No third-party calls — everything runs locally.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Theme ─────────────────────────────────────────────────────────── */
  var THEME_KEY = 'saudapps-theme';
  var darkMQ = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function resolvedTheme() {
    var saved = store.get(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return (darkMQ && darkMQ.matches) ? 'dark' : 'light';
  }
  function metaThemeColor(theme) {
    var m = document.querySelector('meta[name="theme-color"]');
    if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); }
    m.setAttribute('content', theme === 'dark' ? '#0A0B0F' : '#F5F5F7');
  }
  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    metaThemeColor(theme);
    document.querySelectorAll('[data-theme-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-theme-btn') === theme ? 'true' : 'false');
    });
    if (persist) store.set(THEME_KEY, theme);
  }
  // initial (a tiny inline head script may have set this already to avoid flash)
  applyTheme(resolvedTheme(), false);
  // follow system if user hasn't chosen explicitly
  if (darkMQ) {
    var onSys = function () { if (!store.get(THEME_KEY)) applyTheme(darkMQ.matches ? 'dark' : 'light', false); };
    if (darkMQ.addEventListener) darkMQ.addEventListener('change', onSys);
    else if (darkMQ.addListener) darkMQ.addListener(onSys);
  }

  /* ── Language ──────────────────────────────────────────────────────── */
  var LANG_KEY = 'saudapps-lang';
  function applyLang(lang, persist) {
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang-btn') === lang ? 'true' : 'false');
    });
    if (persist) store.set(LANG_KEY, lang);
  }
  function initialLang() {
    var saved = store.get(LANG_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
    return (navigator.language || '').toLowerCase().indexOf('ar') === 0 ? 'ar' : 'en';
  }
  applyLang(initialLang(), false);

  /* ── Wire the toggles after DOM ready ──────────────────────────────── */
  function wire() {
    document.querySelectorAll('[data-theme-btn]').forEach(function (b) {
      b.addEventListener('click', function () { applyTheme(b.getAttribute('data-theme-btn'), true); });
    });
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang-btn'), true); });
    });
    // re-assert pressed states for whatever is current
    applyTheme(root.getAttribute('data-theme') || resolvedTheme(), false);
    applyLang(root.getAttribute('lang') || 'en', false);

    /* ── Signal-field pointer reactivity ── */
    var field = document.querySelector('.signal-field');
    if (field && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
      var hero = field.closest('.hero') || field.parentElement;
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width) * 100;
        var y = ((e.clientY - r.top) / r.height) * 100;
        field.style.setProperty('--mx', x.toFixed(1) + '%');
        field.style.setProperty('--my', y.toFixed(1) + '%');
      }, { passive: true });
    }

    /* ── Reveal on scroll ── */
    var reveal = document.querySelectorAll('[data-reveal]');
    if (reveal.length) {
      if (reduceMotion || !('IntersectionObserver' in window)) {
        reveal.forEach(function (el) { el.classList.add('in'); });
      } else {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        reveal.forEach(function (el) { io.observe(el); });
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
