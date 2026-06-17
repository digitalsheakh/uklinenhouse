import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * Brand logo: the "LH" monogram + wordmark.
 * Logo image lives at /public/linen-house-logo.png.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <Image
        src="/linen-house-logo.png"
        alt={siteConfig.name}
        width={66}
        height={44}
        priority
        className="h-11 w-auto object-contain"
      />
      <span className="hidden sm:flex flex-col leading-none">
        <span className="text-base font-semibold tracking-[0.18em] text-foreground">
          UK LINEN
        </span>
        <span className="text-[0.6rem] font-medium tracking-[0.42em] text-grey-500">
          H O U S E
        </span>
      </span>
    </Link>
  );
}
