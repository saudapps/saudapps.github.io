/* Shared static shell for the completed information routes. */
(function () {
  'use strict';
  function shell() {
    var body = document.body;
    var page = body.getAttribute('data-pc-info') || 'home';
    var title = body.getAttribute('data-pc-title') || 'Information';
    var header = document.querySelector('.topbar');
    var footer = document.querySelector('.site-footer');
    var current = { about: 'About', support: 'Support', legal: 'Legal' }[page] || '';
    var nav = [['/', 'Home'], ['/sshift/', 'SShift'], ['/phonespace/', 'PhoneSpace'], ['/filed/', 'Filed'], ['/dufaat/', 'Dufaat'], ['/about/', 'About'], ['/support/', 'Support'], ['/legal/', 'Legal']];
    function links(mobile) { return nav.map(function (item) { return '<a href="' + item[0] + '"' + (item[1] === current ? ' aria-current="page"' : '') + '>' + item[1] + '</a>'; }).join(''); }
    var mark = '<span class="pc-site-brand__mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
    if (header) header.outerHTML = '<header class="pc-site-header"><a class="pc-site-brand" href="/" aria-label="Saud Apps home">' + mark + '<span><strong>Saud Apps</strong><small>Independent · iOS</small></span></a><nav class="pc-site-nav" aria-label="Primary navigation">' + links(false) + '</nav><div class="pc-site-tools"><div class="pc-site-theme" role="group" aria-label="Color theme"><button type="button" data-pc-site-theme="light" data-pc-theme="light" aria-pressed="false">Day</button><button type="button" data-pc-site-theme="dark" data-pc-theme="dark" aria-pressed="false">Night</button></div><details class="pc-site-menu"><summary>Menu</summary><nav aria-label="Mobile navigation">' + links(true) + '</nav></details></div></header>';
    if (footer) footer.outerHTML = '<footer class="pc-site-footer"><div class="pc-site-footer__identity"><strong>SAUD APPS</strong><span>Four focused apps for iPhone.</span></div><nav aria-label="Footer navigation">' + links(false) + '</nav><div class="pc-site-footer__base"><span>© 2026 Saud Apps · by Saud Ismail</span><a href="mailto:support@saud.im">support@saud.im</a></div></footer>';
    header = document.querySelector('.pc-site-header');
    footer = document.querySelector('.pc-site-footer');
    var main = document.querySelector('main');
    if (!main) {
      main = document.createElement('main');
      var cursor = header ? header.nextElementSibling : null;
      while (cursor && cursor !== footer) {
        var next = cursor.nextElementSibling;
        main.appendChild(cursor);
        cursor = next;
      }
      if (header) header.insertAdjacentElement('afterend', main);
    }
    main.id = 'main'; main.setAttribute('tabindex', '-1');
    document.querySelectorAll('a[href^="/promptbook/"]').forEach(function (link) {
      var row = link.closest('.list-row');
      if (row) row.remove();
    });
    document.querySelectorAll('.section-title').forEach(function (heading) {
      if (heading.textContent.trim().indexOf('Promptbook') === -1) return;
      var card = heading.nextElementSibling;
      var label = heading.previousElementSibling;
      if (card && card.classList.contains('list-card')) card.remove();
      heading.remove();
      if (label && label.classList.contains('eyebrow')) label.remove();
    });
    var skip = document.createElement('a');
    skip.className = 'pc-site-skip'; skip.href = '#main'; skip.textContent = 'Skip to content';
    document.body.insertBefore(skip, document.body.firstChild);
    document.documentElement.setAttribute('data-pc-info-title', title);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', shell);
  else shell();
}());
