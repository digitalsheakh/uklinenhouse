import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Delivery Policy | ${siteConfig.name}`,
  description:
    "Delivery information for UK Linen House — delivery areas, charges, timescales, failed deliveries and when risk in your goods passes to you.",
  alternates: { canonical: "/delivery-policy" },
};

export default function DeliveryPolicyPage() {
  return (
    <LegalLayout
      title="Delivery Policy"
      intro="Everything you need to know about how, where and when we deliver your order across the UK."
      updated="19 June 2026"
    >
      <p>
        {siteConfig.name} delivers nationwide across the UK. This policy explains our delivery charges,
        timescales and the terms that apply to delivery of your order.
      </p>

      <h2>1. Delivery charges</h2>
      <ul>
        <li>
          A flat delivery and handling charge of {siteConfig.currencySymbol}
          {siteConfig.shippingFee.toFixed(2)} applies per order.
        </li>
        <li>Free delivery on trade orders over {siteConfig.currencySymbol}150.</li>
        <li>
          All charges are shown at checkout before you confirm your order, and include VAT at the applicable
          rate.
        </li>
      </ul>

      <h2>2. Delivery areas</h2>
      <p>
        We generally deliver to addresses within England and Wales, Scotland, Northern Ireland, the Isle of
        Man and the Channel Islands. If we accept an order for delivery outside this area, you may need to
        pay import duties or other taxes, which we will not pay.
      </p>

      <h2>3. Delivery timescales</h2>
      <p>
        We will deliver your goods to the delivery location agreed at the time of your order without undue
        delay and, in any event, not more than 30 days after the day on which the contract is entered into,
        unless we agree a different period with you. We may deliver in instalments if we suffer a shortage of
        stock or for another genuine and fair reason, and you will not be charged extra for this.
      </p>

      <h2>4. Failed or missed deliveries</h2>
      <p>
        If you or your nominee fail, through no fault of ours, to take delivery of the goods at the delivery
        location, we may charge the reasonable costs of storing and re-delivering them.
      </p>

      <h2>5. Risk and ownership</h2>
      <p>
        The goods become your responsibility from the completion of delivery or your collection. Risk of
        damage to, or loss of, the goods passes to you at that point. You do not own the goods until we have
        received payment in full. Where reasonably practicable, please examine the goods before accepting
        them.
      </p>

      <h2>6. Problems with your delivery</h2>
      <p>
        If your order arrives late, damaged or incomplete, please contact us as soon as possible at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or on {siteConfig.phone} and we will put
        it right. For returns, please see our{" "}
        <a href="/return-and-refund-policy">Return &amp; Refund Policy</a>.
      </p>
    </LegalLayout>
  );
}
