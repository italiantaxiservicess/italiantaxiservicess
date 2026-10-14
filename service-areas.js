// Service Areas page: reveal the map when it scrolls into view
(function () {
  var map = document.querySelector('.pmap');
  if (!map) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { map.classList.add('in'); io.disconnect(); } }); }, { threshold: 0.3 });
    io.observe(map);
  } else { map.classList.add('in'); }
})();
