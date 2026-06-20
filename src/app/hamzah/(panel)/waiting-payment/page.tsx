import { Clock, ShoppingCart, Building2 } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { formatPrice } from "@/lib/utils";

async function getWaiting() {
  try {
    await connectDB();
    const orders = await Order.find({
      $or: [
        { status: "awaiting_payment" },
        { status: "abandoned" },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return orders.map((o) => ({
      _id: String(o._id),
      orderNumber: o.orderNumber || `LN-${String(o._id).slice(-6).toUpperCase()}`,
      type: o.status as string,
      name: o.customer?.name || "-",
      email: o.customer?.email || "-",
      phone: o.customer?.phone || "-",
      company: o.customer?.company || "",
      items: (o.items ?? []).map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      subtotal: o.subtotal,
      total: o.total,
      paymentMethod: o.paymentMethod || "card",
      createdAt: o.createdAt,
    }));
  } catch {
    return [];
  }
}

export default async function WaitingPaymentPage() {
  const orders = await getWaiting();
  const bankOrders   = orders.filter((o) => o.type === "awaiting_payment");
  const abandoned    = orders.filter((o) => o.type === "abandoned");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Waiting Payment</h1>
      <p className="mt-1 text-sm text-grey-500">
        {bankOrders.length} awaiting bank transfer &nbsp;·&nbsp; {abandoned.length} abandoned bag{abandoned.length !== 1 ? "s" : ""}
      </p>

      {/* ── Bank transfer orders ─────────────────────────────────────────── */}
      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Building2 size={16} className="text-amber-600" />
          <h2 className="font-semibold text-foreground">Awaiting Bank Transfer</h2>
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">{bankOrders.length}</span>
        </div>

        {bankOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-grey-300 bg-white py-10 text-center text-sm text-grey-400">No bank transfer orders waiting</div>
        ) : (
          <div className="space-y-3">
            {bankOrders.map((o) => (
              <OrderCard key={o._id} o={o} badge="Bank Transfer" badgeColor="amber" />
            ))}
          </div>
        )}
      </section>

      {/* ── Abandoned carts ─────────────────────────────────────────────── */}
      <section className="mt-10">
        <div className="mb-3 flex items-center gap-2">
          <ShoppingCart size={16} className="text-grey-500" />
          <h2 className="font-semibold text-foreground">Abandoned Bags</h2>
          <span className="rounded-full bg-grey-100 px-2 py-0.5 text-xs font-semibold text-grey-600">{abandoned.length}</span>
        </div>
        <p className="mb-4 text-xs text-grey-400">Customers who entered their email but did not complete checkout. You may wish to follow up with them.</p>

        {abandoned.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-grey-300 bg-white py-10 text-center text-sm text-grey-400">No abandoned bags</div>
        ) : (
          <div className="space-y-3">
            {abandoned.map((o) => (
              <OrderCard key={o._id} o={o} badge="Abandoned" badgeColor="grey" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

type WaitingOrder = Awaited<ReturnType<typeof getWaiting>>[number];

function OrderCard({ o, badge, badgeColor }: { o: WaitingOrder; badge: string; badgeColor: "amber" | "grey" }) {
  return (
    <details className="group overflow-hidden rounded-2xl border border-grey-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 hover:bg-grey-50">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-foreground">{o.orderNumber}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${badgeColor === "amber" ? "bg-amber-50 text-amber-700" : "bg-grey-100 text-grey-600"}`}>
              {badge}
            </span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-foreground">{o.name}{o.company ? ` — ${o.company}` : ""}</p>
          <p className="text-xs text-grey-400">{o.email}{o.phone ? ` · ${o.phone}` : ""}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-foreground">{formatPrice(o.total)}</p>
          <p className="flex items-center justify-end gap-1 text-xs text-grey-400">
            <Clock size={11} /> {new Date(o.createdAt).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}
          </p>
        </div>
      </summary>

      <div className="border-t border-grey-100 px-5 pb-5 pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">Bag contents</p>
        <ul className="space-y-2">
          {o.items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-grey-100">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-grey-300"><ShoppingCart size={12} /></div>
                )}
              </div>
              <span className="flex-1 line-clamp-1 text-grey-700">{item.name}</span>
              <span className="text-xs text-grey-500">{item.quantity} × {formatPrice(item.price)}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
