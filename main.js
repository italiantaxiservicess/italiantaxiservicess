(function () {
  var doc = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  var yr = doc.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile menu
  var btn = doc.getElementById('menuBtn');
  var nav = doc.getElementById('nav');
  var header = doc.querySelector('.site-header');
  function setMenu(open) {
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
    header.classList.toggle('open', open);
    doc.body.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Scroll reveal
  var items = doc.querySelectorAll('.reveal, .clip');
  if ('IntersectionObserver' in window && !reduce) {
    items.forEach(function (el, i) {
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--rd', Math.min(sib, 4) * 0.09 + 's');
    });
    var clipIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target._clips.forEach(function (c) { c.classList.add('in'); });
        clipIo.unobserve(en.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    var clipWatch = function (el) {
      var host = el.parentElement;
      if (!host._clips) { host._clips = []; clipIo.observe(host); }
      host._clips.push(el);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) {
      // a fully clipped element reports no intersection, so watch its parent instead
      if (el.classList.contains('clip')) { clipWatch(el); } else { io.observe(el); }
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Gentle hero parallax (transform only, rAF-throttled, skipped for reduced motion)
  var img = doc.getElementById('heroImg');
  var hero = doc.querySelector('.hero');
  if (img && hero && !reduce) {
    var ticking = false;
    var update = function () {
      var y = window.scrollY;
      if (y < hero.offsetHeight) img.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0) scale(1.04)';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // Booking form: no backend yet, so validate and show a clear message
  var form = doc.getElementById('book');
  var note = doc.getElementById('formNote');
  var date = doc.getElementById('date');
  if (date) {
    var d = new Date();
    date.min = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = form.querySelector(':invalid');
    form.querySelectorAll('input').forEach(function (i) { i.classList.add('touched'); });
    if (bad) { bad.focus(); note.className = 'form-note'; note.textContent = 'Please complete the highlighted fields.'; return; }
    // TODO: connect to the real booking endpoint / email handler.
    note.className = 'form-note ok';
    note.textContent = 'Thanks. Your request has been noted. Booking submission is not connected yet.';
  });
})();
