import type { Metadata } from "next";
import FeatureStrip from "@/components/home/FeatureStrip";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandStory from "@/components/home/BrandStory";
import WarehousePromo from "@/components/home/WarehousePromo";
import HeroSlider from "@/components/home/HeroSlider";
import CategorySidebar from "@/components/layout/CategorySidebar";
import { getCategoryTree, getSaleProducts, getLatestProducts } from "@/lib/data";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [categories, onSale, latest] = await Promise.all([
    getCategoryTree(),
    getSaleProducts(8),
    getLatestProducts(8),
  ]);

  return (
    <>
      {/* Sidebar + hero slider */}
      <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <div className="flex gap-6">
          <div className="hidden lg:block">
            <CategorySidebar categories={categories} collapsible={false} />
          </div>
          <div className="flex-1">
            <HeroSlider />
          </div>
        </div>
      </section>

      {/* Trust strip (under header) */}
      <FeatureStrip />

      {/* On Sale — only shown when there are discounted products */}
      {onSale.length > 0 && (
        <FeaturedProducts title="On Sale" subtitle="Limited-time offers" products={onSale} />
      )}

      {/* All Products */}
      <FeaturedProducts
        title="All Products"
        subtitle="Browse our latest range"
        products={latest}
      />

      {/* Brand story */}
      <BrandStory />

      {/* UK warehouse */}
      <WarehousePromo />
    </>
  );
}
