/* Saud Apps — Product Cinema / Director's Cut V2 final-interactions prototype.
   Route-scoped, dependency-free, and progressively enhanced. */
(function () {
  'use strict';

  var root = document.documentElement;
  var themeKey = 'saudapps-theme';
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var mobileQuery = window.matchMedia ? window.matchMedia('(max-width: 720px)') : null;
  var finePointerQuery = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;
  var reduced = !!(reduceQuery && reduceQuery.matches);

  function readTheme() {
    try {
      var stored = localStorage.getItem(themeKey);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (error) {}
    return darkQuery && darkQuery.matches ? 'dark' : 'light';
  }

  function storeTheme(theme) {
    try { localStorage.setItem(themeKey, theme); } catch (error) {}
  }

  function updateThemeImages(theme) {
    document.querySelectorAll('[data-theme-image]').forEach(function (image) {
      var source = image.getAttribute(theme === 'dark' ? 'data-dark-src' : 'data-light-src');
      if (source && image.getAttribute('src') !== source) image.setAttribute('src', source);
    });
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    root.setAttribute('lang', 'en');
    root.setAttribute('dir', 'ltr');

    document.querySelectorAll('[data-pc-theme]').forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-pc-theme') === theme ? 'true' : 'false');
    });

    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#10130F' : '#F2EBDD');
    updateThemeImages(theme);
    if (persist) storeTheme(theme);
  }

  function wireTheme() {
    document.querySelectorAll('[data-pc-theme]').forEach(function (button) {
      button.addEventListener('click', function () {
        applyTheme(button.getAttribute('data-pc-theme'), true);
      });
    });

    if (!darkQuery) return;
    var followSystem = function () {
      try {
        if (localStorage.getItem(themeKey)) return;
      } catch (error) {}
      applyTheme(darkQuery.matches ? 'dark' : 'light', false);
    };
    if (darkQuery.addEventListener) darkQuery.addEventListener('change', followSystem);
    else if (darkQuery.addListener) darkQuery.addListener(followSystem);
  }

  function clamp(value) { return Math.max(0, Math.min(1, value)); }
  function rawPhase(progress, start, end) { return clamp((progress - start) / (end - start)); }
  function smooth(value) { return value * value * (3 - 2 * value); }
  function phase(progress, start, end) { return smooth(rawPhase(progress, start, end)); }
  function mix(start, end, amount) { return start + (end - start) * amount; }

  function wireDirectorSequence() {
    var sequence = document.querySelector('[data-pc-sequence]');
    if (!sequence) return;

    var meter = sequence.querySelector('[data-pc-progress]');
    var phaseLabel = sequence.querySelector('[data-pc-phase-label]');
    var cards = {
      sshift: sequence.querySelector('[data-force-card="sshift"]'),
      phonespace: sequence.querySelector('[data-force-card="phonespace"]'),
      filed: sequence.querySelector('[data-force-card="filed"]'),
      dufaat: sequence.querySelector('[data-force-card="dufaat"]')
    };
    var pending = false;

    function setStaticState() {
      sequence.setAttribute('data-phase', 'arrival');
      sequence.style.setProperty('--pc-force-opacity', '0');
      sequence.style.setProperty('--pc-logic-opacity', '0');
      sequence.style.setProperty('--pc-week-opacity', '.34');
      sequence.style.setProperty('--pc-screen-opacity', '1');
      sequence.style.setProperty('--pc-screen-inset-y', '0%');
      sequence.style.setProperty('--pc-screen-inset-x', '0%');
      sequence.style.setProperty('--pc-screen-scale', '1');
      sequence.style.setProperty('--pc-arrival-opacity', '1');
      sequence.style.setProperty('--pc-arrival-y', '0px');
      if (meter) meter.style.transform = 'scaleX(1)';
      if (phaseLabel) phaseLabel.textContent = 'ARRIVAL · 07';
    }

    function render() {
      pending = false;
      if (reduced || (mobileQuery && mobileQuery.matches)) {
        setStaticState();
        return;
      }

      var rect = sequence.getBoundingClientRect();
      var distance = Math.max(1, sequence.offsetHeight - window.innerHeight);
      var progress = clamp(-rect.top / distance);
      var logic = phase(progress, .06, .18) * (1 - phase(progress, .32, .43));
      var gather = phase(progress, .18, .39);
      var select = phase(progress, .34, .44);
      var forceFade = phase(progress, .52, .64);
      var week = phase(progress, .47, .61);
      var screen = phase(progress, .64, .78);
      var arrival = phase(progress, .79, .95);
      var width = window.innerWidth;
      var height = window.innerHeight;

      var positions = {
        sshift: [-.29 * width, -.2 * height],
        phonespace: [.29 * width, -.2 * height],
        filed: [-.29 * width, .21 * height],
        dufaat: [.29 * width, .21 * height]
      };

      Object.keys(cards).forEach(function (key) {
        var card = cards[key];
        if (!card) return;
        var targetY = key === 'sshift' ? -.2 * height * select : 0;
        var x = mix(positions[key][0], 0, gather);
        var y = mix(positions[key][1], 0, gather) + targetY;
        var selectedOpacity = key === 'sshift' ? 1 : (1 - select);
        var opacity = (1 - forceFade) * selectedOpacity;
        card.style.setProperty('--pc-x', x.toFixed(1) + 'px');
        card.style.setProperty('--pc-y', y.toFixed(1) + 'px');
        card.style.setProperty('--pc-card-opacity', opacity.toFixed(4));
      });

      sequence.style.setProperty('--pc-force-opacity', (1 - forceFade).toFixed(4));
      sequence.style.setProperty('--pc-force-scale', mix(.94, 1.03, gather).toFixed(4));
      sequence.style.setProperty('--pc-logic-opacity', logic.toFixed(4));
      sequence.style.setProperty('--pc-week-opacity', (week * mix(1, .42, arrival)).toFixed(4));
      sequence.style.setProperty('--pc-screen-opacity', phase(progress, .63, .68).toFixed(4));
      sequence.style.setProperty('--pc-screen-inset-y', (34 * (1 - screen)).toFixed(2) + '%');
      sequence.style.setProperty('--pc-screen-inset-x', (16 * (1 - screen)).toFixed(2) + '%');
      sequence.style.setProperty('--pc-screen-scale', mix(.84, 1, screen).toFixed(4));
      sequence.style.setProperty('--pc-arrival-opacity', arrival.toFixed(4));
      sequence.style.setProperty('--pc-arrival-y', mix(26, 0, arrival).toFixed(1) + 'px');
      if (meter) meter.style.transform = 'scaleX(' + progress.toFixed(4) + ')';

      var phaseName;
      var label;
      if (progress < .13) { phaseName = 'forces'; label = 'THE CAST · 01'; }
      else if (progress < .27) { phaseName = 'logic'; label = 'PRODUCT LOGIC · 02'; }
      else if (progress < .40) { phaseName = 'converge'; label = 'CONVERGENCE · 03'; }
      else if (progress < .54) { phaseName = 'select'; label = 'SELECT · 04'; }
      else if (progress < .68) { phaseName = 'week'; label = 'FORMATION · 05'; }
      else if (progress < .84) { phaseName = 'interface'; label = 'INTERFACE · 06'; }
      else { phaseName = 'arrival'; label = 'ARRIVAL · 07'; }
      sequence.setAttribute('data-phase', phaseName);
      if (phaseLabel) phaseLabel.textContent = label;
    }

    function requestRender() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(render);
    }

    if (reduced) root.classList.add('pc-reduced');
    render();
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender, { passive: true });

    if (reduceQuery) {
      var followMotionPreference = function () {
        reduced = reduceQuery.matches;
        root.classList.toggle('pc-reduced', reduced);
        requestRender();
      };
      if (reduceQuery.addEventListener) reduceQuery.addEventListener('change', followMotionPreference);
      else if (reduceQuery.addListener) reduceQuery.addListener(followMotionPreference);
    }
    if (mobileQuery && mobileQuery.addEventListener) mobileQuery.addEventListener('change', requestRender);
  }

  function wireQuietReveals() {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-pc-reveal]'));
    if (!items.length || reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: .06 });

    root.classList.add('pc-observe');
    items.forEach(function (item) { observer.observe(item); });
  }

  function wirePointerDepth() {
    var configs = [];
    var opening = document.querySelector('.pc-opening');
    var productOpening = document.querySelector('.pc-product-opening');

    if (opening) configs.push({ element: opening, back: 5, mid: 3, front: 0, visible: true });
    if (productOpening) configs.push({ element: productOpening, back: 9, mid: 6, front: 4, visible: true });
    document.querySelectorAll('.pc-cast__item').forEach(function (item) {
      configs.push({ element: item, back: 0, mid: 2, front: 3, visible: true });
    });
    if (!configs.length) return;

    var pending = null;
    var frame = 0;

    function motionAllowed() {
      return !!(finePointerQuery && finePointerQuery.matches) &&
        !(reduceQuery && reduceQuery.matches) &&
        !(mobileQuery && mobileQuery.matches);
    }

    function reset(config) {
      if (pending && pending.config === config) pending = null;
      config.element.classList.remove('is-pc-depth-active');
      config.element.style.setProperty('--pc-depth-back-x', '0px');
      config.element.style.setProperty('--pc-depth-back-y', '0px');
      config.element.style.setProperty('--pc-depth-mid-x', '0px');
      config.element.style.setProperty('--pc-depth-mid-y', '0px');
      config.element.style.setProperty('--pc-depth-front-x', '0px');
      config.element.style.setProperty('--pc-depth-front-y', '0px');
      config.element.style.setProperty('--pc-depth-light-x', '50%');
      config.element.style.setProperty('--pc-depth-light-y', config.element === opening ? '38%' : '50%');
    }

    function render() {
      frame = 0;
      if (!pending) return;
      var update = pending;
      pending = null;
      var config = update.config;
      if (!config.visible || !motionAllowed()) {
        reset(config);
        return;
      }

      var rect = config.element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var unitX = Math.max(-1, Math.min(1, ((update.x - rect.left) / rect.width - .5) * 2));
      var unitY = Math.max(-1, Math.min(1, ((update.y - rect.top) / rect.height - .5) * 2));
      config.element.classList.add('is-pc-depth-active');
      config.element.style.setProperty('--pc-depth-back-x', (-unitX * config.back).toFixed(2) + 'px');
      config.element.style.setProperty('--pc-depth-back-y', (-unitY * config.back).toFixed(2) + 'px');
      config.element.style.setProperty('--pc-depth-mid-x', (-unitX * config.mid).toFixed(2) + 'px');
      config.element.style.setProperty('--pc-depth-mid-y', (-unitY * config.mid).toFixed(2) + 'px');
      config.element.style.setProperty('--pc-depth-front-x', (unitX * config.front).toFixed(2) + 'px');
      config.element.style.setProperty('--pc-depth-front-y', (unitY * config.front).toFixed(2) + 'px');
      config.element.style.setProperty('--pc-depth-light-x', (((update.x - rect.left) / rect.width) * 100).toFixed(1) + '%');
      config.element.style.setProperty('--pc-depth-light-y', (((update.y - rect.top) / rect.height) * 100).toFixed(1) + '%');
    }

    function queue(config, event) {
      if (!config.visible || !motionAllowed()) return;
      pending = { config: config, x: event.clientX, y: event.clientY };
      if (!frame) frame = window.requestAnimationFrame(render);
    }

    configs.forEach(function (config) {
      config.element.addEventListener('pointerenter', function (event) { queue(config, event); }, { passive: true });
      config.element.addEventListener('pointermove', function (event) { queue(config, event); }, { passive: true });
      config.element.addEventListener('pointerleave', function () { reset(config); }, { passive: true });
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var config = configs.find(function (candidate) { return candidate.element === entry.target; });
          if (!config) return;
          config.visible = entry.isIntersecting;
          if (!config.visible) reset(config);
        });
      }, { threshold: 0 });
      configs.forEach(function (config) { observer.observe(config.element); });
    }

    var resetAll = function () { configs.forEach(reset); };
    if (reduceQuery && reduceQuery.addEventListener) reduceQuery.addEventListener('change', resetAll);
    if (finePointerQuery && finePointerQuery.addEventListener) finePointerQuery.addEventListener('change', resetAll);
    if (mobileQuery && mobileQuery.addEventListener) mobileQuery.addEventListener('change', resetAll);
  }

  function wireCastInteractions() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.pc-cast__item'));
    if (!items.length) return;

    function focusMotionAllowed() {
      return !(reduceQuery && reduceQuery.matches) && !(mobileQuery && mobileQuery.matches);
    }

    items.forEach(function (item) {
      var hovered = false;
      var focused = false;

      function update() {
        var pointerCanAnimate = hovered && finePointerQuery && finePointerQuery.matches;
        item.classList.toggle('is-pc-engaged', focusMotionAllowed() && (pointerCanAnimate || focused));
      }

      item.addEventListener('pointerenter', function () { hovered = true; update(); }, { passive: true });
      item.addEventListener('pointerleave', function () { hovered = false; update(); }, { passive: true });
      item.addEventListener('focusin', function () { focused = true; update(); });
      item.addEventListener('focusout', function (event) {
        if (event.relatedTarget && item.contains(event.relatedTarget)) return;
        focused = false;
        update();
      });

      var reset = function () { item.classList.remove('is-pc-engaged'); };
      if (reduceQuery && reduceQuery.addEventListener) reduceQuery.addEventListener('change', reset);
      if (mobileQuery && mobileQuery.addEventListener) mobileQuery.addEventListener('change', reset);
    });
  }

  function init() {
    applyTheme(readTheme(), false);
    wireTheme();
    wireDirectorSequence();
    wireQuietReveals();
    wirePointerDepth();
    wireCastInteractions();
    root.classList.add('pc-ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
