import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms & Conditions for Online Shopping | ${siteConfig.name}`,
  description:
    "The terms and conditions that apply when you buy goods from UK Linen House online — orders, pricing, payment, delivery, cancellation and your consumer rights.",
  alternates: { canonical: "/terms-for-online-shopping" },
};

export default function OnlineShoppingTermsPage() {
  return (
    <LegalLayout
      title="Terms &amp; Conditions for Online Shopping"
      intro="Please read these terms carefully before placing an order. By ordering goods from us, you agree to be bound by them."
      updated="19 June 2026"
    >
      <p>
        Please read all of these terms and conditions. As we can accept your order and make a legally
        enforceable agreement without further reference to you, you must read these terms and conditions to
        make sure that they contain all that you want and nothing that you are not happy with. If you are not
        sure about anything, just phone us on {siteConfig.phone}.
      </p>

      <h2>Application</h2>
      <p>
        These Terms and Conditions apply to the purchase of goods by you (the Customer). We are{" "}
        {siteConfig.name}, a company registered in England and Wales (company registration number 15946655),
        with a trading address in Bedford, Bedfordshire, United Kingdom; email address{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>; telephone number {siteConfig.phone}{" "}
        (the Supplier, us or we). These are the terms on which we sell all goods to you. By ordering any of
        the goods, you agree to be bound by these Terms and Conditions. You may only purchase goods from the
        website if you are eligible to enter into a contract and are at least 18 years old.
      </p>

      <h2>Goods</h2>
      <p>
        The description of the goods is as set out on the website, catalogues, brochures or other form of
        advertisement. Any description is for illustrative purposes only and there may be small discrepancies
        in the size and colour of the goods supplied. In the case of any goods made to your special
        requirements, it is your responsibility to ensure that any information or specification you provide is
        accurate. All goods are subject to availability. We may make changes to the goods that are necessary
        to comply with any applicable law or safety requirement, and will notify you of these changes.
      </p>

      <h2>Basis of sale</h2>
      <p>
        The description of the goods on our website does not constitute a contractual offer to sell the goods.
        When an order has been submitted, we can reject it for any reason, although we will try to tell you the
        reason without delay. The order process is set out on the website, and each step allows you to check
        and amend any errors before submitting your order. A contract will be formed only when you receive an
        email from us confirming the order (Order Confirmation). Any quotation is valid for a maximum period of
        30 days from its date, unless we expressly withdraw it earlier.
      </p>

      <h2>Price and payment</h2>
      <p>
        The price of the goods and any additional delivery or other charges is that set out on the website at
        the date of the order, or such other price as we may agree in writing. Prices and charges include VAT
        at the rate applicable at the time of the order. You must pay by submitting your credit or debit card
        details with your order, and we can take payment immediately or otherwise before delivery of the goods.
      </p>

      <h2>Delivery</h2>
      <p>
        We will deliver the goods to the delivery location by the agreed time or within the agreed period or,
        failing any agreement, without undue delay and in any event not more than 30 days after the day on
        which the contract is entered into. The goods will become your responsibility from the completion of
        delivery or your collection. Full delivery terms — including delivery areas, charges and failed
        deliveries — are set out in our <a href="/delivery-policy">Delivery Policy</a>.
      </p>

      <h2>Risk and title</h2>
      <p>
        Risk of damage to, or loss of, any goods passes to you when the goods are delivered to you. You do not
        own the goods until we have received payment in full. If full payment is overdue, we may end any right
        you have to use the goods still owned by us, in which case you must return them or allow us to collect
        them.
      </p>

      <h2>Right to cancel</h2>
      <p>
        Subject to these Terms and Conditions, you can cancel this contract within 14 days without giving any
        reason. The cancellation period will expire after 14 days from the day on which you (or a third party,
        other than the carrier, indicated by you) acquire physical possession of the last of the goods. To
        exercise the right to cancel, you must inform us of your decision by a clear statement (for example, a
        letter sent by post or an email to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>). To
        meet the cancellation deadline, it is sufficient that you send your communication before the
        cancellation period has expired.
      </p>
      <p>The cancellation rights do not apply to certain goods, including:</p>
      <ul>
        <li>goods that are made to your specifications or are clearly personalised;</li>
        <li>goods which are liable to deteriorate or expire rapidly;</li>
        <li>sealed goods which are not suitable for return for health-protection or hygiene reasons, once unsealed after delivery; and</li>
        <li>goods which, after delivery, become mixed inseparably with other items.</li>
      </ul>

      <h2>Effects of cancellation</h2>
      <p>
        If you cancel this contract, we will reimburse all payments received from you, including the standard
        costs of delivery (except for any supplementary costs arising if you chose a more expensive type of
        delivery than the least expensive standard delivery we offer). We may make a deduction from the
        reimbursement for loss in value of any goods supplied, if the loss is the result of unnecessary
        handling by you. We will make the reimbursement without undue delay, and not later than 14 days after
        the day we receive the goods back, or (if earlier) 14 days after the day you provide evidence that you
        have returned them. We will use the same means of payment you used for the original transaction.
      </p>

      <h2>Returning goods</h2>
      <p>
        If you cancel the contract after receiving the goods, you must send them back to us, or hand them to
        us, without undue delay and in any event not later than 14 days from the day on which you communicate
        your cancellation. You agree that you will have to bear the cost of returning the goods. See our{" "}
        <a href="/return-and-refund-policy">Return &amp; Refund Policy</a> for the practical steps.
      </p>

      <h2>Conformity and guarantee</h2>
      <p>
        We have a legal duty to supply the goods in conformity with the contract. On delivery, the goods will
        be of satisfactory quality, be reasonably fit for any particular purpose you made known to us before
        the contract was made, and conform to their description. Where a manufacturer&apos;s guarantee applies,
        we will give you the benefit of it; this does not reduce your legal rights.
      </p>

      <h2>Circumstances beyond our control</h2>
      <p>
        In the event of any failure by a party because of something beyond its reasonable control, that party
        will advise the other as soon as reasonably practicable, and its obligations will be suspended so far
        as is reasonable. This does not affect your rights relating to delivery or your right to cancel.
      </p>

      <h2>Privacy</h2>
      <p>
        Your privacy is critical to us. We respect your privacy and comply with applicable data protection law
        in relation to your personal information. These Terms and Conditions should be read alongside, and are
        in addition to, our <a href="/privacy-policy">Privacy Policy</a>.
      </p>

      <h2>Excluding liability</h2>
      <p>
        We do not exclude liability for any fraudulent act or omission, or for death or personal injury caused
        by negligence or breach of our other legal obligations. Subject to this, we are not liable for any loss
        which was not reasonably foreseeable to both parties at the time the contract was made, or for any loss
        to your business, trade, craft or profession.
      </p>

      <h2>Governing law, jurisdiction and complaints</h2>
      <p>
        This contract (including any non-contractual matters) is governed by the law of England and Wales.
        Disputes can be submitted to the jurisdiction of the courts of England and Wales or, where you live in
        Scotland or Northern Ireland, the courts of Scotland or Northern Ireland respectively.
      </p>
      <p>
        We try to avoid any dispute, so we deal with complaints as follows: if you are unhappy with our service
        or product, you must contact us within 5 days from the date of delivery. We will acknowledge the issue
        as soon as possible (generally within 3 business days) and will try to resolve the dispute within a
        reasonable time frame (generally within 10 business days).
      </p>
    </LegalLayout>
  );
}
