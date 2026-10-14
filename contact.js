// Contact page.
// There is NO backend and NO confirmed contact details yet. Fill these in when they exist:
//   ENQUIRY_ENDPOINT  URL that accepts a JSON POST (e.g. a form service)
//   WHATSAPP_NUMBER   digits only, with country code
//   PHONE             e.g. "+39 000 000 0000" (display) ; EMAIL  e.g. "info@yourdomain.com"
// Until then the form validates and shows a clear "not sent" state instead of pretending to submit.
(function () {
  var ENQUIRY_ENDPOINT = '';
  var WHATSAPP_NUMBER = '';
  var PHONE = '';
  var EMAIL = '';

  // contact methods: only shown as live when a real value is configured
  function live(key, text, href) {
    var li = document.querySelector('.methods li[data-m="' + key + '"]');
    if (!li || !text) return;
    var a = li.querySelector('.m-v');
    a.textContent = text; a.href = href; a.removeAttribute('aria-disabled');
    li.classList.add('live');
  }
  live('whatsapp', WHATSAPP_NUMBER && '+' + WHATSAPP_NUMBER, 'https://wa.me/' + WHATSAPP_NUMBER);
  live('phone', PHONE, 'tel:' + PHONE.replace(/[^\d+]/g, ''));
  live('email', EMAIL, 'mailto:' + EMAIL);

  // reveal the map
  var map = document.querySelector('.cvmap');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (map) {
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { map.classList.add('in'); io.disconnect(); } }); }, { threshold: 0.3 });
      io.observe(map);
    } else { map.classList.add('in'); }
  }

  var form = document.getElementById('enquiryForm');
  var done = document.getElementById('bkDone');
  var summary = document.getElementById('errSummary');
  var btn = document.getElementById('submitBtn');

  var rules = {
    name: { label: 'Full name', test: function (v) { return v.trim() ? '' : 'Please enter your full name.'; } },
    email: { label: 'Email', test: function (v) { v = v.trim(); if (!v) return 'Please enter your email address.'; return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'That email address does not look right.'; } },
    phone: { label: 'Phone / WhatsApp', test: function (v) { v = v.trim(); return !v || (/^\+?[0-9 ()\-.]{6,}$/.test(v) && v.replace(/\D/g, '').length >= 7) ? '' : 'Enter a valid number, including the country code.'; } },
    type: { label: 'Enquiry type', test: function (v) { return v ? '' : 'Please choose an enquiry type.'; } },
    message: { label: 'Message', test: function (v) { return v.trim().length >= 5 ? '' : 'Please write a short message.'; } }
  };
  function check(k) {
    var el = document.getElementById(k), p = document.getElementById(k + '-err'), msg = rules[k].test(el.value);
    el.classList.toggle('invalid', !!msg);
    if (msg) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', k + '-err'); p.textContent = msg; p.hidden = false; }
    else { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); p.hidden = true; p.textContent = ''; }
    return msg;
  }
  Object.keys(rules).forEach(function (k) {
    var el = document.getElementById(k);
    el.addEventListener('blur', function () { if (el.value !== '' || el.dataset.t) { el.dataset.t = '1'; check(k); } });
    el.addEventListener('input', function () { if (el.classList.contains('invalid')) check(k); });
  });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function values() { var o = {}; Object.keys(rules).forEach(function (k) { o[k] = document.getElementById(k).value.trim(); }); return o; }

  function show(sent, v) {
    form.hidden = true;
    done.className = 'bk-done' + (sent ? '' : ' notsent');
    var msg = '<dl class="sum"><div><dt>Topic</dt><dd>' + esc(v.type) + '</dd></div><div><dt>Email</dt><dd>' + esc(v.email) + '</dd></div></dl>';
    done.innerHTML = sent
      ? '<h2>Enquiry Received</h2><p>Thank you. Your message has been received and we will get back to you.</p>' + msg + '<div class="acts"><a class="btn btn-primary" href="../booking/">Request a Transfer</a></div>'
      : '<h2>Message checked, but not sent</h2><p>Your enquiry is complete, but this form is not connected to a sending service yet, so <strong>nothing has been sent</strong>. Once it is connected, this screen will confirm that your message was received.</p>' + msg + '<div class="acts"><button type="button" class="btn btn-primary" id="copyBtn">Copy my message</button><button type="button" class="btn btn-outline" id="editBtn">Edit enquiry</button></div>';
    done.hidden = false; done.focus(); done.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var e = document.getElementById('editBtn'), c = document.getElementById('copyBtn');
    if (e) e.addEventListener('click', function () { done.hidden = true; form.hidden = false; document.getElementById('name').focus(); });
    if (c) c.addEventListener('click', function () {
      var t = ['Name: ' + v.name, 'Email: ' + v.email, v.phone ? 'Phone: ' + v.phone : '', 'Topic: ' + v.type, 'Message: ' + v.message].filter(Boolean).join('\n');
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { c.textContent = 'Copied'; });
    });
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var bad = [];
    Object.keys(rules).forEach(function (k) { if (check(k)) bad.push(k); });
    if (bad.length) {
      summary.innerHTML = '<strong>Please fix ' + bad.length + (bad.length > 1 ? ' fields' : ' field') + ' before sending:</strong><ul>' + bad.map(function (k) { return '<li><a href="#' + k + '">' + rules[k].label + '</a></li>'; }).join('') + '</ul>';
      summary.hidden = false; summary.focus();
      summary.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); document.getElementById(a.getAttribute('href').slice(1)).focus(); }); });
      return;
    }
    summary.hidden = true;
    var v = values();
    if (!ENQUIRY_ENDPOINT) { show(false, v); return; }
    btn.disabled = true; btn.querySelector('span').textContent = 'Sending…';
    fetch(ENQUIRY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(v) })
      .then(function (r) { if (!r.ok) throw new Error('bad'); show(true, v); })
      .catch(function () { summary.innerHTML = '<strong>We could not send your enquiry.</strong> Please try again later.'; summary.hidden = false; summary.focus(); })
      .then(function () { btn.disabled = false; btn.querySelector('span').textContent = 'Send Enquiry'; });
  });
})();
