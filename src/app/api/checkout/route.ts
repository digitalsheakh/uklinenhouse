import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";
import { nextOrderNumber } from "@/lib/models/Counter";
import { getStripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validation";
import { siteConfig } from "@/config/site";

/** Round a pounds amount to integer pence for Stripe. */
const toPence = (pounds: number) => Math.round(pounds * 100);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { items, customer } = parsed.data;

    // Payments must be configured before we create anything.
    const stripe = await getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Online payments aren't available right now. Please contact us to place your order." },
        { status: 503 }
      );
    }

    await connectDB();

    // ---- Re-price every line from the database (never trust the client) ----
    const orderItems: {
      product: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }[] = [];
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).lean();
      if (!product || product.isActive === false) {
        return NextResponse.json(
          { error: "One of the items in your cart is no longer available." },
          { status: 400 }
        );
      }

      // Resolve the authoritative unit price + label from the DB.
      let unitPrice = product.price;
      let label = product.name;
      if (item.variantId) {
        const variant = product.variants?.find((v) => String(v._id) === item.variantId);
        if (!variant) {
          return NextResponse.json(
            { error: `A selected option for "${product.name}" is no longer available.` },
            { status: 400 }
          );
        }
        unitPrice = variant.price;
        const opts = variant.options?.map((o) => o.value).filter(Boolean).join(" / ");
        if (opts) label = `${product.name} (${opts})`;
      }

      const image = product.images?.[0];
      orderItems.push({
        product: String(product._id),
        name: label,
        price: unitPrice,
        quantity: item.quantity,
        image,
      });

      lineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: siteConfig.currency.toLowerCase(),
          unit_amount: toPence(unitPrice),
          product_data: {
            name: label,
            ...(image ? { images: [image].filter((u) => /^https?:\/\//.test(u)) } : {}),
          },
        },
      });
    }

    // ---- Totals (prices are stored EXCLUDING VAT) ----
    const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const vat = subtotal * siteConfig.vatRate;
    const shipping = siteConfig.shippingFee;
    const total = subtotal + vat + shipping;

    // VAT + shipping shown as their own clear lines on the Stripe page.
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: siteConfig.currency.toLowerCase(),
        unit_amount: toPence(vat),
        product_data: { name: `VAT (${Math.round(siteConfig.vatRate * 100)}%)` },
      },
    });
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: siteConfig.currency.toLowerCase(),
        unit_amount: toPence(shipping),
        product_data: { name: "Shipping & handling" },
      },
    });

    // ---- Persist a pending order ----
    const orderNumber = await nextOrderNumber();
    const order = await Order.create({
      orderNumber,
      items: orderItems,
      subtotal,
      total,
      customer,
      status: "pending",
      paymentStatus: "unpaid",
    });

    // ---- Create the Stripe Checkout session ----
    const origin = req.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customer.email,
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
    return NextResponse.json({ error: "Something went wrong starting checkout." }, { status: 500 });
  }
}
