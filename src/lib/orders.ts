import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { sendNewOrderEmails } from "@/lib/email";

/**
 * Mark an order as paid and reduce stock. Idempotent: calling it more than
 * once (e.g. webhook + success-page fallback) only fulfils the order once.
 * Returns the order id when it transitions to paid, otherwise null.
 */
export async function markOrderPaid(orderId: string): Promise<string | null> {
  await connectDB();

  // Atomically flip unpaid → paid so concurrent calls can't double-fulfil.
  const order = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: { $ne: "paid" } },
    { $set: { paymentStatus: "paid", status: "processing" } },
    { new: true }
  );
  if (!order) return null; // already paid or not found

  // Best-effort stock decrement — never let it fail the payment.
  try {
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: -item.quantity } }
      );
    }
  } catch (err) {
    console.error("[markOrderPaid] stock decrement failed", err);
  }

  // Send order emails (store owner + customer). Best-effort — never blocks.
  try {
    await sendNewOrderEmails({
      orderNumber: order.orderNumber || `LN-${String(order._id).slice(-6).toUpperCase()}`,
      items: order.items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
      subtotal: order.subtotal,
      total: order.total,
      customer: order.customer,
    });
  } catch (err) {
    console.error("[markOrderPaid] order email failed", err);
  }

  return String(order._id);
}
