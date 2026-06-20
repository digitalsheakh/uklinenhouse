import type { Metadata } from "next";
import FeatureStrip from "@/components/home/FeatureStrip";
import TopCategories from "@/components/home/TopCategories";
import FeaturedSection from "@/components/home/FeaturedSection";
import SaleSection from "@/components/home/SaleSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import OurStory from "@/components/home/OurStory";
import CustomerReviews from "@/components/home/CustomerReviews";
import Newsletter from "@/components/home/Newsletter";
import HeroSlider from "@/components/home/HeroSlider";
import CategorySidebar from "@/components/layout/CategorySidebar";
import { getCategoryTree, getHomepageProducts, getFeaturedProducts, getSaleProducts } from "@/lib/data";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name}, ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [categories, homeProducts, featured, onSale] = await Promise.all([
    getCategoryTree(),
    getHomepageProducts(8),
    getFeaturedProducts(8),
    getSaleProducts(8),
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

      {/* Trust strip */}
      <FeatureStrip />

      {/* Top categories */}
      <TopCategories />

      {/* 1. All Products */}
      <FeaturedProducts title="All Products" products={homeProducts} />

      {/* 2. On Sale (auto-hides when nothing is discounted) */}
      <SaleSection products={onSale} />

      {/* 3. Our Story (links to /about, /sustainability, /values) */}
      <OurStory />

      {/* 3. Customer Reviews */}
      <CustomerReviews />

      {/* 4. Featured Products */}
      <FeaturedSection products={featured} />

      {/* 5. Join our mailing list */}
      <Newsletter />
    </>
  );
}
