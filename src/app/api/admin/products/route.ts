import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { getAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import { computePricing } from "@/lib/pricing";

// GET: list products (admin) with optional ?search= and ?category=
export async function GET(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const category = searchParams.get("category");

  const filter: Record<string, unknown> = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (category) filter.category = category;

  const products = await Product.find(filter)
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    products: products.map((p) => ({ ...p, _id: String(p._id) })),
  });
}

// POST: create a product
export async function POST(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    await connectDB();

    const data = parsed.data;

    // verify category exists
    const cat = await Category.findById(data.category);
    if (!cat) return NextResponse.json({ error: "Invalid category" }, { status: 400 });

    let slug = data.slug ? slugify(data.slug) : slugify(data.name);
    if (await Product.findOne({ slug })) slug = `${slug}-${Date.now().toString(36)}`;

    const pricing = computePricing(data.variants, data.price);
    const product = await Product.create({ ...data, ...pricing, slug });
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("[products POST]", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
