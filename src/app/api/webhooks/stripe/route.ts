import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getStripeConfig } from "@/lib/settings";
import { markOrderPaid } from "@/lib/orders";

// Stripe needs the raw, unparsed request body to verify the signature.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = await getStripe();
  const { webhookSecret } = await getStripeConfig();

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId && session.payment_status === "paid") {
      try {
        await markOrderPaid(orderId);
      } catch (err) {
        console.error("[stripe webhook] failed to fulfil order", err);
        return NextResponse.json({ error: "Fulfilment failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
