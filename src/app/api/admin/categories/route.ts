import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { getAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

// GET: list all categories (flat) for the admin panel
export async function GET() {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
  return NextResponse.json({
    categories: categories.map((c) => ({ ...c, _id: String(c._id), parent: c.parent ? String(c.parent) : null })),
  });
}

// POST: create a category
export async function POST(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    await connectDB();

    const data = parsed.data;
    let slug = data.slug ? slugify(data.slug) : slugify(data.name);
    // ensure unique slug
    if (await Category.findOne({ slug })) slug = `${slug}-${Date.now().toString(36)}`;

    const category = await Category.create({
      ...data,
      slug,
      parent: data.parent || null,
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error("[categories POST]", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
