import { NextRequest, NextResponse } from "next/server";
import { couponApplySchema } from "@/lib/validation";
import { validateCoupon } from "@/lib/coupons";

/** POST /api/coupon — validate a coupon code and return the discount amount. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = couponApplySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const result = await validateCoupon(parsed.data.code, parsed.data.subtotal);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 422 });
    }
    return NextResponse.json({ discount: result.discount, code: result.code, message: result.message });
  } catch {
    return NextResponse.json({ error: "Failed to validate coupon." }, { status: 500 });
  }
}
