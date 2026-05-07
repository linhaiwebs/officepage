/**
 * Analytics helper — reads from window.AppConfig, no hardcoded IDs.
 * Load this after config.js.
 */
(function () {
  'use strict';

  var cfg = window.AppConfig;
  if (!cfg) {
    console.warn('[analytics] AppConfig not found — tracking disabled.');
    return;
  }

  /* ---- gtag bootstrap ---- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', cfg.gtag.measurementId);
  gtag('config', cfg.gtag.awId);

  /* ---- public API ---- */

  /**
   * Track a conversion and optionally redirect after the callback.
   * @param {string} [url] - Redirect destination after tracking.
   */
  function trackConversion(url) {
    gtag('event', 'Add');
    gtag('event', 'conversion', {
      send_to: cfg.gtag.awId + '/' + cfg.gtag.conversionLabel,
      transaction_id: '',
      event_callback: function () {
        if (url) {
          window.location = url;
        }
      },
    });
  }

  /**
   * Track a custom event.
   * @param {string} name
   * @param {Object} [params]
   */
  function trackEvent(name, params) {
    gtag('event', name, params || {});
  }

  /* ---- export ---- */
  window.Analytics = {
    trackConversion: trackConversion,
    trackEvent: trackEvent,
  };
})();
