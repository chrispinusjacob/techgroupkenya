(function () {
  'use strict';

  function hidePageLoader() {
    var loader = document.getElementById('loader');
    if (!loader || loader.dataset.dismissed === '1') return;
    loader.dataset.dismissed = '1';
    setTimeout(function () {
      loader.style.transition = 'opacity 1s ease-out';
      loader.style.opacity = '0';
      setTimeout(function () {
        loader.style.display = 'none';
      }, 1000);
    }, 2000);
  }

  if (document.readyState === 'complete') {
    hidePageLoader();
  } else {
    window.addEventListener('load', hidePageLoader);
  }

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) hidePageLoader();
  });

  window.TGK_LOADER = {
    hidePageLoader: hidePageLoader,
    setFormLoading: function (form, isLoading) {
      if (!form) return;
      var card = form.closest('.tgk-contact-form-card');
      if (!card) return;
      var btn = form.querySelector('[data-fs-submit-btn]');
      var loader = card.querySelector('.tgk-form-loader');

      if (isLoading) {
        card.classList.add('is-submitting');
        if (loader) {
          loader.hidden = false;
          loader.setAttribute('aria-hidden', 'false');
        }
        if (btn) {
          if (!btn.dataset.defaultLabel) {
            btn.dataset.defaultLabel = btn.textContent.trim();
          }
          btn.textContent = 'Sending...';
        }
      } else {
        card.classList.remove('is-submitting');
        if (loader) {
          loader.hidden = true;
          loader.setAttribute('aria-hidden', 'true');
        }
        if (btn && btn.dataset.defaultLabel) {
          btn.textContent = btn.dataset.defaultLabel;
        }
      }
    },
  };
})();
