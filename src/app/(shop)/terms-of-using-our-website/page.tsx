import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms & Conditions of Using Our Website | ${siteConfig.name}`,
  description:
    "The terms and conditions that govern your use of the UK Linen House website, including permitted use, accounts, prohibited activities and liability.",
  alternates: { canonical: "/terms-of-using-our-website" },
};

export default function WebsiteTermsPage() {
  return (
    <LegalLayout
      title="Terms &amp; Conditions of Using Our Website"
      intro="These terms set out the rules for using our website. By accessing or using the site, you agree to them in full."
      updated="19 June 2026"
    >
      <p>
        These terms and conditions govern your use of the {siteConfig.name} website. By accessing the site
        you confirm that you accept these terms and that you agree to comply with them. You must be at least
        18 years old to use this website. If you do not agree, you must not use our website.
      </p>

      <h2>1. Intellectual property</h2>
      <p>
        Unless otherwise stated, we or our licensors own the copyright and all other intellectual property
        rights in the website and the material on it. All such rights are reserved.
      </p>

      <h2>2. Permitted use</h2>
      <p>You may view, download for caching purposes only, print and stream pages from the website for your own personal or business use, provided you do not:</p>
      <ul>
        <li>republish material from the website without our prior written consent;</li>
        <li>sell, rent or sub-license material from the website;</li>
        <li>reproduce, duplicate, copy or otherwise exploit material on the website for a commercial purpose;</li>
        <li>edit or otherwise modify any material on the website; or</li>
        <li>redistribute material from the website, except where expressly permitted.</li>
      </ul>

      <h2>3. Your account</h2>
      <p>
        If you create an account, you are responsible for keeping your login details confidential and for all
        activity that takes place under your account. You must notify us immediately of any unauthorised use.
        We reserve the right to suspend or cancel your account, at our discretion, without notice.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You must not use our website:</p>
      <ul>
        <li>in any way that is unlawful or fraudulent;</li>
        <li>to carry out data scraping, harvesting or any similar automated collection of data;</li>
        <li>to use automated bots, crawlers or scripts other than legitimate search-engine indexing;</li>
        <li>to transmit any malware, virus or other malicious code; or</li>
        <li>to conduct direct marketing using information collected from the website.</li>
      </ul>
      <p>You must ensure that all information you submit to us is accurate and truthful.</p>

      <h2>5. Limitation of liability</h2>
      <p>
        The website is provided &quot;as is&quot; and we make no warranties about its accuracy, completeness or
        continuous availability. To the maximum extent permitted by law, we exclude liability for any business
        losses, loss or corruption of data, or any indirect or consequential loss arising from your use of the
        website. Nothing in these terms excludes or limits our liability for death or personal injury caused by
        our negligence, or for fraud or fraudulent misrepresentation.
      </p>

      <h2>6. Breaches of these terms</h2>
      <p>
        Where you breach these terms, we may take such action as we deem appropriate, including issuing a
        warning, suspending or blocking your access to the website, deleting your account, or commencing legal
        proceedings against you.
      </p>

      <h2>7. Variation</h2>
      <p>
        We may revise these terms from time to time. The revised terms will apply to your use of the website
        from the date they are published. Please check this page regularly to ensure you are familiar with the
        current version.
      </p>

      <h2>8. Governing law</h2>
      <p>
        These terms are governed by and construed in accordance with the law of England and Wales, and any
        disputes will be subject to the jurisdiction of the courts of England and Wales.
      </p>

      <h2>9. Contact</h2>
      <p>
        If you have any questions about these terms, please contact us at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or on {siteConfig.phone}.
        {" "}{siteConfig.name} is based in Bedford, Bedfordshire, United Kingdom (company registration number
        15946655).
      </p>
    </LegalLayout>
  );
}
