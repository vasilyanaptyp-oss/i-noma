(function () {
  'use strict';
  var doc = document;
  var body = doc.body;

  /* ---------- mobile menu ---------- */
  var burger = doc.querySelector('.burger');
  var nav = doc.getElementById('nav');
  function setMenu(open) {
    if (!burger || !nav) return;
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    var t = burger.querySelector('span');
    if (t) t.textContent = open ? 'Aizvērt' : 'Izvēlne';
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      setMenu(!body.classList.contains('menu-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); burger.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setMenu(false);
    });
  }

  /* ---------- lightbox ---------- */
  var items = Array.prototype.slice.call(doc.querySelectorAll('a[data-lb]'));
  if (items.length) {
    var lb = doc.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Foto skatītājs');
    lb.innerHTML =
      '<span class="lb__count" aria-live="polite"></span>' +
      '<button type="button" class="lb__x" aria-label="Aizvērt">×</button>' +
      '<button type="button" class="lb__p" aria-label="Iepriekšējais foto">‹</button>' +
      '<figure class="lb__fig"><img class="lb__img" alt=""><figcaption class="lb__cap"></figcaption></figure>' +
      '<button type="button" class="lb__n" aria-label="Nākamais foto">›</button>';
    body.appendChild(lb);
    var img = lb.querySelector('.lb__img');
    var cap = lb.querySelector('.lb__cap');
    var count = lb.querySelector('.lb__count');
    var bx = lb.querySelector('.lb__x');
    var bp = lb.querySelector('.lb__p');
    var bn = lb.querySelector('.lb__n');
    var cur = 0;
    var lastFocus = null;

    var show = function (i) {
      cur = (i + items.length) % items.length;
      var a = items[cur];
      var thumb = a.querySelector('img');
      img.src = a.getAttribute('href');
      img.alt = thumb ? thumb.getAttribute('alt') || '' : '';
      cap.textContent = a.getAttribute('data-cap') || img.alt;
      count.textContent = (cur + 1) + ' / ' + items.length;
    };
    var open = function (i, trigger) {
      lastFocus = trigger || null;
      show(i);
      lb.classList.add('is-open');
      body.classList.add('lb-open');
      bx.focus();
    };
    var close = function () {
      lb.classList.remove('is-open');
      body.classList.remove('lb-open');
      img.removeAttribute('src');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    items.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        open(i, a);
      });
    });
    bx.addEventListener('click', close);
    bp.addEventListener('click', function () { show(cur - 1); });
    bn.addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });
    doc.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); }
      else if (e.key === 'Tab') {
        var f = [bx, bp, bn];
        var idx = f.indexOf(doc.activeElement);
        e.preventDefault();
        if (e.shiftKey) f[(idx <= 0 ? f.length : idx) - 1].focus();
        else f[(idx + 1) % f.length].focus();
      }
    });
    /* swipe on touch */
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      sx = null;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---------- contact form: builds a mailto letter ---------- */
  var form = doc.getElementById('forma');
  if (form) {
    var msg = doc.getElementById('forma-zina');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var v = function (n) {
        var el = form.elements[n];
        return el ? String(el.value || '').trim() : '';
      };
      var op = form.querySelector('input[name="operators"]:checked');
      var lines = [
        'Vārds: ' + v('vards'),
        'Tālrunis vai e-pasts: ' + v('kontakts'),
        'Tehnika vai darbi: ' + v('tehnika'),
        'Operators: ' + (op ? op.value : 'vēl nezinu'),
        'Objekts (vieta, adrese): ' + v('objekts'),
        'Termiņi: ' + (v('termini') || 'nav norādīti'),
        '',
        v('zina')
      ];
      var subject = 'Pieteikums: ' + v('tehnika');
      var href = 'mailto:inoma21@inbox.lv?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\r\n'));
      var a = doc.createElement('a');
      a.href = href;
      a.style.display = 'none';
      body.appendChild(a);
      a.click();
      body.removeChild(a);
      if (msg) msg.textContent = 'Atvērām jūsu e-pasta programmu ar gatavu vēstuli. Ja tas nenotika, rakstiet uz inoma21@inbox.lv.';
    });
  }
})();
