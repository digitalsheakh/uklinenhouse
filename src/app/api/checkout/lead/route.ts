import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { leadSchema } from "@/lib/validation";
import { nextOrderNumber } from "@/lib/models/Counter";

/**
 * POST /api/checkout/lead
 * Captures a partial order (abandoned cart) when the customer has entered
 * their email but not yet completed checkout. Shown in the admin "Waiting
 * Payment" section. Idempotent: re-submitting the same email+items upserts.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

    await connectDB();
    const { customer, items } = parsed.data;
    type LeadItem = (typeof items)[number];

    const subtotal = items.reduce((s: number, i: LeadItem) => s + i.price * i.quantity, 0);

    // Upsert: if an abandoned order for this email already exists, update it.
    const existing = await Order.findOne({
      "customer.email": customer.email.toLowerCase(),
      status: "abandoned",
    });

    if (existing) {
      existing.items = items.map((i: LeadItem) => ({
        product: i.productId as unknown as import("mongoose").Types.ObjectId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image || "",
      }));
      existing.subtotal = subtotal;
      existing.total = subtotal;
      existing.customer.name = customer.name || existing.customer.name;
      existing.customer.phone = customer.phone || existing.customer.phone;
      await existing.save();
    } else {
      const orderNumber = await nextOrderNumber();
      await Order.create({
        orderNumber,
        items: items.map((i: LeadItem) => ({
          product: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image || "",
        })),
        subtotal,
        total: subtotal,
        discount: 0,
        customer: {
          name: customer.name || "",
          email: customer.email.toLowerCase(),
          phone: customer.phone || "",
        },
        status: "abandoned",
        paymentStatus: "unpaid",
        paymentMethod: "card",
        marketingOptIn: false,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
