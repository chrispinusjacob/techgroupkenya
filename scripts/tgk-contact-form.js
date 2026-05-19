(function () {
  'use strict';

  var MIN_SUBMIT_MS = 3000;
  var RATE_LIMIT_MS = 60000;
  var RATE_LIMIT_KEY = 'tgk_contact_last_submit';
  var HOURLY_COUNT_KEY = 'tgk_contact_hourly';
  var MAX_PER_HOUR = 8;

  var LIMITS = {
    name: { min: 2, max: 100 },
    email: { max: 254 },
    subject: { min: 2, max: 200 },
    message: { min: 10, max: 5000 },
  };

  var SUSPICIOUS = /<script|javascript:|on\w+\s*=|data:text\/html/i;

  function $(id) {
    return document.getElementById(id);
  }

  function trim(val) {
    return String(val == null ? '' : val).trim();
  }

  function stripControlChars(val) {
    return val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }

  function isValidEmail(email) {
    if (email.length > LIMITS.email.max) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function isValidName(name) {
    if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) return false;
    return /^[\p{L}\p{M}\s'.-]+$/u.test(name);
  }

  function hasSuspiciousContent(val) {
    return SUSPICIOUS.test(val);
  }

  function getHourlyCount() {
    try {
      var raw = sessionStorage.getItem(HOURLY_COUNT_KEY);
      if (!raw) return { count: 0, windowStart: Date.now() };
      var data = JSON.parse(raw);
      if (Date.now() - data.windowStart > 3600000) {
        return { count: 0, windowStart: Date.now() };
      }
      return data;
    } catch (e) {
      return { count: 0, windowStart: Date.now() };
    }
  }

  function recordSubmit() {
    try {
      sessionStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
      var hourly = getHourlyCount();
      hourly.count += 1;
      sessionStorage.setItem(HOURLY_COUNT_KEY, JSON.stringify(hourly));
    } catch (e) { /* private mode */ }
  }

  function checkRateLimit() {
    try {
      var last = parseInt(sessionStorage.getItem(RATE_LIMIT_KEY) || '0', 10);
      if (last && Date.now() - last < RATE_LIMIT_MS) {
        return 'Please wait a minute before sending another message.';
      }
      var hourly = getHourlyCount();
      if (hourly.count >= MAX_PER_HOUR) {
        return 'Too many messages sent recently. Please try again later.';
      }
    } catch (e) { /* allow if storage blocked */ }
    return null;
  }

  function checkHoneypot(form) {
    var gotcha = form.querySelector('[name="_gotcha"]');
    if (gotcha && trim(gotcha.value) !== '') {
      return false;
    }
    var trap = form.querySelector('[name="website"]');
    if (trap && trim(trap.value) !== '') {
      return false;
    }
    return true;
  }

  function checkTiming(form) {
    var loaded = form.querySelector('[name="form_loaded_at"]');
    if (!loaded || !loaded.value) return false;
    var loadedAt = parseInt(loaded.value, 10);
    if (!loadedAt || Date.now() - loadedAt < MIN_SUBMIT_MS) {
      return false;
    }
    return true;
  }

  function setFieldError(form, fieldName, message) {
    var span = form.querySelector('[data-fs-error="' + fieldName + '"]');
    if (span) span.textContent = message;
    var field = form.querySelector('[name="' + fieldName + '"]');
    if (field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function clearFieldErrors(form) {
    form.querySelectorAll('[data-fs-error]').forEach(function (span) {
      if (span.getAttribute('data-fs-error')) {
        span.textContent = '';
      }
    });
    form.querySelectorAll('[data-fs-field]').forEach(function (field) {
      field.setAttribute('aria-invalid', 'false');
    });
  }

  function showFormError(form, message) {
    var banner = form.closest('.tgk-contact-form-card');
    if (!banner) return;
    var el = banner.querySelector('.tgk-formspree-error[data-fs-error]');
    if (el) {
      var text = el.querySelector('span');
      if (text) text.textContent = message;
      el.hidden = false;
    }
  }

  function hideFormError(form) {
    var banner = form.closest('.tgk-contact-form-card');
    if (!banner) return;
    var el = banner.querySelector('.tgk-formspree-error[data-fs-error]');
    if (el) el.hidden = true;
  }

  function validateContactForm(form) {
    clearFieldErrors(form);
    hideFormError(form);

    if (!checkHoneypot(form)) {
      return { ok: false, silent: true };
    }

    if (!checkTiming(form)) {
      showFormError(form, 'Please take a moment to complete the form before sending.');
      return { ok: false };
    }

    var rateMsg = checkRateLimit();
    if (rateMsg) {
      showFormError(form, rateMsg);
      return { ok: false };
    }

    var nameEl = form.querySelector('[name="name"]');
    var emailEl = form.querySelector('[name="email"]');
    var subjectEl = form.querySelector('[name="_subject"]');
    var messageEl = form.querySelector('[name="message"]');
    var name = stripControlChars(trim(nameEl && nameEl.value));
    var email = stripControlChars(trim(emailEl && emailEl.value)).toLowerCase();
    var subject = stripControlChars(trim(subjectEl && subjectEl.value));
    var message = stripControlChars(trim(messageEl && messageEl.value));

    var errors = {};

    if (!isValidName(name)) {
      errors.name = 'Enter your name (2–100 letters).';
    }
    if (!isValidEmail(email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (subject.length < LIMITS.subject.min || subject.length > LIMITS.subject.max) {
      errors._subject = 'Subject must be between 2 and 200 characters.';
    }
    if (message.length < LIMITS.message.min || message.length > LIMITS.message.max) {
      errors.message = 'Message must be between 10 and 5,000 characters.';
    }

    [name, email, subject, message].forEach(function (val, i) {
      if (val && hasSuspiciousContent(val)) {
        var keys = ['name', 'email', '_subject', 'message'];
        errors[keys[i]] = 'Invalid characters detected. Please revise your entry.';
      }
    });

    Object.keys(errors).forEach(function (key) {
      setFieldError(form, key, errors[key]);
    });

    if (Object.keys(errors).length) {
      return { ok: false };
    }

    var nameInput = form.querySelector('[name="name"]');
    var emailInput = form.querySelector('[name="email"]');
    var subjectInput = form.querySelector('[name="_subject"]');
    var messageInput = form.querySelector('[name="message"]');
    if (nameInput) nameInput.value = name;
    if (emailInput) emailInput.value = email;
    if (subjectInput) subjectInput.value = subject;
    if (messageInput) messageInput.value = message;

    return { ok: true };
  }

  function initLoadedTimestamp(form) {
    var loaded = form.querySelector('[name="form_loaded_at"]');
    if (loaded) loaded.value = String(Date.now());
  }

  function bindGuards(form) {
    if (!form || form.dataset.tgkGuardsBound === '1') return;
    form.dataset.tgkGuardsBound = '1';
    initLoadedTimestamp(form);

    form.addEventListener(
      'submit',
      function (e) {
        var result = validateContactForm(form);
        if (!result.ok) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      },
      true
    );
  }

  function setFormLoading(form, isLoading) {
    if (window.TGK_LOADER && window.TGK_LOADER.setFormLoading) {
      window.TGK_LOADER.setFormLoading(form, isLoading);
    }
  }

  window.TGK_CONTACT = {
    validateContactForm: validateContactForm,
    recordSubmit: recordSubmit,
    bindGuards: bindGuards,
    setFormLoading: setFormLoading,
  };
})();
