import Link from "next/link";
import { Palette, ShoppingBag } from "lucide-react";
import { ProductCard as TProductCard } from "@/lib/data";
import { formatPriceRange } from "@/lib/utils";

/**
 * Homepage "Best Quality Products" section. Shows products marked as
 * Best Quality in the admin panel (Best Quality page). Simple retail-style
 * cards: image, name, price.
 */
function QualityCard({ product }: { product: TProductCard }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex w-60 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-grey-200 bg-white transition-shadow duration-300 hover:shadow-md sm:w-64"
    >
      <div className="aspect-[4/5] overflow-hidden bg-white">
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-grey-300">
            <ShoppingBag size={40} strokeWidth={1.2} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-medium leading-snug text-foreground line-clamp-2">{product.name}</h3>

        {product.hasVariants && (
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-grey-500">
            <Palette size={13} /> More options available
          </span>
        )}

        <p className="mt-auto pt-3 text-lg font-bold text-red-700">
          {formatPriceRange(product.price, product.priceMax)}
        </p>
      </div>
    </Link>
  );
}

export default function BestQualitySection({ products }: { products: TProductCard[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Best Quality Products
        </h2>
      </div>

      {/* Horizontal carousel — scrolls left↔right on all screens */}
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 sm:gap-5 lg:mx-0 lg:px-0">
        {products.map((p) => (
          <QualityCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
