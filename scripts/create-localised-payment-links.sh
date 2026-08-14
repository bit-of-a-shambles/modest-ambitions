#!/usr/bin/env bash
# Creates the USD and CAD counterparts of the GBP arborist audit Payment Link.
#
# The restricted key the Stripe CLI is logged in with is read-only. Before
# running this, enable "Prices Write" (plan_write) and "Payment Links Write"
# (payment_links_write) on it:
#   https://dashboard.stripe.com/b/acct_1Os6C5FIRCI5dHu0?destination=%2Fapikeys%2Fmk_1TXntTFIRCI5dHu0Eh896DrY%2Fedit
#
# Then paste the two URLs it prints into app/arborist-invoice-audit/pricing.ts.
set -euo pipefail

PRODUCT="prod_V4SmEmZrRCfu9S"   # Completed-work invoice exception audit
THANKS="https://modestambitions.studio/arborist-invoice-audit/thanks"
SUBMIT_MESSAGE="After payment, we will email within one business day to confirm the bounded export sample and secure transfer method."

create_market() {
  local market="$1" currency="$2" amount="$3"

  local price_id
  price_id=$(stripe prices create --live \
    --product "$PRODUCT" \
    --currency "$currency" \
    --unit-amount "$amount" \
    --nickname "OFFER-0019 fixed-scope audit (${market})" \
    -d "metadata[experiment_id]=EXP-0025" \
    -d "metadata[idea_id]=IDEA-0005" \
    -d "metadata[offer_id]=OFFER-0019" \
    -d "metadata[market]=${market}" \
    | python3 -c 'import sys,json; print(json.load(sys.stdin)["id"])')

  # Mirrors the GBP link: pay button, customer always created, same
  # post-payment redirect, same reassurance line above the submit button.
  stripe payment_links create --live \
    -d "line_items[0][price]=${price_id}" \
    -d "line_items[0][quantity]=1" \
    --submit-type pay \
    --customer-creation always \
    -d "after_completion[type]=redirect" \
    -d "after_completion[redirect][url]=${THANKS}" \
    -d "custom_text[submit][message]=${SUBMIT_MESSAGE}" \
    -d "metadata[experiment_id]=EXP-0025" \
    -d "metadata[idea_id]=IDEA-0005" \
    -d "metadata[offer_id]=OFFER-0019" \
    -d "metadata[market]=${market}" \
    -d "metadata[source]=modestambitions.studio" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print('${market}', d['id'], d['url'])"
}

create_market US usd 49500
create_market CA cad 69500
