import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/lib/models/Coupon";
import { getAdmin } from "@/lib/auth";
import { adminCouponSchema } from "@/lib/validation";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ coupons: coupons.map((c) => ({ ...c, _id: String(c._id) })) });
}

export async function POST(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = adminCouponSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    await connectDB();
    const existing = await Coupon.findOne({ code: parsed.data.code.toUpperCase() });
    if (existing) return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });
    const coupon = await Coupon.create({
      ...parsed.data,
      code: parsed.data.code.toUpperCase(),
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      usageLimit: parsed.data.usageLimit ?? null,
    });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create coupon." }, { status: 500 });
  }
}
