import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrochureRequestForm from "@/components/brochure/BrochureRequestForm";

export const metadata: Metadata = {
  title: `Brochure Request | ${siteConfig.name}`,
  description:
    "Request a copy of the UK Linen House product brochure by post or email.",
  alternates: { canonical: "/request-brochure" },
};

export default function RequestBrochurePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">

      {/* Page heading */}
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Brochure Request
      </h1>

      {/* Intro */}
      <p className="mt-4 text-sm leading-relaxed text-grey-600">
        Please complete the form below to receive our brochures either via the
        post or electronically via email.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-grey-600">
        Please note only business customers can receive brochures via post.
        Customers looking to purchase for home use will receive our brochures
        electronically.
      </p>

      <div className="mt-8 border-t border-grey-200 pt-8">
        <h2 className="mb-6 text-lg font-semibold text-foreground">
          Brochure Request Form
        </h2>
        <BrochureRequestForm />
      </div>
    </div>
  );
}
