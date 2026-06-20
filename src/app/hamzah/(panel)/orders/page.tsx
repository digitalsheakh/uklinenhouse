"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ShoppingCart, Building2, CreditCard, ChevronDown, ChevronUp,
  Truck, Package, Loader2, Check, ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  name: string; price: number; quantity: number; image?: string;
}

interface AdminOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name?: string; email?: string; phone?: string; company?: string;
    address?: string; city?: string; postcode?: string; country?: string;
  };
  shippingAddress?: {
    name?: string; address?: string; city?: string; postcode?: string; country?: string;
  };
  items: OrderItem[];
  subtotal: number; discount: number; couponCode?: string; total: number;
  notes?: string; adminNotes?: string;
  paymentMethod: string; status: string; paymentStatus: string;
  courier?: string; trackingNumber?: string; trackingUrl?: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  "pending", "awaiting_payment", "paid", "processing", "shipped", "completed", "cancelled",
];
const PAYMENT_STATUS_OPTIONS = ["unpaid", "paid", "refunded"];
const COURIER_OPTIONS = [
  { value: "", label: "Not dispatched" },
  { value: "evri", label: "Evri" },
  { value: "parcelforce", label: "Parcel Force" },
  { value: "dpd", label: "DPD" },
  { value: "other", label: "Other" },
];
const COURIER_TRACK: Record<string, string> = {
  evri: "https://www.evri.com/track-a-parcel#/tracking/{num}",
  parcelforce: "https://www.parcelforce.com/track-trace?trackNumber={num}",
  dpd: "https://track.dpd.co.uk/search?reference={num}",
};

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  // Per-order edit state
  const [edits, setEdits] = useState<Record<string, Partial<AdminOrder>>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/orders");
      const d = await r.json();
      if (r.ok) setOrders(d.orders);
      else toast.error("Failed to load orders");
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function getEdit(id: string) { return edits[id] || {}; }
  function setEdit(id: string, patch: Partial<AdminOrder>) {
    setEdits((e) => ({ ...e, [id]: { ...e[id], ...patch } }));
  }

  async function save(order: AdminOrder) {
    const patch = edits[order._id];
    if (!patch || Object.keys(patch).length === 0) return;
    setSaving(order._id);
    try {
      const r = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const d = await r.json();
      if (!r.ok) { toast.error(d.error || "Save failed"); return; }
      toast.success("Order updated");
      setEdits((e) => { const n = { ...e }; delete n[order._id]; return n; });
      setOrders((prev) => prev.map((o) => o._id === order._id ? { ...o, ...patch } : o));
    } catch { toast.error("Save failed"); }
    finally { setSaving(null); }
  }

  const totalRevenue = orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);

  if (loading) return <div className="flex justify-center py-24 text-grey-400"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
          <p className="mt-1 text-sm text-grey-500">
            {orders.length} order(s) &nbsp;·&nbsp; {formatPrice(totalRevenue)} total revenue (paid)
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-grey-300 bg-white py-16 text-center">
          <ShoppingCart size={36} className="text-grey-300" />
          <p className="mt-3 text-sm text-grey-600">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isOpen = expanded === order._id;
            const e = getEdit(order._id);
            const status   = e.status          ?? order.status;
            const payStatus = e.paymentStatus  ?? order.paymentStatus;
            const courier  = e.courier         ?? order.courier   ?? "";
            const trackNum = e.trackingNumber  ?? order.trackingNumber ?? "";
            const trackUrl = e.trackingUrl     ?? order.trackingUrl    ?? "";
            const adminNotes = e.adminNotes    ?? order.adminNotes     ?? "";
            const hasEdits = Object.keys(e).length > 0;

            const deliveryAddr = order.shippingAddress?.address
              ? [order.shippingAddress.name, order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.postcode].filter(Boolean).join(", ")
              : [order.customer.address, order.customer.city, order.customer.postcode].filter(Boolean).join(", ");

            const autoTrackUrl = courier && trackNum && COURIER_TRACK[courier]
              ? COURIER_TRACK[courier].replace("{num}", encodeURIComponent(trackNum))
              : trackUrl;

            return (
              <div key={order._id} className="overflow-hidden rounded-2xl border border-grey-200 bg-white">
                {/* ── Summary row ─────────────────────────────────────────── */}
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-grey-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground">{order.orderNumber}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_COLORS[order.status] || "bg-grey-100 text-grey-600"}`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${PAY_COLORS[order.paymentStatus] || ""}`}>
                        {order.paymentStatus}
                      </span>
                      {order.paymentMethod === "bank_transfer" ? (
                        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                          <Building2 size={10} /> Bank transfer
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                          <CreditCard size={10} /> Card
                        </span>
                      )}
                      {order.trackingNumber && (
                        <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                          <Truck size={10} /> Tracked
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {order.customer.name}{order.customer.company ? ` — ${order.customer.company}` : ""}
                    </p>
                    <p className="text-xs text-grey-400">
                      {order.customer.email}{order.customer.phone ? ` · ${order.customer.phone}` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-base font-bold text-foreground">{formatPrice(order.total)}</p>
                    <p className="text-xs text-grey-400">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="shrink-0 text-grey-400" /> : <ChevronDown size={16} className="shrink-0 text-grey-400" />}
                </button>

                {/* ── Expanded detail ──────────────────────────────────────── */}
                {isOpen && (
                  <div className="border-t border-grey-100 px-5 pb-6 pt-5">
                    <div className="grid gap-6 lg:grid-cols-2">

                      {/* Left — items + addresses */}
                      <div className="space-y-5">
                        {/* Items */}
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">Items</p>
                          <ul className="divide-y divide-grey-100 rounded-xl border border-grey-200 bg-grey-50">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-3 px-4 py-3">
                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-grey-200">
                                  {item.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-grey-400"><Package size={14} /></div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                                  <p className="text-xs text-grey-500">{formatPrice(item.price)} × {item.quantity}</p>
                                </div>
                                <span className="text-sm font-semibold text-foreground shrink-0">{formatPrice(item.price * item.quantity)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Delivery address */}
                        <div>
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-grey-400">Delivery Address</p>
                          <p className="text-sm text-grey-600">{deliveryAddr || "Not provided"}</p>
                        </div>

                        {/* Pricing summary */}
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">Order Summary</p>
                          <div className="space-y-1 rounded-xl border border-grey-200 bg-grey-50 px-4 py-3 text-sm">
                            <div className="flex justify-between text-grey-500"><span>Subtotal (ex VAT)</span><span>{formatPrice(order.subtotal)}</span></div>
                            {(order.discount ?? 0) > 0 && (
                              <div className="flex justify-between font-medium text-green-600">
                                <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                                <span>-{formatPrice(order.discount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between border-t border-grey-200 pt-1.5 font-bold text-foreground">
                              <span>Total</span><span>{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Customer notes */}
                        {order.notes && (
                          <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-grey-400">Customer Notes</p>
                            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{order.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Right — controls */}
                      <div className="space-y-5">

                        {/* Status */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Order Status">
                            <select value={status} onChange={(ev) => setEdit(order._id, { status: ev.target.value })}
                              className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none focus:border-accent bg-white">
                              {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Payment Status">
                            <select value={payStatus} onChange={(ev) => setEdit(order._id, { paymentStatus: ev.target.value })}
                              className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none focus:border-accent bg-white">
                              {PAYMENT_STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s.replace(/\b\w/g, c => c.toUpperCase())}</option>
                              ))}
                            </select>
                          </Field>
                        </div>

                        {/* Courier + tracking */}
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">Shipping & Tracking</p>
                          <div className="rounded-xl border border-grey-200 bg-grey-50 p-4 space-y-3">
                            <Field label="Courier">
                              <select value={courier} onChange={(ev) => setEdit(order._id, { courier: ev.target.value })}
                                className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none focus:border-accent bg-white">
                                {COURIER_OPTIONS.map(c => (
                                  <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                              </select>
                            </Field>
                            <Field label="Tracking Number">
                              <input
                                value={trackNum}
                                onChange={(ev) => setEdit(order._id, { trackingNumber: ev.target.value })}
                                placeholder="e.g. H0012345678"
                                className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm font-mono outline-none focus:border-accent"
                              />
                            </Field>

                            {/* Auto tracking URL or manual override */}
                            {autoTrackUrl && (
                              <a href={autoTrackUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">
                                <ExternalLink size={12} /> Track this parcel on {COURIER_OPTIONS.find(c => c.value === courier)?.label}
                              </a>
                            )}

                            <Field label="Custom Tracking URL (optional)">
                              <input
                                value={trackUrl}
                                onChange={(ev) => setEdit(order._id, { trackingUrl: ev.target.value })}
                                placeholder="https://track.example.com/..."
                                className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none focus:border-accent"
                              />
                            </Field>
                          </div>
                        </div>

                        {/* Admin notes */}
                        <div>
                          <Field label="Admin Notes (internal, not shown to customer)">
                            <textarea
                              value={adminNotes}
                              onChange={(ev) => setEdit(order._id, { adminNotes: ev.target.value })}
                              rows={3}
                              placeholder="Internal notes about this order…"
                              className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none focus:border-accent resize-none"
                            />
                          </Field>
                        </div>

                        {/* Save button */}
                        <button
                          type="button"
                          onClick={() => save(order)}
                          disabled={!hasEdits || saving === order._id}
                          className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
                        >
                          {saving === order._id
                            ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                            : <><Check size={14} /> Save Changes</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-grey-600">{label}</p>
      {children}
    </div>
  );
}
