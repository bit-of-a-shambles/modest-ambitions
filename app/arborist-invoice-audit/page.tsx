import type { Metadata } from "next";

const checkoutUrl = "https://buy.stripe.com/3cIfZhbaK7b9drtgef5Rm03";

export const metadata: Metadata = {
  title: "Completed-work invoice exception audit | Modest Ambitions",
  description:
    "A fixed-scope, read-only audit for commercial arboricultural contractors who need to find completed work that may not have reached invoicing.",
};

export default function ArboristInvoiceAudit() {
  return (
    <main className="offer-page">
      <p className="crumbs">
        <a href="/">Modest Ambitions</a> / Completed-work invoice audit
      </p>

      <header className="offer-header">
        <p className="eyebrow">For commercial tree-care contractors</p>
        <h1>Find completed tree work that may not have reached invoicing</h1>
        <p className="lede">
          We compare one bounded sample of accepted work, completion evidence
          and invoice records, then return a short exception register for your
          team to review. Your job-management and accounting systems stay in
          place.
        </p>
      </header>

      <section className="offer-card" aria-labelledby="audit-price">
        <div>
          <p className="price" id="audit-price">
            £395 <span>fixed price</span>
          </p>
          <p>
            One business, one agreed period, up to 250 job records and the
            matching invoice export.
          </p>
        </div>
        <a className="checkout-button" href={checkoutUrl}>
          Purchase the audit
        </a>
        <p className="small-print">
          Secure checkout by Stripe. The service is priced in GBP; checkout may
          show a local-currency amount. We will confirm the sample and transfer
          method before asking for files.
        </p>
      </section>

      <div className="offer-grid">
        <section>
          <h2>What we check</h2>
          <ul>
            <li>Accepted or completed work with no clear invoice match</li>
            <li>Invoice records with ambiguous job or completion references</li>
            <li>Completion evidence that appears to have stalled before billing</li>
          </ul>
        </section>

        <section>
          <h2>What you receive</h2>
          <ul>
            <li>A source-linked CSV exception register</li>
            <li>A one-page note explaining the checks and uncertain cases</li>
            <li>Delivery within three working days of receiving clean exports</li>
          </ul>
        </section>
      </div>

      <section>
        <h2>What we need</h2>
        <p>
          A spreadsheet or export of accepted and completed work for the agreed
          period, plus the matching invoice export. Completion references are
          optional. Please do not email customer files or sensitive records;
          after purchase we will agree the minimum data needed and a secure
          transfer method.
        </p>
      </section>

      <section>
        <h2>Boundaries</h2>
        <p>
          This is a read-only operational check. It does not include accounting
          advice, debt collection, customer contact, changes to your systems or
          a conclusion that an invoice is legally due. Your team makes the
          final decision on every flagged record.
        </p>
      </section>

      <section className="offer-faq">
        <h2>Questions before paying?</h2>
        <p>
          Email <a href="mailto:hello@modestambitions.studio">hello@modestambitions.studio</a>{" "}
          with the approximate number of job records and the systems you use.
          No call is required.
        </p>
      </section>

      <hr />
      <footer>
        <em>
          Modest Ambitions is a trading name of Administrative Burden Ltd,
          registered in England and Wales.
        </em>
        <br />
        Copyright © 2026 Administrative Burden Ltd
      </footer>
    </main>
  );
}
