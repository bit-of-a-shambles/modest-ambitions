/* Shared, consent-gated measurement. No secrets or recipient identifiers. */
(function () {
  'use strict';
  var ID = 'G-7SG7SXN1P8';
  var KEY = 'ma_analytics_consent_v1';
  var query = new URLSearchParams(location.search);
  var qa = query.get('analytics_test') === '1';
  var paths = {
    'delivery-payout-reconciliation': 'EXP-0031',
    'pat-testing-records': 'EXP-0030',
    'arborist-invoice-audit': 'EXP-0033'
  };
  var slug = location.pathname.split('/')[1];
  var experiment = paths[slug] || 'studio';
  var campaign = query.get('utm_campaign') || '';
  if (slug === 'pat-testing-records' && (query.get('experiment') === 'EXP-0032' || /^EXP-0032(?:-|$)/.test(campaign))) experiment = 'EXP-0032';
  var step = /^step_[123]$/.test(query.get('utm_content') || '') ? query.get('utm_content') : '';
  var source = /^(snov|smartlead|google|qa)$/.test(query.get('utm_source') || '') ? query.get('utm_source') : '';
  var tagged = source && /^EXP-003[0-3]-T01$/.test(campaign) && campaign.slice(0,8) === experiment;
  var loaded = false;
  var allowed = false;
  var banner;
  var button;
  var consent = null;
  try { consent = JSON.parse(localStorage.getItem(KEY)); } catch (_) {}
  if (!consent || Date.now() - consent.at > 180 * 86400000) consent = null;

  // Explicit allowlist prevents emails, free text and arbitrary URL parameters
  // entering GA. Campaign values describe a batch, never a person.
  function measurementUrl() {
    var url = new URL(location.origin + location.pathname);
    if (tagged) {
      url.searchParams.set('utm_source', source);
      url.searchParams.set('utm_medium', 'email');
      url.searchParams.set('utm_campaign', campaign);
      if (step) url.searchParams.set('utm_content', step);
    }
    var market = query.get('market');
    if (/^(US|CA|GB|AU|NZ|IE)$/.test(market || '')) url.searchParams.set('market', market);
    return url.href;
  }
  function event(name, extra) {
    if (!allowed) return;
    window.gtag('event', qa ? 'qa_' + name : name, Object.assign({
      experiment_id: experiment,
      email_step: tagged ? step : '',
      traffic_kind: qa ? 'qa' : 'visitor',
      page_location: measurementUrl(),
      page_title: document.title,
      page_referrer: '',
      transport_type: 'beacon'
    }, extra || {}));
  }
  function start() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', ID, {
      send_page_view: false, allow_google_signals: false, cookie_expires: 15552000,
      allow_ad_personalization_signals: false,
      page_location: measurementUrl(), page_referrer: '',
      traffic_kind: qa ? 'qa' : 'visitor'
    });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(script);
    event('page_view');
  }
  function removeAnalyticsCookies() {
    document.cookie.split(';').forEach(function (entry) {
      var name = entry.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      ['', location.hostname, '.' + location.hostname, '.modestambitions.studio'].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '');
      });
    });
  }
  function choose(value) {
    allowed = value === 'granted';
    consent = { value: value, at: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(consent)); } catch (_) {}
    banner.hidden = true;
    if (allowed) { window['ga-disable-' + ID] = false; start(); }
    else {
      window['ga-disable-' + ID] = true;
      removeAnalyticsCookies();
      // Unload Google code when a previously consenting visitor withdraws.
      if (loaded) location.reload();
    }
  }
  function buildConsent() {
    banner = document.createElement('aside');
    banner.className = 'analytics-consent';
    banner.setAttribute('aria-label', 'Analytics preference');
    banner.innerHTML = '<p>May we use Google Analytics to measure visits and which offers people use? Optional analytics cookies help us improve these pilots. <a href="/privacy/">Privacy details</a></p><div><button type="button" data-choice="granted">Allow analytics</button><button type="button" data-choice="denied">No thanks</button></div>';
    banner.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { choose(b.dataset.choice); }); });
    document.body.appendChild(banner);
    button = document.createElement('button');
    button.type = 'button'; button.className = 'analytics-settings'; button.textContent = 'Analytics preferences';
    button.addEventListener('click', function () { banner.hidden = false; banner.querySelector('button').focus(); });
    (document.querySelector('footer') || document.body).appendChild(button);
    banner.hidden = Boolean(consent);
    allowed = Boolean(consent && consent.value === 'granted');
    if (allowed) start();
  }

  // Currency links retain campaign attribution even before analytics consent.
  // This is URL routing only: no visitor identifier or browser storage.
  document.querySelectorAll('#switcher a').forEach(function (a) {
    var url = new URL(a.href);
    if (tagged) {
      url.searchParams.set('utm_source', source);
      url.searchParams.set('utm_medium', 'email');
      url.searchParams.set('utm_campaign', campaign);
      if (step) url.searchParams.set('utm_content', step);
    }
    if (experiment === 'EXP-0032') url.searchParams.set('experiment', experiment);
    if (qa) url.searchParams.set('analytics_test', '1');
    a.href = url.href;
  });
  var checkout = document.getElementById('checkout');
  if (checkout) {
    var url = new URL(checkout.href);
    var ref = url.searchParams.get('client_reference_id') || '';
    var market = ref.split('-').pop();
    if (/^(US|CA|GB|AU|NZ|IE)$/.test(market)) {
      var reference = experiment + '-' + market;
      if (tagged) reference += '-' + source + '-' + (step || 'step_unknown');
      if (qa) reference += '-qa';
      url.searchParams.set('client_reference_id', reference);
    }
    if (tagged) {
      url.searchParams.set('utm_source', source);
      url.searchParams.set('utm_medium', 'email');
      url.searchParams.set('utm_campaign', campaign);
      if (step) url.searchParams.set('utm_content', step);
    }
    checkout.href = url.href;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    if (a.id === 'checkout') event('begin_checkout');
    else if (a.href.indexOf('mailto:') === 0) event('contact_click');
  });
  buildConsent();
}());
