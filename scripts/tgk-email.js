(function () {
  'use strict';

  var DEFAULT_CODES =
    '101,99,104,111,64,116,101,99,104,103,114,111,117,112,107,101,110,121,97,46,99,111,46,107,101';

  function decode(codes) {
    return codes
      .split(',')
      .map(function (n) {
        return String.fromCharCode(parseInt(n, 10));
      })
      .join('');
  }

  function apply(el) {
    var email = decode(el.getAttribute('data-tgk-e') || DEFAULT_CODES);
    var label = el.getAttribute('data-tgk-email-label') || email;
    el.href = 'mailto:' + email;
    el.textContent = label;
    el.setAttribute('aria-label', 'Email ' + email);
    el.classList.remove('tgk-email-pending');
    el.removeAttribute('rel');
  }

  document.querySelectorAll('.tgk-email').forEach(apply);
})();
