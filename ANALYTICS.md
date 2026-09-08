# MVP website measurement

GA4 property: **Modest Ambitions MVPs**, `553113789`, under the existing
Personal Websites account. Stream: `G-62Z1WZ0GJT`.

[Open reports](https://analytics.google.com/analytics/web/#/p553113789/reports/reportinghub).
The public measurement ID is not a secret. No credentials belong in this repo.

## What is measured

- `page_view`: consented page loads, with `experiment_id`, `email_step` and
  `traffic_kind` custom dimensions.
- `begin_checkout`: purchase-link clicks, not successful payment.
- `contact_click`: clicks on an email link, not a submitted enquiry.
- Actual paid orders: Stripe paid, completed live Checkout Sessions, limited to
  the ten current offer Payment Links. The validation repository provides the
  combined read-only report. No synthetic `purchase` event fires on a thank-you page.

The three existing Snov flows already have campaign tags on their step-one and
step-three links. Step two has no link. No tracking redirect, new email send,
recipient identifier or campaign activation is needed. `cold-email` in existing
links is normalized to `email` in analytics so GA4 can group the channel.

PAT's `EXP-0032-T01` campaign now selects outreach experiment EXP-0032;
untagged PAT visits retain the historical EXP-0030 default. The market switcher
preserves attribution. Stripe `client_reference_id` retains its experiment/market
prefix and adds the source and step, e.g. `EXP-0032-GB-snov-step_1`.

## Consent and data

The Google script only loads after analytics consent. Declining does not block
any offer or payment link. Preference storage lasts up to 180 days; consent
withdrawal removes first-party `_ga` cookies and reloads to unload Google code.
Advertising consent stays denied; Google signals and ad personalization are off.
Enhanced automatic measurement is disabled. Only allowlisted campaign/query
values reach page-location measurement; names, email addresses, arbitrary query
parameters and the raw referrer are omitted. Analytics is an incomplete sample:
consent choices, blockers and JavaScript failures can prevent collection.

This cannot reconstruct past unrecorded visits. Reports must say “recorded
visits”, not “all clicks” or “no one clicked”. Standard GA4 processing can take
24–48 hours. Zero checkouts or visits is not a demand verdict.

## Verification

Run the static site with `python3 -m http.server 8766 --directory public-site`.
With Playwright available, run `node tests/analytics-browser.cjs` (Chrome channel).
The test stubs Google requests, verifies all three pages, consent/withdrawal,
URL hygiene, currency attribution and absence of false purchases.

For a controlled live check append `analytics_test=1`. Explicit events then use
`qa_` names and `traffic_kind=qa`; exclude these from experiment reports.
The local report already excludes QA. General GA4 user/session totals can include
such diagnostics, so don't use unfiltered global totals as experiment evidence.

Production is the `public-site` directory deployed by GitHub Pages. The old
Sites/vinext app is not the production deployment target.
