/* email-guard.js - inline email validation for GitDealFlow signup forms.
   Progressive enhancement: if JS fails or a page omits the tag, the native
   required + type=email validation and the existing fetch handlers still work.
   Patterns: trim, lowercase-domain check, common-typo suggestion (gmial.com ->
   gmail.com), disposable-domain block, aria-invalid + inline message.
   Zero dependencies. i18n via document.documentElement.lang. */
(function () {
  'use strict';

  var TYPO_FIX = {
    'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmail.co': 'gmail.com',
    'gmail.con': 'gmail.com', 'gmal.com': 'gmail.com', 'gnail.com': 'gmail.com',
    'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmail.co': 'hotmail.com',
    'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com',
    'iclod.com': 'icloud.com', 'icloud.co': 'icloud.com',
    'outlok.com': 'outlook.com', 'outlook.co': 'outlook.com',
    'protonmai.com': 'protonmail.com', 'protonmal.com': 'protonmail.com'
  };
  var DISPOSABLE = [
    'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
    'temp-mail.org', 'yopmail.com', 'throwawaymail.com', 'getnada.com',
    'dispostable.com', 'sharklasers.com', 'trashmail.com', 'fakeinbox.com'
  ];
  var MSG = {
    en: { typo: 'Did you mean', disposable: 'Please use a permanent email address, disposable inboxes miss the Sunday issue.', invalid: 'That email address does not look right.' },
    de: { typo: 'Meinten Sie', disposable: 'Bitte eine dauerhafte Adresse nutzen, Wegwerf-Postfaecher verpassen die Sonntagsausgabe.', invalid: 'Diese E-Mail-Adresse sieht nicht richtig aus.' },
    es: { typo: 'Quisiste decir', disposable: 'Usa una direccion permanente, los buzones temporales se pierden el numero del domingo.', invalid: 'Esa direccion de correo no parece correcta.' }
  };

  function t() {
    var l = (document.documentElement.lang || 'en').slice(0, 2);
    return MSG[l] || MSG.en;
  }

  function check(v) {
    v = (v || '').trim();
    if (!v) return { ok: false, msg: t().invalid };
    var m = v.match(/^[^\s@]+@([^\s@]+)\.[^\s@]{2,}$/);
    if (!m) return { ok: false, msg: t().invalid };
    var domain = m[1].toLowerCase();
    var fixed = TYPO_FIX[domain];
    if (fixed) return { ok: false, msg: t().typo + ' ' + v.replace('@' + domain, '@' + fixed) + '?', fix: v.replace('@' + domain, '@' + fixed) };
    if (DISPOSABLE.indexOf(domain) !== -1) return { ok: false, msg: t().disposable };
    return { ok: true, value: v };
  }

  function msgEl(input) {
    var id = input.getAttribute('aria-describedby');
    var el = id && document.getElementById(id);
    if (el) return el;
    el = input.parentNode.querySelector('.email-guard-msg');
    if (!el) {
      el = document.createElement('p');
      el.className = 'email-guard-msg text-xs text-red-400 mt-1';
      el.setAttribute('role', 'alert');
      input.insertAdjacentElement('afterend', el);
    }
    return el;
  }

  function show(input, msg) {
    var el = msgEl(input);
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function wire(form) {
    var input = form.querySelector('input[type="email"]');
    if (!input || input.dataset.emailGuard) return;
    input.dataset.emailGuard = '1';
    form.addEventListener('submit', function (e) {
      var r = check(input.value);
      if (!r.ok) {
        e.preventDefault();
        e.stopImmediatePropagation();
        show(input, r.msg);
        input.focus();
        return false;
      }
      show(input, '');
      input.value = r.value;
    }, true); // capture: run BEFORE each page's own submit handlers
    input.addEventListener('blur', function () {
      if (input.value.trim()) {
        var r = check(input.value);
        show(input, r.ok ? '' : r.msg);
      }
    });
  }

  function init() {
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i++) {
      if (forms[i].querySelector('input[type="email"]')) wire(forms[i]);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
