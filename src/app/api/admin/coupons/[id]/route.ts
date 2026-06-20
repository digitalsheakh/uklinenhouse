import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/lib/models/Coupon";
import { getAdmin } from "@/lib/auth";
import { adminCouponSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = adminCouponSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    await connectDB();
    const coupon = await Coupon.findByIdAndUpdate(id, {
      ...parsed.data,
      code: parsed.data.code.toUpperCase(),
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      usageLimit: parsed.data.usageLimit ?? null,
    }, { new: true });
    if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ coupon });
  } catch {
    return NextResponse.json({ error: "Failed to update." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await connectDB();
  await Coupon.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
