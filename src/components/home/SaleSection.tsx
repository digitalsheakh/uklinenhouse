import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductCard as TProductCard } from "@/lib/data";
import ProductGrid from "@/components/product/ProductGrid";

/**
 * Homepage "On Sale" section. Shows products that have a Compare-at price
 * higher than their selling price (set per product in the admin panel).
 * The discount badge and original price are handled by ProductCard.
 */
export default function SaleSection({ products }: { products: TProductCard[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-600">
            Limited time
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            On Sale Now
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm font-medium text-grey-600 hover:text-foreground"
        >
          View all <ArrowUpRight size={16} />
        </Link>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}
