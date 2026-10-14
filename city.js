// City Transfers page: reveal the map, metro line and highlighted phrases; list <-> map highlighting; final image zoom
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var targets = document.querySelectorAll('.cmap, .metro, .story, .flow');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.25 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  var rows = document.querySelectorAll('.board li[data-city]');
  var pins = document.querySelectorAll('.city[data-city]');
  function mark(city, on) {
    rows.forEach(function (r) { if (r.dataset.city === city) r.classList.toggle('hl', on); });
    pins.forEach(function (p) { if (p.dataset.city === city) p.classList.toggle('hl', on); });
  }
  rows.forEach(function (r) {
    r.addEventListener('mouseenter', function () { mark(r.dataset.city, true); });
    r.addEventListener('mouseleave', function () { mark(r.dataset.city, false); });
    if (r.classList.contains('is-confirmed')) {
      pins.forEach(function (p) { if (p.dataset.city === r.dataset.city) p.classList.add('is-confirmed'); });
    }
  });
  pins.forEach(function (p) {
    p.addEventListener('mouseenter', function () { mark(p.dataset.city, true); });
    p.addEventListener('mouseleave', function () { mark(p.dataset.city, false); });
  });

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
