/* Filed — The Filing Cut route behavior. */
(function () {
  'use strict';

  var root = document.documentElement;
  var sequence = document.querySelector('[data-fl-filing]');
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var desktopQuery = window.matchMedia ? window.matchMedia('(min-width: 901px)') : null;
  var frame = 0;
  var sequenceVisible = true;

  function clamp(value) { return Math.max(0, Math.min(1, value)); }
  function smooth(value) { return value * value * (3 - (2 * value)); }
  function phase(progress, start, end) { return smooth(clamp((progress - start) / (end - start))); }
  function value(number, unit) { return number.toFixed(2) + unit; }

  function completeSequence() {
    if (!sequence) return;
    sequence.style.setProperty('--fl-a-x', '0px');
    sequence.style.setProperty('--fl-a-y', '0px');
    sequence.style.setProperty('--fl-a-r', '0deg');
    sequence.style.setProperty('--fl-b-x', '0px');
    sequence.style.setProperty('--fl-b-y', '0px');
    sequence.style.setProperty('--fl-b-r', '0deg');
    sequence.style.setProperty('--fl-c-x', '0px');
    sequence.style.setProperty('--fl-c-y', '0px');
    sequence.style.setProperty('--fl-c-r', '0deg');
    sequence.style.setProperty('--fl-folder', '1');
    sequence.style.setProperty('--fl-library', '1');
    sequence.setAttribute('data-stage', '5');
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
    var order = phase(progress, .07, .53);
    var loose = 1 - order;
    var folder = phase(progress, .37, .66);
    var library = phase(progress, .56, .86);
    var stage = progress < .14 ? 0 : progress < .29 ? 1 : progress < .45 ? 2 : progress < .62 ? 3 : progress < .8 ? 4 : 5;

    sequence.style.setProperty('--fl-a-x', value(-136 * loose, 'px'));
    sequence.style.setProperty('--fl-a-y', value(-66 * loose, 'px'));
    sequence.style.setProperty('--fl-a-r', value(-7 * loose, 'deg'));
    sequence.style.setProperty('--fl-b-x', value(112 * loose, 'px'));
    sequence.style.setProperty('--fl-b-y', value(-104 * loose, 'px'));
    sequence.style.setProperty('--fl-b-r', value(8 * loose, 'deg'));
    sequence.style.setProperty('--fl-c-x', value(148 * loose, 'px'));
    sequence.style.setProperty('--fl-c-y', value(74 * loose, 'px'));
    sequence.style.setProperty('--fl-c-r', value(-4 * loose, 'deg'));
    sequence.style.setProperty('--fl-folder', folder.toFixed(4));
    sequence.style.setProperty('--fl-library', library.toFixed(4));
    sequence.setAttribute('data-stage', String(stage));
  }

  function requestRender() {
    if (!sequenceVisible || frame) return;
    frame = window.requestAnimationFrame(render);
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
    root.classList.add('pc-filed-enhanced');
    wireSequence();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
