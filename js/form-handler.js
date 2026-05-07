/**
 * Form handler — subscription form logic shared across pages.
 * Reads tracking IDs from window.AppConfig.
 */
(function () {
  'use strict';

  var cfg = window.AppConfig;
  if (!cfg) return;

  /* ---- form submission ---- */
  function handleSubmit(form, onSuccess) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '送信中...';
      }

      // Collect form data
      var data = {};
      form.querySelectorAll('input, select, textarea').forEach(function (el) {
        if (el.name) data[el.name] = el.value;
      });

      // Fire conversion via shared analytics
      if (window.Analytics && window.Analytics.trackConversion) {
        Analytics.trackConversion();
      } else {
        // Fallback — still trigger gtag conversion directly
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('event', 'Add');
        gtag('event', 'conversion', {
          send_to: (cfg.gtag && cfg.gtag.awId + '/' + cfg.gtag.conversionLabel) || '',
          transaction_id: '',
        });
      }

      if (onSuccess) {
        onSuccess(data, form);
      }
    });
  }

  /* ---- export ---- */
  window.FormHandler = {
    handleSubmit: handleSubmit,
  };
})();
