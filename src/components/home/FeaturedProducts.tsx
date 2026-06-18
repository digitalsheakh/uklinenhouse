import Link from "next/link";
import { ArrowUpRight, PackageOpen } from "lucide-react";
import { ProductCard as TProductCard } from "@/lib/data";
import ProductGrid from "@/components/product/ProductGrid";
import Reveal from "@/components/ui/Reveal";

export default function FeaturedProducts({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle?: string;
  products: TProductCard[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal className="mb-10 flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-grey-500">{subtitle}</p>}
        <Link
          href="/shop"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-grey-600 hover:text-foreground"
        >
          View all <ArrowUpRight size={16} />
        </Link>
      </Reveal>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <Reveal className="flex flex-col items-center justify-center rounded-xl border border-dashed border-grey-300 bg-grey-50 py-16 text-center">
          <PackageOpen size={40} className="text-grey-300" />
          <p className="mt-3 text-sm font-medium text-grey-600">No products yet</p>
          <p className="mt-1 max-w-sm text-xs text-grey-400">
            Add your first products from the admin panel and they will appear here.
          </p>
        </Reveal>
      )}
    </section>
  );
}
