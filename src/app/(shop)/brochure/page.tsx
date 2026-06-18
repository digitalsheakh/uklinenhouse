import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BrochureFlipbook from "@/components/brochure/BrochureFlipbook";
import { siteConfig } from "@/config/site";

const BROCHURE_URL = "/linen-house-brochure/Linen-House-brochure-2026.pdf";

export const metadata: Metadata = {
  title: `Brochure | ${siteConfig.name}`,
  description: "Browse the UK Linen House 2026 brochure — our full range of linen, towels and workwear.",
  alternates: { canonical: "/brochure" },
};

export default function BrochurePage() {
  return (
    <div className="bg-grey-50">
      <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent">
            UK Linen House · 2026
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Our Brochure
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-grey-600">
            Flip through our full range of premium linen, towels and workwear — the same quality trusted by
            hospitality businesses across the UK.
          </p>
        </div>

        <BrochureFlipbook url={BROCHURE_URL} />

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
