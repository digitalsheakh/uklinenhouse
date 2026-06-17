import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { getAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import { computePricing } from "@/lib/pricing";

type Params = { params: Promise<{ id: string }> };

// GET: single product (admin edit form)
export async function GET(req: NextRequest, { params }: Params) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product: { ...product, _id: String(product._id) } });
}

// PUT: update product
export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = productSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    await connectDB();

    const update: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.slug) update.slug = slugify(parsed.data.slug);

    // Recompute price range whenever variants or base price are part of the update.
    if ("variants" in parsed.data || "price" in parsed.data) {
      const current = await Product.findById(id).lean();
      const variants = ("variants" in parsed.data ? parsed.data.variants : current?.variants) || [];
      const basePrice = "price" in parsed.data ? parsed.data.price! : current?.price ?? 0;
      Object.assign(update, computePricing(variants, basePrice));
    }

    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[products PUT]", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE: remove product
export async function DELETE(req: NextRequest, { params }: Params) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await connectDB();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[products DELETE]", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
