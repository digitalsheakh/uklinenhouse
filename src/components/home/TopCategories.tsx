import Link from "next/link";

/**
 * Top-level shop categories shown as a horizontal strip of image tiles,
 * just under the trust strip on the homepage. Each tile links to its
 * category listing page (/shop/<slug>).
 * On mobile the strip scrolls left↔right; on desktop it centres in one row.
 */
const categories = [
  { name: "Kitchen Linen", slug: "kitchen-linen", image: "/category-image/linen-house-kitchen-cloth-image.png" },
  { name: "Table Linen", slug: "table-linen", image: "/category-image/linen-house-table-linen-image.png" },
  { name: "Bath Linen", slug: "bath-linen", image: "/category-image/linen-house-bath-linen-image.png" },
  { name: "Bed Linen", slug: "bed-linen", image: "/category-image/linen-house-bed-linen-image.png" },
  { name: "Work Wear", slug: "work-wear", image: "/category-image/linen-house-work-wear-image.png" },
];

export default function TopCategories() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12">
      <h2 className="mb-6 text-center text-xl font-semibold tracking-tight text-foreground sm:mb-8 sm:text-2xl md:text-3xl">
        Shop by Category
      </h2>

      {/* Horizontal scroller — scrolls left↔right on mobile, centres on desktop */}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 sm:gap-10 md:gap-12 lg:mx-0 lg:justify-center lg:px-0">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            className="group flex shrink-0 snap-start flex-col items-center"
          >
            <div className="h-32 w-32 overflow-hidden rounded-3xl bg-[#faf7f2] ring-1 ring-black/5 transition-shadow duration-300 group-hover:shadow-lg sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-52 lg:w-52">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="mt-3 text-center text-sm font-medium text-foreground transition-colors group-hover:text-accent sm:mt-4 sm:text-base md:text-lg">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
