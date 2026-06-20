import { ProductCard as TProductCard } from "@/lib/data";
import ProductCard from "./ProductCard";

/**
 * "You May Also Like" — products from the same category as the one being
 * viewed. Horizontal scroll on mobile, grid from sm up.
 */
export default function RelatedProducts({ products }: { products: TProductCard[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        You May Also Like
      </h2>
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p._id} className="w-44 shrink-0 snap-start sm:w-auto">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
