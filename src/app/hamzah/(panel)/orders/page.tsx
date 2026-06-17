import { ShoppingCart } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { formatPrice } from "@/lib/utils";

async function getOrders() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100).lean();
    return orders.map((o) => ({
      _id: String(o._id),
      name: o.customer?.name || "—",
      email: o.customer?.email || "—",
      total: o.total,
      status: o.status,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt,
    }));
  } catch {
    return [];
  }
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-foreground">Orders</h1>
      <p className="mb-6 text-sm text-grey-500">{orders.length} order(s)</p>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-grey-300 bg-white py-16 text-center">
          <ShoppingCart size={36} className="text-grey-300" />
          <p className="mt-3 text-sm font-medium text-grey-600">No orders yet</p>
          <p className="mt-1 text-xs text-grey-400">Orders will appear here after checkout.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-left text-xs uppercase tracking-wide text-grey-400">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Email</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-grey-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{o.name}</td>
                  <td className="hidden px-4 py-3 text-grey-500 sm:table-cell">{o.email}</td>
                  <td className="px-4 py-3">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${o.paymentStatus === "paid" ? "bg-green-50 text-green-700" : "bg-grey-100 text-grey-500"}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-grey-600">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
