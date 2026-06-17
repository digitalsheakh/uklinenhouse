import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, PackageOpen } from "lucide-react";
import { getCategoryBySlug, getCategoryTree, getProducts } from "@/lib/data";
import { siteConfig } from "@/config/site";
import CategorySidebar from "@/components/layout/CategorySidebar";
import ProductGrid from "@/components/product/ProductGrid";
import ShopToolbar from "@/components/shop/ShopToolbar";

type Props = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ q?: string; sort?: string }>;
};

function activeSlug(slug?: string[]) {
  return slug && slug.length ? slug[slug.length - 1] : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catSlug = activeSlug(slug);
  if (catSlug) {
    const cat = await getCategoryBySlug(catSlug);
    if (cat) {
      return {
        title: cat.metaTitle || `${cat.name} | ${siteConfig.name}`,
        description: cat.metaDescription || `Shop ${cat.name} at ${siteConfig.name}.`,
      };
    }
  }
  return { title: `Shop All Products | ${siteConfig.name}` };
}

export default async function ShopPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { q, sort } = await searchParams;
  const catSlug = activeSlug(slug);

  const [categories, category, products] = await Promise.all([
    getCategoryTree(),
    catSlug ? getCategoryBySlug(catSlug) : Promise.resolve(null),
    getProducts({
      categorySlug: catSlug,
      search: q,
      sort: (sort as "newest" | "price-asc" | "price-desc") || "newest",
    }),
  ]);

  const heading = q
    ? `Search results for “${q}”`
    : category
    ? category.name
    : "All Products";

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-grey-400">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        {category?.parentName && category.parentSlug && (
          <>
            <ChevronRight size={12} />
            <Link href={`/shop/${category.parentSlug}`} className="hover:text-foreground">
              {category.parentName}
            </Link>
          </>
        )}
        {category && (
          <>
            <ChevronRight size={12} />
            <span className="text-grey-600">{category.name}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar (collapsible on listing pages) */}
        <div className="hidden lg:block">
          <CategorySidebar categories={categories} collapsible />
        </div>

        {/* Main */}
        <div className="flex-1">
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">{heading}</h1>
          {category?.description && (
            <p className="mb-4 max-w-2xl text-sm text-grey-500">{category.description}</p>
          )}
          <div className="mt-4">
            <ShopToolbar count={products.length} />
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-grey-300 bg-grey-50 py-20 text-center">
                <PackageOpen size={40} className="text-grey-300" />
                <p className="mt-3 text-sm font-medium text-grey-600">No products found</p>
                <p className="mt-1 max-w-sm text-xs text-grey-400">
                  {q ? "Try a different search term." : "Products added here will appear in this category."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
