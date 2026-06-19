import { connectDB } from "./db";
import { Category } from "./models/Category";
import { Product } from "./models/Product";
import { seedCategories, SeedCategory } from "./seed-data";
import { slugify } from "./utils";

export interface CategoryNode {
  _id: string;
  name: string;
  slug: string;
  children: CategoryNode[];
}

export interface ProductCard {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  priceMax?: number;
  compareAtPrice?: number;
  images: string[];
  hasVariants: boolean;
  categoryName?: string;
}

/** Build the fallback tree from seed data (used if the DB is empty/offline). */
function fallbackTree(): CategoryNode[] {
  const map = (c: SeedCategory): CategoryNode => ({
    _id: slugify(c.name),
    name: c.name,
    slug: slugify(c.name),
    children: (c.children || []).map(map),
  });
  return seedCategories.map(map);
}

/**
 * Returns the category tree (top-level categories with nested children).
 * Falls back to the seed data if the database is unavailable or empty.
 */
export async function getCategoryTree(): Promise<CategoryNode[]> {
  try {
    await connectDB();
    const all = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    if (!all.length) return fallbackTree();

    const byId = new Map<string, CategoryNode>();
    all.forEach((c) =>
      byId.set(String(c._id), {
        _id: String(c._id),
        name: c.name,
        slug: c.slug,
        children: [],
      })
    );

    const roots: CategoryNode[] = [];
    all.forEach((c) => {
      const node = byId.get(String(c._id))!;
      if (c.parent && byId.has(String(c.parent))) {
        byId.get(String(c.parent))!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  } catch (err) {
    console.warn("[data] getCategoryTree falling back to seed data:", (err as Error).message);
    return fallbackTree();
  }
}

/** Get featured products for the homepage. */
export async function getFeaturedProducts(limit = 8): Promise<ProductCard[]> {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true, featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return products.map((p) => toCard(p as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
}

/** Get "best quality" products for the homepage (admin-curated). */
export async function getBestQualityProducts(limit = 8): Promise<ProductCard[]> {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true, bestQuality: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return products.map((p) => toCard(p as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
}

/** Get the admin-curated "All Products" selection for the homepage. */
export async function getHomepageProducts(limit = 6): Promise<ProductCard[]> {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true, showOnHomepage: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return products.map((p) => toCard(p as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
}

/** Get latest products. */
export async function getLatestProducts(limit = 8): Promise<ProductCard[]> {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return products.map((p) => toCard(p as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
}

export interface CategoryInfo {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  parentName?: string;
  parentSlug?: string;
}

/** Look up a category by slug (for listing page headers & breadcrumbs). */
export async function getCategoryBySlug(slug: string): Promise<CategoryInfo | null> {
  try {
    await connectDB();
    const cat = await Category.findOne({ slug, isActive: true }).lean();
    if (!cat) return null;
    let parentName: string | undefined;
    let parentSlug: string | undefined;
    if (cat.parent) {
      const parent = await Category.findById(cat.parent).lean();
      if (parent) {
        parentName = parent.name;
        parentSlug = parent.slug;
      }
    }
    return {
      _id: String(cat._id),
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      metaTitle: cat.metaTitle,
      metaDescription: cat.metaDescription,
      parentName,
      parentSlug,
    };
  } catch {
    return null;
  }
}

/** List products for a listing page: by category slug and/or search, with sorting. */
export async function getProducts(opts: {
  categorySlug?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  limit?: number;
}): Promise<ProductCard[]> {
  try {
    await connectDB();
    const filter: Record<string, unknown> = { isActive: true };

    if (opts.categorySlug) {
      const cat = await Category.findOne({ slug: opts.categorySlug }).lean();
      if (!cat) return [];
      // include the category itself plus any of its subcategories
      const childIds = await Category.find({ parent: cat._id }).distinct("_id");
      filter.category = { $in: [cat._id, ...childIds] };
    }

    if (opts.search) {
      filter.$or = [
        { name: { $regex: opts.search, $options: "i" } },
        { description: { $regex: opts.search, $options: "i" } },
      ];
    }

    const sortMap = {
      newest: { createdAt: -1 as const },
      "price-asc": { price: 1 as const },
      "price-desc": { price: -1 as const },
    };
    const sort = sortMap[opts.sort || "newest"];

    const products = await Product.find(filter)
      .sort(sort)
      .limit(opts.limit || 60)
      .lean();
    return products.map((p) => toCard(p as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
}

export interface FullProduct {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number;
  priceMax?: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  options: { name: string; values: { value: string; swatch?: string }[] }[];
  variants: {
    _id: string;
    options: { name: string; value: string }[];
    price: number;
    compareAtPrice?: number;
    stock: number;
    sku?: string;
    image?: string;
  }[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  category?: { name: string; slug: string };
}

/** Fetch a single active product by slug (for the product page). */
export async function getProductBySlug(slug: string): Promise<FullProduct | null> {
  try {
    await connectDB();
    const p = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .lean();
    if (!p) return null;

    const cat = p.category as unknown as { name?: string; slug?: string } | null;
    return {
      _id: String(p._id),
      name: p.name,
      slug: p.slug,
      brand: p.brand || "UK Linen House",
      description: p.description || "",
      price: p.price,
      priceMax: p.priceMax,
      compareAtPrice: p.compareAtPrice,
      images: p.images || [],
      stock: p.stock ?? 0,
      options: (p.options || []).map((o) => ({
        name: o.name,
        values: (o.values || []).map((v) => ({ value: v.value, swatch: v.swatch || undefined })),
      })),
      variants: (p.variants || []).map((v) => ({
        _id: String(v._id),
        options: (v.options || []).map((x) => ({ name: x.name, value: x.value })),
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        stock: v.stock ?? 0,
        sku: v.sku || undefined,
        image: v.image || undefined,
      })),
      metaTitle: p.metaTitle || undefined,
      metaDescription: p.metaDescription || undefined,
      metaKeywords: p.metaKeywords || undefined,
      category: cat?.name && cat?.slug ? { name: cat.name, slug: cat.slug } : undefined,
    };
  } catch {
    return null;
  }
}

/** Products on sale (have a compare-at price higher than the price). */
export async function getSaleProducts(limit = 8): Promise<ProductCard[]> {
  try {
    await connectDB();
    const products = await Product.find({
      isActive: true,
      compareAtPrice: { $gt: 0 },
      $expr: { $gt: ["$compareAtPrice", "$price"] },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return products.map((p) => toCard(p as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
}

function toCard(p: Record<string, unknown>): ProductCard {
  return {
    _id: String(p._id),
    name: p.name as string,
    slug: p.slug as string,
    brand: (p.brand as string) || "UK Linen House",
    price: p.price as number,
    priceMax: p.priceMax as number | undefined,
    compareAtPrice: p.compareAtPrice as number | undefined,
    images: (p.images as string[]) || [],
    hasVariants: Array.isArray(p.variants) && (p.variants as unknown[]).length > 0,
  };
}
