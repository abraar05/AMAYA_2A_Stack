(function () {
  'use strict';
  var D = window.IMEI_DATA || { devices: [], occurrences: [], conflicts: [] };
  try {
    var ov = JSON.parse(localStorage.getItem('imei_override') || 'null');
    if (ov && ov.devices) D = ov;
  } catch (e) {}

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function pill(state) {
    var m = { Sold: 'good', Received: 'good', 'In transit': 'warn', Review: 'warn', 'Bad bin': 'bad', 'Never classified': 'bad', 'No terminal state': 'bad', Open: 'warn', High: 'bad', Medium: 'warn', Low: '' };
    return '<span class="pill ' + (m[state] || '') + '">' + esc(state) + '</span>';
  }

  var ledgerBody = document.getElementById('ledger-body');
  var evidenceBody = document.getElementById('evidence-body');
  var reviewBody = document.getElementById('review-body');
  var ledgerFilter = 'All';
  var evidenceFilter = 'All';

  function states() { return ['All'].concat([...new Set(D.devices.map(function (d) { return d.state; }))]); }
  function tabs() { return ['All'].concat([...new Set(D.occurrences.map(function (o) { return o.tab; }))]); }

  function chips(el, items, current, fn) {
    el.innerHTML = items.map(function (i) {
      return '<button class="chip' + (i === current ? ' on' : '') + '" data-v="' + esc(i) + '">' + esc(i) + '</button>';
    }).join('');
    el.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () { fn(c.getAttribute('data-v')); });
    });
  }

  function renderLedger() {
    var rows = D.devices.filter(function (d) { return ledgerFilter === 'All' || d.state === ledgerFilter; });
    ledgerBody.innerHTML = rows.map(function (d) {
      return '<tr><td><b>' + esc(d.imei) + '</b></td><td>' + esc(d.model) + '</td><td>' + esc(d.brand) + '</td><td>' + pill(d.state) + '</td><td>' + d.sources + '</td><td>' + esc(d.last) + '</td></tr>';
    }).join('') || '<tr><td colspan="6" class="muted">No devices match.</td></tr>';
  }
  function renderEvidence() {
    var rows = D.occurrences.filter(function (o) { return evidenceFilter === 'All' || o.tab === evidenceFilter; });
    evidenceBody.innerHTML = rows.sort(function (a, b) { return a.when < b.when ? -1 : 1; }).map(function (o) {
      return '<tr><td>' + esc(o.when) + '</td><td><b>' + esc(o.imei) + '</b></td><td>' + esc(o.tab) + '</td><td>' + pill(o.state) + '</td><td>' + esc(o.product) + '</td><td>' + esc(o.note) + '</td></tr>';
    }).join('') || '<tr><td colspan="6" class="muted">No occurrences match.</td></tr>';
  }
  function reviewState() {
    try { return JSON.parse(localStorage.getItem('imei_review') || '{}'); } catch (e) { return {}; }
  }
  function renderReview() {
    var ov = reviewState();
    var rows = D.conflicts.map(function (c, i) {
      if (ov[i]) c = Object.assign({}, c, { status: ov[i] });
      var act = c.status === 'Open'
        ? '<button class="btn" data-i="' + i + '" data-a="approve" style="margin-right:4px">Approve</button><button class="btn" data-i="' + i + '" data-a="reject">Reject</button>'
        : '<span class="muted">Recorded</span>';
      return '<tr><td><b>' + esc(c.imei) + '</b></td><td>' + esc(c.issue) + '</td><td>' + esc(c.sources) + '</td><td>' + pill(c.severity) + '</td><td>' + pill(c.status === 'Open' ? 'Review' : (c.status === 'Approved' ? 'Sold' : c.status)) + '</td><td>' + act + '</td></tr>';
    });
    reviewBody.innerHTML = rows.join('');
    document.getElementById('review-count').textContent = D.conflicts.filter(function (c, i) { return (ov[i] || c.status) === 'Open'; }).length + ' open';
    reviewBody.querySelectorAll('button[data-a]').forEach(function (b) {
      b.addEventListener('click', function () {
        var ov2 = reviewState();
        ov2[b.getAttribute('data-i')] = b.getAttribute('data-a') === 'approve' ? 'Approved' : 'Rejected';
        localStorage.setItem('imei_review', JSON.stringify(ov2));
        renderReview();
      });
    });
  }

  // KPIs
  try {
    document.getElementById('k-total').textContent = D.devices.length;
    document.getElementById('k-resolved').textContent = D.devices.filter(function (d) { return d.state !== 'Never classified' && d.state !== 'No terminal state'; }).length;
    document.getElementById('k-conflicts').textContent = D.conflicts.filter(function (c, i) { var ov = reviewState(); return (ov[i] || c.status) === 'Open'; }).length;
    document.getElementById('k-unclassified').textContent = D.devices.filter(function (d) { return d.state === 'Never classified'; }).length;
  } catch (e) {}

  var lf = document.getElementById('ledger-filters');
  var ef = document.getElementById('evidence-filters');
  function buildFilters() {
    if (lf) chips(lf, states(), ledgerFilter, function (v) { ledgerFilter = v; buildFilters(); renderLedger(); });
    if (ef) chips(ef, tabs(), evidenceFilter, function (v) { evidenceFilter = v; buildFilters(); renderEvidence(); });
  }
  buildFilters();
  renderLedger(); renderEvidence(); renderReview();

  window.imeiSearch = function () {
    var q = (document.getElementById('imei-q') || {}).value || '';
    var out = document.getElementById('search-result');
    var hit = D.devices.filter(function (d) { return d.imei.indexOf(q.replace(/\D/g, '')) === 0 && q.replace(/\D/g, '').length > 0; });
    if (!q.replace(/\D/g, '')) { out.innerHTML = '<p class="muted">Paste an IMEI to open its trail.</p>'; return; }
    if (!hit.length) { out.innerHTML = '<p class="muted">No identifier matches from the left.</p>'; return; }
    out.innerHTML = hit.map(function (d) {
      var trail = D.occurrences.filter(function (o) { return o.imei === d.imei; })
        .map(function (o) { return '<div class="event"><b>' + esc(o.state) + '</b> · ' + esc(o.tab) + '<small>' + esc(o.when) + ' — ' + esc(o.note) + '</small></div>'; }).join('') || '<div class="event"><b>No occurrences</b><small>never moved</small></div>';
      return '<div class="card" style="margin:12px 0;padding:17px"><div class="metricrow"><b>' + esc(d.imei) + '</b><span>' + pill(d.state) + '</span></div><p class="muted" style="font-size:12px">' + esc(d.brand) + ' · ' + esc(d.model) + ' · ' + d.sources + ' source tab(s) · last seen ' + esc(d.last) + '</p><div class="timeline">' + trail + '</div></div>';
    }).join('');
  };
  document.getElementById('search-filters').innerHTML = '';

  function download(name, text, type) {
    var b = new Blob([text], { type: type || 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = name; a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 800);
  }
  function toCSV(rows, cols) { return cols.map(function (c) { return c.k; }).join(',') + '\n' + rows.map(function (r) { return cols.map(function (c) { return '"' + String(r[c.k]).replace(/"/g, '""') + '"'; }).join(','); }).join('\n'); }

  window.exportLedger = function () {
    download('asset-ledger.csv', toCSV(D.devices, [{ k: 'imei' }, { k: 'model' }, { k: 'brand' }, { k: 'state' }, { k: 'sources' }, { k: 'last' }]), 'text/csv');
  };
  window.exportEvidence = function () {
    var rows = D.occurrences.map(function (o) { return [o.when, o.imei, o.tab, o.state, o.product, o.note].join('\t'); });
    download('movement-evidence.tsv', 'when\timei\ttab\tstate\tproduct\tnote\n' + rows.join('\n'), 'text/tab-separated-values');
  };
  window.exportJSON = function () {
    download('ledger-bundle.json', JSON.stringify(D, null, 2), 'application/json');
  };
  window.importBundle = function (file) {
    if (!file) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var j = JSON.parse(r.result);
        if (!j.devices) throw new Error('bad bundle');
        localStorage.setItem('imei_override', JSON.stringify(j));
        location.reload();
      } catch (e) { alert('Not a valid ledger bundle.'); }
    };
    r.readAsText(file);
  };
  window.resetSnapshot = function () {
    localStorage.removeItem('imei_override');
    location.reload();
  };

  var sb = document.querySelector('.sidebottom');
  // keep "who" label fresh
  try {
    var u = JSON.parse(localStorage.getItem('nexus_demo_session') || 'null');
    var who = document.getElementById('who');
    if (u && who) who.textContent = u.name || 'admin';
  } catch (e) {}
})();
