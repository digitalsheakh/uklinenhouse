import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Shared layout for legal / policy pages so they all share one clean,
 * on-brand look. Pass plain semantic HTML as children (h2, h3, p, ul, ol,
 * strong, a), the prose styles below take care of the formatting.
 */
export default function LegalLayout({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-grey-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent">
            UK Linen House · Legal
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-grey-600">{intro}</p>
          <p className="mt-2 text-xs text-grey-400">Last updated {updated}</p>
        </div>

        <div
          className="rounded-2xl border border-grey-200 bg-white p-6 text-[15px] leading-relaxed text-grey-600 sm:p-9
            [&_a]:font-medium [&_a]:text-accent hover:[&_a]:underline
            [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&>h2:first-child]:mt-0
            [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground
            [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5
            [&_p]:mt-3
            [&_strong]:font-semibold [&_strong]:text-foreground
            [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
        >
          {children}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-grey-600 hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back to Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
