/**
 * Localised pricing for the completed-work invoice exception audit.
 *
 * One table drives both the displayed price and the Stripe link, so the two can
 * never disagree. A market only becomes live once its Stripe Payment Link
 * exists; until then `resolveMarket` falls back to GB and the visitor sees the
 * GBP price with the GBP link.
 */

export type MarketCode = "GB" | "US" | "CA";

export type Market = {
  code: MarketCode;
  /** ISO currency, used in copy and in the checkout query string. */
  currency: "GBP" | "USD" | "CAD";
  /** Price as shown on the page. */
  price: string;
  /** Short label for the currency switcher. */
  switcherLabel: string;
  /** Live Stripe Payment Link, or null while the link is still to be created. */
  checkoutUrl: string | null;
};

const MARKETS: Record<MarketCode, Market> = {
  GB: {
    code: "GB",
    currency: "GBP",
    price: "£395",
    switcherLabel: "£ GBP",
    checkoutUrl: "https://buy.stripe.com/3cIfZhbaK7b9drtgef5Rm03",
  },
  US: {
    code: "US",
    currency: "USD",
    price: "$495",
    switcherLabel: "$ USD",
    checkoutUrl: "https://buy.stripe.com/00w9AT7YydzxfzB3rt5Rm04",
  },
  CA: {
    code: "CA",
    currency: "CAD",
    price: "CA$695",
    switcherLabel: "CA$ CAD",
    checkoutUrl: "https://buy.stripe.com/3cI8wP5Qq675bjl1jl5Rm05",
  },
};

export const DEFAULT_MARKET: MarketCode = "GB";

/** Markets whose Stripe link exists, in the order shown in the switcher. */
export function liveMarkets(): Market[] {
  return (["GB", "US", "CA"] as MarketCode[])
    .map((code) => MARKETS[code])
    .filter((market) => market.checkoutUrl !== null);
}

function isMarketCode(value: string): value is MarketCode {
  return value === "GB" || value === "US" || value === "CA";
}

/**
 * Pick the market for this request.
 *
 * An explicit `?market=` wins, so an outbound email can link a recipient
 * straight to their own currency. Otherwise the Cloudflare edge country
 * decides. Anything unrecognised, and any market without a live Stripe link,
 * falls back to GB.
 */
export function resolveMarket(
  countryHeader: string | null,
  requested: string | null,
): Market {
  const candidates = [requested, countryHeader];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const code = candidate.trim().toUpperCase();
    if (isMarketCode(code) && MARKETS[code].checkoutUrl !== null) {
      return MARKETS[code];
    }
  }

  return MARKETS[DEFAULT_MARKET];
}

/**
 * Checkout URL carrying the market as a query parameter, so a payment can be
 * attributed to the country that produced it without link tracking.
 */
export function checkoutUrlFor(market: Market): string {
  if (!market.checkoutUrl) return MARKETS[DEFAULT_MARKET].checkoutUrl as string;
  return `${market.checkoutUrl}?client_reference_id=EXP-0025-${market.code}`;
}
