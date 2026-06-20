import { ShoppingCart, Building2, CreditCard } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { formatPrice } from "@/lib/utils";

async function getOrders() {
  try {
    await connectDB();
    const orders = await Order.find({ status: { $ne: "abandoned" } })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return orders.map((o) => ({
      _id: String(o._id),
      orderNumber: o.orderNumber || `LN-${String(o._id).slice(-6).toUpperCase()}`,
      name: o.customer?.name || "-",
      email: o.customer?.email || "-",
      phone: o.customer?.phone || "-",
      company: o.customer?.company || "",
      address: [o.customer?.address, o.customer?.city, o.customer?.postcode].filter(Boolean).join(", "),
      items: o.items ?? [],
      subtotal: o.subtotal,
      discount: o.discount ?? 0,
      couponCode: o.couponCode || "",
      total: o.total,
      notes: o.notes || "",
      paymentMethod: o.paymentMethod || "card",
      status: o.status,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt,
    }));
  } catch {
    return [];
  }
}

const STATUS_COLORS: Record<string, string> = {
  pending:          "bg-grey-100 text-grey-600",
  awaiting_payment: "bg-amber-50 text-amber-700",
  paid:             "bg-blue-50 text-blue-700",
  processing:       "bg-blue-50 text-blue-700",
  shipped:          "bg-purple-50 text-purple-700",
  completed:        "bg-green-50 text-green-700",
  cancelled:        "bg-red-50 text-red-600",
};

const PAYMENT_COLORS: Record<string, string> = {
  unpaid:   "bg-grey-100 text-grey-600",
  paid:     "bg-green-50 text-green-700",
  refunded: "bg-red-50 text-red-600",
};

export default async function OrdersPage() {
  const orders = await getOrders();
  const totalRevenue = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
          <p className="mt-1 text-sm text-grey-500">{orders.length} order(s) — {formatPrice(totalRevenue)} total revenue</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-grey-300 bg-white py-16 text-center">
          <ShoppingCart size={36} className="text-grey-300" />
          <p className="mt-3 text-sm font-medium text-grey-600">No orders yet</p>
          <p className="mt-1 text-xs text-grey-400">Orders will appear here after checkout.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <details key={o._id} className="group overflow-hidden rounded-2xl border border-grey-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 hover:bg-grey-50">
                {/* Order ref + date */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">{o.orderNumber}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_COLORS[o.status] || "bg-grey-100 text-grey-600"}`}>
                      {o.status.replace("_", " ")}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${PAYMENT_COLORS[o.paymentStatus] || ""}`}>
                      {o.paymentStatus}
                    </span>
                    {o.paymentMethod === "bank_transfer" ? (
                      <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        <Building2 size={10} /> Bank transfer
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                        <CreditCard size={10} /> Card
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-grey-700 font-medium">{o.name}{o.company ? ` — ${o.company}` : ""}</p>
                  <p className="text-xs text-grey-400">{o.email}{o.phone ? ` · ${o.phone}` : ""}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-base font-bold text-foreground">{formatPrice(o.total)}</p>
                  <p className="text-xs text-grey-400">{new Date(o.createdAt).toLocaleDateString("en-GB", { day:"2-digit",month:"short",year:"numeric"})}</p>
                </div>
              </summary>

              {/* Expanded order detail */}
              <div className="border-t border-grey-100 px-5 pb-5 pt-4 grid gap-5 sm:grid-cols-2">
                {/* Items */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">Items</p>
                  <ul className="space-y-2">
                    {o.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-grey-100">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-grey-300"><ShoppingCart size={12} /></div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground line-clamp-1">{item.name}</p>
                          <p className="text-xs text-grey-500">{formatPrice(item.price)} × {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-foreground shrink-0">{formatPrice(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Order details */}
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">Delivery Address</p>
                    <p className="text-sm text-grey-600">{o.address || "Not provided"}</p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">Order Summary</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-grey-500"><span>Subtotal</span><span>{formatPrice(o.subtotal)}</span></div>
                      {o.discount > 0 && (
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>Discount{o.couponCode ? ` (${o.couponCode})` : ""}</span>
                          <span>-{formatPrice(o.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-foreground border-t border-grey-100 pt-1"><span>Total</span><span>{formatPrice(o.total)}</span></div>
                    </div>
                  </div>

                  {o.notes && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-grey-400">Customer Notes</p>
                      <p className="rounded-lg bg-grey-50 px-3 py-2 text-sm text-grey-600">{o.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
