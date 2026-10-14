// Milan page: reveal the illustrative route lines when they scroll into view
(function () {
  var fan = document.querySelector('.fan');
  if (!fan) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fan.classList.add('in'); io.disconnect(); } }); }, { threshold: 0.3 });
    io.observe(fan);
  } else { fan.classList.add('in'); }
})();
