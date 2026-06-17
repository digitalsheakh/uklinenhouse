import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import { getAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

// PUT: update a category
export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = categorySchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    await connectDB();

    const update: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.name && !parsed.data.slug) {
      update.slug = slugify(parsed.data.name);
    } else if (parsed.data.slug) {
      update.slug = slugify(parsed.data.slug);
    }
    if ("parent" in parsed.data) update.parent = parsed.data.parent || null;

    const category = await Category.findByIdAndUpdate(id, update, { new: true });
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ category });
  } catch (err) {
    console.error("[categories PUT]", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// DELETE: remove a category (blocked if it has subcategories or products)
export async function DELETE(req: NextRequest, { params }: Params) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await connectDB();

    const childCount = await Category.countDocuments({ parent: id });
    if (childCount > 0) {
      return NextResponse.json(
        { error: "Delete or move the subcategories first" },
        { status: 400 }
      );
    }
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `This category has ${productCount} product(s). Move or delete them first.` },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[categories DELETE]", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
