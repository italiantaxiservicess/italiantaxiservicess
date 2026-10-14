// Rome page: reveal the illustrative itinerary line
(function () {
  var el = document.querySelector('.rflow');
  if (!el) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(el);
  } else { el.classList.add('in'); }
})();
