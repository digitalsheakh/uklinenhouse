import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description:
    "How UK Linen House collects, uses, stores and protects your personal data, your rights under UK GDPR, and how we use cookies.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      intro="We respect your privacy and are committed to protecting your personal data. This policy explains what we collect, why, and the choices you have."
      updated="19 June 2026"
    >
      <p>
        This Privacy Policy describes how {siteConfig.name} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
        collects and processes personal data about visitors to our website and customers of our services.
        We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
      </p>

      <h2>1. Information we collect</h2>
      <p>Depending on how you use our website and services, we may process:</p>
      <ul>
        <li><strong>Usage data</strong> — information about how you use our website and services.</li>
        <li><strong>Account data</strong> — details you provide when registering an account.</li>
        <li><strong>Profile data</strong> — information included in your profile.</li>
        <li><strong>Enquiry &amp; correspondence data</strong> — information contained in any enquiry or message you send us.</li>
        <li><strong>Customer relationship data</strong> — information about our relationship with you.</li>
        <li><strong>Transaction data</strong> — details of purchases, payments and orders.</li>
      </ul>

      <h2>2. How we use your information</h2>
      <p>We process your personal data to:</p>
      <ul>
        <li>operate our website and provide our products and services;</li>
        <li>analyse the use of our website and services to improve them;</li>
        <li>process and fulfil your orders, and take payment;</li>
        <li>manage our relationship with you and respond to your enquiries;</li>
        <li>ensure the security of our website and business; and</li>
        <li>comply with our legal and regulatory obligations.</li>
      </ul>

      <h2>3. Legal basis for processing</h2>
      <p>
        We rely on one or more of the following lawful bases: performance of a contract with you, your
        consent, our legitimate interests in operating and improving our business, and compliance with our
        legal obligations.
      </p>

      <h2>4. Retention</h2>
      <p>
        We keep your personal data only for as long as is necessary for the purposes set out above. As a
        general rule, personal data and account information will be retained for a minimum period of 3 years
        and for a maximum period of 10 years, unless we are required to keep it longer to meet a legal
        obligation.
      </p>

      <h2>5. Cookies</h2>
      <p>
        Our website uses cookies and similar technologies for authentication, personalisation, security,
        advertising and analysis. We use Google Analytics to help us understand how our website is used.
        You can manage or disable cookies through your browser settings, though some features of the site
        may not work correctly as a result.
      </p>

      <h2>6. Sharing your information</h2>
      <p>
        We do not sell your personal data. We may share it with trusted service providers (such as payment
        processors, delivery partners and IT providers) who act on our behalf, and with authorities where
        required by law.
      </p>

      <h2>7. Your rights</h2>
      <p>Under data protection law, you have the right to:</p>
      <ul>
        <li>access the personal data we hold about you;</li>
        <li>have inaccurate data rectified;</li>
        <li>have your data erased in certain circumstances;</li>
        <li>restrict or object to our processing of your data;</li>
        <li>data portability; and</li>
        <li>lodge a complaint with the Information Commissioner&apos;s Office (ICO) or another supervisory authority.</li>
      </ul>

      <h2>8. Contact us</h2>
      <p>
        If you have any questions about this Privacy Policy or wish to exercise your rights, please contact
        us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or by phone on {siteConfig.phone}.
        {siteConfig.name} is a family-run business based in Bedford, Bedfordshire, United Kingdom (company
        registration number 15946655).
      </p>
    </LegalLayout>
  );
}
