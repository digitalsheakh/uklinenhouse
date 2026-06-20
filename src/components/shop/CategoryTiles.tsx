import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import type { CategoryTile } from "@/lib/data";

/**
 * Subcategory tile grid shown at the top of a parent-category listing
 * (e.g. /shop/bed-linen shows Duvets, Flat Bed Sheets, Pillow Cases).
 * Each tile links to its own listing page.
 */
export default function CategoryTiles({
  parentSlug,
  parentName,
  tiles,
}: {
  parentSlug: string;
  parentName: string;
  tiles: CategoryTile[];
}) {
  if (tiles.length === 0) return null;

  return (
    <section className="mb-10">
      <header className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          Shop {parentName}
        </h2>
        <span className="text-xs uppercase tracking-wider text-grey-400">
          {tiles.length} {tiles.length === 1 ? "category" : "categories"}
        </span>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t._id}
            href={`/shop/${parentSlug}/${t.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-grey-300 hover:shadow-md"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#faf7f2]">
              {t.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.image}
                  alt={t.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-grey-300">
                  <ImageIcon size={32} />
                </div>
              )}
            </div>

            {/* Copy */}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                {t.name}
              </h3>
              {t.description && (
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-grey-500 line-clamp-3">
                  {t.description}
                </p>
              )}
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                Shop {t.name}
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
