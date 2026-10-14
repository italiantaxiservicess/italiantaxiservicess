// Booking page: client-side validation + submission.
// There is NO backend yet. Set BOOKING_ENDPOINT to a real URL (e.g. a form service) to send requests;
// until then the form validates and shows a clear "not sent" state instead of pretending to submit.
// Set WHATSAPP_NUMBER (digits only, with country code) to enable the WhatsApp button.
(function () {
  var BOOKING_ENDPOINT = '';
  var WHATSAPP_NUMBER = '';

  var form = document.getElementById('bookingForm');
  var done = document.getElementById('bkDone');
  var summary = document.getElementById('errSummary');
  var btn = document.getElementById('submitBtn');
  var wa = document.getElementById('waBtn');
  var waNote = document.getElementById('waNote');

  var date = document.getElementById('date');
  var d = new Date();
  date.min = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

  var rules = {
    service: { id: 'service', err: 'service-err', label: 'Service type', test: function (v) { return v ? '' : 'Please choose a service type.'; } },
    pickup: { id: 'pickup', err: 'pickup-err', label: 'Pickup location', test: function (v) { return v.trim() ? '' : 'Please enter a pickup location.'; } },
    dest: { id: 'dest', err: 'dest-err', label: 'Destination', test: function (v) { return v.trim() ? '' : 'Please enter a destination.'; } },
    date: { id: 'date', err: 'date-err', label: 'Travel date', test: function (v) { if (!v) return 'Please choose a travel date.'; return v < date.min ? 'Please choose today or a later date.' : ''; } },
    time: { id: 'time', err: 'time-err', label: 'Pickup time', test: function (v) { return v ? '' : 'Please choose a pickup time.'; } },
    pax: { id: 'pax', err: 'pax-err', label: 'Number of passengers', test: function (v) { var n = parseInt(v, 10); return n >= 1 && n <= 99 ? '' : 'Enter a number of passengers between 1 and 99.'; } },
    name: { id: 'name', err: 'name-err', label: 'Full name', test: function (v) { return v.trim() ? '' : 'Please enter your full name.'; } },
    phone: { id: 'phone', err: 'phone-err', label: 'WhatsApp / phone', test: function (v) {
      v = v.trim();
      if (!v) return 'Please enter a phone or WhatsApp number.';
      if (!/^\+?[0-9 ()\-.]{6,}$/.test(v) || v.replace(/\D/g, '').length < 7) return 'Enter a valid number, including the country code.';
      return '';
    } },
    email: { id: 'email', err: 'email-err', label: 'Email', test: function (v) { v = v.trim(); return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'That email address does not look right.'; } }
  };

  function check(key) {
    var r = rules[key], el = document.getElementById(r.id), p = document.getElementById(r.err);
    var msg = r.test(el.value);
    el.classList.toggle('invalid', !!msg);
    if (msg) {
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', r.err + (key === 'phone' ? ' phone-hint' : ''));
      p.textContent = msg; p.hidden = false;
    } else {
      el.removeAttribute('aria-invalid');
      el.setAttribute('aria-describedby', key === 'phone' ? 'phone-hint' : '');
      if (key !== 'phone') el.removeAttribute('aria-describedby');
      p.hidden = true; p.textContent = '';
    }
    return msg;
  }
  Object.keys(rules).forEach(function (k) {
    var el = document.getElementById(rules[k].id);
    el.addEventListener('blur', function () { if (el.value !== '' || el.dataset.touched) { el.dataset.touched = '1'; check(k); } });
    el.addEventListener('input', function () { if (el.classList.contains('invalid')) check(k); });
  });

  function values() {
    var g = function (id) { return document.getElementById(id).value.trim(); };
    return { service: g('service'), pickup: g('pickup'), destination: g('dest'), date: g('date'), time: g('time'), passengers: g('pax'), luggage: g('lug'), name: g('name'), phone: g('phone'), email: g('email'), notes: g('notes') };
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function text(v) {
    return ['Service: ' + v.service, 'Pickup: ' + v.pickup, 'Destination: ' + v.destination, 'Date: ' + v.date, 'Time: ' + v.time, 'Passengers: ' + v.passengers,
      v.luggage ? 'Luggage: ' + v.luggage : '', 'Name: ' + v.name, 'Phone: ' + v.phone, v.email ? 'Email: ' + v.email : '', v.notes ? 'Notes: ' + v.notes : ''].filter(Boolean).join('\n');
  }

  if (WHATSAPP_NUMBER) {
    waNote.hidden = true; wa.removeAttribute('aria-describedby');
    wa.addEventListener('click', function (e) {
      e.preventDefault();
      var v = values();
      var msg = v.pickup || v.destination ? 'Hello, I would like to request a transfer.\n' + text(v) : 'Hello, I would like to request a transfer.';
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  } else {
    wa.setAttribute('aria-disabled', 'true');
    wa.setAttribute('tabindex', '-1');
    wa.addEventListener('click', function (e) { e.preventDefault(); });
  }

  function show(sent, v) {
    form.hidden = true;
    var rows = [['Service', v.service], ['Pickup', v.pickup], ['Destination', v.destination], ['Date', v.date], ['Time', v.time], ['Passengers', v.passengers]]
      .map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
    done.className = 'bk-done' + (sent ? '' : ' notsent');
    done.innerHTML = sent
      ? '<h2>Request Received</h2><p>Thank you. Your journey details have been received. We\'ll review your request and contact you with the next steps.</p><dl class="sum">' + rows + '</dl><div class="acts"><a class="btn btn-outline" href="../index.html">Back to home</a></div>'
      : '<h2>Form checked, but not sent</h2><p>Your details are valid, but this booking form is not connected to a sending service yet, so <strong>nothing has been submitted</strong>. Once it is connected, this screen will confirm that your request was received.</p><dl class="sum">' + rows + '</dl><div class="acts"><button type="button" class="btn btn-primary" id="copyBtn">Copy my details</button><button type="button" class="btn btn-outline" id="editBtn">Edit request</button></div>';
    done.hidden = false; done.focus(); done.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var e = document.getElementById('editBtn'), c = document.getElementById('copyBtn');
    if (e) e.addEventListener('click', function () { done.hidden = true; form.hidden = false; document.getElementById('service').focus(); });
    if (c) c.addEventListener('click', function () { if (navigator.clipboard) navigator.clipboard.writeText(text(v)).then(function () { c.textContent = 'Copied'; }); });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [];
    Object.keys(rules).forEach(function (k) { if (check(k)) bad.push(k); });
    if (bad.length) {
      summary.innerHTML = '<strong>Please fix ' + bad.length + (bad.length > 1 ? ' fields' : ' field') + ' before sending:</strong><ul>' +
        bad.map(function (k) { return '<li><a href="#' + rules[k].id + '">' + rules[k].label + '</a></li>'; }).join('') + '</ul>';
      summary.hidden = false; summary.focus();
      summary.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function (ev) { ev.preventDefault(); document.getElementById(a.getAttribute('href').slice(1)).focus(); });
      });
      return;
    }
    summary.hidden = true;
    var v = values();
    if (!BOOKING_ENDPOINT) { show(false, v); return; }
    btn.disabled = true; btn.querySelector('span').textContent = 'Sending…';
    fetch(BOOKING_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(v) })
      .then(function (r) { if (!r.ok) throw new Error('bad'); show(true, v); })
      .catch(function () { summary.innerHTML = '<strong>We could not send your request.</strong> Please try again, or contact us directly.'; summary.hidden = false; summary.focus(); })
      .then(function () { btn.disabled = false; btn.querySelector('span').textContent = 'Request My Transfer'; });
  });
})();
