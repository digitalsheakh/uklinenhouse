import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Return & Refund Policy | ${siteConfig.name}`,
  description:
    "Our return and refund policy, return windows, eligibility, how to return an item, refunds, exchanges and damaged or defective goods.",
  alternates: { canonical: "/return-and-refund-policy" },
};

export default function ReturnRefundPolicyPage() {
  return (
    <LegalLayout
      title="Return &amp; Refund Policy"
      intro="We want you to be completely satisfied with your purchase. If for any reason you are not, we are here to help."
      updated="19 June 2026"
    >
      <p>
        Thank you for shopping with {siteConfig.name}. Please read our return policy below. This policy
        sits alongside your statutory rights as a consumer, which it does not affect.
      </p>

      <h2>1. Return window</h2>
      <p>
        You have <strong>7 calendar days</strong> from the date of delivery to request a return. We are
        unable to process returns after this timeframe has expired.
      </p>

      <h2>2. Eligibility for returns</h2>
      <p>To qualify for a return, your item must:</p>
      <ul>
        <li>be unused and in the same condition as you received it, in its original packaging;</li>
        <li>include any tags, labels or accessories that came with it; and</li>
        <li>have been purchased directly from our website (not from a third-party vendor or reseller).</li>
      </ul>

      <h2>3. How to return an item</h2>
      <ol>
        <li>
          <strong>Contact us.</strong> Email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>{" "}
          with your order number, the item(s) you wish to return and the reason.
        </li>
        <li>
          <strong>Return authorisation.</strong> We will review your request and provide authorisation where
          applicable. We may request additional information or photos.
        </li>
        <li>
          <strong>Pack the item.</strong> Securely package the item in its original condition with all tags,
          accessories and packaging.
        </li>
        <li>
          <strong>Ship the item.</strong> Return the item to us using your own return label, as we do not
          provide return shipping labels. We will confirm the return address when we authorise your return.
        </li>
      </ol>

      <h2>4. Refunds</h2>
      <p>
        Once we receive and inspect your return, we will notify you whether your refund is approved. If
        approved, a credit will be applied to your original payment method, typically within 2–10 business
        days of approval.
      </p>

      <h2>5. Exchanges</h2>
      <p>
        If you need a different size or colour, please start the return process first and then place a new
        order for the item you want.
      </p>

      <h2>6. Damaged or defective items</h2>
      <p>
        If your item arrives damaged or defective, contact us immediately with your order number, photos and
        a description of the issue. We will provide instructions for returning the item at no cost to you,
        and a full refund or replacement will be processed.
      </p>

      <h2>7. Late or missing refunds</h2>
      <p>
        If you have not received a refund you are expecting, please first check with your bank or credit
        card company, as processing can take some time. If you have done this and still have not received
        your refund, contact us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>

      <h2>8. Contact us</h2>
      <p>
        Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        <br />
        Phone: {siteConfig.phone}
      </p>
    </LegalLayout>
  );
}
