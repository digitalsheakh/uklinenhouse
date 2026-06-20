import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductCard as TProductCard } from "@/lib/data";
import ProductCard from "@/components/product/ProductCard";

/**
 * Homepage "Best Quality Products" section. Shows products marked as
 * Best Quality in the admin panel. Horizontal carousel on every screen.
 */
export default function BestQualitySection({ products }: { products: TProductCard[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Best Quality Products
        </h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm font-medium text-grey-600 hover:text-foreground"
        >
          View all <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 sm:gap-5 lg:mx-0 lg:px-0">
        {products.map((p) => (
          <div key={p._id} className="w-44 shrink-0 snap-start sm:w-52">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
