import { connectDB } from "@/lib/db";
import { Coupon } from "@/lib/models/Coupon";

export interface CouponResult {
  ok: boolean;
  message: string;
  code?: string;
  discount: number; // amount in £ (ex VAT) to subtract from subtotal
}

/**
 * Validate a coupon code against an order subtotal (ex VAT) and return the
 * discount amount. Used by both the public /api/coupon endpoint and the
 * checkout route (which must never trust a client-supplied discount).
 */
export async function validateCoupon(rawCode: string, subtotal: number): Promise<CouponResult> {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return { ok: false, message: "Enter a coupon code.", discount: 0 };

  await connectDB();
  const coupon = await Coupon.findOne({ code }).lean();

  if (!coupon || !coupon.active) {
    return { ok: false, message: "This coupon code isn't valid.", discount: 0 };
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { ok: false, message: "This coupon has expired.", discount: 0 };
  }
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, message: "This coupon is no longer available.", discount: 0 };
  }
  if (subtotal < coupon.minSpend) {
    return {
      ok: false,
      message: `Spend at least £${coupon.minSpend.toFixed(2)} to use this coupon.`,
      discount: 0,
    };
  }

  let discount = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
  discount = Math.min(discount, subtotal); // never discount more than the subtotal
  discount = Math.round(discount * 100) / 100;

  return { ok: true, message: "Coupon applied.", code, discount };
}
