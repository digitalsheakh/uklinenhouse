import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BrochureFlipbook from "@/components/brochure/BrochureFlipbook";
import { siteConfig } from "@/config/site";

const REPORT_URL = "/compliance-report/Safety-Assessment-Report.pdf";

export const metadata: Metadata = {
  title: `Compliance & Safety Report | ${siteConfig.name}`,
  description:
    "Read the UK Linen House safety assessment and compliance report, independently verified standards behind our linen, towels and workwear, trusted by UK hospitality.",
  alternates: { canonical: "/compliance-report" },
};

export default function ComplianceReportPage() {
  return (
    <div className="bg-grey-50">
      <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent">
            UK Linen House · Quality & Safety
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Compliance & Safety Report
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-grey-600">
            Flip through our independent safety assessment, the standards and testing that back the
            quality trusted by hospitality businesses across the UK.
          </p>
        </div>

        <BrochureFlipbook url={REPORT_URL} label="report" />

        <div className="mt-12 text-center">
          <Link
            href="/wholesale"
            className="inline-flex items-center gap-2 text-sm font-medium text-grey-600 hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back to Trade & Wholesale
          </Link>
        </div>
      </div>
    </div>
  );
}
