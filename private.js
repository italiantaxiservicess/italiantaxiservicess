// Private Transfers page: route highlighting, scroll-linked final image zoom, reveal for the compare lines + map
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // reveal the compare paths and route map when they enter the viewport
  var targets = document.querySelectorAll('.paths, .rmap');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.25 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  // route list <-> map
  var buttons = document.querySelectorAll('#rlist button');
  var paths = document.querySelectorAll('.rt-path');
  var stops = document.querySelectorAll('.stops g');
  function set(id) {
    buttons.forEach(function (b) { b.classList.toggle('on', b.dataset.route === id); });
    paths.forEach(function (p) { p.classList.toggle('on', p.id === id); });
    stops.forEach(function (g) { g.classList.toggle('on', (g.dataset.r || '').split(' ').indexOf(id) > -1); });
  }
  buttons.forEach(function (b) {
    b.addEventListener('mouseenter', function () { set(b.dataset.route); });
    b.addEventListener('focus', function () { set(b.dataset.route); });
    b.addEventListener('click', function () { set(b.dataset.route); });
    b.addEventListener('mouseleave', function () { set(null); });
    b.addEventListener('blur', function () { set(null); });
  });

  // subtle zoom on the final image as it scrolls into view
  var img = document.getElementById('finalImg');
  if (img && !reduce) {
    var sec = img.parentElement, tick = false;
    var upd = function () {
      var r = sec.getBoundingClientRect(), h = window.innerHeight;
      var p = Math.min(1, Math.max(0, (h - r.top) / (h + r.height)));
      img.style.transform = 'scale(' + (1.02 + (1 - p) * 0.12).toFixed(3) + ')';
      tick = false;
    };
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }
})();
