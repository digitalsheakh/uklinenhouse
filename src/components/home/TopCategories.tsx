import Link from "next/link";

/**
 * Top-level shop categories shown as a horizontal scroller of cards,
 * using the same card chrome as the product cards for a consistent look.
 * Scrolls left↔right on every screen size; cards stay compact.
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
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Shop by Category
      </h2>

      {/* Horizontal scroller on all screens */}
      <div
        className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 [-webkit-overflow-scrolling:touch] sm:gap-5 lg:mx-0 lg:justify-center lg:px-0"
        style={{ touchAction: "pan-x pan-y" }}
      >
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            className="group flex w-32 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-grey-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:w-40"
          >
            <div className="aspect-square overflow-hidden bg-[#faf7f2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="px-2 py-3 text-center text-xs font-semibold text-foreground transition-colors group-hover:text-accent sm:text-sm">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
