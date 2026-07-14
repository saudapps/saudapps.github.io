/* Dufaat — The Settlement Cut route behavior. */
(function () {
  'use strict';

  var root = document.documentElement;
  var sequence = document.querySelector('[data-df-settlement]');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var desktopQuery = window.matchMedia ? window.matchMedia('(min-width: 901px)') : null;
  var frame = 0;
  var sequenceVisible = true;

  function clamp(value) { return Math.max(0, Math.min(1, value)); }
  function smooth(value) { return value * value * (3 - (2 * value)); }
  function phase(progress, start, end) { return smooth(clamp((progress - start) / (end - start))); }

  function setValue(name, value) {
    if (sequence) sequence.style.setProperty(name, value.toFixed(4));
  }

  function completeSequence() {
    if (!sequence) return;
    setValue('--df-disorder', 0);
    setValue('--df-order', 1);
    setValue('--df-soon', 1);
    setValue('--df-paid', 1);
    setValue('--df-proof', 1);
    setValue('--df-resolve', 1);
    sequence.setAttribute('data-stage', '6');
  }

  function render() {
    frame = 0;
    if (!sequence) return;
    if ((reduceQuery && reduceQuery.matches) || !(desktopQuery && desktopQuery.matches)) {
      completeSequence();
      return;
    }

    var rect = sequence.getBoundingClientRect();
    var distance = Math.max(1, sequence.offsetHeight - window.innerHeight);
    var progress = clamp(-rect.top / distance);
    var order = phase(progress, .04, .30);
    var soon = phase(progress, .19, .43);
    var paid = phase(progress, .36, .60);
    var proof = phase(progress, .52, .76);
    var resolve = phase(progress, .69, .93);
    var stage = progress < .12 ? 0
      : progress < .26 ? 1
      : progress < .40 ? 2
      : progress < .55 ? 3
      : progress < .70 ? 4
      : progress < .84 ? 5 : 6;

    setValue('--df-disorder', 1 - order);
    setValue('--df-order', order);
    setValue('--df-soon', soon);
    setValue('--df-paid', paid);
    setValue('--df-proof', proof);
    setValue('--df-resolve', resolve);
    sequence.setAttribute('data-stage', String(stage));
  }

  function requestRender() {
    if (!sequenceVisible || frame) return;
    frame = window.requestAnimationFrame(render);
  }

  function syncThemeMeta() {
    if (!themeMeta) return;
    themeMeta.setAttribute('content', root.getAttribute('data-theme') === 'dark' ? '#081519' : '#F4EFE5');
  }

  function wireSequence() {
    if (!sequence) return;
    render();
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender, { passive: true });

    [reduceQuery, desktopQuery].forEach(function (query) {
      if (!query) return;
      if (query.addEventListener) query.addEventListener('change', render);
      else if (query.addListener) query.addListener(render);
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          sequenceVisible = entry.isIntersecting;
          if (sequenceVisible) requestRender();
        });
      }, { rootMargin: '25% 0px', threshold: 0 });
      observer.observe(sequence);
    }
  }

  function init() {
    root.classList.add('pc-dufaat-enhanced');
    syncThemeMeta();
    wireSequence();
    if ('MutationObserver' in window) {
      new MutationObserver(syncThemeMeta).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
