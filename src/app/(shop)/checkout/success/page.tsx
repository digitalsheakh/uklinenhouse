import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import { getStripe } from "@/lib/stripe";
import { markOrderPaid } from "@/lib/orders";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { formatPrice } from "@/lib/utils";
import ClearCart from "@/components/checkout/ClearCart";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let orderRef: string | null = null;
  let email: string | null = null;
  let total: number | null = null;
  let paid = false;

  if (session_id) {
    try {
      const stripe = await getStripe();
      if (stripe) {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const orderId = session.metadata?.orderId;
        if (orderId) {
          // Fallback fulfilment in case the webhook hasn't arrived yet.
          if (session.payment_status === "paid") {
            await markOrderPaid(orderId);
            paid = true;
          }
          await connectDB();
          const order = await Order.findById(orderId).lean();
          if (order) {
            orderRef = order.orderNumber || `LN-${String(order._id).slice(-6).toUpperCase()}`;
            email = order.customer?.email || session.customer_email || null;
            total = order.total;
            paid = paid || order.paymentStatus === "paid";
          }
        }
      }
    } catch (err) {
      console.error("[checkout success]", err);
    }
  }

  return (
    <div className="bg-grey-50">
      <ClearCart />
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:py-20">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 size={34} />
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
          Thank you{paid ? "!" : " — order received"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-grey-600">
          {paid
            ? "Your payment was successful and your order is now being processed."
            : "We've received your order. If payment is still completing, your confirmation will update shortly."}
          {email && <> A confirmation will be sent to <span className="font-medium text-foreground">{email}</span>.</>}
        </p>

        <div className="mt-8 rounded-2xl border border-grey-200 bg-white p-6 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm text-grey-500">Order reference</span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {orderRef || "—"}
            </span>
          </div>
          {total != null && (
            <div className="mt-3 flex items-center justify-between border-t border-grey-100 pt-3">
              <span className="text-sm text-grey-500">Total paid</span>
              <span className="text-sm font-semibold text-foreground">{formatPrice(total)}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            <Package size={16} /> View my orders
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-grey-300 px-5 py-3 text-sm font-semibold text-foreground hover:bg-white"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
