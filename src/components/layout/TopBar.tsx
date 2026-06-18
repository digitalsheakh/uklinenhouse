import Link from "next/link";
import { BookOpen, Truck, Tag } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * Slim top bar above the header: announcement + quick links
 * (Download brochure, Track order, Wholesale pricing).
 */
export default function TopBar() {
  return (
    <div className="bg-grey-900 text-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6">
        <p className="hidden truncate text-grey-300 sm:block">{siteConfig.topBar.message}</p>

        <div className="flex flex-1 items-center justify-between gap-4 sm:flex-none sm:justify-end">
          <Link
            href="/brochure"
            className="inline-flex items-center gap-1.5 text-grey-200 transition-colors hover:text-white"
          >
            <BookOpen size={14} /> <span className="hidden xs:inline sm:inline">View Brochure</span>
            <span className="xs:hidden sm:hidden">Brochure</span>
          </Link>

          <Link
            href="/track-order"
            className="inline-flex items-center gap-1.5 text-grey-200 transition-colors hover:text-white"
          >
            <Truck size={14} /> Track Order
          </Link>

          <Link
            href="/wholesale"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-semibold text-grey-900 transition-colors hover:bg-grey-200"
          >
            <Tag size={13} /> Wholesale Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
