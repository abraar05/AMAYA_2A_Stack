(function () {
  'use strict';
  var root = document.documentElement;
  var cfg = window.NEXUS_CONFIG || {};
  function $(s) { return document.querySelector(s); }

  var toast = (function () {
    var el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
    var t;
    return function (msg) {
      el.textContent = msg;
      el.classList.add('show');
      clearTimeout(t);
      t = setTimeout(function () { el.classList.remove('show'); }, 2400);
    };
  })();

  /* ---------- theme / mode ---------- */
  root.dataset.theme = localStorage.getItem('ndtheme') || root.dataset.theme || 'graphite';
  root.dataset.mode = localStorage.getItem('ndmode') || root.dataset.mode || 'dark';
  window.theme = function (t) {
    root.dataset.theme = t;
    localStorage.setItem('ndtheme', t);
    toast('Theme set to ' + t);
  };
  window.toggleMode = function () {
    root.dataset.mode = root.dataset.mode === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ndmode', root.dataset.mode);
    toast('Switched to ' + root.dataset.mode + ' mode');
  };

  /* ---------- AI drawer ---------- */
  window.openAI = function () {
    var d = $('#drawer');
    if (d) { d.classList.add('show'); setTimeout(function () { var q = $('#q'); if (q) q.focus(); }, 80); }
  };
  window.closeAI = function () { var d = $('#drawer'); if (d) d.classList.remove('show'); };
  window.answer = function () {
    var q = $('#q'), a = $('#answer');
    if (!a) return;
    var text = (q && q.value) ? q.value.replace(/</g, '&lt;') : 'your question';
    a.innerHTML = '<b>Local AI analysis</b><br><br>I’d combine current data across ' +
      (cfg.domain || 'your modules') + ' to answer: <b>' + text + '</b>.<br><br><span class="muted">' +
      (cfg.aiNote || 'Demo UI response · Connect your local model and data layer for live results.') + '</span>';
  };

  /* ---------- page routing ---------- */
  var generatedHost = null;
  function ensureGenerated() {
    if (generatedHost) return generatedHost;
    generatedHost = document.getElementById('generated');
    if (!generatedHost) {
      generatedHost = document.createElement('div');
      generatedHost.id = 'generated';
      generatedHost.className = 'page';
      var content = document.querySelector('.content');
      if (content) content.appendChild(generatedHost);
    }
    return generatedHost;
  }
  function crumbFor(btn, id) {
    if (btn) {
      var s = btn.querySelector('span');
      return (s ? s.textContent : btn.textContent).trim();
    }
    return id.charAt(0).toUpperCase() + id.slice(1);
  }
  function activate(id, btn) {
    var target = document.getElementById(id);
    document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
    if (target && target.id !== 'generated') {
      target.classList.add('active');
    } else {
      renderGenerated(id);
    }
    document.querySelectorAll('.nav button').forEach(function (b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    var crumb = $('#crumb');
    if (crumb) crumb.textContent = crumbFor(btn, id);
  }
  window.page = activate;
  function renderGenerated(id) {
    var g = ensureGenerated();
    var d = (cfg.generated || {})[id];
    g.classList.add('active');
    if (!d) {
      g.innerHTML = '<div class="hero"><div><h1>' + id + '</h1><p>This module is under construction.</p></div></div>';
      return;
    }
    var gridCls = document.querySelector('.modules') ? 'modules' : 'modulegrid';
    var html = '<div class="hero"><div><h1>' + d.title + '</h1><p>' + d.sub + '</p></div><div class="actions"><button class="btn primary" data-toast="' + d.title + ' · new entry">＋ New</button></div></div>';
    html += '<div class="grid ' + gridCls + '">' + d.cards.map(function (c) {
      return '<div class="card module"><div class="bigico ico">' + c.i + '</div><h3>' + c.t + '</h3><p>' + c.d + '</p><button class="btn" data-toast="' + c.t + ' opened">Open →</button></div>';
    }).join('') + '</div>';
    if (d.events) {
      html += '<div class="card" style="margin-top:12px"><div class="head"><h3>Recent activity</h3></div><div class="body"><div class="timeline">' +
        d.events.map(function (e) { return '<div class="event"><b>' + e.t + '</b><small>' + e.s + '</small></div>'; }).join('') +
        '</div></div></div>';
    }
    g.innerHTML = html;
  }

  document.querySelectorAll('[data-page]').forEach(function (b) {
    b.addEventListener('click', function () { activate(b.getAttribute('data-page'), b); });
  });

  /* ---------- suite links (interconnect the five apps) ---------- */
  var side = document.querySelector('.side');
  if (side && cfg.suite) {
    var wrap = document.createElement('div');
    wrap.className = 'suite';
    wrap.innerHTML = '<div class="navlabel">Nexus suite</div>' + Object.keys(cfg.suite).map(function (k) {
      return '<a href="' + cfg.suite[k] + '" target="_blank" rel="noopener"><i class="ico">⬚</i><span>' + k + '</span></a>';
    }).join('');
    var sb = side.querySelector('.sidebottom');
    if (sb) side.insertBefore(wrap, sb); else side.appendChild(wrap);
  }

  /* ---------- search / shortcuts / toasts ---------- */
  document.querySelectorAll('.search').forEach(function (s) { s.addEventListener('click', openAI); });
  document.querySelectorAll('[data-toast]').forEach(function (b) {
    b.dataset.bound = '1';
    b.addEventListener('click', function () { toast(b.getAttribute('data-toast')); });
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-toast]') : null;
    if (t && !t.dataset.bound) { toast(t.getAttribute('data-toast')); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openAI(); }
    if (e.key === 'Escape') closeAI();
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
