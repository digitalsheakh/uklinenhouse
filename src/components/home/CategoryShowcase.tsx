import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryNode } from "@/lib/data";
import Reveal from "@/components/ui/Reveal";

export default function CategoryShowcase({ categories }: { categories: CategoryNode[] }) {
  const shown = categories.slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Shop by Category
          </h2>
          <p className="mt-2 text-sm text-grey-500">Browse our full range of products</p>
        </div>
        <Link
          href="/shop"
          className="hidden items-center gap-1 text-sm font-medium text-grey-600 hover:text-foreground sm:inline-flex"
        >
          View all <ArrowUpRight size={16} />
        </Link>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((cat, i) => (
          <Reveal key={cat._id} delay={i * 0.04}>
            <Link
              href={`/shop/${cat.slug}`}
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl border border-grey-200 bg-grey-50 p-5 transition-colors hover:border-grey-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-grey-100 to-white opacity-80 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <h3 className="text-base font-medium text-foreground">{cat.name}</h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-grey-500">
                  Shop now
                  <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
