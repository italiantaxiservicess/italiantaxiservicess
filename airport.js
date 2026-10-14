// Airport Transfers page: accessible tabs + airport list <-> map highlighting
(function () {
  // ----- tabs (roving tabindex, arrow keys) -----
  var list = document.querySelector('.tab-list');
  if (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  }

  // ----- airport board <-> map -----
  var rows = document.querySelectorAll('.board li[data-city]');
  var pins = document.querySelectorAll('.city[data-city]');
  function mark(city, on) {
    rows.forEach(function (r) { if (r.dataset.city === city) r.classList.toggle('hl', on); });
    pins.forEach(function (p) { if (p.dataset.city === city) p.classList.toggle('hl', on); });
  }
  rows.forEach(function (r) {
    r.addEventListener('mouseenter', function () { mark(r.dataset.city, true); });
    r.addEventListener('mouseleave', function () { mark(r.dataset.city, false); });
  });
  pins.forEach(function (p) {
    p.addEventListener('mouseenter', function () { mark(p.dataset.city, true); });
    p.addEventListener('mouseleave', function () { mark(p.dataset.city, false); });
  });
  // confirmed airports get a solid marker automatically
  rows.forEach(function (r) {
    if (r.classList.contains('is-confirmed')) {
      pins.forEach(function (p) { if (p.dataset.city === r.dataset.city) p.classList.add('is-confirmed'); });
    }
  });
})();
