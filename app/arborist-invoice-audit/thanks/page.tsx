import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit purchased | Modest Ambitions",
  description: "Next steps for the completed-work invoice exception audit.",
};

export default function ArboristInvoiceAuditThanks() {
  return (
    <main className="offer-page confirmation-page">
      <p className="crumbs">
        <a href="/">Modest Ambitions</a> / Payment received
      </p>
      <p className="eyebrow">Payment received</p>
      <h1>Thank you. We will confirm the sample before you send files.</h1>
      <p className="lede">
        We will write to the email address used at checkout within one business
        day. The message will confirm the period, record limit and secure
        transfer method.
      </p>
      <div className="notice">
        <strong>Please do not email customer files.</strong> If you have not
        heard from us after one business day, contact{" "}
        <a href="mailto:hello@modestambitions.studio">hello@modestambitions.studio</a>.
      </div>
      <p>
        <a href="/arborist-invoice-audit/">Return to the audit description</a>
      </p>
    </main>
  );
}
