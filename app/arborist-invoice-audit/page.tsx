import type { Metadata } from "next";
import { headers } from "next/headers";
import { checkoutUrlFor, liveMarkets, resolveMarket } from "./pricing";

export const metadata: Metadata = {
  title: "Completed-work invoice exception audit | Modest Ambitions",
  description:
    "A fixed-scope, read-only audit for commercial arboricultural contractors who need to find completed work that may not have reached invoicing. Refunded in full if it finds nothing worth acting on.",
};

export default async function ArboristInvoiceAudit({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [requestHeaders, params] = await Promise.all([headers(), searchParams]);

  const requestedMarket = params.market;
  const market = resolveMarket(
    requestHeaders.get("cf-ipcountry"),
    typeof requestedMarket === "string" ? requestedMarket : null,
  );
  const checkoutUrl = checkoutUrlFor(market);
  const otherMarkets = liveMarkets().filter((m) => m.code !== market.code);

  return (
    <main className="offer-page">
      <p className="crumbs">
        <a href="/">Modest Ambitions</a> / Completed-work invoice audit
      </p>

      <header className="offer-header">
        <p className="eyebrow">For commercial tree-care contractors</p>
        <h1>Find completed tree work that never reached an invoice</h1>
        <p className="lede">
          Crews finish the job. The paperwork moves between a job-management
          system, a diary and an accounts package. Some of that work quietly
          stops before it is billed. We compare one bounded sample of your
          accepted work, completion evidence and invoice records, then send back
          a short register of the jobs that do not line up.
        </p>
      </header>

      <section className="offer-card" aria-labelledby="audit-price">
        <div>
          <p className="price" id="audit-price">
            {market.price} <span>fixed price, {market.currency}</span>
          </p>
          <p>
            One business, one agreed period, up to 250 job records and the
            matching invoice export. No subscription. Nothing to install.
          </p>
        </div>
        <a className="checkout-button" href={checkoutUrl}>
          Purchase the audit
        </a>
        <p className="guarantee-line">
          <strong>100% money-back guarantee.</strong> Read the register. If it
          does not show you anything worth acting on, reply and say so, and we
          refund the full {market.price}. You keep the register. There is no
          form and no time limit.
        </p>
        <p className="small-print">
          Secure checkout by Stripe. We never see your card details.{" "}
          {otherMarkets.length > 0 && (
            <>
              Paying from another country?{" "}
              {otherMarkets.map((m, index) => (
                <span key={m.code}>
                  {index > 0 && " · "}
                  <a href={`?market=${m.code}`}>{m.switcherLabel}</a>
                </span>
              ))}
            </>
          )}
        </p>
      </section>

      <ul className="reassurance">
        <li>Read-only. We change nothing in your systems.</li>
        <li>No call, no demo, no meeting.</li>
        <li>We never contact your customers.</li>
        <li>Your files are deleted 30 days after delivery.</li>
      </ul>

      <div className="offer-grid">
        <section>
          <h2>What we check</h2>
          <ul>
            <li>Accepted or completed work with no clear invoice match</li>
            <li>Invoice records with ambiguous job or completion references</li>
            <li>
              Work added to a job after the original quote that does not appear
              on the invoice
            </li>
            <li>Completion evidence that appears to have stalled before billing</li>
          </ul>
        </section>

        <section>
          <h2>What you receive</h2>
          <ul>
            <li>A source-linked CSV exception register</li>
            <li>A one-page note explaining the checks and the uncertain cases</li>
            <li>Delivery within three working days of receiving clean exports</li>
            <li>A direct reply address for questions about any single row</li>
          </ul>
        </section>
      </div>

      <section>
        <h2>What the register looks like</h2>
        <p>
          Every row points back to the record it came from, so your office
          manager can check it in a few seconds and either bill it or dismiss
          it.
        </p>
        <div className="sample-table">
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Completed</th>
                <th>Work</th>
                <th>Exception</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>JOB-1042</td>
                <td>14 Mar</td>
                <td>Crown reduction, 3 limes</td>
                <td>Signed off, no invoice found in period</td>
                <td>High</td>
              </tr>
              <tr>
                <td>JOB-1119</td>
                <td>02 Apr</td>
                <td>Emergency storm callout</td>
                <td>Two site visits recorded, one invoiced</td>
                <td>Medium</td>
              </tr>
              <tr>
                <td>JOB-0987</td>
                <td>27 Feb</td>
                <td>Stump grinding, added on site</td>
                <td>Added after quote, absent from invoice</td>
                <td>High</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small-print">
          Illustrative layout using invented jobs. It is not data from a client.
        </p>
      </section>

      <section className="founder">
        <h2>Who you are buying from</h2>
        <p>
          I am Duarte. I run Modest Ambitions, a one-person studio trading as
          Administrative Burden Ltd, registered in England and Wales at 71-75
          Shelton Street, London WC2H 9JQ. The company number is{" "}
          <a href="https://find-and-update.company-information.service.gov.uk/company/17363389">
            17363389
          </a>
          , and you can check it on the public register before you send me
          anything. The audit is done by me, and the reply to your email comes
          from me.
        </p>
        <p>
          This audit is new, and I am not going to pretend otherwise. There are
          no customer logos on this page because I am not going to invent them.
          What I can offer instead is the arrangement above: a fixed price, a
          bounded scope, a named person, and a refund you can claim by replying
          to an email. If the work is worth paying for, the register will show
          it, and if it is not, you have lost nothing.
        </p>
      </section>

      <section>
        <h2>What we need from you</h2>
        <p>
          A spreadsheet or export of accepted and completed work for the agreed
          period, plus the matching invoice export. Completion references are
          optional. Job values and dates are useful. Customer names, addresses
          and phone numbers are not, and you are welcome to strip them before
          sending.
        </p>
        <p>
          Please do not email customer files. After purchase we agree the
          minimum data needed and a secure transfer method first.
        </p>
      </section>

      <section>
        <h2>Boundaries</h2>
        <p>
          This is a read-only operational check. It does not include accounting
          advice, debt collection, customer contact, changes to your systems or
          a conclusion that an invoice is legally due. Your team makes the final
          decision on every flagged record.
        </p>
      </section>

      <section>
        <h2>Common questions</h2>

        <h3>My bookkeeper already reconciles everything.</h3>
        <p>
          Then this should come back nearly empty, and you get your money back.
          Bookkeeping reconciles invoices against payments. This compares
          completed work against invoices, which is a different direction and
          the one where jobs go missing.
        </p>

        <h3>We use a job-management system that handles invoicing.</h3>
        <p>
          Most of the gaps we look for happen at the edges of that system: work
          added on site, jobs closed by a crew rather than the office, callouts
          logged in a different place. If the system caught all of it, the
          register will be short.
        </p>

        <h3>I do not want to send my data to a stranger.</h3>
        <p>
          Reasonable. Send one month rather than a year, strip customer
          identifiers first, and use the transfer method we agree after
          purchase. The audit works on job references, dates and amounts.
        </p>

        <h3>How long does it take on my side?</h3>
        <p>
          Two exports and one email. Most of the elapsed time is on my side, not
          yours.
        </p>

        <h3>What if the exports are messy?</h3>
        <p>
          Messy is normal. If they are unusable, I will say so before starting
          and refund you rather than guess.
        </p>
      </section>

      <section className="offer-faq">
        <h2>Questions before paying?</h2>
        <p>
          Email{" "}
          <a href="mailto:hello@modestambitions.studio">
            hello@modestambitions.studio
          </a>{" "}
          with the approximate number of job records and the systems you use. No
          call is required, and you will get an answer from a person.
        </p>
      </section>

      <hr />
      <footer>
        <em>
          Modest Ambitions is a trading name of Administrative Burden Ltd,
          registered in England and Wales, company number{" "}
          <a href="https://find-and-update.company-information.service.gov.uk/company/17363389">
            17363389
          </a>
          , at 71-75 Shelton Street, Covent Garden, London WC2H 9JQ.
        </em>
        <br />
        Copyright © 2026 Administrative Burden Ltd
      </footer>
    </main>
  );
}
