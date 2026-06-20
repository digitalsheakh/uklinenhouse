import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/data";
import { siteConfig } from "@/config/site";
import ProductDetail from "@/components/product/ProductDetail";
import RelatedProducts from "@/components/product/RelatedProducts";

type Props = { params: Promise<{ slug: string }> };

// SEO: uses the meta title/description/keywords set in the admin panel.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const title = product.metaTitle || `${product.name} | ${siteConfig.name}`;
  const description =
    product.metaDescription ||
    product.description?.slice(0, 300) ||
    siteConfig.description;

  return {
    title,
    description,
    keywords: product.metaKeywords,
    openGraph: {
      title,
      description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = product.category?.slug
    ? (await getProducts({ categorySlug: product.category.slug, limit: 9 }))
        .filter((p) => p.slug !== product.slug)
        .slice(0, 8)
    : [];

  return (
    <>
      <ProductDetail product={product} />
      <RelatedProducts products={related} />
    </>
  );
}

