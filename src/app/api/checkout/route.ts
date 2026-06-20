import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";
import { Coupon } from "@/lib/models/Coupon";
import { nextOrderNumber } from "@/lib/models/Counter";
import { getStripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validation";
import { validateCoupon } from "@/lib/coupons";
import { siteConfig } from "@/config/site";

const toPence = (pounds: number) => Math.round(pounds * 100);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { items, customer, shippingAddress, notes, couponCode, marketingOptIn, paymentMethod } = parsed.data;

    await connectDB();

    // Re-price from DB (never trust client prices)
    const orderItems: { product: string; name: string; price: number; quantity: number; image?: string }[] = [];
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).lean();
      if (!product || product.isActive === false)
        return NextResponse.json({ error: "One of the items in your bag is no longer available." }, { status: 400 });

      let unitPrice = product.price;
      let label = product.name;
      if (item.variantId) {
        const variant = product.variants?.find((v) => String(v._id) === item.variantId);
        if (!variant)
          return NextResponse.json({ error: `A selected option for "${product.name}" is no longer available.` }, { status: 400 });
        unitPrice = variant.price;
        const opts = variant.options?.map((o) => o.value).filter(Boolean).join(" / ");
        if (opts) label = `${product.name} (${opts})`;
      }
      const image = product.images?.[0];
      orderItems.push({ product: String(product._id), name: label, price: unitPrice, quantity: item.quantity, image });
      lineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: siteConfig.currency.toLowerCase(),
          unit_amount: toPence(unitPrice),
          product_data: { name: label, ...(image ? { images: [image].filter((u) => /^https?:\/\//.test(u)) } : {}) },
        },
      });
    }

    // Totals
    const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

    // Validate coupon server-side
    let discount = 0;
    let appliedCouponCode = "";
    if (couponCode) {
      const couponResult = await validateCoupon(couponCode, subtotal);
      if (couponResult.ok) { discount = couponResult.discount; appliedCouponCode = couponResult.code || ""; }
    }

    const discountedSubtotal = subtotal - discount;
    const vat = discountedSubtotal * siteConfig.vatRate;
    const shipping = discountedSubtotal >= siteConfig.freeDeliveryThreshold ? 0 : siteConfig.shippingFee;
    const total = discountedSubtotal + vat + shipping;

    const orderNumber = await nextOrderNumber();

    const order = await Order.create({
      orderNumber, items: orderItems, subtotal, discount,
      couponCode: appliedCouponCode, total,
      customer: { ...customer, email: customer.email.toLowerCase() },
      shippingAddress: shippingAddress ?? undefined,
      notes: notes || "", marketingOptIn: !!marketingOptIn, paymentMethod,
      status: paymentMethod === "bank_transfer" ? "awaiting_payment" : "pending",
      paymentStatus: "unpaid",
    });

    if (appliedCouponCode) {
      await Coupon.updateOne({ code: appliedCouponCode }, { $inc: { usedCount: 1 } });
    }

    // Bank transfer — no Stripe, return order ref immediately
    if (paymentMethod === "bank_transfer") {
      return NextResponse.json({ bankTransfer: true, orderNumber, orderId: String(order._id) });
    }

    // Card — create Stripe session
    const stripe = await getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Online card payments are not available right now. Please choose bank transfer or contact us." },
        { status: 503 }
      );
    }

    if (discount > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: siteConfig.currency.toLowerCase(),
          unit_amount: -toPence(discount),
          product_data: { name: `Discount (${appliedCouponCode})` },
        },
      });
    }
    lineItems.push({ quantity: 1, price_data: { currency: siteConfig.currency.toLowerCase(), unit_amount: toPence(vat), product_data: { name: `VAT (${Math.round(siteConfig.vatRate * 100)}%)` } } });
    if (shipping > 0) {
      lineItems.push({ quantity: 1, price_data: { currency: siteConfig.currency.toLowerCase(), unit_amount: toPence(shipping), product_data: { name: "Shipping & handling" } } });
    }

    const origin = req.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment", line_items: lineItems, customer_email: customer.email,
      metadata: { orderId: String(order._id) },
      payment_intent_data: { metadata: { orderId: String(order._id) } },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=1`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
