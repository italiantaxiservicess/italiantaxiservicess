// Services page: smooth accessible accordion (native <details>, animated height)
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var all = document.querySelectorAll('.s-faq details');

  all.forEach(function (d) {
    var sum = d.querySelector('summary');
    var ans = d.querySelector('.ans');
    var anim = null;

    function finish(open) {
      d.open = open;
      d.classList.remove('is-closing');
      ans.style.height = ans.style.overflow = '';
      anim = null;
    }

    sum.addEventListener('click', function (e) {
      e.preventDefault();
      if (reduce) { d.open = !d.open; return; }
      if (anim) anim.cancel();

      var opening = !d.open;
      if (opening) {
        // close siblings for a calmer reading experience
        all.forEach(function (o) { if (o !== d && o.open) o.querySelector('summary').click(); });
        d.open = true;
      }
      var start = opening ? 0 : ans.offsetHeight;
      var end = opening ? ans.scrollHeight : 0;
      ans.style.overflow = 'hidden';
      anim = ans.animate({ height: [start + 'px', end + 'px'], opacity: opening ? [0, 1] : [1, 0] },
        { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' });
      anim.onfinish = function () { finish(opening); };
      anim.oncancel = function () { anim = null; };
    });
  });
})();
