// FAQ page: highlight the current topic in the index; accordion animation comes from services.js (loaded via the shared script below)
(function () {
  var s = document.createElement('script');
  s.src = '../services.js';
  document.body.appendChild(s);

  // services.js targets '.s-faq details'; this page uses '.fq-sec details', so animate them here with the same pattern
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.fq-sec details').forEach(function (d) {
    var sum = d.querySelector('summary'), ans = d.querySelector('.ans'), anim = null;
    sum.addEventListener('click', function (e) {
      e.preventDefault();
      if (reduce) { d.open = !d.open; return; }
      if (anim) anim.cancel();
      var opening = !d.open;
      if (opening) d.open = true;
      var from = opening ? 0 : ans.offsetHeight, to = opening ? ans.scrollHeight : 0;
      ans.style.overflow = 'hidden';
      anim = ans.animate({ height: [from + 'px', to + 'px'], opacity: opening ? [0, 1] : [1, 0] }, { duration: 340, easing: 'cubic-bezier(.2,.7,.2,1)' });
      anim.onfinish = function () { d.open = opening; ans.style.height = ans.style.overflow = ''; anim = null; };
      anim.oncancel = function () { anim = null; };
    });
  });

  // scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.1 });
    items.forEach(function (i) { io.observe(i); });
  } else items.forEach(function (i) { i.classList.add('in'); });

  // current topic in index
  var links = document.querySelectorAll('.fq-index a');
  var secs = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    secs.forEach(function (s) { if (s) so.observe(s); });
  }
})();
