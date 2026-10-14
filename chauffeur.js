// Chauffeur page: reveal the itinerary line, and swap the sightseeing background with the example list
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var itin = document.querySelector('.itin');
  if (itin) {
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { itin.classList.add('in'); io.disconnect(); } });
      }, { threshold: 0.4 });
      io.observe(itin);
    } else { itin.classList.add('in'); }
  }

  var btns = document.querySelectorAll('#sl button');
  var imgs = document.querySelectorAll('.s-img');
  function show(key) {
    btns.forEach(function (b) { b.classList.toggle('on', b.dataset.key === key); });
    imgs.forEach(function (i) { i.classList.toggle('on', i.dataset.for === key); });
  }
  btns.forEach(function (b) {
    b.addEventListener('mouseenter', function () { show(b.dataset.key); });
    b.addEventListener('focus', function () { show(b.dataset.key); });
    b.addEventListener('click', function () { show(b.dataset.key); });
  });
})();
