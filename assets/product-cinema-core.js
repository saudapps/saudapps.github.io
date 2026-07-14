/* Saud Apps — shared Product Cinema rollout behavior. */
(function () {
  'use strict';

  var root = document.documentElement;
  var themeKey = 'saudapps-theme';
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
    document.querySelectorAll('[data-pc-theme-image]').forEach(function (image) {
      var source = image.getAttribute(theme === 'dark' ? 'data-dark-src' : 'data-light-src');
      if (source && image.getAttribute('src') !== source) image.setAttribute('src', source);
    });
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    root.setAttribute('lang', 'en');
    root.setAttribute('dir', 'ltr');
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
    wireTheme();
    wireReveals();
    root.classList.add('pc-site-ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
