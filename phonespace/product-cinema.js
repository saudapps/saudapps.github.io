/* PhoneSpace — The Pressure Cut route behavior. */
(function () {
  'use strict';

  var root = document.documentElement;
  var sequence = document.querySelector('[data-ps-sequence]');
  var depth = document.querySelector('[data-ps-depth]');
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var desktopQuery = window.matchMedia ? window.matchMedia('(min-width: 901px)') : null;
  var pointerQuery = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;
  var sequenceFrame = 0;
  var pointerFrame = 0;
  var pointerUpdate = null;
  var depthVisible = true;

  function clamp(value) { return Math.max(0, Math.min(1, value)); }
  function smooth(value) { return value * value * (3 - 2 * value); }
  function phase(progress, start, end) { return smooth(clamp((progress - start) / (end - start))); }

  function staticSequence() {
    if (!sequence) return;
    sequence.style.setProperty('--ps-space', '1');
    sequence.style.setProperty('--ps-clarity', '1');
    sequence.style.setProperty('--ps-screen', '1');
    sequence.setAttribute('data-stage', '3');
  }

  function renderSequence() {
    sequenceFrame = 0;
    syncDepthVisibility();
    if (!sequence) return;
    if ((reduceQuery && reduceQuery.matches) || !(desktopQuery && desktopQuery.matches)) {
      staticSequence();
      return;
    }

    var rect = sequence.getBoundingClientRect();
    var distance = Math.max(1, sequence.offsetHeight - window.innerHeight);
    var progress = clamp(-rect.top / distance);
    var clarity = phase(progress, .06, .38);
    var space = phase(progress, .18, .78);
    var screen = .42 + (.58 * phase(progress, .2, .74));
    var stage = progress < .18 ? 0 : progress < .42 ? 1 : progress < .66 ? 2 : 3;

    sequence.style.setProperty('--ps-space', space.toFixed(4));
    sequence.style.setProperty('--ps-clarity', clarity.toFixed(4));
    sequence.style.setProperty('--ps-screen', screen.toFixed(4));
    sequence.setAttribute('data-stage', String(stage));
  }

  function requestSequence() {
    if (sequenceFrame) return;
    sequenceFrame = window.requestAnimationFrame(renderSequence);
  }

  function depthAllowed() {
    return !!depth && depthVisible &&
      !!(pointerQuery && pointerQuery.matches) &&
      !(reduceQuery && reduceQuery.matches) &&
      !!(desktopQuery && desktopQuery.matches);
  }

  function syncDepthVisibility() {
    if (!depth) return;
    var rect = depth.getBoundingClientRect();
    depthVisible = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    if (!depthVisible) resetDepth();
  }

  function resetDepth() {
    pointerUpdate = null;
    if (!depth) return;
    depth.classList.remove('is-ps-depth-active');
    depth.style.setProperty('--ps-depth-back-x', '0px');
    depth.style.setProperty('--ps-depth-back-y', '0px');
    depth.style.setProperty('--ps-depth-front-x', '0px');
    depth.style.setProperty('--ps-depth-front-y', '0px');
  }

  function renderPointer() {
    pointerFrame = 0;
    if (!pointerUpdate || !depthAllowed()) {
      resetDepth();
      return;
    }
    var update = pointerUpdate;
    pointerUpdate = null;
    var rect = depth.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var x = Math.max(-1, Math.min(1, ((update.x - rect.left) / rect.width - .5) * 2));
    var y = Math.max(-1, Math.min(1, ((update.y - rect.top) / rect.height - .5) * 2));
    depth.classList.add('is-ps-depth-active');
    depth.style.setProperty('--ps-depth-back-x', (-x * 6).toFixed(2) + 'px');
    depth.style.setProperty('--ps-depth-back-y', (-y * 5).toFixed(2) + 'px');
    depth.style.setProperty('--ps-depth-front-x', (x * 5).toFixed(2) + 'px');
    depth.style.setProperty('--ps-depth-front-y', (y * 4).toFixed(2) + 'px');
  }

  function queuePointer(event) {
    if (!depthAllowed()) return;
    pointerUpdate = { x: event.clientX, y: event.clientY };
    if (!pointerFrame) pointerFrame = window.requestAnimationFrame(renderPointer);
  }

  function wireSequence() {
    if (!sequence) return;
    renderSequence();
    window.addEventListener('scroll', requestSequence, { passive: true });
    window.addEventListener('resize', requestSequence, { passive: true });
    if (desktopQuery) {
      if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', requestSequence);
      else if (desktopQuery.addListener) desktopQuery.addListener(requestSequence);
    }
    if (reduceQuery) {
      if (reduceQuery.addEventListener) reduceQuery.addEventListener('change', requestSequence);
      else if (reduceQuery.addListener) reduceQuery.addListener(requestSequence);
    }
  }

  function wireDepth() {
    if (!depth) return;
    depth.addEventListener('pointerenter', queuePointer, { passive: true });
    depth.addEventListener('pointermove', queuePointer, { passive: true });
    depth.addEventListener('pointerleave', resetDepth, { passive: true });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          depthVisible = entry.isIntersecting;
          if (!depthVisible) resetDepth();
        });
      }, { threshold: 0 });
      observer.observe(depth);
    }

    var reset = function () { resetDepth(); };
    if (pointerQuery && pointerQuery.addEventListener) pointerQuery.addEventListener('change', reset);
    if (desktopQuery && desktopQuery.addEventListener) desktopQuery.addEventListener('change', reset);
    if (reduceQuery && reduceQuery.addEventListener) reduceQuery.addEventListener('change', reset);
  }

  function init() {
    root.classList.add('pc-phonespace-enhanced');
    wireSequence();
    wireDepth();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
