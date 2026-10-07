/* Demo sign-in gate — client-side only. NOT real security. */
(function () {
  'use strict';
  var SESSION = 'nexus_demo_session';
  var USERS = (window.NEXUS_CONFIG && window.NEXUS_CONFIG.authUsers) || [
    { email: 'admin@teamnexus.app', pass: 'Nexus@2026', name: 'Admin', role: 'Owner' },
    { email: 'staff@teamnexus.app', pass: 'Nexus@2026', name: 'Staff', role: 'Viewer' }
  ];
  var gate = document.getElementById('login');
  if (!gate) return;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  window.nexusLogin = function () {
    var email = (document.getElementById('login-email') || {}).value || '';
    var pass = (document.getElementById('login-pass') || {}).value || '';
    var err = document.getElementById('login-err');
    var u = USERS.filter(function (x) { return x.email === email.trim().toLowerCase() && x.pass === pass; })[0];
    if (!u) { if (err) err.textContent = 'Invalid credentials.'; return; }
    localStorage.setItem(SESSION, JSON.stringify({ email: u.email, name: u.name, role: u.role, at: Date.now() }));
    gate.style.display = 'none';
    var crumb = document.getElementById('crumb');
    try { document.dispatchEvent(new CustomEvent('nexus:login', { detail: u })); } catch (e) {}
  };
  window.nexusLogout = function () {
    localStorage.removeItem(SESSION);
    location.reload();
  };
  try {
    if (localStorage.getItem(SESSION)) { gate.style.display = 'none'; return; }
  } catch (e) {}
  gate.style.display = 'flex';
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && gate.style.display !== 'none') window.nexusLogin();
  });
})();
