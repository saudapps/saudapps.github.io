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
    var nav = [
      ['/', 'Home', 'الرئيسية'],
      ['/sshift/', 'SShift', 'SShift'],
      ['/phonespace/', 'PhoneSpace', 'PhoneSpace'],
      ['/filed/', 'Filed', 'Filed'],
      ['/dufaat/', 'Dufaat', 'دُفعات'],
      ['/about/', 'About', 'عن المطوّر'],
      ['/support/', 'Support', 'الدعم'],
      ['/legal/', 'Legal', 'الشؤون القانونية']
    ];
    function pair(en, ar) { return '<span data-en>' + en + '</span><span data-ar>' + ar + '</span>'; }
    function links(mobile) {
      return nav.map(function (item) {
        return '<a href="' + item[0] + '"' + (item[1] === current ? ' aria-current="page"' : '') + '>' + pair(item[1], item[2]) + '</a>';
      }).join('');
    }
    var mark = '<span class="pc-site-brand__mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
    if (header) header.outerHTML = '<header class="pc-site-header"><a class="pc-site-brand" href="/" aria-label="Saud Apps home" data-aria-en="Saud Apps home" data-aria-ar="الصفحة الرئيسية لتطبيقات سعود">' + mark + '<span><strong>Saud Apps</strong><small>' + pair('Independent · iOS', 'مستقل · iOS') + '</small></span></a><nav class="pc-site-nav" aria-label="Primary navigation" data-aria-en="Primary navigation" data-aria-ar="التنقّل الأساسي">' + links(false) + '</nav><div class="pc-site-tools"><div class="pc-site-theme" role="group" aria-label="Color theme" data-aria-en="Color theme" data-aria-ar="نمط الألوان"><button type="button" data-pc-site-theme="light" data-pc-theme="light" aria-pressed="false">' + pair('Day', 'نهار') + '</button><button type="button" data-pc-site-theme="dark" data-pc-theme="dark" aria-pressed="false">' + pair('Night', 'ليل') + '</button></div><div class="pc-site-lang" role="group" aria-label="Language" data-aria-en="Language" data-aria-ar="اللغة"><button type="button" data-lang-btn="en" aria-pressed="false">EN</button><button type="button" data-lang-btn="ar" aria-pressed="false">ع</button></div><details class="pc-site-menu"><summary>' + pair('Menu', 'القائمة') + '</summary><nav aria-label="Mobile navigation" data-aria-en="Mobile navigation" data-aria-ar="تنقّل الجوال">' + links(true) + '</nav></details></div></header>';
    if (footer) footer.outerHTML = '<footer class="pc-site-footer"><div class="pc-site-footer__identity"><strong>SAUD APPS</strong><span>' + pair('Four focused apps for iPhone.', 'أربعة تطبيقات آيفون مركّزة.') + '</span></div><nav aria-label="Footer navigation" data-aria-en="Footer navigation" data-aria-ar="تنقّل التذييل">' + links(false) + '</nav><div class="pc-site-footer__base"><span>' + pair('© 2026 Saud Apps · by Saud Ismail', '© 2026 تطبيقات سعود · بقلم سعود إسماعيل') + '</span><a href="mailto:support@saud.im">support@saud.im</a></div></footer>';
    document.documentElement.classList.add('pc-info-shell');
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
    if (!document.querySelector('.pc-site-skip')) {
      var skip = document.createElement('a');
      skip.className = 'pc-site-skip'; skip.href = '#main';
      skip.innerHTML = '<span data-en>Skip to content</span><span data-ar>تخطَّ إلى المحتوى</span>';
      document.body.insertBefore(skip, document.body.firstChild);
    }
    document.documentElement.setAttribute('data-pc-info-title', title);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', shell);
  else shell();
}());
