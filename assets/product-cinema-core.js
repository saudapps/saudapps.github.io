/* Saud Apps — shared Product Cinema rollout behavior. */
(function () {
  'use strict';

  var root = document.documentElement;
  var themeKey = 'saudapps-theme';
  var langKey = 'saudapps-lang';
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  root.classList.add('pc-site-js');

  function storedTheme() {
    try {
      var value = localStorage.getItem(themeKey);
      return value === 'light' || value === 'dark' ? value : null;
    } catch (error) { return null; }
  }

  function resolvedTheme() {
    return storedTheme() || (darkQuery && darkQuery.matches ? 'dark' : 'light');
  }

  function updateImages(theme) {
    var lang = root.getAttribute('lang') === 'ar' ? 'ar' : 'en';
    document.querySelectorAll('[data-pc-theme-image]').forEach(function (image) {
      var localizedAttribute = 'data-' + lang + '-' + (theme === 'dark' ? 'dark' : 'light') + '-src';
      var source = image.getAttribute(localizedAttribute) || image.getAttribute(theme === 'dark' ? 'data-dark-src' : 'data-light-src');
      if (source && image.getAttribute('src') !== source) image.setAttribute('src', source);
    });
    document.querySelectorAll('[data-pc-lang-image]').forEach(function (image) {
      var source = image.getAttribute(lang === 'ar' ? 'data-ar-src' : 'data-en-src');
      if (source && image.getAttribute('src') !== source) image.setAttribute('src', source);
    });
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-pc-site-theme]').forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-pc-site-theme') === theme ? 'true' : 'false');
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#10110E' : '#F3ECDE');
    updateImages(theme);
    if (persist) {
      try { localStorage.setItem(themeKey, theme); } catch (error) {}
    }
  }

  function wireTheme() {
    document.querySelectorAll('[data-pc-site-theme]').forEach(function (button) {
      button.addEventListener('click', function () {
        applyTheme(button.getAttribute('data-pc-site-theme'), true);
      });
    });

    if (!darkQuery) return;
    var followSystem = function () {
      if (!storedTheme()) applyTheme(darkQuery.matches ? 'dark' : 'light', false);
    };
    if (darkQuery.addEventListener) darkQuery.addEventListener('change', followSystem);
    else if (darkQuery.addListener) darkQuery.addListener(followSystem);
  }

  /* ── Language (EN/AR + RTL, persisted). Theme logic never touches
     lang/dir; only this subsystem may change document language. ── */
  function storedLang() {
    try {
      var value = localStorage.getItem(langKey);
      return value === 'en' || value === 'ar' ? value : null;
    } catch (error) { return null; }
  }

  function initialLang() {
    return storedLang() || ((navigator.language || '').toLowerCase().indexOf('ar') === 0 ? 'ar' : 'en');
  }

  function localizeAttributes(lang) {
    document.querySelectorAll('[data-alt-en]').forEach(function (element) {
      var en = element.getAttribute('data-alt-en');
      var ar = element.getAttribute('data-alt-ar');
      var next = lang === 'ar' ? (ar || en) : en;
      if (next != null && element.getAttribute('alt') !== next) element.setAttribute('alt', next);
    });
    document.querySelectorAll('[data-aria-en]').forEach(function (element) {
      var en = element.getAttribute('data-aria-en');
      var ar = element.getAttribute('data-aria-ar');
      var next = lang === 'ar' ? (ar || en) : en;
      if (next != null && element.getAttribute('aria-label') !== next) element.setAttribute('aria-label', next);
    });
  }

  function applyLang(lang, persist) {
    var previous = root.getAttribute('lang');
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-lang-btn]').forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-lang-btn') === lang ? 'true' : 'false');
    });
    localizeAttributes(lang);
    updateImages(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    if (persist) {
      try { localStorage.setItem(langKey, lang); } catch (error) {}
    }
    if (previous !== lang) {
      try { document.dispatchEvent(new CustomEvent('saudapps:langchange', { detail: { lang: lang } })); } catch (error) {}
    }
  }

  function wireLang() {
    document.querySelectorAll('[data-lang-btn]').forEach(function (button) {
      button.addEventListener('click', function () {
        applyLang(button.getAttribute('data-lang-btn'), true);
      });
    });
  }

  function wireReveals() {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-pc-site-reveal]'));
    var reduced = !!(reduceQuery && reduceQuery.matches);
    if (!items.length || reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }
    root.classList.add('pc-site-observe');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
    items.forEach(function (item) { observer.observe(item); });
  }

  function init() {
    applyTheme(resolvedTheme(), false);
    applyLang(initialLang(), false);
    wireTheme();
    wireLang();
    wireReveals();
    root.classList.add('pc-site-ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
