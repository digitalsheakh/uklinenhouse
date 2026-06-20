"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ShoppingCart, Building2, CreditCard, Truck, Loader2, Search, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderRow {
  _id: string;
  orderNumber: string;
  customer: { name?: string; email?: string; phone?: string; company?: string };
  items: { name: string; price: number; quantity: number }[];
  total: number;
  discount: number;
  paymentMethod: string;
  status: string;
  paymentStatus: string;
  courier?: string;
  trackingNumber?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:           "bg-grey-100 text-grey-600",
  awaiting_payment:  "bg-amber-50 text-amber-700",
  paid:              "bg-blue-50 text-blue-700",
  processing:        "bg-blue-50 text-blue-700",
  shipped:           "bg-purple-50 text-purple-700",
  completed:         "bg-green-50 text-green-700",
  cancelled:         "bg-red-50 text-red-600",
};
const PAY_COLORS: Record<string, string> = {
  unpaid:   "bg-grey-100 text-grey-600",
  paid:     "bg-green-50 text-green-700",
  refunded: "bg-red-50 text-red-600",
};

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All orders" },
  { value: "pending",          label: "Pending" },
  { value: "awaiting_payment", label: "Awaiting payment" },
  { value: "paid",             label: "Paid" },
  { value: "processing",       label: "Processing" },
  { value: "shipped",          label: "Shipped" },
  { value: "completed",        label: "Completed" },
  { value: "cancelled",        label: "Cancelled" },
];

export default function OrdersPage() {
  const [orders, setOrders]       = useState<OrderRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/orders");
      const d = await r.json();
      if (r.ok) setOrders(d.orders);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      (o.customer.name || "").toLowerCase().includes(q) ||
      (o.customer.email || "").toLowerCase().includes(q) ||
      (o.customer.company || "").toLowerCase().includes(q);
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const revenue = orders
    .filter(o => o.paymentStatus === "paid")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
          <p className="mt-1 text-sm text-grey-500">
            {orders.length} total &nbsp;&middot;&nbsp; {formatPrice(revenue)} revenue (paid)
          </p>
        </div>
      </div>

      {/* Stat chips */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { label: "Awaiting payment", color: "bg-amber-50 text-amber-700", statuses: ["awaiting_payment","pending"] },
          { label: "Processing",       color: "bg-blue-50 text-blue-700",   statuses: ["paid","processing"] },
          { label: "Shipped",          color: "bg-purple-50 text-purple-700", statuses: ["shipped"] },
          { label: "Completed",        color: "bg-green-50 text-green-700",  statuses: ["completed"] },
        ].map(chip => {
          const n = orders.filter(o => chip.statuses.includes(o.status)).length;
          if (!n) return null;
          return (
            <span key={chip.label} className={`rounded-full px-3 py-1 text-xs font-semibold ${chip.color}`}>
              {chip.label}: {n}
            </span>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search order, customer, email…"
            className="w-full rounded-lg border border-grey-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatus(e.target.value)}
          className="rounded-lg border border-grey-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
        >
          {STATUS_FILTER_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {(search || statusFilter) && (
          <button onClick={() => { setSearch(""); setStatus(""); }}
            className="text-sm text-grey-500 underline hover:text-foreground">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-24 text-grey-400"><Loader2 className="animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-grey-300 bg-white py-20 text-center">
          <ShoppingCart size={36} className="text-grey-300" />
          <p className="mt-3 text-sm font-medium text-grey-600">
            {search || statusFilter ? "No orders match your filters" : "No orders yet"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-grey-200 bg-grey-50 text-left text-xs uppercase tracking-wide text-grey-400">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Customer</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o._id} className="group border-b border-grey-100 last:border-0 hover:bg-grey-50 transition-colors">
                  {/* Order ref */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs font-bold text-foreground">{o.orderNumber}</span>
                      <div className="flex flex-wrap gap-1">
                        {o.paymentMethod === "bank_transfer" ? (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                            <Building2 size={9} /> Bank
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                            <CreditCard size={9} /> Card
                          </span>
                        )}
                        {o.trackingNumber && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-700">
                            <Truck size={9} /> Tracked
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="hidden px-4 py-3.5 sm:table-cell">
                    <p className="font-medium text-foreground">
                      {o.customer.name || "-"}
                    </p>
                    {o.customer.company && (
                      <p className="text-xs text-grey-400">{o.customer.company}</p>
                    )}
                    <p className="text-xs text-grey-400">{o.customer.email}</p>
                  </td>

                  {/* Items count */}
                  <td className="hidden px-4 py-3.5 text-grey-500 md:table-cell">
                    {o.items.reduce((n, i) => n + i.quantity, 0)} item{o.items.reduce((n, i) => n + i.quantity, 0) !== 1 ? "s" : ""}
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-foreground">{formatPrice(o.total)}</span>
                    {o.discount > 0 && (
                      <p className="text-xs text-green-600">-{formatPrice(o.discount)} off</p>
                    )}
                  </td>

                  {/* Payment status */}
                  <td className="hidden px-4 py-3.5 lg:table-cell">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${PAY_COLORS[o.paymentStatus] || ""}`}>
                      {o.paymentStatus}
                    </span>
                  </td>

                  {/* Order status */}
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_COLORS[o.status] || "bg-grey-100 text-grey-600"}`}>
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="hidden px-4 py-3.5 text-xs text-grey-400 lg:table-cell">
                    {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>

                  {/* Open link */}
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/hamzah/orders/${o._id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-grey-200 bg-white px-3 py-1.5 text-xs font-semibold text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:border-accent hover:text-accent"
                    >
                      Open <ArrowUpRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-grey-100 bg-grey-50 px-4 py-3 text-xs text-grey-400">
            Showing {filtered.length} of {orders.length} order{orders.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
