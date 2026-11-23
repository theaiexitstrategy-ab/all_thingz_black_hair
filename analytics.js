/* ATBH site analytics. Loaded on every page.
   1. GA4 (G-RGLQVQ5S3W): page views + named events. The GoElev8 portal
      reads this property (536419721) on ATBH's Analytics tab.
   2. GoElev8 portal page views (/api/track/view -> funnel_views).
      Page views only. This deliberately does NOT load portal embed/track.js,
      which would also capture form fields and post them as leads.
   3. Click tracking: Amazon affiliate links and anything with data-track.
   Never send names, emails or phone numbers to analytics. */
(function () {
  var GA_ID = 'G-RGLQVQ5S3W';
  var SLUG = 'allthingzblackhair';

  // ── GA4 ──
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  // Public helper for page code: atbhTrack('quiz_complete', { persona: '...' })
  window.atbhTrack = function (name, params) {
    try { gtag('event', name, params || {}); } catch (e) {}
  };

  // ── GoElev8 portal page view ──
  try {
    var body = JSON.stringify({
      slug: SLUG,
      path: location.pathname || '/',
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null
    });
    var url = 'https://portal.goelev8.ai/api/track/view';
    // text/plain is CORS-safelisted, so no preflight; the endpoint parses string bodies.
    var blob = new Blob([body], { type: 'text/plain' });
    if (!(navigator.sendBeacon && navigator.sendBeacon(url, blob))) {
      fetch(url, { method: 'POST', mode: 'cors', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: body }).catch(function () {});
    }
  } catch (e) {}

  // ── Click tracking (delegated, so dynamically rendered picks are covered) ──
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/amazon\.com\//i.test(href)) {
      var asin = (href.match(/\/dp\/([A-Z0-9]{10})/i) || [])[1] || '';
      window.atbhTrack('affiliate_click', {
        program: 'amazon',
        item_id: asin,
        item_name: a.getAttribute('data-product') || '',
        persona: a.getAttribute('data-persona') || '',
        placement: a.getAttribute('data-placement') || location.pathname
      });
      return;
    }
    var name = a.getAttribute('data-track');
    if (name) window.atbhTrack(name, { placement: location.pathname, link_url: href });
  }, true);
})();
