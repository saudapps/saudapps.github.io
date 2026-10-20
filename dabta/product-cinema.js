/* Dabta — route behavior. The shared core handles theme, language and
   reveals; this keeps the browser chrome on the Dabta palette and the
   document title in the selected language. */
(function () {
  'use strict';

  var root = document.documentElement;
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function syncThemeMeta() {
    if (!themeMeta) return;
    var dark = root.getAttribute('data-theme') === 'dark';
    var next = dark ? '#1E080B' : '#F6E1CC';
    if (themeMeta.getAttribute('content') !== next) themeMeta.setAttribute('content', next);
  }

  function syncTitle() {
    var body = document.body;
    var title = body && body.getAttribute(root.getAttribute('lang') === 'ar' ? 'data-title-ar' : 'data-title-en');
    if (title && document.title !== title) document.title = title;
  }

  function init() {
    syncThemeMeta();
    syncTitle();
    document.addEventListener('saudapps:langchange', syncTitle);
    if ('MutationObserver' in window) {
      new MutationObserver(syncThemeMeta).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
