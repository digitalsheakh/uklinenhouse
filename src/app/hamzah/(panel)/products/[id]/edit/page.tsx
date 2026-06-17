import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const p = await Product.findById(id).lean();
  if (!p) notFound();

  const initial: ProductFormData = {
    _id: String(p._id),
    name: p.name,
    brand: p.brand || "UK Linen House",
    description: p.description || "",
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? "",
    category: String(p.category),
    sku: p.sku || "",
    stock: p.stock ?? 0,
    images: p.images || [],
    options: (p.options || []).map((o) => ({
      name: o.name,
      values: (o.values || []).map((v) => ({ value: v.value, swatch: v.swatch || undefined })),
    })),
    variants: (p.variants || []).map((v) => ({
      options: (v.options || []).map((x) => ({ name: x.name, value: x.value })),
      price: v.price,
      compareAtPrice: v.compareAtPrice ?? "",
      stock: v.stock ?? 0,
      sku: v.sku || "",
      image: v.image || "",
    })),
    featured: !!p.featured,
    isActive: !!p.isActive,
    metaTitle: p.metaTitle || "",
    metaDescription: p.metaDescription || "",
    metaKeywords: (p.metaKeywords || []).join(", "),
  };

  return (
    <div>
      <Link href="/hamzah/products" className="mb-4 inline-flex items-center gap-1 text-sm text-grey-500 hover:text-foreground">
        <ArrowLeft size={15} /> Back to products
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Edit Product</h1>
      <ProductForm initial={initial} />
    </div>
  );
}
