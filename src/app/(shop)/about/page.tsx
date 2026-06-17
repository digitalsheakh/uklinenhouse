import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${siteConfig.name} — premium linen, towels and workwear supplier in the UK.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">About {siteConfig.name}</h1>
      <div className="mt-6 space-y-4 text-grey-600 leading-relaxed">
        <p>
          {siteConfig.name} is a trusted UK supplier of premium linen, towels, bags and workwear.
          We supply hospitality businesses, restaurants, hotels and homes with quality products at
          competitive prices.
        </p>
        <p>
          From cotton wet towels and table linen to bath and bed linen, our range is built for
          durability and comfort. Trade and wholesale customers can register for a dedicated
          account and price list.
        </p>
        <p>This page is easy to edit — update the copy in <code className="font-mono text-sm">src/app/(shop)/about/page.tsx</code>.</p>
      </div>
    </div>
  );
}
