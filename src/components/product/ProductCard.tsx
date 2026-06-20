import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { ProductCard as TProductCard } from "@/lib/data";
import { formatPrice, formatPriceRange } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";

/**
 * Single, consistent product card used everywhere (grids and carousels).
 * Framed image, name, price, and an add-to-cart button. A full-card link
 * overlay handles navigation without nesting links inside the button.
 */
export default function ProductCard({ product }: { product: TProductCard }) {
  const discounted = !!product.compareAtPrice && product.compareAtPrice > product.price;
  const percent = discounted
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-grey-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-white">
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

        {discounted && (
          <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-1 text-[11px] font-bold leading-none text-white shadow-sm">
            -{percent}%
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-medium leading-snug text-foreground line-clamp-2">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-red-700">
            {formatPriceRange(product.price, product.priceMax)}
          </span>
          {discounted && (
            <span className="text-sm text-grey-400 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {/* Add to cart sits above the card overlay */}
        <div className="relative z-10 mt-4">
          <AddToCartButton product={product} />
        </div>
      </div>

      {/* Full-card click target (under the button) */}
      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0" aria-label={product.name} />
    </div>
  );
}
