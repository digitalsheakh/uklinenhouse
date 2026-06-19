import type { Metadata } from "next";
import FeatureStrip from "@/components/home/FeatureStrip";
import TopCategories from "@/components/home/TopCategories";
import FeaturedSection from "@/components/home/FeaturedSection";
import BestQualitySection from "@/components/home/BestQualitySection";
import SaleSection from "@/components/home/SaleSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSlider from "@/components/home/HeroSlider";
import CategorySidebar from "@/components/layout/CategorySidebar";
import { getCategoryTree, getSaleProducts, getHomepageProducts, getFeaturedProducts, getBestQualityProducts } from "@/lib/data";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [categories, onSale, homeProducts, featured, bestQuality] = await Promise.all([
    getCategoryTree(),
    getSaleProducts(8),
    getHomepageProducts(6),
    getFeaturedProducts(12),
    getBestQualityProducts(12),
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

      {/* Top categories (image tiles, scrolls left↔right on mobile) */}
      <TopCategories />

      {/* Featured products — admin-controlled via each product's "Featured" flag */}
      <FeaturedSection products={featured} />

      {/* On Sale — admin-controlled via each product's Compare-at price */}
      <SaleSection products={onSale} />

      {/* All Products — admin-curated via each product's "Show on homepage" flag */}
      <FeaturedProducts title="All Products" products={homeProducts} />

      {/* Best Quality — admin-controlled via each product's "Best Quality" flag */}
      <BestQualitySection products={bestQuality} />
    </>
  );
}
